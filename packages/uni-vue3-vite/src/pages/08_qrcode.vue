<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
import drawQrCode from 'u-draw-poster/plugins/drawQrCode'
const src = ref('')

// 1. 创建绘制工具
const { draw, create } = useDrawPoster('canvas', {
  debug: true,
  plugins: [drawQrCode()]
})

// 创建一个绘制任务
draw(async (ctx, { width: w, height: h }) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  // 绘制二维码
  ctx.drawQrCode({
    x: 0,
    y: h / 2 - 50,
    text: 'http://www.baidu.com',
    size: 100,
    margin: 5
  })
  ctx.drawQrCode({
    x: 100,
    y: h / 2 - 50,
    text: 'http://www.baidu.com',
    size: 100,
    margin: 5,
    backgroundColor: '#cdd0d2'
  })
  ctx.drawQrCode({
    x: 200,
    y: h / 2 - 50,
    text: 'http://www.baidu.com',
    size: 100,
    margin: 5,
    foregroundColor: '#fbbd08'
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