<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
const src = ref('')
onReady(async () => {
  // 1. 创建绘制工具
  const dp = await useDrawPoster('canvas', {
    width: 300,
    height: 300,
    debug: true
  })
  // 2. 创建一个绘制任务
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
  // 3. 执行绘制任务（可选）
  await dp.render()
  // 4. 创建本地图片
  src.value = await dp.create()
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