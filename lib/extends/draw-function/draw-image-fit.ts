/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-01 23:45:33
 * @LastEditTime: 2021-01-03 12:31:34
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { DrawPosterUseCtxOpts } from '../../utils/interface'
import { calculateConcreteRect, ObjectFit, ObjectPosition, Size } from "../../utils/object-sizing"
import gbl from "../../utils/global"
export interface ImageFitOption {
  radius?: number
  objectFit?: ObjectFit
  intrinsicSize?: Size
  specifiedSize?: Size
  intrinsicPosition?: ObjectPosition
  specifiedPosition?: [number, number]
}
export default {
  name: 'drawImageFit',
  handle: async (canvas, ctx, url: string, options?: ImageFitOption) => {
    const [error, imageInfo] = await (gbl.getImageInfo({ src: url }) as any) as [any, UniApp.GetImageInfoSuccessData]
    // 配置默认值
    const style: Required<ImageFitOption> = {
      radius: 0,
      objectFit: 'cover',
      intrinsicSize: { width: imageInfo?.width ?? 100, height: imageInfo?.height ?? 100 },
      specifiedSize: { width: 100, height: 100 },
      intrinsicPosition: ['center', 'center'],
      specifiedPosition: [0, 0],
      ...options
    }
    // 计算图片尺寸
    const drawImageInfo = calculateConcreteRect(
      style,
      style.intrinsicSize,
      style.specifiedSize
    )
    // 如有圆角, 则进行裁剪
    if (style.radius > 0) {
      ctx.save()
      ctx.setFillStyle?.('transparent')
      ctx.fillStyle = 'transparent'
      ctx.fillRoundRect(
        style.specifiedPosition[0],
        style.specifiedPosition[1],
        style.specifiedSize.width,
        style.specifiedSize.height,
        style.radius
      )
      ctx.clip()
    }
    const result = await ctx.drawImage(url, ...Object.values(drawImageInfo))
    if (style.radius > 0)
      ctx.restore()
    return result
  }
} as DrawPosterUseCtxOpts