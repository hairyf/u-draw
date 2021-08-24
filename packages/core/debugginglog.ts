import { DrawPosterResult, DrawPosterOptions } from '.'
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
export class DebuggingLog {
  private $color = '#3489fd'

  constructor(private dp: Partial<DrawPosterResult>, private $options: DrawPosterOptions) {}
  log = (message: string, color = this.$color, ...args: any[]) => {
    if (!this.$options.debug) return
    console.log(`%c${this.dp.id} -> ${message}`, `color: ${color}`, ...args)
  }
  success = (message: string, ...args: any[]) => {
    this.log(`🎉 ${message}`, '#19be6b', ...args)
  }
  error = (message: string, ...args: any[]) => {
    this.log(`🎉 ${message}`, '#fa3534', ...args)
  }
}
