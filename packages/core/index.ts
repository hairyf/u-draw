import { isObject } from 'lodash'
import { queryFields, UNI_PLATFORM } from '../utils'
import { DebuggingLog } from './debugginglog'
import { Plugins, globalUse, DrawPosterPlugin, DrawPosterUse } from './plugin'

export type NonNullableCustom<T, N> = T extends N ? never : T
export type NonPick<T, K extends keyof T> = {
  [P in NonNullableCustom<keyof T, K>]: T[P]
}

export interface DrawPosterOptions {
  /** 查询字符串(必须), 注意不要写错对应canvas id */
  selector: string
  /** 选取组件范围 */
  componentThis?: any
  /** 绘制类型, 微信小程序自动切换为 '2d' */
  type?: '2d' | 'context' | 'webgl'
  /** 是否在绘制与创建时显示加载提示 */
  loading?:
    | boolean
    | {
        /** 生成时加载文字 @default '绘制海报中...' */
        render?: string
        /** 创建图片时加载文字 @default '生成图片中...' */
        create?: string
      }
  /** 是否开启调试模式 */
  debug?: boolean
  /** 是否启动gcanvas(nvue) */
  gcanvas?: boolean
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
  /** 绘制扩展 */
  plugins?: DrawPosterPlugin[]
}
export interface DrawPosterResult {
  /** 绘制标识 */
  readonly id: string
  /** 当前绘画插件 */
  readonly plugins: DrawPosterPlugin[]
  /** 源数据 */
  readonly $options: DrawPosterOptions
  /** 画布(仅 2d 生效) */
  readonly canvas: Canvas
  /** 画笔 */
  readonly ctx: CanvasCtx
  /**
   * 引入扩展
   * 建议: 在构建配置中传入 `plugins`, 该引入方式无法触发 beforeMount
   */
  readonly use: DrawPosterUse
  /** 停止绘制(仅停止生成) */
  readonly stop: () => void
  /** 创建一个绘制作用域 */
  readonly draw: (func: (ctx: CanvasCtx) => Promise<void> | void) => void
  /** 将所有作用域渲染 */
  readonly render: () => Promise<boolean[]>
  /** 生成图片地址 */
  readonly createImagePath: (options?: CreateImagePathOptions) => Promise<string>
  /** 绘图原型(用于在 beforeMount 时自定义绘制原型) */
  $drawPrototype?: { canvas: Canvas; ctx: CanvasCtx }
  [key: string]: any
}
export interface CanvasCtx extends UniApp.CanvasContext {
  [key: string]: any
  createImageData: () => ImageData
  textAlign: CanvasTextDrawingStyles['textAlign']
  textBaseline: CanvasTextDrawingStyles['textBaseline']
  transform: CanvasTransform['transform']
}
export interface Canvas {
  width: number
  height: number
  getContext<K extends '2d' | 'webgl'>(
    contextType: K
  ): K extends '2d' ? CanvasCtx : WebGLRenderingContext
  createImage(): {
    src: string
    width: number
    height: number
    onload: () => void
    onerror: () => void
  }
  requestAnimationFrame(callback: Function): number
  cancelAnimationFrame(requestID: number): void
  createImageData(): ImageData
  createPath2D(path: Path2D): Path2D
  toDataURL(type: string, encoderOptions: number): string
}
export type Stacks = Array<() => Promise<boolean>>
export type CreateImagePathOptions = Partial<
  NonPick<UniApp.CanvasToTempFilePathOptions, 'canvasId' | 'complete' | 'success' | 'fail'>
>

