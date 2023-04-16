import type { Canvas } from '../@types'

type UniApiKey = keyof UniApp.Uni
type UniApiValue = UniApp.Uni[UniApiKey]
type GetSuccess<T extends UniApiValue> = Parameters<Parameters<T>[0]['success']>[0]

/**
 * 将 Uni | wx 转换为异步 Api
 * @param api api
 */
export function promisify<V extends UniApiValue>(api: V) {
  return async (...args: Parameters<V>): Promise<GetSuccess<V>> => {
    return new Promise((resolve, reject) => {
      const [options, ...other] = args;
      (api as any)({ ...options, success: resolve, fail: reject }, ...other)
    })
  }
}

/**
 * 查询 fields 信息
 * @param selector
 * @param componentThis
 * @param options
 * @returns
 */
export function queryFields(selector: string, componentThis?: any, options?: UniApp.NodeField) {
  const query = componentThis ? uni.createSelectorQuery().in(componentThis) : uni.createSelectorQuery()
  return new Promise<UniApp.NodeInfo>((resolve) => {
    query
      .select(selector)
      .fields(options || {}, (result) => {
        if (Array.isArray(result))
          result = result[0]
        resolve(result)
      })
      .exec()
  })
}

export function createAnimationFrame(canvas?: Canvas) {
  let requestAnimationFrame: (callback: FrameRequestCallback) => number = (callback) => {
    return setInterval(callback, 60)
  }
  let cancelAnimationFrame: (handle: number) => void = clearInterval

  requestAnimationFrame = canvas?.requestAnimationFrame || window?.requestAnimationFrame || requestAnimationFrame
  cancelAnimationFrame = canvas?.cancelAnimationFrame || window?.cancelAnimationFrame || cancelAnimationFrame

  return { requestAnimationFrame, cancelAnimationFrame }
}
