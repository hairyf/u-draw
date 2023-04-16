import type { Plugin, Plugins } from '../core/plugin'
import type { DrawInstance } from '../core/types'

export const globalPlugins: Plugin[] = []

export function getCurrentInstance(selector: string) {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  if (page[`__dp_${selector}`])
    return page[`__dp_${selector}`] as DrawInstance
}

export function setCurrentInstance(dp: Partial<DrawInstance>, ps: Plugins) {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  page[`__dp_${dp.id}`] = dp

  const onUnload = page.onUnload
  page.onUnload = function () {
    ps.run('beforeUnmount')
    dp.stop!()
    onUnload()
    ps.run('unmounted')
  }
}

export function onReady(callback?: Function) {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]

  console.log(page.$vm)
  // return new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     const onReady = page.onReady
  //     page.onReady = function () {
  //       callback?.()
  //       resolve()
  //       onReady?.call(page)
  //     }
  //   })
  // })
}
