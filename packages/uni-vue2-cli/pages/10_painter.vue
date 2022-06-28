<script>
import { createDrawPoster } from '@/js_sdk/u-draw-poster'
import drawPainter from '@/js_sdk/u-draw-poster/plugins/painter'
import drawQrCode from '@/js_sdk/u-draw-poster/plugins/drawQrCode'
export default {
  data: () => ({
    imgUrl: '',
    width: 200,
    height: 380,
  }),
  async onReady() {
    // 创建绘制工具
    const dp = createDrawPoster({
      selector: 'canvas',
      debug: true,
      width: 200,
      height: 380,
      plugins: [drawQrCode(), drawPainter()],
    })
    dp.mount()

    // 插入绘制描述信息
    dp.painter({
      width: 200,
      height: 380,
      contents: [
        {
          type: 'rect',
          width: 200,
          height: 380,
          background: 'grey',
        },
        {
          type: 'image',
          src: '/static/logo.jpg',
          width: 200,
          height: 380,
        },
        {
          type: 'text',
          top: 20,
          left: 10,
          color: '#ffffff',
          fontSize: 40,
          fontWeight: 'bold',
          content: '城市建筑摄影专题',
        },
        {
          type: 'line-feed-text',
          left: 10,
          top: 300,
          width: 150,
          color: '#ffffff',
          lineHeight: 25,
          content:
              '老朋友向我频频挥手，告别了黄鹤楼，在这柳絮如烟、繁花似锦的阳春三月去扬州远游。',
        },
        {
          type: 'qr-code',
          left: 50,
          top: 380 / 2 - 50,
          size: 100,
          content: 'http://www.baidu.com',
        },
      ],
    })
    console.log(await dp.create())
  },
}
</script>

<template>
  <div class="index">
    <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 200px; height: 380px" />
  </div>
</template>

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
