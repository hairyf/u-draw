<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:35
 * @LastEditTime: 2021-01-03 11:58:43
 * @Description: 测试重复绘制
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
  </div>
</template>
<script>
  import { useDrawPoster } from '@/js_sdk/u-draw-poster'
  export default {
    data: () => ({
      imgUrl: '',
      timer: 0,
      xy: 50
    }),
    methods: {
      async repeatDraw() {
        // 创建绘制工具
        const dp = await useDrawPoster({
          selector: 'canvas',
          tip: true,
          debug: true
        })
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
      }
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
    }
  }
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
