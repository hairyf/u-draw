<script setup>
import { ref } from 'vue'
import { useDraw } from 'u-draw'

const src = ref('')
const headImgUrl
  = 'https://avatars3.githubusercontent.com/u/49724027?s=460&u=7fc6b620b73a5a3486d85ceafb892b1c2d4eb698&v=4'
const { draw, create } = useDraw('canvas', {
  loading: true,
  debug: true,
})

// 绘制基本背景
draw((ctx, { width, height }) => {
  ctx.fillStyle = '#ffffff'
  ctx.fillRoundRect(0, 0, width, height, 12)
  ctx.clip()
  ctx.fillStyle = '#E3712A'
  ctx.fillRect(0, 0, width, height - 160)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.font = 'bold 32px PingFang SC'
  ctx.fillText(' 分享海报 ', width / 2, 50)
})
// 绘制图片内容
draw(async (ctx) => {
  await Promise.all([
    ctx.drawImage('/static/logo1.png', 20, 20, 35, 35),
    ctx.drawImage('/static/tp.png', 19, 86, 612, 459),
    ctx.drawImage('/static/bw.png', 188, 559, 274, 50),
  ])
  // 用户二维码
  await ctx.drawRoundImage(headImgUrl, 518, 780, 92, 92)
  // 用户头像
  await ctx.drawRoundImage(headImgUrl, 39, 790, 90, 90, 100)
})
// 绘制中间文字内容
draw((ctx) => {
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px PingFang SC'
  ctx.fillText('To倪好:', 34, 660)
  ctx.font = '28px PingFang SC'
  ctx.fillWarpText({
    content:
      '当你觉得晚了的时候，恰恰是开始的时候，未来可期、前程似锦、一路向前吧。dddddddddddddd',
    maxWidth: 527,
    x: 81,
    y: 700,
    layer: 2,
  })
})
// 绘制底部文字内容
draw((ctx) => {
  ctx.fillStyle = '#333333'
  ctx.font = '28px PingFang SC'
  ctx.fillText('叽叽喳喳', 145, 820)
  ctx.font = '24px PingFang SC'
  ctx.fillText('邀请您一起聆听声音', 145, 866)
  ctx.font = '21px PingFang SC'
  ctx.fillText('扫码聆听', 521, 895)
})
create()
  .then(path => src.value = path)
</script>

<template>
  <image :src="src" style="width: 650rpx; height: 920rpx" />
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 650px; height: 920px; position: fixed; top: 9999px" />
</template>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: wheat;
}
</style>
