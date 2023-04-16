<script>
import { createDraw } from '../js_sdk'

export default {
  data: () => ({
    imgUrl: '',
  }),
  async onReady() {
    // 创建绘制工具
    const dp = createDraw('canvas')

    dp.mount()

    // 创建一个绘制任务
    dp.draw((ctx) => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 300, 300)
      ctx.fillStyle = '#000'
      ctx.font = '30px sans-serif'
      ctx.fillWarpText({
        content: new Array(1000).fill(1).join(''),
        maxWidth: 150,
        layer: 3,
      })
    })
    this.imgUrl = await dp.create()
  },
}
</script>

<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
  </div>
</template>

<style>
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
