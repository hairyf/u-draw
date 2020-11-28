import { DrawPosterUseCtxOpts, Canvas, DrawPosterCanvasCtx } from '../../utils/interface'
/** 绘制填充圆角矩形方法 */
export default {
  name: 'fillRoundRect',
  handle: (
    canvas: Canvas | undefined,
    ctx: DrawPosterCanvasCtx,
    x: number, y: number,
    w: number, h: number,
    r: number,
  ) => {
    ctx.roundRect(x, y, w, h, r, true)
  }
} as DrawPosterUseCtxOpts