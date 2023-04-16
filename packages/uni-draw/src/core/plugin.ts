import { globalPlugins } from '../helpers/internal'
import { helperPluginParams } from '../helpers/params'
import type { DrawInstance } from './types'

export interface DrawLifeCycle<I = Required<DrawInstance>, O = Record<string, any>> {
  (instance: I, options?: O): void
}

export interface DrawLifeCycles {
  /** 创建实例前 */
  beforeMount?: DrawLifeCycle<Partial<DrawInstance>>
  /** 创建实例后 */
  mounted?: DrawLifeCycle
  /** 卸载实例前 */
  beforeUnmount?: DrawLifeCycle
  /** 卸载实例后 */
  unmounted?: DrawLifeCycle
  /** 创建绘图前 */
  beforeCreate?: DrawLifeCycle
  /** 创建绘图后 */
  created?: DrawLifeCycle
}
export interface Plugin extends DrawLifeCycles {
  /** 扩展名称 */
  name: string
}

export interface PluginUse {
  (name: string, lifeCycle: DrawLifeCycle): void
  (name: string, options: DrawLifeCycles): void
  (options: Plugin): void
}

export class Plugins {
  /** 当前示例中挂在的所有 plugins （不包含 global plugins） */
  private $plugins: Plugin[] = []

  /** 当前示例中挂在的所有 plugins（包含 global plugins） */
  get plugins(): Plugin[] {
    return [...globalPlugins, ...this.$plugins]
  }

  constructor(public dp: Partial<DrawInstance>) {
    if (dp.$options?.plugins)
      this.$plugins.push(...dp.$options?.plugins)
  }

  /**
   * 全局插件挂载
   * @param args
   */
  static use: PluginUse = (...args: any[]) => {
    helperPluginParams(globalPlugins, ...args)
    return Plugins
  }

  /**
   * 局部插件挂载
   * @param args
   */
  use: PluginUse = (...args: any[]) => {
    const plugin = helperPluginParams(this.$plugins, ...args)
    if (this.dp.canvas)
      plugin?.mounted?.(this.dp as any)
    return this
  }

  run = (lifeCycleName: keyof DrawLifeCycles) => {
    this.plugins.forEach(lifeCycle => lifeCycle[lifeCycleName]?.(this.dp as any))
  }
}
