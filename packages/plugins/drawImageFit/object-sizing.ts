/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-01 23:35:54
 * @LastEditTime: 2021-01-02 01:44:09
 * @Description:
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
export type ObjectFit = 'contain' | 'cover' // "scale-down" | "none";
export type ObjectPosition = ['left' | 'center' | 'right', 'top' | 'center' | 'bottom']
export interface Size {
  width: number
  height: number
}
/**
 * 用于计算图片的宽高比例
 * @see https://drafts.csswg.org/css-images-3/#sizing-terms
 *
 * ## 名词解释
 * ### intrinsic dimensions
 * 图片本身的尺寸
 *
 * ### specified size
 * 用户指定的元素尺寸
 *
 * ### concrete object size
 * 应用了 `objectFit` 之后图片的显示尺寸
 *
 * ### default object size
 */
export function concreteRect(
  style: {
    /** @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit */
    objectFit?: ObjectFit
    /** @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position */
    intrinsicPosition?: ObjectPosition
    specifiedPosition?: [number, number]
  },
  intrinsicSize: Size,
  specifiedSize: Size
): {
  sx: number
  sy: number
  sw: number
  sh: number
  dx: number
  dy: number
  dw: number
  dh: number
} {
  const isContain = style.objectFit === 'contain'
  const specifiedPosition = style.specifiedPosition || [0, 0]

  // ratio 越大表示矩形越"扁"
  const intrinsicRatio = intrinsicSize.width / intrinsicSize.height
  const specifiedRatio = specifiedSize.width / specifiedSize.height

  /** 图片原始尺寸与最终尺寸之比 */
  let concreteScale = 1

  if (
    (intrinsicRatio > specifiedRatio && style.objectFit == 'contain') ||
    (intrinsicRatio <= specifiedRatio && style.objectFit == 'cover')
  )
    // 图片较"胖"时完整显示图片，图片较"瘦"时完全覆盖容器
    // 这两种情况下有 concreteRect.width = specifiedSize.width
    // 因为 concreteRect.width = intrinsicSize.width * concreteScale
    // 所以:
    concreteScale = specifiedSize.width / intrinsicSize.width
  else if (
    (intrinsicRatio > specifiedRatio && style.objectFit == 'cover') ||
    (intrinsicRatio <= specifiedRatio && style.objectFit == 'contain')
  )
    // 图片较"瘦"时完整显示图片，图片较"胖"时完全覆盖容器
    // 这两种情况下有 concreteRect.height = specifiedSize.height
    // 因为 concreteRect.height = intrinsicSize.height * concreteScale
    // 所以:
    concreteScale = specifiedSize.height / intrinsicSize.height
  else throw new Error('Unkonwn concreteScale')

  const concreteRectWidth = intrinsicSize.width * concreteScale
  const concreteRectHeight = intrinsicSize.height * concreteScale

  // 这里可以把 left top 的计算想象成投影
  const xRelativeOrigin = { left: 0, center: 0.5, right: 1 }[
    style.intrinsicPosition?.[0] || 'center'
  ]
  const yRelativeOrigin = { top: 0, center: 0.5, bottom: 1 }[
    style.intrinsicPosition?.[1] || 'center'
  ]
  let concreteRectLeft = (specifiedSize.width - concreteRectWidth) * xRelativeOrigin
  let concreteRectTop = (specifiedSize.height - concreteRectHeight) * yRelativeOrigin
  if (isContain) {
    concreteRectLeft += specifiedPosition[0]
    concreteRectTop += specifiedPosition[1]
  }
  // 这里有两个坐标系，一个是 specified (dist) 的坐标系，一个是 intrinsic (src) 的坐标系
  // 这里将两个坐标系的点位置进行变换
  // 例: 带入 x=0, y=0, 得到的结果就是 specifiedRect 的左上角在 intrinsic 坐标系下的坐标位置
  // 在 specified 坐标系下, intrinsic 的零点在 (concreteRectLeft, concreteRectTop), 缩放为 concreteScale
  // 所以有 x_dist = x_src * concreteScale + concreteRectLeft
  //        y_dist = y_src * concreteScale + concreteRectTop
  const dist2src = (distX: number, distY: number) => [
    /* srcX = */ (distX - concreteRectLeft) / concreteScale,
    /* srcY = */ (distY - concreteRectTop) / concreteScale
  ]

  const [srcLeft, srcTop] = dist2src(0, 0)

  // srcRight =  图片 specified 框右边在 src 坐标系下的 x 坐标
  // srcBottom = 图片 specified 框下边在 src 坐标系下的 y 坐标
  const [srcRight, srcBottom] = dist2src(specifiedSize.width, specifiedSize.height)

  // 这里要对 src 和 disc 两个框进行约束
  return {
    sx: Math.max(srcLeft, 0),
    sy: Math.max(srcTop, 0),
    sw: Math.min(srcRight - srcLeft, intrinsicSize.width),
    sh: Math.min(srcBottom - srcTop, intrinsicSize.height),
    dx: isContain ? Math.max(concreteRectLeft, 0) : specifiedPosition[0],
    dy: isContain ? Math.max(concreteRectTop, 0) : specifiedPosition[1],
    dw: Math.min(concreteRectWidth, specifiedSize.width),
    dh: Math.min(concreteRectHeight, specifiedSize.height)
  }
}
