<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:35
 * @LastEditTime: 2021-01-03 11:59:23
 * @Description: 换行字体测试案例
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 300px; height: 300px" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas id="canvas" canvas-id="canvas" style="width: 300px; height: 300px" />
    <!-- #endif -->
  </div>
</template>
<script>
  import { useDrawPoster } from '@/js_sdk/u-draw-poster'
  export default {
    data: () => ({
      imgUrl: ''
    }),
    async onReady() {
      // 创建绘制工具
      const dp = await useDrawPoster('canvas', {
        width: 300,
        height: 300
      })
      // 创建一个绘制任务
      dp.draw((ctx) => {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, 300, 300)
        ctx.fillStyle = '#000'
        ctx.font = '30px sans-serif'
        ctx.fillWarpText({
          content: new Array(1000).fill(1).join(''),
          maxWidth: 150,
          layer: 3
        })
      })
      this.imgUrl = await dp.createImagePath()
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
