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
import DrawPoster from "@/js_sdk/uni-draw-poster";
export default {
  data: () => ({
    imgUrl: "",
  }),
  async onReady() {
    // 创建绘制工具
    const dp = await DrawPoster.build("canvas");
    dp.canvas.width = 300;
    dp.canvas.height = 300;
    // 创建一个绘制任务
    dp.draw((ctx) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);
    });
    // 执行绘制任务
    console.log("绘制情况: ", await dp.awaitCreate());
    // 创建本地图片
    this.imgUrl = await dp.createImagePath();
    console.log("创建地址: ", { url: this.imgUrl });
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
