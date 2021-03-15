import { DrawPosterUseOpts } from '../../utils/interface'
import { ImageFitOption } from '../draw-function/draw-image-fit'
/** 矩形基本信息 */
interface PainterItemSize {
  /** 容器的宽度，固定值 */
  width: number
  /** 容器的高度，固定值 */
  height: number
}
/** 元素位置信息 */
interface PainterItemSite {
  /** 元素锚点距左边的距离; 默认: 0 */
  left?: number
  /** 元素锚点距上边的距离; 默认: 0 */
  top?: number
}
/** 绘制图片信息 */
interface PainterImageInfo extends
  PainterItemSize,
  PainterItemSite {
  /** 绘制图片元素 */
  type: 'image'
  /** 图片地址 */
  src: string
  /** 图片自适应, 可参考 css 属性 object-fit */
  objectFit?: ImageFitOption['objectFit']
  /** 图片在元素容器中显示的位置，可参考 css 属性 object-position */
  position?: ImageFitOption['intrinsicPosition']
  /** 圆角尺寸; 默认: 0 */
  radius?: number
}
/** 绘制矩形信息 */
interface PainterRectInfo extends
  PainterItemSize,
  PainterItemSite {
  /** 绘制矩形元素 */
  type: "rect"
  /** 矩形背景颜色; 默认: "#000" */
  background?: string,
  /** 圆角尺寸; 默认: 0 */
  radius?: number
}
/** 绘制单行文字信息 */
interface PainterTextInfo extends
  PainterItemSite {
  /** 绘制文本元素 */
  type: "text"
  /** 文本颜色; 默认: "#000" */
  color?: string
  /** 字体; 默认: "serial" */
  fontFamily?: string
  /** 字号(单位rpx); 默认: 30 rpx */
  fontSize?: number
  /** 字重; 默认: "normal" 可选项: "bold" */
  fontWeight?: string
  /** 字型 默认: "normal" 可选项: "italic" */
  fontStyle?: string
  /** 元素的宽度(单位rpx), 水平排布时影响后一个元素的位置，为 null 时根据文字实际占用的宽度计算 */
  width?: number,
  /** 文本内容 */
  content: string
}
/** 绘制多行文字信息 */
interface PainterLineFeedTextInfo extends
  PainterItemSite {
  /** 绘制换行文本元素 */
  type: "line-feed-text"
  /** 文本颜色; 默认: "#000" */
  color?: string
  /** 字体; 默认: "serial" */
  fontFamily?: string
  /** 字号(单位rpx); 默认: 30 rpx */
  fontSize?: number
  /** 字重; 默认: "normal" 可选项: "bold" */
  fontWeight?: string
  /** 字型 默认: "normal" 可选项: "italic" */
  fontStyle?: string
  /** 文本块的宽度，不能为空 */
  width: number,
  /** 行高; 默认取当前文字行高 */
  lineHeight?: number
  /** 文本最大行数,超出即显示省略号; 默认3行 */
  lineClamp?: number
  /** 文本内容 */
  content: string
}
export interface PainterContainerOption extends
  PainterItemSize {
  /** 绘制项的数组 */
  contents: (PainterImageInfo | PainterRectInfo | PainterTextInfo | PainterLineFeedTextInfo)[]
}

export default {
  name: 'painter',
  handle: (dp, option: PainterContainerOption) => {
    dp.canvas.width = option.width
    dp.canvas.height = option.height
    dp.draw(async ctx => {
      for (let i = 0; i < option.contents.length; i++) {
        ctx.save()
        const drawInfo = option.contents[i]
        if (drawInfo.type === 'rect') {
          ctx.fillStyle = drawInfo.background ?? '#000000'
          ctx.fillRoundRect(
            drawInfo.left ?? 0,
            drawInfo.top ?? 0,
            drawInfo.width,
            drawInfo.height,
            drawInfo.radius ?? 0
          )
        }
        if (drawInfo.type === 'image') {
          await ctx.drawImageFit(drawInfo.src, {
            objectFit: drawInfo.objectFit ?? 'cover',
            intrinsicPosition: drawInfo.position ?? ['center', 'center'],
            specifiedSize: {
              width: drawInfo.width,
              height: drawInfo.height
            },
            radius: drawInfo.radius,
          })
        }
        if (drawInfo.type === 'text') {
          ctx.fillStyle = drawInfo.color ?? '#000000'
          ctx.font = `\
          ${drawInfo.fontStyle ?? 'normal'} \
          ${drawInfo.fontWeight ?? 'normal'} \
          ${uni.upx2px(drawInfo.fontSize ?? 30)} \
          ${drawInfo.fontFamily ?? 'serial'}\
          `
          ctx.fillText(
            drawInfo.content,
            drawInfo.left ?? 0,
            drawInfo.top ?? 0,
            drawInfo.width
          )
        }
        if (drawInfo.type === 'line-feed-text') {
          ctx.fillStyle = drawInfo.color ?? '#000000'
          ctx.font = `\
          ${drawInfo.fontStyle ?? 'normal'} \
          ${drawInfo.fontWeight ?? 'normal'} \
          ${uni.upx2px(drawInfo.fontSize ?? 30)} \
          ${drawInfo.fontFamily ?? 'serial'}\
          `
          ctx.fillWarpText({
            x: drawInfo.left,
            y: drawInfo.top,
            layer: drawInfo.lineClamp,
            maxWidth: drawInfo.width,
            text: drawInfo.content
          })
        }
        ctx.restore()
      }
    })
  }
} as DrawPosterUseOpts
