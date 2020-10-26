import gbl from "./utils/global"
import {
  Canvas,
  DrawPosterCanvasCtx,
  getCanvas2dContext,
  Execute,
} from "./utils";
interface DarwOptions<T> {
  /** 变换器速率 */
  animSpeed?: number
  /** 注入器速率 */
  injectSpeed?: number
  /** 是否在每次绘制时清除画布 */
  clearDarw?: boolean
  /** 注入内容 */
  inject: () => T
  /** 变化器循环前 */
  changerInit?: (queues: T[]) => void
  /** 变化器 */
  changer: (item: T, index: number, queues: T[]) => void
  /** 绘制器循环前 */
  plotterInit?: (ctx: DrawPosterCanvasCtx, queues: T[]) => void
  /** 绘制器 */
  plotter: (ctx: DrawPosterCanvasCtx, item: T, index: number, queues: T[]) => void
}

import { drawCtxMount } from "./draw-function"
export default class DrawAnimation {
  private executes = [] as Execute;
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
      canvas.getContext && canvas.getContext("2d") || gbl.createCanvasContext(selector)
    ) as DrawPosterCanvasCtx
    return new DrawAnimation(canvas, ctx, selector)
  }

  /** 创建一个动画 */
  anim = <T>(opts: DarwOptions<T>) => {
    // 定义默认数据
    if (typeof opts.injectSpeed !== 'undefined') {
      opts.injectSpeed = 400 - opts.injectSpeed
    } else {
      opts.injectSpeed = 60
    }
    if (typeof opts.animSpeed !== 'undefined') {
      opts.animSpeed = 1000 / opts.injectSpeed
    } else {
      opts.animSpeed = 1000 / 60
    }
    opts.clearDarw = opts.clearDarw ?? true

    // 定义初始化数据
    const ctx = this.ctx
    const queues: T[] = []
    let injectTimer = 0
    let animTimer = 0

    // 运行函数
    function play() {
      injectTimer = setInterval(() => {
        queues.push(opts.inject())
      }, opts.injectSpeed)
      animTimer = setInterval(() => {
        opts.changerInit?.(queues)
        for (let i = 0; i < queues.length; i++) {
          const item = queues[i];
          opts.changer(item, i, queues)
        }
        opts.plotterInit?.(ctx, queues)
        for (let i = 0; i < queues.length; i++) {
          const item = queues[i];
          ctx.save()
          opts.plotter(ctx, item, i, queues)
          ctx.restore()
          ctx.draw?.(true)
        }
      }, opts.animSpeed)
    }

    // 停止函数
    function stop() {
      clearInterval(injectTimer)
      clearInterval(animTimer)
    }
    return { play, stop }
  }
}