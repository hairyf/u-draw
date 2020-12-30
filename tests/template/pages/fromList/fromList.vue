<template>
  <div class="index">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" style="width: 300px;" :style="{height:height+'px'}" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas canvas-id="canvas" id="canvas" style="width: 300px;" :style="{height:height+'px'}"  />
    <!-- #endif -->
  </div>
</template>
<script>
import { setTimeout } from 'timers';
import DrawPoster from "../../js_sdk/u-draw-poster";
import DreateLayer from "../../js_sdk/u-draw-poster/extends/create-from-list";
DrawPoster.use(DreateLayer)
export default {
  data: () => ({
    imgUrl: "",
    height: 10
  }),
  async onReady() {
    // 创建绘制工具
    const dp = await DrawPoster.build("canvas");
    dp.canvas.width = 300;
    dp.createLayer({background: '#fff'}, [
      {text: '字体与颜色', font: '35px sans-serif', color: 'red'},
    ])
    dp.createLayer({background: '#fff'}, [
      {text: '普通字体'},
      {text: '居中字体', center: true},
    ])
    dp.createLayer({background: '#fff'}, [
      {text: '自动换行，，计算高度'},
      {text: '普通字体'},
    ])
    dp.createLayer({background: '#fff', line: false}, [
      {text: '去内边框'},
      {text: '去内边框'},
    ])
    dp.createLayer({background: '#fff'}, [
      {text: '普通字体'},
      {text: '普通字体'},
    ])
    dp.createLayer({background: '#fff'}, [
      {text: '普通字体'},
      {text: '普通字体'},
    ])
    dp.createLayer({background: '#fff'}, [
      {text: '普通字体'},
      {text: '普通字体'},
    ])
    this.height = dp.canvas.height = dp.from.height+1
    setTimeout(()=>{
      dp.createImagePath()
    }, 10)
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
