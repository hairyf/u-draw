<script setup>
import { ref } from 'vue'
import { useDraw } from 'u-draw'

const src = ref('')
// 1. 创建绘制工具

const dp = useDraw('canvas', {
  debug: true,
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
;(async () => {
  await dp.render()
})()

// 4. 创建本地图片
dp.create()
  .then(path => src.value = path)
</script>

<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<style>
page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
