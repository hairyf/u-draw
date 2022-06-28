import type { Plugin } from '../../core/plugin'
declare module '../../core/typed' {
  interface CanvasCtx {
    /** 绘制二维码
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillWarpText(options: FillWarpTextOptions): { text: string; y: number; x: number }[]
  }
}
/** 绘制换行配置 */
export interface FillWarpTextOptions {
  content: string
  maxWidth?: number
  lineHeight?: number
  layer?: number
  x?: number
  y?: number
  separator?: string
  draw?: boolean
}

const plugin: Plugin = {
  name: '__ctx-fillWarpText__',
  mounted: ({ ctx }) => {
    ctx.fillWarpText = (config) => {
      const _config = (config = {
        maxWidth: 100,
        layer: 2,
        lineHeight: +ctx.font.replace(/[^\d.]/g, ''),
        x: 0,
        y: +ctx.font.replace(/[^\d.]/g, '') / 1.2,
        separator: '',
        draw: true,
        ...config,
      })
      const { content, separator, maxWidth, layer, lineHeight, draw, x, y } = _config
      // 当字符串为空时, 抛出错误
      if (!content)
        throw new Error('warpFillText Error: text is empty string')

      // 分割所有单个字符串
      const chr = content.split(separator)
      // 存入的每行字体的容器
      let row: string[] = []
      // 判断字符串
      let timp = ''
      if (separator) {
        row = chr
      }
      else {
        // 遍历所有字符串, 填充行容器
        for (let i = 0; i < chr.length; i++) {
          // 当超出行列时, 停止执行遍历, 节省计算时间
          if (row.length > layer)
            break

          if (ctx.measureText(timp).width < maxWidth) {
            // 如果超出长度, 添加进row数组
            timp += chr[i]
          }
          else {
            // 如超出一行长度, 则换行, 并清除容器
            i--
            row.push(timp)
            timp = ''
          }
        }
        // 如有剩下字体, 则在最后时添加一行
        if (timp)
          row.push(timp)

        // 如果数组长度大于指定行数
        if (row.length > layer) {
          row = row.slice(0, layer)
          // 结束的索引
          const end = layer - 1
          for (let i = 0; i < row[end].length; i++) {
            const currentWidth = ctx.measureText(`${row[end]}...`).width
            if (currentWidth > maxWidth) {
              // 加上... 当前宽度大于最大宽度时, 去除一位字符串
              const strEnd = row[end].length - 1
              row[end] = row[end].slice(0, strEnd)
            }
            else {
              row[end] += '...'
              break
            }
          }
        }
      }
      // 储存并返回绘制信息
      return row.map((item, index) => {
        const info = { text: item, y: y + index * lineHeight, x }
        // 默认执行绘制信息
        if (draw)
          ctx.fillText(info.text, info.x, info.y)
        return info
      })
    }
  },
}

export default () => plugin
