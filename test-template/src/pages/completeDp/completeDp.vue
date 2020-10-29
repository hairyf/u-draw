<template>
  <div class="index">
    <image :src="imgUrl" style="width: 650rpx; height: 920rpx" />
    <div style="height: 0px; overflow: hidden">
      <!-- #ifdef MP-WEIXIN -->
      <canvas id="canvas" type="2d" style="width: 650px; height: 920px" />
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <canvas
        canvas-id="canvas"
        id="canvas"
        style="width: 650px; height: 920px"
      />
      <!-- #endif -->
    </div>
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
    const dp = await DrawPoster.build({
      selector: 'canvas',
      loading: true,
    });
    const w = (dp.canvas.width = 650);
    const h = (dp.canvas.height = 920);
    // 绘制基本背景
    dp.draw((ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRoundRect(0, 0, w, h, 12);
      ctx.clip();
      ctx.fillStyle = '#E3712A';
      ctx.fillRect(0, 0, w, h - 160);
    });
    // 绘制图片内容
    dp.draw(async (ctx) => {
      await ctx.drawImage('/static/logo1.png', 20, 20, 35, 35);
      await ctx.drawImage('/static/tp.png', 19, 86, 612, 459);
      await ctx.drawImage('/static/bw.png', 188, 559, 274, 50);
      // 用户头像
      // await ctx.drawRoundImage('/static/tx.png', 39, 780, 90, 90, 100);
      await ctx.drawImage('/static/tx.png', 39, 780, 90, 90);
      // 用户二维码
      await ctx.drawImage('/static/code.png', 518, 780, 92, 92);
    });
    // 绘制中间文字内容
    dp.draw((ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px PingFang SC';
      ctx.fillText(' 分享海报 ', w / 2, 0);
      ctx.fillText('To倪好:', 34, 660);
      ctx.font = '28px PingFang SC';
      ctx.fillWarpText({
        text:
          '当你觉得晚了的时候，恰恰是开始的时候，未来可期、前程似锦、一路向前吧。',
        maxWidth: 527,
        x: 81,
        y: 700,
        layer: 3,
      });
    });
    // 绘制底部文字内容
    dp.draw((ctx) => {
      ctx.fillStyle = '#333333';
      ctx.font = '28px PingFang SC';
      ctx.fillText('叽叽喳喳', 145, 820);
      ctx.font = '24px PingFang SC';
      ctx.fillText('邀请您一起聆听声音', 145, 866);
      ctx.font = '21px PingFang SC';
      ctx.fillText('扫码聆听', 521, 895);
    });
    console.log('绘制海报情况：', await dp.awaitCreate());
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
</style>
