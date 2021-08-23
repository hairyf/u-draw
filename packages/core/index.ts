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
  componentThis?: string
  /** 绘制类型, 微信小程序自动切换为 '2d' */
  type?: '2d' | 'context' | 'webgl'
  /** 是否在绘制与创建时显示加载提示 */
  loading?: boolean
  /** 是否开启调试模式 */
  debugging?: boolean
  /** 加载提示文字 */
  loadingText?: string
  /** 创建图片提示文字 */
  createText?: string
  /** 是否启动gcanvas(nvue) */
  gcanvas?: boolean
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
}
export interface DrawPosterResult {
  readonly _id: string
  readonly plugins: DrawPosterPlugin[]
  canvas: Canvas
  ctx: CanvasCtx
  use: DrawPosterUse
  stop(): void
  draw(func: (ctx: CanvasCtx) => Promise<void> | void): void
  render(): Promise<boolean[]>
  createImagePath(options?: CreateImagePathOptions): Promise<string>
  $options: DrawPosterOptions
  [key: string]: any
}
export interface CanvasCtx extends UniApp.CanvasContext {
  [key: string]: any
  createImageData: () => ImageData
  textAlign: CanvasTextDrawingStyles['textAlign']
  textBaseline: CanvasTextDrawingStyles['textBaseline']
  transform: CanvasTransform['transform']
  /** 绘制图片原型 */
  drawImageProto: UniApp.CanvasContext['drawImage']
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
      debugging: false,
      loadingText: '绘制海报中...',
      createText: '生成图片中...',
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
  const consola = new DebuggingLog(dp, $options)
  let stacks: Stacks = []
  let isStop = false

  const build = async () => {
    ps.run('beforeMount')
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
    dp.canvas = canvas
    dp.ctx = ctx
    ps.run('mounted')
  }

  dp.render = async () => {
    if ($options.loading) uni.showLoading({ title: $options.loadingText })

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

  dp.createImagePath = async (_options_ = {}) => {
    if (stacks.length > 0) await dp.render!()
    if (isStop) {
      isStop = false
      return Promise.reject()
    }
    if ($options.loading) uni.showLoading({ title: $options.createText })

    const options: UniApp.CanvasToTempFilePathOptions = <any>_options_

    if ($options.type === '2d') {
      ;(<any>options).canvas = dp.canvas
    }
    if ($options.type === 'context') {
      ;(<any>options).canvasId = dp._id
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

  dp.draw = async (func) => {
    const length = stacks.length
    stacks.push(async () => {
      try {
        dp.ctx!.save()
        await func(dp.ctx!)
        dp.ctx!.restore()
        return true
      } catch (error) {
        if (!error?.message?.includes?.(`'nodeId' of undefined`))
          consola.error(`绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  dp.stop = () => {
    stacks = []
    isStop = true
  }

  Object.defineProperty(dp, '_id', { get: () => $options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })
  Object.defineProperty(dp, 'use', { get: () => ps.use })

  if (page[`__dp_${dp._id}`]) return page[`__dp_${dp._id}`]

  await build()

  $options.debugging && consola.success('构建成功!', dp)

  dp.canvas!.width = $options.width ?? 0
  dp.canvas!.height = $options.height ?? 0

  page[`__dp_${dp._id}`] = dp

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
