# 旧 API 的兼容

~~~html
<!-- 设置宽高 -->
<canvas style="width: 300px; height: 200px" canvas-id="firstCanvas"></canvas>
~~~

~~~js
// 创建绘制矩形工具
const drawPoster = await DrawPoster.build("firstCanvas");
// 添加绘制任务
drawPoster.draw(async (ctx) => {
  const path = "https://....";
  await ctx.drawLoadImage(path, 0, 0, 50, 50);
});
// 进行绘制(当绘制方式为旧接口时, 需要手动配置创建尺寸)
await drawPoster.createImagePath({
    width: 300,
    height: 300,
    destWidth: 300,
    destHeight: 300
});
~~~

