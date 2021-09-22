# 绘制海报工具简述

- 创建绘制海报`canvas`矩形方法，内置了图片绘制，圆角矩形绘制，换行字体绘制等方法。
- 接近原生开发体验，上手快，只需考虑业务逻辑，而不用考虑其他问题。
- 拥有良好的语法架构，不会在绘制`uni/wx`矩形时陷入回调地狱。
- 支持原生小程序，与`uniapp`多端应用。当是环境为原生小程序时，自动切换为性能更好的`type2d`绘制方式。
- 将复杂的逻辑组合为简单的方法，扩展性强，可使用 `use|useCtx` 引入扩展。
- 支持`typescript`，支持`vue3`模板
- 支持声明式绘制扩展，自定义海报必备 具体使用参考 [draw-painter](https://tuimao233.gitee.io/mao-blog/wo-de-kuo-zhan/u-draw-poster/01-base-desc.html)

api文档：[u-draw-poster](https://tuimao233.gitee.io/mao-blog/wo-de-kuo-zhan/u-draw-poster/01-base-desc.html)

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
import { useDrawPoster } from 'u-draw-poster'
async onReady() {
 // 传入选择器, 初始化绘制工具, 当微信小程序时, 将自动启用type2d绘制
 const dp = await useDrawPoster("canvas", {
   // 设置画布宽高
   width: 100,
   height: 100
 })   
}
~~~

## 2. 绘制任意内容
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
    await ctx.drawImage('...')
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
`dp.render`在非`2d`绘画中，执行绘画任务完毕后，将自动执行`ctx.draw`方法，并在 draw 绘画才算异步结束。

~~~js
dp.draw((ctx) => {/* ... */})
dp.draw(async (ctx) => {/* ... */})
// 由于每个任务都有可能会有异步的绘制任务, 所以得需要使用await等待绘制
console.log("draw绘制状况:", await dp.render()); // draw绘制状况: [true]
~~~

[^为什么这么做]: 当全部同步绘制时，将会出现绘制时间保持不一致的情况。这样就会导致一个问题，绘制图层覆盖导致显示未达到预期效果，之所以设计为异步等待，也是为了绘制图层能保持一致顺序。

## 5. 生成图片本地地址

如需要保存为图片时，可以使用`dp.createImagePath` 进行创建图片本地地址，在由`wx`或`uni`的`api`进行保存。
~~~js
dp.draw(async (ctx) => {/* ... */})
const result = await dp.render();
const posterImgUrl = await dp.createImagePath();
console.log("draw绘制状况:", result); // [true]
console.log("绘制生成本地地址:", posterImgUrl); // ...tmp...
~~~
你也可以不使用`dp.render`方法，当调用`dp.createImagePath`时会自动检测任务列表，如果有则执行绘制任务后在创建地址。

~~~js
dp.draw(async (ctx) => {/* ... */})
// 跳过drawPoster.awaitCreate直接生成地址
const posterImgUrl = await dp.createImagePath();
console.log("绘制生成本地地址:", posterImgUrl);
~~~

# 绘制扩展 API

DrawPoster 在创建时，会自动的向`ctx(画笔)`添加/覆盖扩展方法，以便构建海报矩形。

目前支持绘制图片、圆角图片、绘制裁剪图片（object-fit）、换行字体、圆角矩形、圆角矩形边框、绘制二维码。

~~~js
dp.draw(async (ctx) => {
  // ctx.drawImage | ctx.drawRoundImage | ctx.fillWarpText | ....
})
~~~

具体查看API文档：[u-draw-poster](http://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poster/02-draw-extends.html)


# 全局实例 API

DrawPoster 的静态与扩展方法，除了最常用的：绘制节点、绘画构建、创建绘制、创建图片，以及还有另外的扩展功能：绘画构建、挂载全局扩展、挂载绘制扩展、全局画笔、等待绘制、停止绘画。

具体查看API文档：[u-draw-poster](http://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poster/03-gbl-example.html)

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

## 支持重复调用 (单例模式)
需要注意的是，创建绘制工具支持重复调用，当构建第一次的绘制工具后，重复构建将自动获取第一次的实例。不需要存入`this`中，其实`vue3`也不提倡使用`this`这个黑盒，甚至抛弃了使用`this`。
~~~js
data: () => ({}),
// 不存入实例(推荐)
method: {
  async draw() {
    const dp = await useDrawPoster("canvas")
    //...
  }
},
onReady() {
 this.draw()
 // 重复调用....
 this.draw()
}
~~~
~~~js
// 存入实例(不推荐)
data: () => ({
  dp: null
}),
method: {
  async draw() {
    if (!this.dp) {
      const dp = await useDrawPoster("canvas")
      this.dp = dp
    }
    //...
  }
},
onReady() {
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

联系方式（邮箱）：951416545@qq.com

海报绘制QQ群：936377537
