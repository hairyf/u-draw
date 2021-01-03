/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-10-11 18:30:56
 * @LastEditTime: 2021-01-03 12:31:07
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
declare const wx: UniApp.Uni

/** 当前环境类型 */
export type UniPlatforms = 'app-plus' | 'app-plus-nvue' | 'h5' | 'mp-weixin' | 'mp-alipay' | 'mp-baidu' | 'mp-toutiao' | 'mp-qq' | 'mp-360' | 'mp' | 'quickapp-webview' | 'quickapp-webview-union' | 'quickapp-webview-huawei' | undefined
export const PLATFORM = typeof process !== 'undefined' ? process?.env?.VUE_APP_PLATFORM as UniPlatforms : undefined


/** 全局对象 */
const _uni = (function () {
  if (typeof uni != "undefined")
    return uni;
  if (typeof wx != "undefined")
    return wx;
  return uni;
})()

export default _uni