import { getCurrentDrawPoster, setCurrentDrawPoster } from '../helpers/internal'
import { helperDrawPosterParams } from '../helpers/params'
import { queryFields } from '../utils'
import { Consola } from './consola'
import { Plugins, DrawPosterPlugin, DrawPosterUse } from './plugin'
import DrawProcess from './process'
import { Canvas, CanvasCtx, CreatePathOptions } from './typed'

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
  /** 生成图片地址, 当进程存在则调用所有进程 */
  readonly create: (options?: CreatePathOptions) => Promise<string>
  /** 绘图原型(用于在 beforeMount 时自定义绘制原型) */
  $drawPrototype?: { canvas: Canvas; ctx: CanvasCtx }
  [key: string]: any
}

function useDrawPoster(
  selector: string,
  options?: Partial<Omit<DrawPosterOptions, 'selector'>>
): Promise<DrawPosterResult>
function useDrawPoster(options: DrawPosterOptions): Promise<DrawPosterResult>

async function useDrawPoster(...args: any[]) {
  const $options = helperDrawPosterParams(...args)

  // 假如当前页面已存在实例, 则直接返回
  const currentDrawPoster = getCurrentDrawPoster($options.selector)
  if (currentDrawPoster) return currentDrawPoster

  // #region 初始化参数定义, 初始化插件系统 / debug 系统 / 进程系统
  const dp: Partial<DrawPosterResult> = { $options }

  const ps = new Plugins(dp)
  const consola = new Consola(dp)
  const pcs = new DrawProcess(dp, consola)

  Object.defineProperty(dp, 'id', { get: () => $options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })

  // #endregion

  // #region 基础方法定义
  const build = async () => {
    const { $drawPrototype, $options } = dp
    const { selector = '', componentThis } = $options || {}

    if ($drawPrototype) return $drawPrototype

    const nodeInfo = await queryFields(selector, componentThis, <any>{ node: true })
    const canvas: Canvas = (<any>nodeInfo)?.node || {}
    const ctx = canvas.getContext?.('2d') || uni.createCanvasContext(selector, componentThis)
    if (!canvas || !ctx || !selector) {
      throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')
    }
    canvas!.width = $options?.width ?? 0
    canvas!.height = $options?.height ?? 0
    return { canvas, ctx }
  }
  const render = async () => {
    const hideLoading = consola.loading('create')

    consola.log('绘制海报中...')

    const tips: boolean[] = await pcs.walk()

    consola.log('绘制状况: ', undefined, tips)

    if ($options.type === 'context') {
      await new Promise((resolve) => dp.ctx!.draw(true, resolve))
    }

    hideLoading()

    return tips
  }
  const create = async (_options_ = {}) => {
    ps.run('beforeCreate')

    if (pcs.stacks.length > 0) await dp.render!()
    if (pcs.prevent) return Promise.reject()

    const hideLoading = consola.loading('create')

    const options: UniApp.CanvasToTempFilePathOptions = <any>_options_

    if ($options.type === '2d') (<any>options).canvas = dp.canvas
    if ($options.type === 'context') (<any>options).canvasId = dp.id

    const promised = new Promise<string>((resolve, reject) => {
      options.success = (res) => {
        resolve(res.tempFilePath)
        hideLoading()
        consola.success('绘制成功', res)
        ps.run('created')
      }
      options.fail = (err) => {
        reject(err)
        hideLoading()
        consola.error('绘制失败', err)
      }
      uni.canvasToTempFilePath(<any>options)
    })

    return promised
  }
  // #endregion

  // #region 挂载数据与方法
  ps.run('beforeMount')

  const { canvas, ctx } = await build()

  Object.defineProperty(dp, 'canvas', { get: () => canvas })
  Object.defineProperty(dp, 'ctx', { get: () => ctx })
  Object.defineProperty(dp, 'render', { get: () => render })
  Object.defineProperty(dp, 'create', { get: () => create })
  Object.defineProperty(dp, 'draw', { get: () => pcs.push })
  Object.defineProperty(dp, 'stop', { get: () => pcs.stop })
  Object.defineProperty(dp, 'use', { get: () => ps.use })

  ps.run('mounted')

  consola.success('构建成功!', dp)
  // #endregion

  // 保存实例, 实现单页面同个实例
  setCurrentDrawPoster(dp, ps)

  return dp
}

export { useDrawPoster, DrawPosterPlugin, Plugins }
