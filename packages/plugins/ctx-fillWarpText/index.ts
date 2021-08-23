import { DrawPosterPlugin } from '../../core/plugin'
declare module '../../core' {
  interface CanvasCtx {
    /** 绘制二维码
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillWarpText(options: FillWarpTextOptions): void
  }
}
/** 绘制换行配置 */
export interface FillWarpTextOptions {
  text: string
  maxWidth?: number
  lineHeight?: number
  layer?: number
  x?: number
  y?: number
  splitText?: string
  notFillText?: boolean
}

const plugin: DrawPosterPlugin = {
  name: '__name__',
  mounted: () => {}
}

export default plugin