function useDrawPoster(
  selector: string,
  options?: Partial<NonPick<DrawPosterOptions, 'selector'>>
): Promise<DrawPosterResult>
function useDrawPoster(options: DrawPosterOptions): Promise<DrawPosterResult>
async function useDrawPoster(...args: any[]) {
  const $options = (() => {
    const _default: DrawPosterOptions = {
      selector: '',
      componentThis: undefined,
      type: UNI_PLATFORM === 'mp-weixin' ? '2d' : 'context',
      loading: false,
      debug: false,
      gcanvas: false
    }
    let _overrides: DrawPosterOptions
    if (isObject(args[0])) {
      _overrides = args[0] as any
    } else if (isObject(args[1])) {
      _overrides = <any>args[1]
      _overrides.selector = args[0]
    } else {
      _overrides = { selector: args[0] }
    }
    const options = { ..._default, ..._overrides }
    options.selector = options.selector.replace('#', '')
    if (options.type === '2d') {
      options.selector = `#${options.selector}`
    }
    if (options.loading === true) {
      options.loading = { render: '绘制海报中...', create: '生成图片中...' }
    }
    if (isObject(options.loading)) {
      options.loading!.render = options.loading?.render ?? '绘制海报中...'
      options.loading!.create = options.loading?.create ?? '生成图片中...'
    }
    if (!UNI_PLATFORM) {
      console.warn(
        '注意! draw-poster未开启uni条件编译! 当环境是微信小程序将不会动态切换为type=2d模式'
      )
      console.warn(`请在vue.config.js中的'transpileDependencies'中添加 'u-draw-poster' `)
    }
    return options
  })()

  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  const dp: Partial<DrawPosterResult> = { $options }
  const ps = new Plugins(dp)
  const consola = new DebuggingLog(dp)
  let stacks: Stacks = []
  let isStop = false

  const build = async () => {
    if (dp.$drawPrototype) return dp.$drawPrototype
    const _nodeInfo = await queryFields($options.selector, $options.componentThis, <any>{
      node: true
    })
    const canvas: Canvas = (<any>_nodeInfo)?.node || {}
    const ctx =
      canvas.getContext?.('2d') ||
      uni.createCanvasContext($options.selector, $options.componentThis)
    if (!canvas || !ctx || !$options.selector) {
      throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')
    }
    return { canvas, ctx }
  }

  const render = async () => {
    if ($options.loading) uni.showLoading({ title: ($options.loading as any).render })

    consola.log('绘制海报中...')
    const tips: boolean[] = []
    for (const next of stacks) {
      tips.push(await next())
    }
    stacks = []
    consola.log('绘制状况: ', undefined, tips)

    if ($options.type === 'context') {
      await new Promise((resolve) => {
        dp.ctx!.draw(true, resolve)
      })
    }

    if ($options.loading) uni.hideLoading()

    return tips
  }

  const createImagePath = async (_options_ = {}) => {
    if (stacks.length > 0) await dp.render!()
    if (isStop) {
      isStop = false
      return Promise.reject()
    }
    if ($options.loading) uni.showLoading({ title: ($options.loading as any).create })

    const options: UniApp.CanvasToTempFilePathOptions = <any>_options_

    if ($options.type === '2d') {
      ;(<any>options).canvas = dp.canvas
    }
    if ($options.type === 'context') {
      ;(<any>options).canvasId = dp.id
    }
    return new Promise<string>((resolve, reject) => {
      options.success = (res) => {
        resolve(res.tempFilePath)
        $options.loading && uni.hideLoading()
        consola.success('绘制成功', res)
      }
      options.fail = (err) => {
        reject(err)
        $options.loading && uni.hideLoading()
        consola.success('绘制失败', err)
      }
      uni.canvasToTempFilePath(<any>options)
    })
  }

  const draw = async (func: Function) => {
    const length = stacks.length
    stacks.push(async () => {
      try {
        dp.ctx!.save()
        await func(dp.ctx!)
        dp.ctx!.restore()
        return true
      } catch (error: any) {
        if (!error?.message?.includes?.(`'nodeId' of undefined`))
          consola.error(`绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  const stop = () => {
    stacks = []
    isStop = true
  }

  if (page[`__dp_${dp.id}`]) return page[`__dp_${dp.id}`]

  Object.defineProperty(dp, 'id', { get: () => $options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })

  ps.run('beforeMount')

  const { canvas, ctx } = await build()

  Object.defineProperty(dp, 'canvas', { get: () => canvas })
  Object.defineProperty(dp, 'ctx', { get: () => ctx })
  Object.defineProperty(dp, 'render', { get: () => render })
  Object.defineProperty(dp, 'createImagePath', { get: () => createImagePath })
  Object.defineProperty(dp, 'draw', { get: () => draw })
  Object.defineProperty(dp, 'stop', { get: () => stop })
  Object.defineProperty(dp, 'use', { get: () => ps.use })

  dp.canvas!.width = $options.width ?? 0
  dp.canvas!.height = $options.height ?? 0

  ps.run('mounted')

  $options.debug && consola.success('构建成功!', dp)

  page[`__dp_${dp.id}`] = dp

  const _onUnload = page.onUnload
  page.onUnload = function () {
    ps.run('beforeUnmount')
    dp.stop!()
    _onUnload()
    ps.run('unmounted')
  }
  return dp
}

useDrawPoster.use = globalUse

export { useDrawPoster, DrawPosterPlugin }
