<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 200px; height: 380px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
import drawPainter from 'u-draw-poster/plugins/painter'
import drawQrCode from 'u-draw-poster/plugins/drawQrCode'

// 创建绘制工具
const dp = useDrawPoster({
  selector: 'canvas',
  debug: true,
  plugins: [drawQrCode(), drawPainter()]
})

onReady(async () => {
  await dp.ready()
  
  // 插入绘制描述信息
  dp.painter({
    width: 200,
    height: 380,
    contents: [
      {
        type: 'rect',
        width: 200,
        height: 380,
        background: 'grey'
      },
      {
        type: 'image',
        src: '/static/logo.jpg',
        width: 200,
        height: 380
      },
      {
        type: 'text',
        top: 20,
        left: 10,
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 'bold',
        content: '城市建筑摄影专题'
      },
      {
        type: 'line-feed-text',
        left: 10,
        top: 300,
        width: 150,
        color: '#ffffff',
        lineHeight: 25,
        content:
          '老朋友向我频频挥手，告别了黄鹤楼，在这柳絮如烟、繁花似锦的阳春三月去扬州远游。'
      },
      {
        type: 'qr-code',
        left: 50,
        top: 380 / 2 - 50,
        size: 100,
        content: 'http://www.baidu.com'
      }
    ]
  })

  await dp.render()
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