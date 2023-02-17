## 绘画构建(useDrawPoster)

`useDrawPoster(...args)`

初始化构建绘制工具，传入查询字符串与配置对象，当配置字符串时，则直接查询该字符串的`canvas`，当配置对象时，`object.selector`则为必选项，以下是`options`的配置项，需要注意的是，返回值为`Promise`，返回绘制构建对象`dp`。

~~~js
// 仅传入选择器
useDrawPoster('canvas')
// 传入选择器 + 配置
useDrawPoster('canvas', {/* DrawPosterBuildOpts */})
// 仅传入配置 (这时 selector 为必填项)
useDrawPoster({
  selector: 'canvas',
  /* DrawPosterBuildOpts */
})
~~~

~~~typescript
/** useDrawPoster 构建配置 */
interface DrawPosterOptions {
  /** 查询字符串 */
  selector: string
  /** 选取组件范围 */
  componentThis?: any
  /** 绘制类型, 微信小程序自动切换为 '2d', 可指定固定类型 */
  type?: '2d' | 'context' | 'webgl'
  /** 是否在绘制与创建时显示加载提示 */
  loading?:
    | boolean
    | {
        /** 生成时加载文字 @default '绘制海报中...' */
        render?: string
        /** 创建图片时加载文字 @default '生成图片中...' */
        create?: string
      }
  /** 是否开启调试模式 */
  debug?: boolean
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
  /** 绘制扩展 */
  plugins?: DrawPosterPlugin[]
}
~~~

## 挂载全局插件(Plugins.use)

`Plugins.use(...args)`

~~~js
import { Plugins } from 'u-draw-poster'
import drawQrCode from 'u-draw-poster/plugins/ctx-drawQrCode'
Plugins.use(drawQrCode)
~~~


## 挂载局部插件(dp.use)

`useDrawPoster({plugins: [...]})`
`useDrawPoster(...).use`

挂载局部插件的方式与全局插件差不多，有两种挂载方式

~~~js
import drawQrCode from 'u-draw-poster/plugins/ctx-drawQrCode'
// 1. 配置中传入(推荐), 只能传入对象 (drawQrCode 调用返回对象)
const dp1 = await useDrawPoster('canvas', {
  plugins: [drawQrCode()]
})
// 2. 构建完毕后使用 .use, 该方法无法享有 beforeMount 周期函数的调用
const dp2 = await useDrawPoster('canvas')
dp.use(drawQrCode())
~~~

## 自定义全局|局部插件

除了核心功能默认内置的插件（例如 `drawRoundImage` 和 `drawImageFit`），useDrawPoster 也允许注册自定义插件，自定义插件中，name 为必传项。

~~~js
Plugins.use({
  name: '__draw-my-qr-code__',
  mounted: (dp, $options) => {
    dp.ctx.drawMyQrCode = (qrCodeOptions) => { /* 挂载绘制画笔: 自定义绘制方法 */ }
    dp.drawMyQrCode = (qrCodeOptions) => { /* 挂载实例方法: 自定义绘制内容 */ }
  }
})
~~~

插件支持三种引用方式, 插件拥有 6 个生命周期
会在实例调用的不同阶段, 调用插件方法

~~~js
Plugins.use('name', {
  /* beforeMount, mounted, beforeUnmount, unmounted, beforeCreate, created */
})
Plugins.use('name', (dp) => { /* mounted */ })
Plugins.use({
  name: 'name',
  /* beforeMount, mounted, beforeUnmount, unmounted, beforeCreate, created */
})
~~~

~~~ts
interface DrawPosterLifeCycles {
  /** 创建实例前(注意: 这时候 canvas 与 ctx 并未创建) */
  beforeMount?: DrawPosterLifeCycle<Partial<DrawPosterResult>>
  /** 创建实例后 */
  mounted?: DrawPosterLifeCycle
  /** 卸载实例前 */
  beforeUnmount?: DrawPosterLifeCycle
  /** 卸载实例后 */
  unmounted?: DrawPosterLifeCycle
  /** 创建绘图前 */
  beforeCreate?: DrawPosterLifeCycle
  /** 创建绘图后 */
  created?: DrawPosterLifeCycle
}
~~~

## 绘制节点(dp.canvas)

`dp.canvas | dp.canvas.width | dp.canvas.height | ...`

`dp.canvas`为全局的绘制根节点，在微信小程序中拥有独享`API`。在其他端将作为全局宽高容器使用。当`dp.create`未传入参数时，默认使用 `dp.canvas.width | dp.canvas.height` 创建图片，以下是`dp.canvas`对象中存在的`api`与属性。

~~~js
interface Canvas {
  width: number
  height: number
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

## 当前绘画进行渲染(dp.render)

`dp.render()`

异步绘制绘制器堆栈，成功后清空绘制器容器，返回成功堆栈状况的数组(`boolean[]`)。

## 停止绘画(dp.stop)

`dp.stop()`

停止当前绘画栈，调用后将停止`dp.render |dp.create `的执行。

## 创建图片(dp.create)

`dp.create(options)`

创建当前 `canvas` 绘制后的本地图片地址，如绘制器堆栈未清空时，会自动调用 `dp.render()` 清空堆栈。
`create` 会根据 `canvas.width` 与 `canvas.height` 进行创建图片。
如果你想自定义参数，`render` 方法可以接受一个配置对象，以下为可配置项，与 uni.canvasToTempFilePath 配置相似。

~~~ts
interface CreatePathOptions {
  x?: number | undefined
  y?: number | undefined
  width?: number | undefined
  height?: number | undefined
  destWidth?: number | undefined
  destHeight?: number | undefined
  fileType?: string | undefined
  quality?: number | undefined
}
~~~
