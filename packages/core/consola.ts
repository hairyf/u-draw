// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import { DrawPosterResult } from './typed'

export class Consola {
  private $color = '#3489fd'
  constructor(private dp: Partial<DrawPosterResult>) {}
  log = (message: string, color = this.$color, ...args: any[]) => {
    if (!this.dp?.$options?.debug) return
    console.log(`%c${this.dp.id} -> ${message}`, `color: ${color}`, ...args)
  }
  success = (message: string, ...args: any[]) => {
    this.log(`🎉 ${message}`, '#19be6b', ...args)
  }
  error = (message: string, ...args: any[]) => {
    this.log(`🎉 ${message}`, '#fa3534', ...args)
  }
  loading = (type: 'render' | 'create') => {
    if (this.dp?.$options?.loading)
      uni.showLoading({ title: (this.dp?.$options?.loading as any)[type] })
    return () => uni.hideLoading()
  }
}
