import type { Canvas, CanvasContext } from '../@types'
import type { Plugin, PluginUse } from './plugin'

export interface DrawOptions {
  /** 查询字符串(必须), 注意不要写错对应canvas id */
  selector: string
  /** 选取组件范围 */
  componentThis?: any
  /** 绘制类型, 微信小程序自动切换为 '2d' */
  type?: '2d' | 'context' | 'webgl'
  /** 是否开启调试模式 */
  debug?: boolean
  /** 绘制扩展 */
  plugins?: Plugin[]
  /** 是否初始化就执行挂载 */
  immediate?: boolean
}

export interface DrawInstance {
  /** 绘制标识 */
  readonly id: string
  /** 当前绘画插件 */
  readonly plugins: Plugin[]
  /** 源数据 */
  readonly $options: DrawOptions
  /** 画布(仅 2d 生效) */
  readonly canvas?: Canvas
  /** 画笔 */
  readonly ctx?: CanvasContext
  /**
   * 引入扩展
   * 建议: 在构建配置中传入 `plugins`, 该引入方式无法触发 beforeMount
   */
  readonly use: PluginUse
  /** 停止绘制(仅停止生成) */
  readonly stop: () => void
  /** 创建一个绘制作用域 */
  readonly draw: (func: (ctx: CanvasContext, canvas: Canvas) => Promise<void> | void) => void
  /** 将所有作用域渲染 */
  readonly render: () => Promise<boolean[]>
  /** 生成图片地址, 当进程存在则调用所有进程 */
  readonly create: (options?: CanvasToTempFilePathOptions) => Promise<string>
  /** canvas 和 ctx 都已经准备就绪 */
  readonly ready: () => Promise<DrawInstance>
  /** 装载 canvas 和 ctx */
  readonly mount: () => Promise<DrawInstance>
  /** 绘图原型(用于在 beforeMount 时自定义绘制原型) */
  $instance?: { canvas: Canvas; ctx: CanvasContext } | Promise<{ canvas: Canvas; ctx: CanvasContext }>

  /** 绘画动画 */
  readonly renderAnimation: (renderer: Function) => () => void

  [key: string]: any
}

// ---------------------- base ----------------------

export type CanvasToTempFilePathOptions = Partial<Omit<UniApp.CanvasToTempFilePathOptions, 'canvasId' | 'complete' | 'success' | 'fail'>>

export type { Canvas, CanvasContext } from '../@types'
