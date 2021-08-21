import { isFunction, isObject, isString } from 'lodash'
import { UNI_PLATFORM } from '@tuimao/uni-utils'

export const _debuggingLog = (id: string, message: string, data?: any, color = '#3489fd') => {
  if (data) {
    // eslint-disable-next-line no-console
    console.log(`%c${id} -> ${message}`, `color: ${color}`, data)
  } else {
    // eslint-disable-next-line no-console
    console.log(`%c${id} -> ${message}`, `color: ${color}`)
  }
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
/**
 * 运行绘画堆栈
 * @param executes
 */
export const runExecutes = async (executes: Executes) => {
  const _tips: Array<boolean> = []
  for (const [index] of executes.entries()) {
    _tips.push(await executes.splice(index, 1)[0]())
  }
  return _tips
}

/**
 * 创建 debugging
 * @param id 实例标识
 * @param debugging
 */
export const createDebuggingLog = (id: string, debugging?: boolean) => {
  const debuggingLog = (message: string, data?: any, color?: string) => {
    debugging && _debuggingLog(id, message, data, color)
  }
  debuggingLog.success = (message: string, data?: any) => debuggingLog(message, data, '#19be6b')
  debuggingLog.fail = (message: string, data?: any) => debuggingLog(message, data, '#fa3534')
  return debuggingLog
}

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
 * 对插件参数进行处理并引入
 * @param plugins 插件列表
 * @param args 参数
 */
export const usePluginOptions = (plugins: DrawPosterPlugin[], ...args: any[]) => {
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
