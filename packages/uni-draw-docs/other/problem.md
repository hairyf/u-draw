## 微信小程序手机浏览空白

微信小程序绘制如果有图片绘制，手机浏览需要在后台添加`downloadFile`域名，并需要重启开发者工具。

## 微信小程序无法真机调试

[在设置canvas的type="2d"后, 微信开发者工具的真机预览直接闪退](https://developers.weixin.qq.com/community/develop/doc/000eece1640d608df21bb19055b000)

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
  await ctx.drawRoundImage(headImgUrl, 39, 790, 90, 90, 100)
  await Promise.all([
    ctx.drawImage('/static/logo1.png', 20, 20, 35, 35),
    ctx.drawImage('/static/tp.png', 19, 86, 612, 459),
    ctx.drawImage('/static/bw.png', 188, 559, 274, 50),
    // // 用户二维码
    ctx.drawImage(codeImgUrl, 518, 780, 92, 92),
  ])
})
~~~

需要注意的是：`ctx.drawRoundImage`不可以放在`Promise.all`当中，由于`ctx.drawRoundImage`内部会调用`ctx.clip`方法，在`Promise.all`中会与其他图片绘制产生冲突。从而导致圆角失效。