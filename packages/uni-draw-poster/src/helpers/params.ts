import { isFunction, isObject, isString } from '../utils/is'
import type { Plugin } from '../core'
import type { DrawPosterOptions } from '../core/typed'
import { UNI_PLATFORM } from '../utils'
import { globalPlugins } from './internal'

/**
 * 处理 drawPoster 参数
 * @param args
 * @returns options
 */
export const helper = (...args: any[]) => {
  const _default: DrawPosterOptions = {
    selector: '',
    componentThis: undefined,
    type: UNI_PLATFORM === 'mp-weixin' ? '2d' : 'context',
    loading: false,
    debug: false,
    gcanvas: false,
  }
  let _overrides: DrawPosterOptions
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

  if (options.loading === true)
    options.loading = { render: '绘制海报中...', create: '生成图片中...' }

  if (isObject(options.loading)) {
    options.loading!.render = options.loading?.render ?? '绘制海报中...'
    options.loading!.create = options.loading?.create ?? '生成图片中...'
  }
  return options
}

/**
 * 对插件参数进行处理并引入
 * @param plugins 插件列表
 * @param args 参数
 */
export const helperPluginParams = (plugins: Plugin[], ...args: any[]) => {
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
