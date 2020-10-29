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
    const dp = await DrawPoster.build('canvas');
    dp.canvas.width = 300;
    dp.canvas.height = 300;
    dp.draw((ctx) => {
      ctx.fillStyle = '#F4F4F4';
      ctx.fillRect(0, 0, 300, 300);
    });
    // 测试本地地址
    // const url = '/static/logo.png';
    // 测试网络地址
    const url =
      'https://qie-online-sale-qiniu.wsandos.com/uploads/20201027/FuZZKEsjnF1bTobVc4ujlKhuCUKP.png';
    // 绘制图片(矩形)
    dp.draw(async (ctx) => {
      await ctx.drawImage(url, 0, 150, 150, 150);
      await ctx.drawImage(url, 150, 150, 150, 150);
    });
    // 绘制图片(圆角)
    dp.draw(async (ctx) => {
      await ctx.drawRoundImage(url, 0, 0, 150, 150, 100);
      await ctx.drawRoundImage(url, 150, 0, 150, 150, 100);
    });
    // 创建本地地址
    this.imgUrl = await dp.createImagePath();
    console.log('创建地址: ', this.imgUrl);
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
