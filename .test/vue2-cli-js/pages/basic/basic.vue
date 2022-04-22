<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:34
 * @LastEditTime: 2021-01-03 12:01:18
 * @Description: 测试基本绘制
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
  </div>
</template>
<script>
  // eslint-disable-next-line eslint-comments/disable-enable-pair
  /* eslint-disable no-console */
  import { useDrawPoster } from '@/js_sdk/u-draw-poster'
  export default {
    data: () => ({
      imgUrl: ''
    }),
    async onReady() {
      // 1. 创建绘制工具
      const dp = await useDrawPoster('canvas', {
        width: 300,
        height: 300
      })
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
