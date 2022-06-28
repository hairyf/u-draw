import type { Plugin } from '../../core/plugin'
declare module '../../core/typed' {
  interface CanvasCtx {
    /** 绘制圆角矩形（填充）
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillRoundRect(x: number, y: number, w: number, h: number, r: number): void
  }
}
const plugin: Plugin = {
  name: '__ctx-fillRoundRect__',
  mounted: ({ ctx }) => {
    ctx.fillRoundRect = (x, y, w, h, r) => ctx.roundRect(x, y, w, h, r, true)
  },
}

export default () => plugin
