`drawPoster` 在创建时，会自动的向 `ctx(画笔)` 添加|覆盖扩展方法，以便构建海报矩形。

```js
dp.draw(async (ctx) => {
  // ctx.drawImage | ctx.drawRoundImage | ctx.fillWarpText | ....
})
```

## 绘制图片(ctx.drawImage)

`ctx.drawImage(url, x, y, w, h)`

`drawPoster`绘制图片与原生绘制不相同，`ctx.drawImage`内部已经内置了`downloadFile`，只需要传入本地/网络地址即可。支持`2d`与`非2d`绘制，绘制方式一致。需要await等待绘制。

如果有图片自适应尺寸裁剪的需求，建议使用`ctx.drawImageFit`。

注意：当绘制环境为H5时，uniapp使用本地图片绘画时不要用尺寸较大的图片，不然会在创建图片时生成失败。

```js
dp.draw(async (ctx) => {
  const url = '/static/logo.png'
  // const url = "https://...."
  await ctx.drawImage(url, 88, 174.94, 198.98, 36)
})
```

> 小程序端需要添加域名才能绘制成功！

| 参数          | 描述                                      |
| :------------ | :---------------------------------------- |
| url           | 网络图片地址，或本地`/static`中图片路径。 |
| x，y          | 图片的左上角的坐标。                      |
| width，height | 图片的大小。                              |


## 圆角图片(ctx.drawRoundImage)

`ctx.drawRoundImage(url, x, y, w, h, r)`

```js
dp.draw(async (ctx) => {
  const url = 'static/logo.png'
  // const url = "https://...."
  await ctx.drawRoundImage(url, 0, 0, 100, 100, 50)
})
```

## 裁剪图片(ctx.drawImageFit)

`ctx.drawRoundImage(url, DrawImageFitOpts)`

```js
dp.draw(async (ctx) => {
  const url = 'static/logo.png'
  // const url = "https://...."
  await ctx.drawImageFit(url, {
    round: 15,
    objectFit: 'cover',
    specifiedSize: { width: 150, height: 150 },
    intrinsicPosition: ['right', 'top'],
    specifiedPosition: [0, 0],
  })
})
```

根据图片原有尺寸与展示尺寸的宽高比例，计算模拟类似[obejct-fit](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)效果，以下为可配置项。

```ts
interface DrawImageFitOpts {
  // 图片圆角尺寸
  round?: number
  // 图片裁剪方式, 默认 "contain"
  objectFit?: 'contain' | 'cover'
  // 图片原有尺寸, 默认使用图片原有尺寸(getImageInfo->success)
  intrinsicSize?: { width: number; height: number }
  // 图片展示尺寸, 默认 {width: 100, height: 100}
  specifiedSize?: { width: number; height: number }
  // 图片裁剪定位[x, y], 默认 ["left", "top"]
  intrinsicPosition?: ['left' | 'center' | 'right', 'top' | 'center' | 'bottom']
  // 图片绘制定位[x, y], 默认 [0, 0]
  specifiedPosition?: [number, number]
}
```

## 换行字体(ctx.fillWarpText)

`ctx.fillWarpText(options)`

传入配置对象，绘制换行字体，以下为可配置项。

```ts
interface FillWarpTextOpts {
  // 绘制字符串, 必传项
  content: string
  // 绘制最长高度, 默认100px
  maxWidth?: number
  // 绘制行高, 默认取当前字体的默认宽度
  lineHeight?: number
  // 绘制行数量, 默认限制为2层
  layer?: number
  // 绘制x轴, 默认0
  x?: number
  // 绘制y轴, 默认0
  y?: number
  // 设置换行字符, 默认为空, 如设置, maxWidth|layer 将会失效
  splitText?: string
  // 是否不马上进行绘制
  notFillText?: boolean
}
// 当 `notFillText` 为 `true` 时，则不进行绘制，该函数将返回一个绘制信息队列
// 用于代表每行字体所对应的绘制信息, 以下是返回的结构信息，你可以用于计算该
// 换行字体的宽度，你也可以使用array.forEach与ctx.fillText进行绘制。
[
  { text: string, y: number, x: number }
  // ....
]
```

## 圆角矩形(ctx.fillRoundRect)

`ctx.fillWarpText(x, y, w, h, r)`

```js
dp.draw(async (ctx) => {
  // 设置矩形颜色
  ctx.fillStyle = '#fff'
  // 进行绘制
  ctx.fillRoundRect(15, 179, 345, 365.5, 10)
})
```

| 参数          | 描述                 |
| :------------ | :------------------- |
| x，y          | 矩形的左上角的坐标。 |
| width，height | 矩形的大小。         |
| r             | 矩形的弧度半径。     |


## 圆角矩形边框(ctx.strokeRoundRect)

`ctx.strokeRoundRect(x, y, w, h, r)`

| 参数          | 描述                 |
| :------------ | :------------------- |
| x，y          | 矩形的左上角的坐标。 |
| width，height | 矩形的大小。         |
| r             | 矩形的弧度半径。     |

## 绘制二维码(ctx.drawQrCode)

生成二维码扩展，源码使用了 [uQRCode](https://github.com/Sansnn/uQRCode) 并改动了一下，该文件比较大，所以作为扩展插件使用，使用时得先引入插件。

```js
// 注意：如果使用HBuilder引入, 需要引入 '@/js_sdk/u-draw'
import { useDraw } from 'u-draw'
import drawQrCode, { errorCorrectLevel } from 'u-draw/plugins/drawQrCode'

export default {
  async onReady() {
    const dp = useDraw('canvas', {
      // 单独引入二维码插件
      plugins: [drawQrCode()]
    })
    dp.draw((ctx) => {
      ctx.drawQrCode({
        x: (dp.canvas.width / 2) - 50,
        y: (dp.canvas.height / 2) - 50,
        text: 'http://www.baidu.com',
        size: 100,
        // errorCorrectLevel: errorCorrectLevel.L
      })
    })
  }
}
```

|       参数        |  类型  | 必填 |                             说明                             |
| :---------------: | :----: | :--: | :----------------------------------------------------------: |
|         x         | number |  否  |                       水平方向偏移长度                       |
|         y         | number |  否  |                       垂直方向偏移长度                       |
|       text        | String |  是  |                          二维码内容                          |
|       size        | Number |  否  |                        二维码尺寸大小                        |
|      margin       | Number |  否  | 边距，二维码实际尺寸会根据所设边距值进行缩放调整（默认：`0`） |
|  backgroundColor  | String |  否  | 背景色，若设置为透明背景， `fileType` 需设置为 `'png'` ， 然后设置背景色为 `'rgba(255,255,255,0)'` 即可（默认：`'#ffffff'`） |
|  foregroundColor  | String |  否  |                 前景色（默认：`'#000000'`）                  |
| errorCorrectLevel | Number |  否  | 纠错等级，包含 `errorCorrectLevel.L`、`errorCorrectLevel.M`、`errorCorrectLevel.Q`、`errorCorrectLevel.H` 四个级别，`L`: 最大 7% 的错误能够被纠正；`M`: 最大 15% 的错误能够被纠正；`Q`: 最大 25% 的错误能够被纠正；`H`: 最大 30% 的错误能够被纠正。 |
