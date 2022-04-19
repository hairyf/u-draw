/**
 * 查询 fields 信息
 * @param selector
 * @param componentThis
 * @param options
 * @returns
 */
export const queryFields = (selector: string, componentThis?: any, options?: UniApp.NodeField) => {
  const query = componentThis ? uni.createSelectorQuery().in(componentThis) : uni.createSelectorQuery()
  return new Promise<UniApp.NodeInfo>((resolve) => {
    query
      .select(selector)
      .fields(options || {}, resolve)
      .exec()
  })
}

type UniPlatforms =
  | 'app-plus'
  | 'app-plus-nvue'
  | 'h5'
  | 'mp-weixin'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-toutiao'
  | 'mp-qq'
  | 'mp-360'
  | 'mp'
  | 'quickapp-webview'
  | 'quickapp-webview-union'
  | 'quickapp-webview-huawei'
  | undefined

/**
 * 当前环境信息
 */
export const UNI_PLATFORM = ((): UniPlatforms => {
  if (typeof process !== 'undefined') return process?.env?.VUE_APP_PLATFORM as UniPlatforms
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
})()

type UniApiKey = keyof UniApp.Uni
type UniApiValue = UniApp.Uni[UniApiKey]
type GetSuccessReult<T extends UniApiValue> = Parameters<Parameters<T>[0]['success']>[0]

/**
 * 将 Uni | wx 转换为异步 Api
 * @param api api
 */
export const promisify = <V extends UniApiValue>(api: V) => {
  return async (...args: Parameters<V>): Promise<GetSuccessReult<V>> => {
    const [error, result] = await (api as any)(...args)
    return error ? Promise.reject(error) : Promise.resolve(result)
  }
}
