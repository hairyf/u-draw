/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-01 23:45:33
 * @LastEditTime: 2021-01-02 00:53:50
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { DrawPosterUseCtxOpts } from '../../utils/interface'
import { calculateConcreteRect, ObjectFit, ObjectPosition, Size } from "../../utils/object-sizing"
export interface DrawImageFitOpts {
  round?: number
  objectFit?: ObjectFit
  intrinsicSize?: Size
  specifiedSize?: Size
  intrinsicPosition?: ObjectPosition
  specifiedPosition?: [number, number]
}
export default {
  name: 'drawImageFit',
  handle: async (canvas, ctx, url: string, opts?: DrawImageFitOpts) => {
    // 配置默认值
    const style: Required<DrawImageFitOpts> = {
      round: 0,
      objectFit: 'cover',
      intrinsicSize: { width: 100, height: 100 },
      specifiedSize: { width: 100, height: 100 },
      intrinsicPosition: ['left', 'top'],
      specifiedPosition: [0, 0],
      ...opts
    }
    // 计算图片尺寸
    const drawImageInfo = calculateConcreteRect(
      style,
      style.intrinsicSize,
      style.specifiedSize
    )
    // 如有圆角, 则进行裁剪
    if (style.round > 0) {
      ctx.save()
      ctx.setFillStyle?.('transparent')
      ctx.fillStyle = 'transparent'
      ctx.fillRoundRect(
        style.specifiedPosition[0],
        style.specifiedPosition[1],
        style.specifiedSize.width,
        style.specifiedSize.height,
        style.round
      )
      ctx.clip()
    }
    const result = await ctx.drawImage(url, ...Object.values(drawImageInfo))
    if (style.round > 0)
      ctx.restore()
    return result
  }
} as DrawPosterUseCtxOpts