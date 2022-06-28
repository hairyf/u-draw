<script>
import { createDrawPoster } from '@/js_sdk/u-draw-poster'
export default {
  data: () => ({
    imgUrl: '',
  }),
  onLoad() {

  },
  async onReady() {
    // 1. 创建绘制工具挂载
    const dp = createDrawPoster('canvas', {
      width: 300,
      height: 300,
    })
    dp.mount()

    // 2. 创建一个绘制任务
    dp.draw((ctx) => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 300, 300)
    })

    // 3. 执行绘制任务（可选）
    console.log('绘制情况:', await dp.render())
    
    // 4. 创建本地图片
    this.imgUrl = await dp.create()
    console.log('创建地址:', { url: this.imgUrl })
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
