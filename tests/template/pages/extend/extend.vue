<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:35
 * @LastEditTime: 2021-01-03 12:01:03
 * @Description: 测试自定义扩展使用
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 300px; height: 300px" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas
      canvas-id="canvas"
      id="canvas"
      style="width: 300px; height: 300px"
    />
    <!-- #endif -->
  </div>
</template>
<script>
import { DrawPoster } from "@/js_sdk/u-draw-poster";

// 测试案例一：添加一个绘制个人海报的扩展实现
DrawPoster.use({
  name: "createMyCardImagePath",
  handle: async (dp, opts) => {
    // ..自定义绘制内容..
    return await dp.createImagePath()
  },
});

// 测试案例二：添加一个绘制二维码的绘画扩展实现
DrawPoster.useCtx({
  name: "drawMyQrCode",
  handle: (canvas, ctx, url, x, y, w, h) => {
    // ....
    console.log('自定义绘制方法: drawMyQrCode-->', {
      canvas, ctx, url, x, y, w, h
    })
  },
});

export default {
  data: () => ({
    imgUrl: "",
  }),
  async onReady() {
    // 创建绘制工具
    const dp = await DrawPoster.build("canvas");
    dp.canvas.width = 300; dp.canvas.height = 300;
    // 使用自定义扩展
    const url = await dp.createMyCardImagePath({
      name: '12111',
      age: '11231',
      headImg: '....'
    })

    dp.draw((ctx) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);
      // 使用扩展方法
      ctx.drawMyQrCode('url', 0, 0, 100, 100)
    });
    this.imgUrl = await dp.createImagePath();
  },
};
</script>

<style lang="scss">
page,
.index {
  height: 100%;
}
.index {
  position: relative;
  text-align: center;
  background: rgba($color: grey, $alpha: 0.2);
}
image {
  margin-top: 30rpx;
}
canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
