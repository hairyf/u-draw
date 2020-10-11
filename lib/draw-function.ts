import { Canvas, downloadImgUrl, DrawPosterCanvasCtx } from './utils'

export const drawLoadImage = async (
  canvas: Canvas | undefined,
  ctx: DrawPosterCanvasCtx,
  url: string,
  x: number, y: number,
  w: number, h: number,
): Promise<boolean> => {
  const path = await downloadImgUrl(url);
  if (!canvas) {
    ctx.drawImage(path, x, y, w, h)
    ctx.draw()
    return true
  } else {
    // canvas2d 绘制图片
    return new Promise(resolve => {
      const image = canvas.createImage()
      image.src = path
      image.onload = () => {
        ctx.drawImage(path, x, y, w, h)
        resolve(true)
      }
    })
  }
}

export const fillWarpText = (
  ctx: DrawPosterCanvasCtx,
  text: string,
  maxWidth = 100,
  layer = 2,
  lineHeight = Number(ctx.font.replace(/[^0-9.]/g, '')),
  x = 0,
  y = lineHeight / 1.2,
  notFillText?: boolean
) => {
  // 当字符串为空时, 抛出错误
  if (!text.length) {
    throw Error('warpFillText Error: text is empty string')
  }
  // 分割所有单个字符串
  const chr = text.split('')
  // 存入的每行字体的容器
  let row = []
  // 判断字符串
  let timp = ''

  // 遍历所有字符串, 填充行容器
  for (let i = 0; i < chr.length; i++) {
    if (ctx.measureText(timp).width < maxWidth) {
      // 如果超出长度, 添加进row数组
      timp += chr[i];
    } else {
      // 如超出一行长度, 则换行, 并清除容器
      i--;
      row.push(timp);
      timp = '';
    }
  }
  // 如有剩下字体, 则在最后时添加一行
  if (timp) {
    row.push(timp)
  }

  // 如果数组长度大于指定行数
  if (row.length > layer) {
    row = row.slice(0, layer);
    // 结束的索引
    const end = layer - 1;
    for (let i = 0; i < end; i++) {
      const currentWidth = ctx.measureText(`${row[end]}...`).width
      if (currentWidth > maxWidth) {
        // 加上... 当前宽度大于最大宽度时, 去除一位字符串
        const strEnd = row[end].length - 1;
        row[end] = row[end].slice(0, strEnd)
      } else {
        row[end] += '...'
        break;
      }
    }
  }

  // 储存并返回绘制信息
  const drawInfo = row.map((item, index) => {
    const info = {
      text: item,
      y: y + index * lineHeight,
      x: x,
    }
    // 默认执行绘制信息
    if (!notFillText) {
      ctx.fillText(info.text, info.x, info.y);
    }
    return info;
  })
  return drawInfo;
}

export const fillRoundRect = (
  ctx: DrawPosterCanvasCtx,
  x: number, y: number,
  w: number, h: number,
  r = 15
) => {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  // 开始绘制
  ctx.beginPath();

  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  // 移动复制
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.lineTo(x + w, y + r);

  // (x,y,z,j,f) x,y圆心z半径,j起始弧度f，终止弧度
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
  ctx.lineTo(x + w, y + h - r);
  ctx.lineTo(x + w - r, y + h);

  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
  ctx.lineTo(x + r, y + h);
  ctx.lineTo(x, y + h - r);

  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x + r, y);
  // 填充
  ctx.fill();
  // 剪裁
  ctx.closePath();
}

export const drawCtxInit = (canvas: Canvas, ctx: DrawPosterCanvasCtx) => {
  ctx.drawLoadImage = (
    url: string,
    x: number,
    y: number,
    w: number,
    h: number) => {
    return drawLoadImage(canvas, ctx, url, x, y, w, h)
  }
  ctx.fillWarpText = (options) => fillWarpText(
    ctx,
    options.text,
    options.maxWidth,
    options.layer,
    options.lineHeight,
    options.x,
    options.y,
    options.notFillText
  )
  ctx.fillRoundRect = (x, y, w, h, r) => fillRoundRect(ctx, x, y, w, h, r)
}