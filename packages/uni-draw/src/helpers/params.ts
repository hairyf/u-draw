import { isMpWeixin } from '@uni-helper/uni-env'
import { isFunction, isObject, isString } from '../utils/is'
import type { Plugin } from '../core'
import type { DrawOptions } from '../core/types'
import { globalPlugins } from './internal'

/**
 * 处理 drawPoster 参数
 * @param args
 * @returns options
 */
export function helper(...args: any[]) {
  const _default: DrawOptions = {
    selector: '',
    componentThis: undefined,
    type: isMpWeixin ? '2d' : 'context',
    debug: false,
  }
  let _overrides: DrawOptions
  if (isObject(args[0])) {
    _overrides = args[0] as any
  }
  else if (isObject(args[1])) {
    // @ts-expect-error
    _overrides = args[1]
    _overrides.selector = args[0]
  }
  else {
    _overrides = { selector: args[0] }
  }
  const options = { ..._default, ..._overrides }

  options.selector = options.selector.replace('#', '')
  if (options.type === '2d')
    options.selector = `#${options.selector}`

  return options
}

/**
 * 对插件参数进行处理并引入
 * @param plugins 插件列表
 * @param args 参数
 */
export function helperPluginParams(plugins: Plugin[], ...args: any[]) {
  if (!args[0])
    throw new Error('DrawPoster Error: plugins arguments required')

  let _options: Plugin = { name: '' }
  if (isString(args[0]) && isFunction(args[1])) {
    _options.name = args[0]
    _options.mounted = args[1]
  }
  if (isString(args[0]) && isObject(args[1]))
    _options = { name: args[0], ...args[1] }

  if (isObject(args[0]))
    _options = args[0] as any

  if (![...globalPlugins, ...plugins].some(v => _options.name === v.name)) {
    plugins.push(_options)
    return _options
  }
  console.warn(`该扩展已存在: ${_options.name}`)
}
