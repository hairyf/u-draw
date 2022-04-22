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

const repeatDraw = async () => {
  // 创建绘制工具
  const dp = await useDrawPoster({
    selector: 'canvas',
    debug: true,
    width: 300,
    height: 300
  })
  const w = dp.canvas!.width
  const h = dp.canvas!.height
  // 创建一个绘制任务
  dp.draw((ctx) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, 300, 300)
  })
  dp.draw(async (ctx) => {
    const url = '/static/logo.jpg'
    await ctx.drawImage(url, xy.value, xy.value, w, h)
    xy.value = 100
  })

  await dp.create()
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