import { DrawPosterUseCtxOpts, Canvas, DrawPosterCanvasCtx } from '../../utils/interface'
/** 绘制圆角图片原型方法 */
export default {
  name: 'drawRoundImage',
  handle: async (
    canvas: Canvas | undefined,
    ctx: DrawPosterCanvasCtx,
    url: string,
    x: number, y: number,
    w: number, h: number,
    r = 15
  ) => {
    ctx.save()
    ctx.setFillStyle?.('transparent')
    ctx.fillStyle = 'transparent'
    ctx.fillRoundRect(x, y, w, h, r)
    ctx.clip()
    const result = await ctx.drawImage(url, x, y, w, h)
    return result
  }
} as DrawPosterUseCtxOpts