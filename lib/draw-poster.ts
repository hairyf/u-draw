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
  private stopStatus = false
  constructor(
    public canvas: Canvas,
    public ctx: DrawPosterCanvasCtx,
    public canvasId: string,
    public loading: boolean,
    public drawImageTime: number,
    public debugging: boolean,
    public loadingText: string,
    public createText: string
  ) {
    if (!canvas || !ctx || !canvasId) {
      throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects")
    }
    drawCtxMount(canvas, ctx)

    // 当离开页面时, 自动调用停止绘画
    const _this = this
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as Record<any, any>
    page.oldOnUnload = page.onUnload
    page.onUnload = function () {
      _this.stop()
      page.oldOnUnload()
    }
  }

  /** 提示器, 传入消息与数据 */
  private debuggingLog(message: string, data?: any) {
    if (this.debugging) {
      if (data) {
        console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd", data)
      } else {
        console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd")
      }
    }
  }

  /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
  static async build(options: string | DrawPosterBuildOpts, tips = true) {
    const {
      selector,
      componentThis,
      loading,
      drawImageTime,
      debugging,
      loadingText,
      createText
    } = handleBuildOpts(options)
    // 初始化监测当前页面绘制对象
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as Record<any, any>
    if (page[selector + '__dp']) {
      return page[selector + '__dp'] as InstanceType<typeof DrawPoster>
    }
    // 获取canvas实例
    const canvas = await getCanvas2dContext(selector) as Canvas
    const ctx = (
      canvas.getContext?.("2d") || gbl.createCanvasContext(selector, componentThis)
    ) as DrawPosterCanvasCtx
    tips && console.log("%cdraw-poster 构建完成：", "#E3712A", { canvas, ctx, selector })
    const dp = new DrawPoster(
      canvas,
      ctx,
      selector,
      loading,
      drawImageTime,
      debugging,
      loadingText,
      createText
    )
    // 储存当前绘制对象
    page[selector + '__dp'] = dp;
    return dp
  }

  /** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
  static async buildAll(optionsAll: (string | DrawPosterBuildOpts)[]) {
    const dpsArr = await Promise.all(optionsAll.map(async options => {
      return await DrawPoster.build(options, false)
    }))
    const dpsObj = {} as { [key: string]: typeof dpsArr[0] }
    dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp)
    console.log("%cdraw-poster 构建完成：", "#E3712A", dpsObj)
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
        const isOutError = error.search?.(`'nodeId' of undefined`) >= 0
        if (isOutError) {
          return false
        } else {
          console.error(`${this.canvasId} -> 绘画栈(${length})，绘制错误：`, error)
          return false
        }
      }
    })
  }
  /** 等待创建绘画, 成功后清空绘制器容器 */
  awaitCreate = async (): Promise<boolean[]> => {
    this.debuggingLog('绘制海报中...')
    this.loading && uni.showLoading({ title: this.loadingText })
    const tips: Array<boolean> = []
    for (let i = 0; i < this.executeOnions.length; i++) {
      const execute = this.executeOnions[i]
      tips.push(await execute())
    }
    this.executeOnions = []
    this.debuggingLog('绘制状况', tips)

    // 当前绘制为 type2 绘制
    if (!this.ctx.draw) {
      uni.hideLoading()
      return tips
    }
    // 当前绘制为 context 绘制
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

  /** 创建canvas本地地址 @returns {string} 本地地址 */
  createImagePath = async (baseOptions = {} as CreateImagePathOptions): Promise<string> => {
    const { canvas, canvasId, executeOnions, awaitCreate } = this
    executeOnions.length && await awaitCreate()
    if (this.stopStatus) {
      this.stopStatus = false
      return ''
    }
    this.loading && uni.showLoading({ title: this.createText })
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
          this.debuggingLog('绘制成功 🎉', res)
        },
        fail: (err) => {
          reject(err)
          this.loading && uni.hideLoading();
          this.debuggingLog('绘制失败 🌟', err)
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

  /** 停止当前绘画, 调用则停止当前绘画堆栈的绘画 */
  stop = () => {
    this.executeOnions = []
    this.stopStatus = true
  }
}

export default DrawPoster;