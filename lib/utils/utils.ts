/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:25
 * @LastEditTime: 2021-01-03 11:36:40
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { DrawPosterBuildOpts } from "./interface"
import { PLATFORM } from "./global"

/** 是否是base64本地地址 */
export const isBaseUrl = (str: string) => {
  return /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(str)
}
/** 是否是小程序本地地址 */
export const isTmpUrl = (str: string) => {
  return /http:\/\/temp\/wx/.test(str)
}
/** 是否是网络地址 */
export const isNetworkUrl = (str: string) => {
  return /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(str)
}
/** 对象target挂载到对象current */
export const extendMount = (
  current: Record<any, any>,
  target: Record<any, any>,
  handle = (extend: Function, target?: Record<any, any>) => undefined as any
) => {
  for (const key in target) {
    current[key] = handle(target[key].handle, target[key]) || target[key].handle
  }
}
/** 处理构建配置 */
export const handleBuildOpts = (options: string | DrawPosterBuildOpts) => {
  let defaultOpts = {
    selector: '',
    componentThis: undefined as any,
    type2d: true,
    loading: false,
    debugging: false,
    loadingText: '绘制海报中...',
    createText: '生成图片中...',
    gcanvas: false
  }
  if (typeof options === "string") {
    defaultOpts.selector = options
  } else {
    defaultOpts = { ...defaultOpts, ...options }
  }
  const oldSelector = defaultOpts.selector

  if (PLATFORM === 'mp-weixin' && defaultOpts.type2d) {
    defaultOpts.selector = '#' + defaultOpts.selector
  }

  if (!PLATFORM) {
    console.error('注意! draw-poster未开启uni条件编译! 当环境是微信小程序将不会动态切换为type2d模式')
    console.error(`请在vue.config.js中的transpileDependencies中添加'uni-draw-poster'`)
    console.error(`或者可以在选择器字符串前缀中添加#来切换为type2d绘制`)
    defaultOpts.selector = oldSelector
  }
  return defaultOpts
}
