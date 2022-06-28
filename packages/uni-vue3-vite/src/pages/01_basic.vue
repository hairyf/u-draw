<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
const src = ref('')
// 1. 创建绘制工具
const dp = useDrawPoster('canvas', {
  debug: true
})

dp.draw((ctx, canvas) => {
  canvas.width = 300
  canvas.height = 300
})
dp.draw((ctx) => {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 300, 300)
})

// 3. 执行绘制任务（可选）
dp.render()
  .then(() => {/* render end */ })

// 4. 创建本地图片
dp.create()
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