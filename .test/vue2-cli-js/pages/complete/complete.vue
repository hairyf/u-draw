<template>
  <div class="index">
    <image :src="imgUrl" style="width: 650rpx; height: 920rpx" />
    <div style="position: fixed; top: 999999999999999999999rpx">
      <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 650px; height: 920px" />
    </div>
  </div>
</template>
<script>
  import { useDrawPoster } from '@/js_sdk/u-draw-poster'
  const headImgUrl =
    'https://avatars3.githubusercontent.com/u/49724027?s=460&u=7fc6b620b73a5a3486d85ceafb892b1c2d4eb698&v=4'

  export default {
    data: () => ({
      imgUrl: ''
    }),
    async onReady() {
      // 创建绘制工具
      const dp = await useDrawPoster({
        selector: 'canvas',
        loading: true,
        debug: true,
        width: 650,
        height: 920
      })
      const w = dp.canvas.width
      const h = dp.canvas.height
      // 绘制基本背景
      dp.draw((ctx) => {
        ctx.fillStyle = '#ffffff'
        ctx.fillRoundRect(0, 0, w, h, 12)
        ctx.clip()
        ctx.fillStyle = '#E3712A'
        ctx.fillRect(0, 0, w, h - 160)
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.font = 'bold 32px PingFang SC'
        ctx.fillText(' 分享海报 ', w / 2, 50)
      })
      // 绘制图片内容
      dp.draw(async (ctx) => {
        await Promise.all([
          ctx.drawImage('/static/logo1.png', 20, 20, 35, 35),
          ctx.drawImage('/static/tp.png', 19, 86, 612, 459),
          ctx.drawImage('/static/bw.png', 188, 559, 274, 50)
        ])
        // 用户二维码
        await ctx.drawRoundImage(headImgUrl, 518, 780, 92, 92)
        // 用户头像
        await ctx.drawRoundImage(headImgUrl, 39, 790, 90, 90, 100)
      })
      // 绘制中间文字内容
      dp.draw((ctx) => {
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
          layer: 2
        })
      })
      // 绘制底部文字内容
      dp.draw((ctx) => {
        ctx.fillStyle = '#333333'
        ctx.font = '28px PingFang SC'
        ctx.fillText('叽叽喳喳', 145, 820)
        ctx.font = '24px PingFang SC'
        ctx.fillText('邀请您一起聆听声音', 145, 866)
        ctx.font = '21px PingFang SC'
        ctx.fillText('扫码聆听', 521, 895)
      })
      this.imgUrl = await dp.create()
    }
  }
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
</style>
