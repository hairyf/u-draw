import { isObject } from 'lodash'
import { DrawPosterOptions } from '.'
import { UNI_PLATFORM } from '../utils'

export const helperParams = (...args: any[]) => {
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
}
