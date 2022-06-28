import type { Plugin, Plugins } from '../core/plugin'
import type { DrawPosterResult } from '../core/typed'

export const globalPlugins: Plugin[] = []

export const getCurrentDrawPoster = (selector: string) => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  if (page[`__dp_${selector}`])
    return page[`__dp_${selector}`] as DrawPosterResult
}

export const setCurrentDrawPoster = (dp: Partial<DrawPosterResult>, ps: Plugins) => {
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

export const onReady = async (callback?: Function) => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const onReady = page.onReady
  return new Promise<void>((resolve) => {
    page.onReady = function () {
      callback?.()
      resolve()
      onReady?.()
    }
  })
}
