<template>
  <canvas id="canvas" type="2d" canvas-id="canvas" style="width: 300px;" :style="{ height: height + 'px' }" />
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useDrawPoster } from 'u-draw-poster'
import table from 'u-draw-poster/plugins/table'

const height = ref(10)
const src = ref('')

const dp = useDrawPoster('canvas', {
  debug: true,
  plugins: [table()]
})

onReady(async () => {
  await dp.ready()

  dp.createLayer({ background: '#fff', line: false }, [
    { text: '字体与颜色', font: '35px sans-serif', color: 'red' },
    { text: '字体与颜色', font: '35px sans-serif', color: 'red' }
  ])
  dp.createLayer({ background: '#fff' }, [
    { text: '普通字体' },
    { text: '居中字体', center: true }
  ])
  dp.createLayer({ background: '#fff' }, [
    { text: '自动换行，，计算高度' },
    { text: '普通字体，，不要边框' }
  ])
  dp.createLayer({ background: '#fff', line: false }, [
    { text: '去内边框' },
    { text: '去内边框' }
  ])
  dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
  dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
  dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
  height.value = dp.canvas.height = dp.table.height + 1

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