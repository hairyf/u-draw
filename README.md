# 绘制海报工具简述

- 创建绘制海报`canvas`矩形方法，内置了图片绘制，圆角矩形绘制，换行字体绘制等方法。
- 接近原生开发体验，上手快，只需考虑业务逻辑，而不用考虑其他问题。
- 拥有良好的语法架构，不会在绘制`uni/wx`矩形时陷入回调地狱。
- 支持原生小程序，与`uniapp`多端应用。当是环境为原生小程序时，自动切换为性能更好的`type2d`绘制方式。
- 将复杂的逻辑组合为简单的方法，扩展性强，可使用 `use|useCtx` 引入扩展。
- 支持`typescript`，支持`vue3`模板，具体使用参考 [useDrawPoster](https://github.com/TuiMao233/u-draw-poster/tree/master/docs/use.md)。

api文档：[u-draw-poster](https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poster.html)

插件市场：[dcloud/u-draw-poster](https://ext.dcloud.net.cn/plugin?id=3237)

**npm 安装插件**

~~~
npm i --save-dev u-draw-poster
~~~

## 1. 创建海报绘制工具

~~~html
<!-- #ifdef MP-WEIXIN -->
<canvas id="canvas" type="2d" style="width:100px; height:100px" />
<!-- #endif -->
<!-- #ifndef MP-WEIXIN -->
<canvas canvas-id="canvas" id="canvas" style="width:100px; height:100px" />
<!-- #endif -->
~~~

~~~js
// 注意：如果使用HBuilder引入, 需要引入 '@/js_sdk/u-draw-poster'
import DrawPoster from 'u-draw-poster'
async onReady() {
 // 传入选择器, 初始化绘制工具(注意, 不需要传入#符号) 当微信小程序时, 将自动启用type2d绘制
 const dp = await DrawPoster.build("canvas")   
}
~~~

## 2. 设置画布尺寸
~~~js
// 设置长高为100px的矩形宽高
dp.canvas.width = 100
dp.canvas.height = 100
~~~

## 3. 绘制任意内容
~~~js
// 绘制背景与文字
dp.draw((ctx) => {
    ctx.fillStyle = "#F4F4F4";
    ctx.fillRect(0, 0, dp.canvas.width, dp.canvas.height);
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.font = `bold ${22}px sans-serif`;
    ctx.fillText('周先生', dp.canvas.width/2, 38.5);
})
// 绘制图片内容
dp.draw(async (ctx) => {
    //.......
})
~~~
值得注意的是, `draw`方法会自动的执行`ctx.save/ctx.restore`, 不需要人为操纵绘画栈.
~~~js
dp.draw((ctx) => {/* ... */})
// 相当于
ctx.save()
/* ... */
ctx.restore()
~~~

## 4. 进行绘制

`dp.draw`并不会马上绘制，只是将该任务添加到了任务栈，需要使用`dp.awaitCreate`函数进行绘制，该函数在绘制完毕后将弹出所有任务。
`dp.awaitCreate`在非`2d`绘画中，执行绘画任务完毕后，将自动执行`ctx.draw`方法，并在draw绘画才算异步结束。

~~~js
dp.draw((ctx) => {/* ... */})
dp.draw(async (ctx) => {/* ... */})
// 由于每个任务都有可能会有异步的绘制任务, 所以得需要使用await等待绘制
const result = await dp.awaitCreate();
// 绘制成功将返回每个任务的绘制状况组成的数组
console.log("draw绘制状况:", result); // draw绘制状况: [true]
~~~

[^为什么这么做]: 当全部同步绘制时，将会出现绘制时间保持不一致的情况。这样就会导致一个问题，绘制图层覆盖导致显示未达到预期效果，之所以设计为异步等待，也是为了绘制图层能保持一致顺序。

## 5. 生成图片本地地址

如需要保存为图片时，可以使用`dp.createImgUrl` 进行创建图片本地地址，在由`wx`或`uni`的`api`进行保存。
~~~js
dp.draw(async (ctx) => {/* ... */})
const result = await dp.awaitCreate();
const posterImgUrl = await dp.createImagePath();
console.log("draw绘制状况:", result); // [true]
console.log("绘制生成本地地址:", posterImgUrl); // ...tmp...
~~~
你也可以不使用`dp.awaitCreate`方法，当调用`dp.createImagePath`时会自动检测任务列表，如果有则执行绘制任务后在创建地址。

~~~js
dp.draw(async (ctx) => {/* ... */})
// 跳过drawPoster.awaitCreate直接生成地址
const posterImgUrl = await dp.createImagePath();
console.log("绘制生成本地地址:", posterImgUrl);
~~~

# 绘制扩展 API

`drawPoster`在创建时，会自动的向`ctx(画笔)`添加/覆盖扩展方法，以便构建海报矩形。

~~~js
dp.draw(async (ctx) => {
  // ctx.drawImage | ctx.drawRoundImage | ctx.fillWarpText | ....
})
~~~

## 绘制图片(ctx.drawImage)

`ctx.drawImage(url, x, y, w, h)`

`drawPoster`绘制图片与原生绘制不相同，`ctx.drawImage`内部已经内置了`downloadFile`，只需要传入本地/网络地址即可。支持`2d`与`非2d`绘制，绘制方式一致。需要await等待绘制。

注意：当绘制环境为H5时，uniapp使用本地图片绘画时不要用尺寸较大的图片，不然会在创建图片时生成失败。

~~~js
dp.draw(async (ctx)=>{
    const url = "/static/logo.png"
    // const url = "https://...."
    await ctx.drawImage(url, 88, 174.94, 198.98, 36);
})
~~~
[^注意]:小程序端需要添加域名才能绘制成功！

| 参数          | 描述                                      |
| :------------ | :---------------------------------------- |
| url           | 网络图片地址，或本地`/static`中图片路径。 |
| x，y          | 图片的左上角的坐标。                      |
| width，height | 图片的大小。                              |

## 换行字体(ctx.fillWarpText)

`ctx.fillWarpText(options)`

传入配置对象，绘制换行字体，以下为可配置项。

~~~js
interface FillWarpTextOpts {
  // 绘制字符串, 必传项
  text: string;
  // 绘制最长高度, 默认100px
  maxWidth?: number;
  // 绘制行高, 默认取当前字体的默认宽度
  lineHeight?: number;
  // 绘制行数量, 默认限制为2层
  layer?: number;
  // 绘制x轴, 默认0
  x?: number;
  // 绘制y轴, 默认0
  y?: number;
  // 设置换行字符, 默认为空, 如设置, maxWidth|layer 将会失效
  splitText?: string;
  // 是否不马上进行绘制
  notFillText?: boolean;
}
// 当 `notFillText` 为 `true` 时，则不进行绘制，该函数将返回一个绘制信息队列
// 用于代表每行字体所对应的绘制信息, 以下是返回的结构信息，你可以用于计算该
// 换行字体的宽度，也你可以使用array.forEach与ctx.fillText进行绘制。
[
  { text: string, y: number, x: number}
  // ....
]
~~~

## 圆角矩形(ctx.fillRoundRect)

`ctx.fillWarpText(x, y, w, h, r)`

~~~js
dp.draw(async (ctx)=>{
   // 设置矩形颜色
   ctx.fillStyle = "#fff";
   // 进行绘制
   ctx.fillRoundRect(15, 179, 345, 365.5, 10);
})
~~~

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

## 圆角图片(ctx.drawRoundImage)

`ctx.drawRoundImage(url, x, y, w, h, r)`

~~~js
dp.draw(async (ctx) => {
  const url = "static/logo.png"
  // const url = "https://...."
  await ctx.drawRoundImage(url, 0, 0, 100, 100, 50);
});
~~~

| 参数          | 描述                                      |
| :------------ | :---------------------------------------- |
| url           | 网络图片地址，或本地`/static`中图片路径。 |
| x，y          | 图片的左上角的坐标。                      |
| width，height | 图片的大小。                              |
| r             | 图片的弧度半径。                          |

## 绘制二维码(ctx.drawQrCode)

生成二维码扩展，源码使用了 [uQRCode](https://github.com/Sansnn/uQRCode) 并改动了一下，该文件比较大，所以作为扩展插件使用，使用时得先引入插件。

~~~js
// 注意：如果使用HBuilder引入, 需要引入 '@/js_sdk/u-draw-poster'
import DrawPoster from 'u-draw-poster'
import { drawQrCode } from 'u-draw-poster'
// 引入绘制二维码插件
DrawPoster.useCtx(drawQrCode)

async onReady() {
 const dp = await DrawPoster.build("canvas")
 dp.canvas.width = 200; dp.canvas.height = 200
 dp.draw(ctx=>{
   ctx.drawQrCode({
    x: (dp.canvas.width / 2) - 50,
    y: (dp.canvas.height / 2) - 50,
    text: "http://www.baidu.com",
    size: 100,
  });
 })
}
~~~

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

# 全局实例 API

## 绘画构建(DrawPoster.build)

`DrawPoster.build(string|object)`

初始化构建绘制工具，传入查询字符串与配置对象，当配置字符串时，则直接查询该字符串的`canvas`，当配置对象时，`object.selector`则为必选项，以下是`options`的配置项，需要注意的是，返回值为`Promise`，返回绘制构建对象`dp`。

~~~js
/** DrawPoster.build 构建配置 */
interface DrawPosterBuildOpts {
    // 查询字符串(必须), 注意不要写错对应canvas id, 不需要传入#符号
    selector: string;
    // 选取组件范围
    componentThis?: any;
    // 类型为2d绘制, 默认开启, 在微信小程序的时候动态加载
    type2d?: boolean;
    // 是否在绘制的过程中, 显示加载框, 默认关闭
    loading?: boolean,
    // 当存在绘制图片时, 等待绘画完毕的时间（毫秒），仅在App中生效
    drawImageTime?: 100,
    // 加载提示文字
    loadingText?: '绘制海报中...',
    // 创建图片加载提示文字
    createText?: '生成图片中...'
}
~~~

## 多绘画构建(DrawPoster.buildAll)

`DrawPoster.buildAll(Array<string|object>)`

构建多个绘画工具，传入build函数中参数string | options构成的数组，返回多个绘制工具组成的对象。key为canvasId，value为构建对象。

## 挂载全局扩展(DrawPoster.use)

`DrawPoster.use(object)`

传入挂载配置对象，添加全局扩展方法，一般可用于海报绘制模板的封装，在不同页面有一样的海报模板时可以有效的减少代码量，使用方式如下。

一、在任意位置添加扩展（建议放在`main.js`中执行）

~~~js
import DrawPoster from 'u-draw-poster'
// 全局添加绘制个人海报的扩展实现
DrawPoster.use({
  name: "createMyCardImagePath",
  // dp为当前实例, 其余参数为自定义传入参数
  handle: async (dp, opts) => {
    // ..自定义构建内容..
    return await dp.createImagePath()
  }
})
~~~

二、页面中使用自定义扩展

~~~js
import DrawPoster from 'u-draw-poster'
async onReady() {
 const dp = await DrawPoster.build("canvas")
 dp.canvas.width = 100; dp.canvas.height = 100
 const posterImg = await dp.createMyCardImagePath({/*...*/})
}
~~~

## 挂载绘制扩展(DrawPoster.useCtx)

`DrawPoster.useCtx(object)`

传入挂载配置对象，添加全局绘制扩展方法，用于自定义绘制方法的定义，使用方式如下。

一、在任意位置添加扩展（建议放在`main.js`中执行）

~~~js
// 全局添加绘制二维码的绘画扩展实现
DrawPoster.useCtx({
  name: "drawQrCode",
  // canvas(绘制节点), ctx(绘制画笔), 其余参数为自定义传入参数
  handle: async (canvas, ctx, url, x, y, w, h) => {
    // ..自定义绘制内容..
  },
});
~~~

二、绘制中使用自定义扩展

~~~js
dp.draw(ctx=> {
  const url = 'http://www.baidu.com'
  await ctx.drawQrCode(url, 0, 0, 50, 50)
 })
~~~

## 绘制节点(dp.canvas)

`dp.canvas | dp.canvas.width | dp.canvas.height | ...`

`dp.canvas`为全局的绘制根节点，在微信小程序中拥有独享`API`。在其他端将作为全局宽高容器使用。当`dp.createImagePath`未传入参数时，默认使用 `dp.canvas.width | dp.canvas.height` 创建图片，以下是`dp.canvas`对象中存在的`api`与属性。

~~~js
interface Canvas {
  width: number;
  height: number;
  // 剩余参数为微信小程序独享API，只有微信小程序才拥有的API
  // 具体参考微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
}
~~~

## 创建绘制(dp.draw)

`dp.draw(async callback(ctx))`

绘制器, 接收执行器函数, 添加到绘制容器中，可改装为异步函数处理图片绘制，也可以为同步函数。

## 全局画笔(dp.ctx)

`dp.ctx`

全局绘制画笔，特殊情况可以使用，推荐只使用`dp.draw`函数进行绘制。

## 等待绘制(dp.awaitCreate)

`dp.awaitCreate()`

异步绘制绘制器堆栈，成功后清空绘制器容器，返回成功堆栈状况的数组(`boolean[]`)。

## 停止绘画(dp.stop)

`dp.stop()`

停止当前绘画栈，调用后将停止`dp.awaitCreate |dp.createImagePath `的执行。

## 创建图片(dp.createImagePath)

`dp.createImagePath(options)`

创建当前`canvas`绘制后的本地图片地址，如绘制器堆栈未清空时，会自动调用`dp.awaitCreate()`清空堆栈。`createImagePath` 会根据 `canvas.width` 与 `canvas.height` 进行创建图片。如果你想自定义参数，`awaitCreate` 方法可以接受一个配置对象，返回图片地址，以下为可配置项。

~~~js
interface CreateImagePathOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  destWidth?: number;
  destHeight?: number;
}
~~~

# 使用建议

## canvas 当做为生成工具
canvas在海报生成中请当做一个生成工具来看待，它的作用仅是绘制出海报。应把生成得到的资源保存并使用，显示用image图片组件，原因是方便操作，例如调整大小，或是H5端长按保存或识别，所以canvas应将它放在看不见的地方。不能用display:none;overflow:hidden;隐藏，否则生成空白。这里推荐canvas的隐藏样式代码，该说明为 [uQRCode](https://github.com/Sansnn/uQRCode) 提供的说明，同样`u-draw-poster`也适用
~~~css
.canvas-hide {
	/* 1 */
	position: fixed;
	right: 100vw;
	bottom: 100vh;
	/* 2 */
	z-index: -9999;
	/* 3 */
	opacity: 0;
}
~~~

## 支持重复调用
需要注意的是，创建绘制工具支持重复调用，当构建第一次的绘制工具后，重复构建将自动获取第一次的实例。不需要存入`this`中，其实`vue3`也不提倡使用`this`这个黑盒，甚至抛弃了使用`this`。
~~~js
data: () => ({})
// 不存入实例(推荐)
method: {
  draw() {
    const dp = await DrawPoster.build("canvas")
    //...
  }
}
async onReady() {
 this.draw()
 // 重复调用....
 this.draw()
}
~~~
~~~js
// 存入实例(不推荐)
data: () => ({
  dp: null
})
method: {
  draw() {
    if (!this.dp) {
      const dp = await DrawPoster.build("canvas")
      this.dp = dp
    }
    //...
  }
}
async onReady() {
 this.draw()
 // 重复调用....
 this.draw()
}
~~~

# 常见问题

## 微信小程序手机浏览空白

微信小程序绘制如果有图片绘制，手机浏览需要在后台添加`downloadFile`域名，并需要重启开发者工具。

## 微信小程序无法真机调试

https://developers.weixin.qq.com/community/develop/doc/000eece1640d608df21bb19055b000

## 绘制完毕后没有效果

注意`DrawPoster.build`无法检测你所选择`canvasId`的是否正确，所以一定要确保与`canvas-id`和`html`中的`canvas`相同，在小程序端，由于会自动切换为`type2d`，必须得加上动态编译。

~~~html
<!-- #ifdef MP-WEIXIN -->
<canvas id="canvas" type="2d" style="width: 300px; height: 300px" />
<!-- #endif -->
<!-- #ifndef MP-WEIXIN -->
<canvas canvas-id="canvas" id="canvas" style="width: 300px; height: 300px" />
<!-- #endif -->
~~~

## 绘制多个图片加载慢

如果觉得多个图片绘制`await`加载慢，可以使用`Promise.all`将一部分不需要处理图层覆盖的图片进行同步绘制。

~~~js
dp.draw(async (ctx) => {
  // // 用户头像
  await ctx.drawRoundImage(headImgUrl, 39, 790, 90, 90, 100);
  await Promise.all([
    ctx.drawImage('/static/logo1.png', 20, 20, 35, 35),
    ctx.drawImage('/static/tp.png', 19, 86, 612, 459),
    ctx.drawImage('/static/bw.png', 188, 559, 274, 50),
    // // 用户二维码
    ctx.drawImage(codeImgUrl, 518, 780, 92, 92),
  ]);
});
~~~

需要注意的是：`ctx.drawRoundImage`不可以放在`Promise.all`当中，由于`ctx.drawRoundImage`内部会调用`ctx.clip`方法，在`Promise.all`中会与其他图片绘制产生冲突。从而导致圆角失效。

我的博客：[Mr.Mao'blog](https://tuimao233.gitee.io/mao-blog/)

联系方式：951416545@qq.com