<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
const src = ref('')

const { draw, create } = useDrawPoster('canvas', {
  debug: true
})


draw((ctx, canvas) => {
  canvas.width = 300
  canvas.height = 300
  ctx.fillStyle = '#F4F4F4'
  ctx.fillRect(0, 0, 300, 300)
})

// 测试本地/网络地址
const url = '/static/logo.jpg' /* 网络图片 */
// 测试案例一：绘制图片(矩形)
draw(async (ctx) => {
  await ctx.drawImage(url, 0, 150, 150, 150)
  await ctx.drawImage(url, 150, 150, 150, 150)
})
// 测试案例二：绘制图片(圆角)
draw(async (ctx) => {
  await ctx.drawRoundImage(url, 0, 0, 150, 150, 100)
  await ctx.drawRoundImage(url, 150, 0, 150, 150, 100)
})

create()
  .then(path => src.value = path)
</script>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>