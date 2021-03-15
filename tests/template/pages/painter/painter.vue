<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-12-31 13:57:34
 * @LastEditTime: 2021-01-03 12:01:18
 * @Description: 测试基本绘制
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <!-- <image :src="imgUrl" style="width: 100px; height: 100px" /> -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 200px; height: 380px" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas canvas-id="canvas" id="canvas" style="width: 200px; height: 380px" />
    <!-- #endif -->
  </div>
</template>
<script>
import DrawPoster from "@/js_sdk/u-draw-poster";
import drawPainter from "@/js_sdk/u-draw-poster/extends/draw-painter";
import drawQrCode from "@/js_sdk/u-draw-poster/extends/draw-qr-code";
DrawPoster.use(drawPainter)
export default {
  data: () => ({
    imgUrl: "",
    width: 200,
    height: 380
  }),
  async onReady() {
    // 1. 创建绘制工具
    const dp = await DrawPoster.build({
      selector: "canvas",
      debugging: true,
    });
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
          height: 380,
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
          content: '老朋友向我频频挥手，告别了黄鹤楼，在这柳絮如烟、繁花似锦的阳春三月去扬州远游。'
        },
        {
          type: 'qr-code',
          left: 50,
          top: (380/2) - 50,
          size: 100,
          content: 'http://www.baidu.com'
        }
      ]
    })
    console.log(await dp.createImagePath());
  },
};
</script>

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
