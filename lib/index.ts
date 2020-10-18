import gbl from "./utils/global"
import {
  Canvas,
  DrawPosterCanvasCtx,
  getCanvas2dContext,
  Execute,
  CreateImagePathOptions
} from "./utils";
import { drawCtxMount } from "./draw-function"
class UniDrawPoster {
  private executeOnions = [] as Execute;
  constructor(
    public canvas: Canvas,
    public ctx: DrawPosterCanvasCtx,
    public canvasId: string,
  ) { drawCtxMount(canvas, ctx) }

  /** 构建绘制海报矩形方法, 传入canvas选择器字符串, 返回绘制对象 */
  static async build(selector: string, componentThis?: any) {
    // 获取canvas实例
    const canvas = await getCanvas2dContext(selector, componentThis) as Canvas
    const ctx = (
      canvas?.getContext("2d") || gbl.createCanvasContext(selector)
    ) as DrawPosterCanvasCtx
    return new UniDrawPoster(canvas, ctx, selector)
  }
  /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
  draw = (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => {
    this.executeOnions.push(async () => {
      try {
        this.ctx.save()
        await execute(this.ctx)
        this.ctx.restore()
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    })
  }

  /** 等待创建绘画, 成功后清空绘制器容器 */
  awaitCreate = async () => {
    const result: Array<boolean> = []
    for (let i = 0; i < this.executeOnions.length; i++) {
      const execute = this.executeOnions[i]
      result.push(await execute())
    }
    this.executeOnions = []
    return result
  }

  /** 创建canvas本地地址 @returns {string} 本地地址 */
  createImagePath = async (baseOptions = {} as CreateImagePathOptions) => {
    const { canvas, canvasId, executeOnions, awaitCreate } = this
    executeOnions.length && (await awaitCreate())
    return new Promise((resolve, reject) => {
      const options: WechatMiniprogram.CanvasToTempFilePathOption = {
        x: 0, y: 0,
        width: canvas && canvas.width,
        height: canvas && canvas.height,
        destWidth: canvas && canvas.width,
        destHeight: canvas && canvas.height,
        success: (res) => resolve(res.tempFilePath),
        fail: (err) => reject(err),
        ...baseOptions
      };
      if (canvas) {
        options.canvas = canvas
      } else {
        options.canvasId = canvasId
      }
      gbl.canvasToTempFilePath(options as any);
    })
  }
}

export default UniDrawPoster;