import gbl from "./utils/global"
import {
  Canvas,
  DrawPosterCanvasCtx,
  Execute,
  CreateImagePathOptions,
  DrawPosterBuildOpts,
  getCanvas2dContext,
  handleBuildOpts
} from "./utils";
import { drawCtxMount } from "./draw-function"
class DrawPoster {
  private executeOnions = [] as Execute;
  constructor(
    public canvas: Canvas,
    public ctx: DrawPosterCanvasCtx,
    public canvasId: string,
    public loading: boolean,
    public drawImageTime: number,
    public debugging: boolean
  ) {
    if (!canvas || !ctx || !canvasId){
      throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects")
    }
    drawCtxMount(canvas, ctx)
   }

  /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
  static async build(options: string | DrawPosterBuildOpts, tips = true) {
    const { selector, componentThis, loading, drawImageTime, debugging } = handleBuildOpts(options)
    // 获取canvas实例
    const canvas = await getCanvas2dContext(selector) as Canvas
    const ctx = (
      canvas.getContext && canvas.getContext("2d") || gbl.createCanvasContext(selector, componentThis)
    ) as DrawPosterCanvasCtx
    tips && console.log("draw-poster 构建完成：", { canvas, ctx, selector })
    return new DrawPoster(canvas, ctx, selector, loading, drawImageTime, debugging)
  }

  /** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
  static async buildAll(optionsAll: (string | DrawPosterBuildOpts)[]) {
    const dpsArr = await Promise.all(optionsAll.map(async options=> {
      return await DrawPoster.build(options, false)
    }))
    const dpsObj = {} as {[key:string]: typeof dpsArr[0]}
    dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp)
    console.log("draw-posters 构建完成：", dpsObj)
    return dpsObj
  }

  /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
  draw = (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => {
    const length = this.executeOnions.length
    this.executeOnions.push(async () => {
      try {
        this.ctx.save()
        await execute(this.ctx)
        this.ctx.restore()
        return true
      } catch (error) {
        console.error(`绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  /** 等待创建绘画, 成功后清空绘制器容器 */
  awaitCreate = async ():Promise<boolean[]> => {
    this.loading && uni.showLoading({ title: '绘制海报中...' })
    const tips: Array<boolean> = []
    for (let i = 0; i < this.executeOnions.length; i++) {
      const execute = this.executeOnions[i]
      tips.push(await execute())
    }
    this.executeOnions = []
    this.debugging && (console.log('当前绘制状况：', tips))
    if (!!this.ctx.draw) {
      return await new Promise((resolve) => {
        this.ctx.draw(true, () => {
          resolve(tips)
          this.loading && uni.hideLoading()
        })
        // #ifdef APP-PLUS
        let time = 0
        if (this.ctx.existDrawImage) {
          time = 100
          this.ctx.existDrawImage = false
        }
        setTimeout(() => {
          resolve(tips)
          this.loading && uni.hideLoading()
        }, time)
        // #endif
      })
    }
    uni.hideLoading()
    return tips
  }

  /** 创建canvas本地地址 @returns {string} 本地地址 */
  createImagePath = async (baseOptions = {} as CreateImagePathOptions):Promise<string> => {
    const { canvas, canvasId, executeOnions, awaitCreate, debugging } = this
    if (executeOnions.length) {
      const tips = await awaitCreate()
      debugging && (console.log('当前绘制状况：', tips))
    }
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