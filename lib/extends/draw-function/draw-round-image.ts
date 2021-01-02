/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-28 12:21:02
 * @LastEditTime: 2021-01-02 00:03:50
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
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
    ctx.restore()
    return result
  }
} as DrawPosterUseCtxOpts