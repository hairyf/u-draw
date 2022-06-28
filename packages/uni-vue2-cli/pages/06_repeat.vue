<script>
import { createDrawPoster } from '@/js_sdk/u-draw-poster'
export default {
  data: () => ({
    imgUrl: '',
    timer: 0,
    xy: 50,
  }),
  methods: {
    async repeatDraw() {
      // 创建绘制工具
      const dp = createDrawPoster({
        selector: 'canvas',
        tip: true,
        debug: true,
      })
      dp.mount()

      const w = (dp.canvas.width = 300)
      const h = (dp.canvas.height = 300)
      // 创建一个绘制任务
      dp.draw((ctx) => {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, 300, 300)
      })
      dp.draw(async (ctx) => {
        const url = '/static/logo.jpg'
        await ctx.drawImage(url, this.xy, this.xy, w, h)
        this.xy = 100
      })
      this.imgUrl = await dp.create()
    },
  },
  // 页面渲染完毕
  async onReady() {
    await this.repeatDraw()
    this.timer = setTimeout(() => {
      this.repeatDraw()
    }, 1500)
  },
  // 当离开页面时, 清除定时器
  onUnload() {
    clearTimeout(this.timer)
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
