<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-02 00:11:21
 * @LastEditTime: 2021-02-19 10:29:04
 * @Description: 测试图片裁剪方式绘制
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
    const dp = await DrawPoster.build({
      selector: "canvas",
      debugging: true,
    });
    dp.canvas.width = 300;
    dp.canvas.height = 300;
    dp.draw((ctx) => {
      ctx.fillStyle = '#F4F4F4';
      ctx.fillRect(0, 0, 300, 300);
    });
    dp.draw(async (ctx) => {
      const url = '/static/bg.jpeg';
      // 测试案例一：以左偏移裁剪方式
      await ctx.drawImageFit(url, {
        round: 15,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        intrinsicPosition: ['left', 'top'],
        specifiedPosition: [0, 0],
      })
      // 测试案例二：以右裁剪方式
      await ctx.drawImageFit(url, {
        round: 15,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        intrinsicPosition: ['right', 'top'],
        specifiedPosition: [150, 0],
      })
      // 测试案例三：图片完全展示
      await ctx.drawImageFit(url, {
        round: 50,
        objectFit: 'contain',
        specifiedSize: { width: 150, height: 150 },
        specifiedPosition: [0, 150],
        intrinsicPosition: ['right', 'center'],
      })
      // 测试案例四：居中裁剪方式
      await ctx.drawImageFit(url, {
        round: 150,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        specifiedPosition: [150, 150],
        intrinsicPosition: ['center', 'center'],
      })
    });
    // 创建本地地址
    // await await dp.awaitCreate()
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
