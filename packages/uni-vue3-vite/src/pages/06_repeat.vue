<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'

let timer
const src = ref('')
const xy = ref(50)

const { draw, create } = useDrawPoster('canvas', {
  debug: true
})

const repeatDraw = async () => {
  draw((ctx, canvas) => {
    canvas.width = 300
    canvas.height = 300
    ctx.fillStyle = '#F4F4F4'
    ctx.fillRect(0, 0, 300, 300)
  })
  // 创建一个绘制任务
  draw((ctx) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, 300, 300)
  })
  draw(async (ctx, { width, height }) => {
    const url = '/static/logo.jpg'
    await ctx.drawImage(url, xy.value, xy.value, width, height)
    xy.value = 100
  })

  create()
    .then(path => src.value = path)
}

onReady(async () => {
  timer = setTimeout(repeatDraw, 1500)
  repeatDraw()
})
</script>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>