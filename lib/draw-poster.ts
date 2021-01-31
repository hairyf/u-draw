import gbl, { PLATFORM } from "./utils/global"
import {
  Canvas, Execute,
  DrawPosterCanvasCtx,
  CreateImagePathOptions,
  DrawPosterBuildOpts,
  DrawPosterUseOpts,
  drawPosterExtends,
  DrawPosterUseCtxOpts
} from "./utils/interface"
import { handleBuildOpts, extendMount } from "./utils/utils"
import { getCanvas2dContext } from "./utils/wx-utils"

// 实例类型添加上扩展类型
type DrawPosterInstanceType = InstanceType<typeof DrawPoster> & drawPosterExtends

// 扩展挂载储存
let drawPosterExtend: Record<any, any> = {}
let drawCtxPosterExtend: Record<any, any> = {}

class DrawPoster {
  [key: string]: any
  private executeOnions = [] as Execute
  private stopStatus = false
  private drawType: 'type2d' | 'context'

  /** 构建器, 构建返回当前实例, 并挂载多个方法 */
  constructor(
    public canvas: Canvas,
    public ctx: DrawPosterCanvasCtx,
    public canvasId: string,
    public loading: boolean,
    public debugging: boolean,
    public loadingText: string,
    public createText: string
  ) {
    if (!canvas || !ctx || !canvasId) {
      throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects")
    }

    // 判断当前绘制类型
    ctx.drawType = this.drawType = (ctx.draw) ? 'context' : 'type2d'

    // 挂载全局实例, 绘画扩展
    extendMount(this.ctx, drawCtxPosterExtend, (extend, target) => {
      target?.init?.(this.canvas, this.ctx)
      return (...args: any[]) => extend(this.canvas, this.ctx, ...args)
    })
    extendMount(this, drawPosterExtend, (extend, target) => {
      target?.init?.(this)
      return (...args: any[]) => extend(this, ...args)
    })

    // 当离开页面时, 自动调用停止绘画
    const _this = this
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as Record<any, any>
    // 查询标识, 不存在, 在替换页面卸载回调, 避免产生死循环
    if (!page?.onUnload?.identification) {
      page.oldOnUnload = page.onUnload
      page.onUnload = function () {
        _this?.stop()
        page.oldOnUnload()
      }
      page.onUnload.identification = true
    }
  }
  /** 提示器, 传入消息与数据 */
  private debuggingLog = (message: string, data?: any) => {
    if (this.debugging) {
      if (data) {
        console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd", data)
      } else {
        console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd")
      }
    }
  }

  /** 传入挂载配置对象, 添加扩展方法 */
  static use = (opts: DrawPosterUseOpts) => {
    drawPosterExtend[opts.name] = opts
  }

  /** 传入挂载配置对象, 添加绘画扩展方法 */
  static useCtx = (opts: DrawPosterUseCtxOpts) => {
    drawCtxPosterExtend[opts.name] = opts
  }

  /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
  static build = async (options: string | DrawPosterBuildOpts, tips = true) => {
    const config = handleBuildOpts(options)

    // 初始化监测当前页面绘制对象
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as Record<string, DrawPosterInstanceType>
    if (page[config.selector + '__dp']) {
      return page[config.selector + '__dp']
    }

    // 获取canvas实例
    const canvas = await getCanvas2dContext(config.selector, config.componentThis) as Canvas
    const ctx = (
      canvas.getContext?.("2d") || gbl.createCanvasContext(config.selector, config.componentThis)
    ) as DrawPosterCanvasCtx

    tips && console.log("%cdraw-poster 构建完成：", "#E3712A", { canvas, ctx, selector: config.selector })

    const dp = new DrawPoster(
      canvas, ctx,
      config.selector,
      config.loading,
      config.debugging,
      config.loadingText,
      config.createText
    )
    // 储存当前绘制对象
    page[config.selector + '__dp'] = dp as DrawPosterInstanceType;
    return page[config.selector + '__dp']
  }

  /** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
  static buildAll = async (optionsAll: (string | DrawPosterBuildOpts)[]) => {
    const dpsArr = await Promise.all(optionsAll.map(async options => {
      return await DrawPoster.build(options, false)
    }))
    const dpsObj = {} as { [key: string]: typeof dpsArr[0] }
    dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp)
    console.log("%cdraw-poster 构建完成：", "#E3712A", dpsObj)
    return dpsObj
  }

  /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
  public draw = (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => {
    const length = this.executeOnions.length
    this.executeOnions.push(async () => {
      try {
        this.ctx.save()
        await execute(this.ctx)
        this.ctx.restore()
        return true
      } catch (error) {
        const isOutError = error?.message?.search?.(`'nodeId' of undefined`) >= 0
        !isOutError && console.error(`${this.canvasId} -> 绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  /** 等待创建绘画, 成功后清空绘制器容器 */
  public awaitCreate = async (): Promise<boolean[]> => {
    this.debuggingLog('绘制海报中...')
    this.loading && gbl.showLoading({ title: this.loadingText })

    const tips: Array<boolean> = []
    for (let i = 0; i < this.executeOnions.length; i++) {
      const execute = this.executeOnions[i]
      tips.push(await execute())
    }
    this.executeOnions = []
    this.debuggingLog('绘制状况', tips)

    // 当前绘制为 type2 绘制
    if (this.drawType === 'type2d') {
      this.loading && gbl.hideLoading()
      return tips
    }
    // 当前绘制为 context 绘制
    return await new Promise((resolve) => {
      this.ctx.draw(true, () => {
        resolve(tips)
        this.loading && gbl.hideLoading()
      })
    })
  }

  /** 创建canvas本地地址 @returns {string} 本地地址 */
  public createImagePath = async (baseOptions: CreateImagePathOptions = {}): Promise<string> => {
    const { canvas, canvasId, executeOnions, awaitCreate } = this
    executeOnions.length && await awaitCreate()
    // 如果当前为停止状态
    if (this.stopStatus) {
      this.stopStatus = false
      return '---stop createImagePath---'
    }
    this.loading && gbl.showLoading({ title: this.createText })
    const options: WechatMiniprogram.CanvasToTempFilePathOption = {
      x: 0, y: 0,
      width: canvas.width,
      height: canvas.height,
      destWidth: canvas.width * 2,
      destHeight: canvas.height * 2,
      ...baseOptions
    };

    if (this.drawType === 'context')
      options.canvasId = canvasId
    if (this.drawType === 'type2d')
      options.canvas = canvas
    
    return new Promise((resolve, reject) => {
      options.success = (res) => {
        resolve(res.tempFilePath)
        this.loading && gbl.hideLoading();
        this.debuggingLog('绘制成功 🎉', res)
      }
      options.fail = (err) => {
        reject(err)
        this.loading && gbl.hideLoading();
        this.debuggingLog('绘制失败 🌟', err)
      }
      gbl.canvasToTempFilePath(options as any)
    })
  }

  /** 停止当前绘画, 调用则停止当前绘画堆栈的绘画 */
  public stop = () => {
    this.executeOnions = []
    this.stopStatus = true
  }
}

export default DrawPoster;