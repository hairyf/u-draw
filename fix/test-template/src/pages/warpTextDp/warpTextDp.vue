<template>
  <div class="index">
    <canvas
      id="canvas"
      canvas-id="canvas"
      style="width: 300px; height: 300px"
    ></canvas>
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
      ctx.setFontSize(30);
      ctx.fillWarpText({
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
