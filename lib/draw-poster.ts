import gbl from "./utils/global"
import {
  Canvas,
  DrawPosterCanvasCtx,
  getCanvas2dContext,
  Execute,
  CreateImagePathOptions,
  DrawPosterBuildOpts
} from "./utils";
import { drawCtxMount } from "./draw-function"
import { handleBuildOpts } from "./utils/utils";
class DrawPoster {
  private executeOnions = [] as Execute;
  constructor(
    public canvas: Canvas,
    public ctx: DrawPosterCanvasCtx,
    public canvasId: string,
    public loading: boolean,
    public drawImageTime: number
  ) {
    if (!canvas || !ctx || !canvasId){
      throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects")
    }
    drawCtxMount(canvas, ctx)
   }

  /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
  static async build(options: string | DrawPosterBuildOpts) {
    const { selector, componentThis, loading, drawImageTime } = handleBuildOpts(options)
    // 获取canvas实例
    const canvas = await getCanvas2dContext(selector) as Canvas
    const ctx = (
      canvas.getContext && canvas.getContext("2d") || gbl.createCanvasContext(selector, componentThis)
    ) as DrawPosterCanvasCtx
    console.log("draw-poster 构建成功 ", { canvas, ctx, selector })
    return new DrawPoster(canvas, ctx, selector, loading, drawImageTime)
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
    this.loading && uni.showLoading({ title: '绘制海报中...' })
    const result: Array<boolean> = []
    for (let i = 0; i < this.executeOnions.length; i++) {
      const execute = this.executeOnions[i]
      result.push(await execute())
    }
    this.executeOnions = []
    if (!!this.ctx.draw) {
      return await new Promise((resolve) => {
        this.ctx.draw(true, () => {
          resolve(result)
          this.loading && uni.hideLoading()
        })
        // #ifdef APP-PLUS
        let time = 0
        if (this.ctx.existDrawImage) {
          time = 100
          this.ctx.existDrawImage = false
        }
        setTimeout(() => {
          resolve(result)
          this.loading && uni.hideLoading()
        }, time)
        // #endif
      })
    }
    uni.hideLoading()
    return result
  }

  /** 创建canvas本地地址 @returns {string} 本地地址 */
  createImagePath = async (baseOptions = {} as CreateImagePathOptions) => {
    const { canvas, canvasId, executeOnions, awaitCreate } = this
    executeOnions.length && (await awaitCreate())
    this.loading && uni.showLoading({ title: '生成图片中...' })
    return new Promise((resolve, reject) => {
      const options: WechatMiniprogram.CanvasToTempFilePathOption = {
        x: 0, y: 0,
        width: canvas.width,
        height: canvas.height,
        destWidth: canvas.width * 2,
        destHeight: canvas.height * 2,
        success: (res) => {
          resolve(res.tempFilePath)
          this.loading && uni.hideLoading();
        },
        fail: (err) => {
          this.loading && uni.hideLoading();
          reject(err)
        },
        ...baseOptions
      };
      if (!canvas.createImage) {
        options.canvasId = canvasId
      } else {
        options.canvas = canvas
      }
      gbl.canvasToTempFilePath(options as any)
    })
  }
}

export default DrawPoster;