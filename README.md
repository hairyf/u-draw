- 创建绘制海报`canvas`矩形方法，内置了图片绘制，圆角矩形绘制，换行字体绘制等方法。
- 接近原生开发体验，上手快，只需考虑业务逻辑，而不用考虑其他问题。
- 拥有良好的语法架构，不会在绘制`uni/wx`矩形时陷入回调地狱。
- 支持原生小程序，与`uniapp`多端应用。当是环境为原生小程序时，自动切换为性能更好的`type2d`绘制方式。
- 将复杂的逻辑组合为简单的方法，扩展性强，可使用 `use|useCtx` 引入扩展。
- 支持`typescript`，支持`vue3`模板，具体使用参考 [useDraw](https://u-draw.vercel.app/other/vite-vue3.html)。

- API 文档：[u-draw](https://u-draw.vercel.app)
- 插件市场：[dcloud/u-draw](https://ext.dcloud.net.cn/plugin?id=3237)

> 4.0.0 TODO

## ⚙️ Install

```sh
pnpm add u-draw --dev
# Or Yarn
yarn add u-draw --dev
```

## 📖 Usage

### template

```html
<!-- #ifdef MP-WEIXIN -->
<canvas id="canvas" type="2d" style="width:100px; height:100px" />
<!-- #endif -->
<!-- #ifndef MP-WEIXIN -->
<canvas canvas-id="canvas" id="canvas" style="width:100px; height:100px" />
<!-- #endif -->
```

```html
<script setup>
// 注意：如果使用 HBuilder 引入, 需要引入 '../js_sdk'
import { useDraw } from "u-draw"

const { draw, render, create } = useDraw('canvas')
</script>

```

<detail>
<summary>Vue 2</summary><br>

```js
import { createDraw } from 'u-draw'

export default {
  async onReady() {
    // 传入选择器, 初始化绘制工具(注意, 不需要传入#符号) 当微信小程序时, 将自动启用type2d绘制
    const dp = await createDraw('canvas', {
      width: 100,
      height: 100
    })
  }
}
```

</detail>

### content

```js
const { draw, render, create, canvas } = useDraw('canvas')
// 绘制背景与文字
draw((ctx) => {
  ctx.fillStyle = '#F4F4F4'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'start'
  ctx.fillStyle = 'white'
  ctx.font = `bold ${22}px sans-serif`
  ctx.fillText('周先生', canvas.width / 2, 38.5)
})
// 绘制图片内容
draw(async (ctx) => {
  // 拥有异步等待的图片绘制，支持 local、url 等图片类型
  await ctx.drawImage(/* ... */)
})
```

> 值得注意的是, `draw`方法会自动的执行 `ctx.save/ctx.restore`, 不需要人为操纵绘画栈。

```js
draw((ctx) => { /* ... */ })
// 相当于
ctx.save()
/* ... */
ctx.restore()
```

### render

`draw` 并不会马上绘制，只是将该任务添加到了任务栈，需要使用 `dp.render` 函数进行绘制，该函数在绘制完毕后将弹出所有任务。

`render` 在非 `2d` 绘画中，执行绘画任务完毕后，将自动执行 `ctx.draw` 方法，并在 draw 绘画才算异步结束。

```js
draw((ctx) => { /* ... */ })
draw(async (ctx) => { /* ... */ })
// 由于每个任务都有可能会有异步的绘制任务, 所以得需要使用await等待绘制
const result = await render()
// 绘制成功将返回每个任务的绘制状况组成的数组
console.log('draw绘制状况:', result) // draw绘制状况: [ { api: 'drawImage', params: [/* ... */], status: 'success'} ]
```

> 当全部同步绘制时，将会出现绘制时间保持不一致的情况。这样就会导致一个问题，绘制图层覆盖导致显示未达到预期效果，之所以设计为异步等待，也是为了绘制图层能保持一致顺序。

### image

如需要保存为图片时，可以使用 `create` 进行创建图片本地地址，在由 `wx` 或 `uni` 的 `api` 进行保存。

```js
draw(async (ctx) => { /* ... */ })
const result = await render()
const posterImgUrl = await create()
console.log('draw绘制状况:', result)
console.log('绘制生成本地地址:', posterImgUrl) // ...tmp...
```


你也可以不使用 `render` 方法，当调用 `create` 时会自动检测任务列表，如果有则执行绘制任务后在创建地址。

```js
draw(async (ctx) => { /* ... */ })
// 跳过drawPoster.render直接生成地址
const posterImgUrl = await create()
console.log('绘制生成本地地址:', posterImgUrl)
```

## Animation

`4.x` 版本支持 renderAnimation，支持渲染动画、小程序、H5 默认使用 `requestAnimationFrame` 渲染：

```ts
const { draw, renderAnimation, create, canvas } = useDrawCanvas('canvas')

const w = ref(100)
const h = ref(100)

draw((ctx) => {
  ctx.roundRect(0, 0, w.value, h.value)
})

// 绘制图片内容（在 Animation 中可能存在图片绘制过慢的问题）
draw(async (ctx) => {
  await ctx.drawImage(/* ... */)
})

const stop = renderAnimation(() => {
  width.value--
  if (width.value === 0)
    stop()
})

function onCreate() {
  // 等待 renderAnimation 结束后执行
  const url = await create()
}
```


---

- 博客：[Mr.Mao'blog](https://hairy.blog/)
- 邮箱：951416545@qq.com