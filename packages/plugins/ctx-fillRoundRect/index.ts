import { DrawPosterPlugin } from '../../core/plugin'
declare module '../../core' {
  interface CanvasCtx {
    /** 绘制圆角矩形（填充）
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillRoundRect(x: number, y: number, w: number, h: number, r: number): void
  }
}
const plugin: DrawPosterPlugin = {
  name: '__name__',
  mounted: () => {}
}

export default plugin
