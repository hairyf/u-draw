import { isFunction, isObject, isString } from 'lodash'
import { UseDrawPosterResult, NonPick } from '.'
export interface DrawPosterLifeCycle<I = UseDrawPosterResult, O = Record<string, any>> {
  (instance: I, options?: O): void
}

export interface DrawPosterLifeCycles {
  /** 创建实例前 */
  beforeMount?: DrawPosterLifeCycle<Partial<UseDrawPosterResult>>
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
  (name: string, options: NonPick<DrawPosterPlugin, 'name'>): void
  (options: DrawPosterPlugin): void
}

/**
 * 对插件参数进行处理并引入
 * @param plugins 插件列表
 * @param args 参数
 */
const usePluginOptions = (plugins: DrawPosterPlugin[], ...args: any[]) => {
  if (!args[0]) {
    throw new Error('DrawPoster Error: plugins arguments required')
  }
  let _options: DrawPosterPlugin = { name: '' }
  if (isString(args[0]) && isFunction(args[1])) {
    _options.name = args[0]
    _options.mounted = args[1]
  }
  if (isString(args[0]) && isObject(args[1])) {
    _options = { name: args[0], ...args[1] }
  }
  if (isObject(args[0])) {
    _options = <any>args[0]
  }
  plugins.push(_options)
}

const globalPlugins: DrawPosterPlugin[] = []

export const use: DrawPosterUse = (...args: any[]) => usePluginOptions(globalPlugins, ...args)

export class Plugins {
  $plugins: DrawPosterPlugin[] = []
  get plugins(): DrawPosterPlugin[] {
    return [...globalPlugins, ...this.$plugins]
  }

  constructor(public dp: Partial<UseDrawPosterResult>) {}

  use = (...args: any[]) => {
    usePluginOptions(this.$plugins, ...args)
    if (this.dp['canvas']) this.run('mounted')
  }

  run = (lifeCycleName: keyof DrawPosterLifeCycles) => {
    this.plugins.forEach((lifeCycle) => {
      lifeCycle[lifeCycleName]?.(<any>this.dp)
    })
  }
}
