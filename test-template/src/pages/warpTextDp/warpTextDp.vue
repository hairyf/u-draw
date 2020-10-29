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
<script lang="ts">
import Vue from 'vue';
import DrawPoster from 'uni-draw-poster';
export default Vue.extend({
  data: () => ({
    imgUrl: '',
  }),
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
        text: new Array(10000).fill(1).join(''),
        maxWidth: 150,
        layer: 3,
      });
    });
    this.imgUrl = await dp.createImagePath();
    // console.log('创建地址: ', this.imgUrl);
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
