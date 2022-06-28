import type { Plugin } from '../../core/plugin'
import type { ImageFitOption } from '../drawImageFit'
declare module '../../core/typed' {
  interface DrawPosterInstance {
    painter: (option: PainterContainerOption) => void
  }
}
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
interface PainterImageInfo extends PainterItemSize, PainterItemSite {
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
interface PainterRectInfo extends PainterItemSize, PainterItemSite {
  /** 绘制矩形元素 */
  type: 'rect'
  /** 矩形背景颜色; 默认: "#000" */
  background?: string
  /** 圆角尺寸; 默认: 0 */
  radius?: number
}
/** 绘制单行文字信息 */
interface PainterTextInfo extends PainterItemSite {
  /** 绘制文本元素 */
  type: 'text'
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
  width?: number
  /** 文本内容 */
  content: string
}
/** 绘制多行文字信息 */
interface PainterLineFeedTextInfo extends PainterItemSite {
  type: 'line-feed-text'
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
  width: number
  /** 行高; 默认取当前文字行高 */
  lineHeight?: number
  /** 文本最大行数,超出即显示省略号; 默认3行 */
  lineClamp?: number
  /** 文本内容 */
  content: string
}
/** 绘制二维码信息 */
interface PainterQrCodeInfo extends PainterItemSite {
  /** 绘制换行文本元素 */
  type: 'qr-code'
  /** 二维码尺寸 */
  size: number
  /** 二维码内容 */
  content: string
  /** 边距，二维码实际尺寸会根据所设边距值进行缩放调整（默认：5） */
  margin?: number
  /** 背景色（默认：'#ffffff'） */
  backgroundColor?: string
  /** 前景色（默认：'#000000'） */
  foregroundColor?: string
}
export interface PainterContainerOption extends PainterItemSize {
  /** 绘制项的数组 */
  contents: Array<
    // 绘制图片信息
    | PainterImageInfo
    // 绘制矩形信息
    | PainterRectInfo
    // 绘制文字信息
    | PainterTextInfo
    // 绘制换行文字信息
    | PainterLineFeedTextInfo
    // 绘制扩展二维码信息
    | PainterQrCodeInfo
  >
}
const plugin: Plugin = {
  name: '__dp-painter__',
  mounted: (dp) => {
    dp.painter = (option) => {
      dp.canvas.width = option.width
      dp.canvas.height = option.height
      dp.draw(async (ctx) => {
        for (let i = 0; i < option.contents.length; i++) {
          const info = option.contents[i]
          const left = info.left ?? 0
          const top = info.top ?? 0
          if (info.type === 'rect') {
            const { background, width, height, radius } = info
            ctx.fillStyle = background || '#000000'
            ctx.fillRoundRect(left, top, width, height, radius || 0)
          }
          if (info.type === 'image') {
            await ctx.drawImageFit(info.src, {
              objectFit: info.objectFit || 'cover',
              intrinsicPosition: info.position || ['center', 'center'],
              specifiedPosition: [left, top],
              specifiedSize: {
                width: info.width,
                height: info.height,
              },
              radius: info.radius,
            })
          }
          if (info.type === 'text') {
            ctx.fillStyle = info.color || '#000000'
            ctx.font = `\
            ${info.fontStyle || 'normal'} \
            ${info.fontWeight || 'normal'} \
            ${info.fontSize || 30} \
            ${info.fontFamily || 'serial'}\
            `
            ctx.fillText(info.content, left, top, info.width)
          }
          if (info.type === 'line-feed-text') {
            ctx.fillStyle = info.color || '#000000'
            ctx.font = `\
            ${info.fontStyle || 'normal'} \
            ${info.fontWeight || 'normal'} \
            ${info.fontSize || 30} \
            ${info.fontFamily || 'serial'}\
            `
            ctx.fillWarpText({
              x: info.left,
              y: info.top,
              layer: info.lineClamp,
              lineHeight: info.lineHeight,
              maxWidth: info.width,
              content: info.content,
            })
          }
          if (info.type === 'qr-code') {
            if (typeof ctx.drawQrCode !== 'function') {
              console.error('--- 当前未引入qr-code扩展, 将自动省略该二维码绘制 ---')
              return
            }
            ctx.drawQrCode({
              x: left,
              y: top,
              size: info.size,
              text: info.content,
              margin: info.margin || 5,
              backgroundColor: info.backgroundColor || '#ffffff',
              foregroundColor: info.foregroundColor || '#000000',
            })
          }
        }
      })
    }
  },
}

export default () => plugin
