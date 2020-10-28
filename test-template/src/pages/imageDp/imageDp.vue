<template>
  <div class="index">
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 300rpx; height: 300rpx" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas
      canvas-id="canvas"
      id="canvas"
      style="width: 300rpx; height: 300rpx"
    />
    <!-- #endif -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import DrawPoster from 'uni-draw-poster';
export default Vue.extend({
  async onReady() {
    // 创建绘制工具
    const dp = await DrawPoster.build('canvas');
    dp.canvas.width = 300;
    dp.canvas.height = 300;
    // 绘制一个背景
    dp.draw((ctx) => {
      ctx.fillStyle = '#F4F4F4';
      ctx.fillRect(0, 0, 300, 300);
    });
    // 绘制图片
    dp.draw(async (ctx) => {
      await ctx.drawImage('/static/logo.png', 0, 0, 150, 150);
      await ctx.drawRoundImage('/static/logo.png', 150, 0, 150, 150, 100);
    });
    // 创建本地地址
    console.log('创建本地地址: ', await dp.createImagePath());
  },
});
</script>

<style lang="scss">
page,
.index {
  height: 100%;
}
.index {
  position: relative;
  background: rgba($color: grey, $alpha: 0.2);
}
canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
