<script setup>
import { Plugins, useDraw } from 'u-draw'
// 测试案例一：添加一个绘制个人海报的扩展实现
Plugins.use({
  name: 'createMyCardImagePath',
  mounted: (dp) => {
    dp.createMyCardImagePath = async (_options) => {
      // ..自定义绘制内容..
      return await dp.create()
    }
  },
})
// 测试案例二：添加一个绘制二维码的绘画扩展实现
Plugins.use({
  name: 'drawMyQrCode',
  mounted: (dp) => {
    dp.ctx.drawMyQrCode = async (url, x, y, w, h) => {
      console.log('自定义绘制方法: drawMyQrCode-->', { url, x, y, w, h })
    }
  },
})

// 创建绘制工具
const dp = useDraw('canvas', {
  debug: true,
})

dp.draw((ctx, canvas) => {
  canvas.width = 300
  canvas.height = 300
})
// 使用自定义扩展(画笔)
dp.draw((ctx) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 300, 300)
  // 使用扩展方法
  ctx.drawMyQrCode('url', 0, 0, 100, 100)
})

// 使用自定义扩展
dp.ready()
  .then(() => {
    dp.createMyCardImagePath({
      name: '12111',
      age: '11231',
      headImg: '....',
    })
      .then(path => console.log(path))
  })
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
