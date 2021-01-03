<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:35
 * @LastEditTime: 2021-01-03 12:00:40
 * @Description: 测试图片绘制
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
import Vue from 'vue';
import DrawPoster from "@/js_sdk/u-draw-poster";
export default {
  data: () => ({
    imgUrl: '',
  }),
  async onReady() {
    const dp = await DrawPoster.build('canvas');
    dp.canvas.width = 300;
    dp.canvas.height = 300;
    dp.draw((ctx) => {
      ctx.fillStyle = '#F4F4F4';
      ctx.fillRect(0, 0, 300, 300);
    });
    // 测试本地/网络地址
    const url = '/static/logo.png' /* 网络图片 */;
    // 测试案例一：绘制图片(矩形)
    dp.draw(async (ctx) => {
      await ctx.drawImage(url, 0, 150, 150, 150);
      await ctx.drawImage(url, 150, 150, 150, 150);
    });
    // 测试案例二：绘制图片(圆角)
    dp.draw(async (ctx) => {
      await ctx.drawRoundImage(url, 0, 0, 150, 150, 100);
      await ctx.drawRoundImage(url, 150, 0, 150, 150, 100);
    });
    // 创建本地地址
    this.imgUrl = await dp.createImagePath();
    console.log('创建地址: ', { url: this.imgUrl });
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
