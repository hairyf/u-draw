<script>
import { useDrawPoster } from '@/js_sdk/u-draw-poster'
export default {
  data: () => ({
    imgUrl: '',
  }),
  async onReady() {
    const dp = await useDrawPoster({
      selector: 'canvas',
      debug: true,
    })
    dp.canvas.width = 300
    dp.canvas.height = 300
    dp.draw((ctx) => {
      ctx.fillStyle = '#F4F4F4'
      ctx.fillRect(0, 0, 300, 300)
    })
    dp.draw(async (ctx) => {
      const url = '/static/bg.jpeg'
      // 测试案例一：以左偏移裁剪方式
      await ctx.drawImageFit(url, {
        radius: 15,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        intrinsicPosition: ['left', 'top'],
        specifiedPosition: [0, 0],
      })
      // 测试案例二：以右裁剪方式
      await ctx.drawImageFit(url, {
        radius: 15,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        intrinsicPosition: ['right', 'top'],
        specifiedPosition: [150, 0],
      })
      // 测试案例三：图片完全展示
      await ctx.drawImageFit(url, {
        radius: 50,
        objectFit: 'contain',
        specifiedSize: { width: 150, height: 150 },
        specifiedPosition: [0, 150],
        intrinsicPosition: ['right', 'center'],
      })
      // 测试案例四：居中裁剪方式
      await ctx.drawImageFit(url, {
        radius: 150,
        objectFit: 'cover',
        specifiedSize: { width: 150, height: 150 },
        specifiedPosition: [150, 150],
        intrinsicPosition: ['center', 'center'],
      })
    })
    // 创建本地地址
    // await await dp.awaitCreate()
    this.imgUrl = await dp.create()
  },
}
</script>

<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <div style="height: 20px" />
    <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
  </div>
</template>

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
