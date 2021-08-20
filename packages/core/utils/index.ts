import { isObject } from 'lodash'
import { UNI_PLATFORM } from '@tuimao/uni-utils'

/**
 * 处理构建配置
 * @param args
 */
export const createDrawOptions: UseDrawPoster<DrawPosterOptions> = (...args) => {
  const _default: DrawPosterOptions = {
    selector: '',
    componentThis: undefined,
    type: UNI_PLATFORM === 'mp-weixin' ? '2d' : 'context',
    tips: false,
    debugging: false,
    loadingText: '绘制海报中...',
    createText: '生成图片中...',
    gcanvas: false
  }
  let _overrides: DrawPosterOptions
  if (isObject(args[0])) {
    _overrides = args[0]
  } else if (isObject(args[1])) {
    _overrides = <any>args[0]
  } else {
    _overrides = { selector: '' }
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
}

/**
 * 查询 fields 信息
 * @param selector
 * @param componentThis
 * @param options
 * @returns
 */
export const queryFields = (selector: string, componentThis?: any, options?: UniApp.NodeField) => {
  const query = componentThis
    ? uni.createSelectorQuery().in(componentThis)
    : uni.createSelectorQuery()
  return new Promise<UniApp.NodeInfo>((resolve) => {
    query
      .select(selector)
      .fields(options || {}, resolve)
      .exec()
  })
}
