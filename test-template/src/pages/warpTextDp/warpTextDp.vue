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
    // 创建一个绘制任务
    dp.draw((ctx) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#000';
      ctx.font = '30px sans-serif';
      ctx.fillWarpText({
        x: 3,
        text: new Array(1000).fill('x').join(''),
        maxWidth: dp.canvas.width - 13,
        layer: 10,
      });
    });
    console.log('绘制情况: ', await dp.awaitCreate());
    console.log('创建地址: ', await dp.createImagePath());
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
