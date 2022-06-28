<script>
import { useDrawPoster } from '@/js_sdk/u-draw-poster'

// 测试案例一：添加一个绘制个人海报的扩展实现
useDrawPoster.use({
  name: 'createMyCardImagePath',
  mounted: (dp) => {
    dp.createMyCardImagePath = async (_options) => {
      // ..自定义绘制内容..
      return await dp.create()
    }
  },
})

// 测试案例二：添加一个绘制二维码的绘画扩展实现
useDrawPoster.use({
  name: 'drawMyQrCode',
  mounted: (dp) => {
    dp.ctx.drawMyQrCode = (url, x, y, w, h) => {
      // ....
      console.log('自定义绘制方法: drawMyQrCode-->', {
        dp,
        url,
        x,
        y,
        w,
        h,
      })
    }
  },
})

export default {
  data: () => ({
    imgUrl: '',
  }),
  async onReady() {
    // 创建绘制工具
    const dp = await useDrawPoster('canvas', {
      width: 300,
      height: 300,
    })
    // 使用自定义扩展
    const url = await dp.createMyCardImagePath({
      name: '12111',
      age: '11231',
      headImg: '....',
    })

    dp.draw((ctx) => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 300, 300)
      // 使用扩展方法
      ctx.drawMyQrCode('url', 0, 0, 100, 100)
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
