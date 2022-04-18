import { DrawPosterResult } from '../core'
import { DrawPosterPlugin, Plugins } from '../core/plugin'

export const globalPlugins: DrawPosterPlugin[] = []

export const getCurrentDrawPoster = (selector: string) => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  if (page[`__dp_${selector}`]) return page[`__dp_${selector}`]
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
