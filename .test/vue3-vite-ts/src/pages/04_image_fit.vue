<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px; height: 300px" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
const src = ref('')
onReady(async () => {
  const dp = await useDrawPoster('canvas', {
    width: 300,
    height: 300,
    debug: true
  })
  dp.draw((ctx) => {
    ctx.fillStyle = '#F4F4F4'
    ctx.fillRect(0, 0, 300, 300)
  })
  dp.draw(async (ctx) => {
    const url = '/static/bg.jpeg'
    // 测试案例一：以左偏移裁剪方式
    await ctx.drawImageFit(url, {
      radius: 15,
      objectFit: 'cover',
      specifiedSize: { width: 150, height: 150 },
      intrinsicPosition: ['left', 'top'],
      specifiedPosition: [0, 0]
    })
    // 测试案例二：以右裁剪方式
    await ctx.drawImageFit(url, {
      radius: 15,
      objectFit: 'cover',
      specifiedSize: { width: 150, height: 150 },
      intrinsicPosition: ['right', 'top'],
      specifiedPosition: [150, 0]
    })
    // 测试案例三：图片完全展示
    await ctx.drawImageFit(url, {
      radius: 50,
      objectFit: 'contain',
      specifiedSize: { width: 150, height: 150 },
      specifiedPosition: [0, 150],
      intrinsicPosition: ['right', 'center']
    })
    // 测试案例四：居中裁剪方式
    await ctx.drawImageFit(url, {
      radius: 150,
      objectFit: 'cover',
      specifiedSize: { width: 150, height: 150 },
      specifiedPosition: [150, 150],
      intrinsicPosition: ['center', 'center']
    })
  })
  // 创建本地地址
  src.value = await dp.create()
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