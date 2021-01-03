<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:35
 * @LastEditTime: 2021-01-03 12:00:11
 * @Description: 二维码测试案例
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <!-- <image :src="imgUrl" style="width: 100px; height: 100px" /> -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 300px; height: 300px" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas canvas-id="canvas" id="canvas" style="width: 300px; height: 300px" />
    <!-- #endif -->
  </div>
</template>
<script>
import DrawPoster from "@/js_sdk/u-draw-poster";
import { drawQrCode } from "@/js_sdk/u-draw-poster";
DrawPoster.useCtx(drawQrCode);
export default {
  data: () => ({
    imgUrl: "",
  }),
  async onReady() {
    // 创建绘制工具
    const dp = await DrawPoster.build("canvas");
    const w = (dp.canvas.width = 300);
    const h = (dp.canvas.height = 300);
    // 创建一个绘制任务
    dp.draw(async (ctx) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      // 绘制二维码
      ctx.drawQrCode({
        x: 0,
        y: h / 2 - 50,
        text: "http://www.baidu.com",
        size: 100,
        margin: 5,
      });
      ctx.drawQrCode({
        x: 100,
        y: h / 2 - 50,
        text: "http://www.baidu.com",
        size: 100,
        margin: 5,
        backgroundColor: "#cdd0d2",
      });
      ctx.drawQrCode({
        x: 200,
        y: h / 2 - 50,
        text: "http://www.baidu.com",
        size: 100,
        margin: 5,
        foregroundColor: "#fbbd08",
      });
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
