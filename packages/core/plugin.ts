import { globalPlugins } from '../helpers/internal'
import { helperPluginParams } from '../helpers/params'
import { DrawPosterResult } from './typed'

export interface DrawPosterLifeCycle<I = DrawPosterResult, O = Record<string, any>> {
  (instance: I, options?: O): void
}

export interface DrawPosterLifeCycles {
  /** 创建实例前 */
  beforeMount?: DrawPosterLifeCycle<Partial<DrawPosterResult>>
  /** 创建实例后 */
  mounted?: DrawPosterLifeCycle
  /** 卸载实例前 */
  beforeUnmount?: DrawPosterLifeCycle
  /** 卸载实例后 */
  unmounted?: DrawPosterLifeCycle
  /** 创建绘图前 */
  beforeCreate?: DrawPosterLifeCycle
  /** 创建绘图后 */
  created?: DrawPosterLifeCycle
}
export interface DrawPosterPlugin extends DrawPosterLifeCycles {
  /** 扩展名称 */
  name: string
}

export interface DrawPosterUse {
  (name: string, lifeCycle: DrawPosterLifeCycle): void
  (name: string, options: DrawPosterLifeCycles): void
  (options: DrawPosterPlugin): void
}

export class Plugins {
  /** 当前示例中挂在的所有 plugins （不包含 global plugins） */
  private $plugins: DrawPosterPlugin[] = []

  /** 当前示例中挂在的所有 plugins（包含 global plugins） */
  get plugins(): DrawPosterPlugin[] {
    return [...globalPlugins, ...this.$plugins]
  }

  constructor(public dp: Partial<DrawPosterResult>) {
    if (dp.$options?.plugins) this.$plugins.push(...dp.$options?.plugins)
  }

  /**
   * 全局插件挂载
   * @param args
   */
  static use = (...args: any[]) => helperPluginParams(globalPlugins, ...args)

  /**
   * 局部插件挂载
   * @param args
   */
  use = (...args: any[]) => {
    const plugin = helperPluginParams(this.$plugins, ...args)
    if (this.dp['canvas']) plugin?.mounted?.(<any>this.dp)
  }

  run = (lifeCycleName: keyof DrawPosterLifeCycles) => {
    this.plugins.forEach((lifeCycle) => lifeCycle[lifeCycleName]?.(<any>this.dp))
  }
}
