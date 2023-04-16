/* eslint-disable no-useless-call */
import type { Plugin } from '../../core/plugin'
import uQRCode from './uQRCode'

declare module '../../core/types' {
  interface CanvasContext {
    /** 绘制二维码
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawQrCode(options: DrawQrCodeOptions): void
  }
}
/** 绘制二维码配置 */
export interface DrawQrCodeOptions {
  text: string
  x?: number
  y?: number
  size?: number
  margin?: number
  backgroundColor?: string
  foregroundColor?: string
}

const plugin: Plugin = {
  name: '__ctx-drawQrCode__',
  mounted: ({ ctx, canvas }) => {
    ctx.drawQrCode = (options) => {
      // @ts-expect-error
      uQRCode.make.call(uQRCode, canvas, ctx, options)
    }
  },
}

export const errorCorrectLevel: {
  L: number
  M: number
  Q: number
  H: number
  // @ts-expect-error
} = uQRCode.errorCorrectLevel

export default () => plugin
