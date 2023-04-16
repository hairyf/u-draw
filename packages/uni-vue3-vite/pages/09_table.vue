<script setup>
import { onReady } from '@dcloudio/uni-app'
import { useDraw } from 'u-draw'
import { ref } from 'vue'
import table from 'u-draw/plugins/table'

const imageHeight = ref(10)
const src = ref('')

const dp = useDraw('canvas', {
  debug: true,
  plugins: [table()],
})

onReady(async () => {
  await dp.ready()

  let height = 0

  height += dp.createLayer({ background: '#fff', line: false }, [
    { text: '字体与颜色', font: '35px sans-serif', color: 'red' },
    { text: '字体与颜色', font: '35px sans-serif', color: 'red' },
  ])
  height += dp.createLayer({ background: '#fff' }, [
    { text: '普通字体' },
    { text: '居中字体', center: true },
  ])
  height += dp.createLayer({ background: '#fff' }, [
    { text: '自动换行，，计算高度' },
    { text: '普通字体，，不要边框' },
  ])
  height += dp.createLayer({ background: '#fff', line: false }, [
    { text: '去内边框' },
    { text: '去内边框' },
  ])
  height += dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
  height += dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
  height += dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])

  dp.canvas.height = height
  imageHeight.value = height

  src.value = await dp.create()

  console.log(src.value)
})
</script>

<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px;" :style="{ height: `${imageHeight}px` }" />
</template>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
