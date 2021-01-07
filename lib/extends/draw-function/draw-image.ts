/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-28 12:07:51
 * @LastEditTime: 2021-01-07 15:18:50
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
    sx?: number, sy?: number,
    sh?: number, sw?: number,
    dx?: number, dy?: number,
    dh?: number, dw?: number
  ): Promise<boolean> => {
    // 下载路径
    const path = await downloadImgUrl(url)
    // 标记当前绘画存在图片绘制
    ctx.existDrawImage = true
    let result = false
    // 基本绘制方法, 如果是 fit 方式, 则传入所有参数, 不然则只传入四个参数
    const baseDrawImage = (imageResource: string) => {
      const isFit = typeof dx === 'number' && typeof dw === 'number'
      if (isFit) {
        ctx.oldDrawImage(imageResource, sx, sy, sh, sw, dx, dy, dh, dw)
      } else {
        ctx.oldDrawImage(imageResource, sx, sy, sh, sw)
      }
    }
    // 如果是 context 绘制方式, 则直接绘制
    if (ctx.drawType === 'context') {
      baseDrawImage(path)
      result = true
    }
    // 如果是 type2d 绘制方式, 则等待图片绘制完毕
    if (ctx.drawType === 'type2d') {
      result = await new Promise(resolve => {
        const image = canvas.createImage()
        image.src = path
        image.onload = () => {
          baseDrawImage(image as any)
          resolve(true)
        }
        image.onerror = () => resolve(false)
      })
    }
    return result
  }
} as DrawPosterUseCtxOpts
