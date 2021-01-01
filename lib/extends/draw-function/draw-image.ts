/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-28 12:07:51
 * @LastEditTime: 2021-01-01 23:04:49
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { DrawPosterUseCtxOpts, Canvas, DrawPosterCanvasCtx } from '../../utils/interface'
import { downloadImgUrl } from '../../utils/wx-utils'

/** 等待绘制图片原型方法 */
export default {
  name: 'drawImage',
  init: (canvas, ctx) => {
    ctx.oldDrawImage = ctx.drawImage
  },
  handle: async (
    canvas: Canvas,
    ctx: DrawPosterCanvasCtx,
    url: string,
    dx?: number | undefined,
    dy?: number | undefined,
    dWidth?: number | undefined,
    dHeigt?: number | undefined,
    sx?: number | undefined,
    sy?: number | undefined,
    sWidth?: number | undefined,
    sHeight?: number | undefined
  ): Promise<boolean> => {
    const path = await downloadImgUrl(url)
    ctx.existDrawImage = true
    let result = false
    if (ctx.drawType === 'context') {
      ctx.oldDrawImage(path, dx, dy, dWidth, dHeigt, sx, sy, sWidth, sHeight)
      ctx.restore()
      result = true
    }
    if (ctx.drawType === 'type2d') {
      result = await new Promise(resolve => {
        const image = canvas.createImage()
        image.src = path
        image.onload = () => {
          ctx.oldDrawImage(image as any, dx, dy, dWidth, dHeigt, sx, sy, sWidth, sHeight)
          ctx.restore()
          resolve(true)
        }
        image.onerror = () => resolve(false)
      })
    }
    return result
  }
} as DrawPosterUseCtxOpts

// ctx.drawCoverImage
// ctx.drawCoverRoundImage
// ctx.drawFillImage
// ctx.drawFillRoundImage
// ctx.drawContainImage
// ctx.drawContainRoundImage
// ctx.drawRoundImage


// ctx.drawImage({
//   round: 15,
//   objectFit: 'cover',
//   intrinsicSize: {width: 100, height: 100}, 
//   specifiedSize: {width: 100, height: 100},
//   position: ['left', 'center']
// })