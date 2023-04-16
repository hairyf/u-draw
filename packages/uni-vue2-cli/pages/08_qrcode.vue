<script>
import { createDraw } from '../js_sdk'
import drawQrCode from '../js_sdk/plugins/drawQrCode'

export default {
  data: () => ({
    imgUrl: '',
  }),
  async onReady() {
    // 创建绘制工具
    const dp = createDraw('canvas', {
      width: 300,
      height: 300,
      plugins: [drawQrCode()],
    })
    dp.mount()

    const w = dp.canvas.width
    const h = dp.canvas.height
    // 创建一个绘制任务
    dp.draw(async (ctx) => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
      // 绘制二维码
      ctx.drawQrCode({
        x: 0,
        y: h / 2 - 50,
        text: 'http://www.baidu.com',
        size: 100,
        margin: 5,
      })
      ctx.drawQrCode({
        x: 100,
        y: h / 2 - 50,
        text: 'http://www.baidu.com',
        size: 100,
        margin: 5,
        backgroundColor: '#cdd0d2',
      })
      ctx.drawQrCode({
        x: 200,
        y: h / 2 - 50,
        text: 'http://www.baidu.com',
        size: 100,
        margin: 5,
        foregroundColor: '#fbbd08',
      })
    })
    this.imgUrl = await dp.create()
  },
}
</script>

<template>
  <div class="index">
    <!-- <image :src="imgUrl" style="width: 100px; height: 100px" /> -->
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
