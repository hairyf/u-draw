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
})
draw((ctx) => {
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