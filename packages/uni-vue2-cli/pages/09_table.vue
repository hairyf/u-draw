<script>
import table from '../js_sdk/plugins/table'

export default {
  data: () => ({
    imgUrl: '',
    height: 10,
  }),
  async onReady() {
    // 创建绘制工具
    const dp = createDraw({
      selector: 'canvas',
      debug: true,
      width: 300,
      plugins: [table()],
    })
    dp.mount()

    dp.createLayer({ background: '#fff', line: false }, [
      { text: '字体与颜色', font: '35px sans-serif', color: 'red' },
      { text: '字体与颜色', font: '35px sans-serif', color: 'red' },
    ])
    dp.createLayer({ background: '#fff' }, [
      { text: '普通字体' },
      { text: '居中字体', center: true },
    ])
    dp.createLayer({ background: '#fff', border: false }, [
      { text: '自动换行，，计算高度' },
      { text: '普通字体' },
    ])
    dp.createLayer({ background: '#fff', line: false }, [
      { text: '去内边框' },
      { text: '去内边框' },
    ])
    dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
    dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
    dp.createLayer({ background: '#fff' }, [{ text: '普通字体' }, { text: '普通字体' }])
    this.height = dp.canvas.height = dp.table.height + 1

    const image = await dp.create()
    console.log(image)
  },
}
</script>

<template>
  <div class="index">
    <!-- <image :src="imgUrl" style="width: 300px; height: height" /> -->
    <canvas
      id="canvas"
      canvas-id="canvas"
      type="2d"
      style="width: 300px"
      :style="{ height: `${height}px` }"
    />
  </div>
</template>

<style>
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
