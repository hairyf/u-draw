import { DrawPosterPlugin } from '../../core/plugin'
declare module '../../core' {
  interface CanvasCtx {
    /**
     * 绘制圆角矩形（原型）
     */
    roundRect(
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill?: boolean,
      stroke?: boolean
    ): void
  }
}
const plugin: DrawPosterPlugin = {
  name: '__name__',
  mounted: () => {}
}

export default plugin
