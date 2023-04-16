import type { Plugin } from '../../core/plugin'
import { promisify } from '../../utils'
import type { ObjectFit, ObjectPosition, Size } from './object-sizing'
import { concreteRect } from './object-sizing'

declare module '../../core/types' {
  interface CanvasContext {
    /** 绘制 Object-Fit 模式图片
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawImageFit(url: string, opts?: ImageFitOption): Promise<boolean>
  }
}
export interface ImageFitOption {
  radius?: number
  objectFit?: ObjectFit
  intrinsicSize?: Size
  specifiedSize?: Size
  intrinsicPosition?: ObjectPosition
  specifiedPosition?: [number, number]
}
const plugin: Plugin = {
  name: '__ctx-drawImageFit__',
  mounted: ({ ctx }) => {
    ctx.drawImageFit = async (url, options) => {
      const imageInfo = await promisify(uni.getImageInfo)({ src: url })
      const style: Required<ImageFitOption> = {
        radius: 0,
        objectFit: 'cover',
        intrinsicSize: { width: imageInfo?.width ?? 100, height: imageInfo?.height ?? 100 },
        specifiedSize: { width: 100, height: 100 },
        intrinsicPosition: ['center', 'center'],
        specifiedPosition: [0, 0],
        ...options,
      }
      // 计算图片尺寸
      const drawInfo = concreteRect(style, style.intrinsicSize, style.specifiedSize)
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
          style.radius,
        )
        ctx.clip()
      }
      const result = await ctx.drawImage(url, ...Object.values(drawInfo))
      if (style.radius > 0)
        ctx.restore()
      return result
    }
  },
}

export default () => plugin
