import { DrawPosterPlugin } from '../../core/plugin'
import uQRCode from './uQRCode'
interface DrawPosterQrCodePlugin extends DrawPosterPlugin {
  errorCorrectLevel: {
    L: number
    M: number
    Q: number
    H: number
  }
}
declare module '../../core' {
  interface CanvasCtx {
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

const plugin: DrawPosterQrCodePlugin = {
  name: '__name__',
  mounted: ({ ctx, canvas }) => {
    ctx.drawQrCode = (options) => {
      uQRCode.make.call(uQRCode, canvas, ctx, options)
    }
  },
  errorCorrectLevel: uQRCode.errorCorrectLevel
}

export default plugin
