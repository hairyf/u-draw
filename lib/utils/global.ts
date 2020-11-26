declare const wx: UniApp.Uni

/** 当前环境类型 */
export type UniPlatforms = 'app-plus' | 'app-plus-nvue' | 'h5' | 'mp-weixin' | 'mp-alipay' | 'mp-baidu' | 'mp-toutiao' | 'mp-qq' | 'mp-360' | 'mp' | 'quickapp-webview' | 'quickapp-webview-union' | 'quickapp-webview-huawei' | undefined
export const PLATFORM = process?.env?.VUE_APP_PLATFORM as UniPlatforms

/** 全局对象 */
const _uni = (function () {
  if (typeof uni != "undefined")
    return uni;
  if (typeof wx != "undefined")
    return wx;
  return uni;
})()

export default _uni