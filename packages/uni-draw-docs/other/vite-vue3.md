
在 Vue3（vite）下，有两种使用场景，一种是进入页面直接绘制，另一种是点击后生成图像。

## 场景一（进入页面就开始绘画）

```vue
<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { useDraw } from 'u-draw'

onReady(async () => {
  const dp = useDraw('canvas', {
    debug: true,
  })
  dp.draw(async (ctx) => {
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 100, 100)
  })
  dp.render()
})
</script>

<template>
  <canvas id="canvas" type="2d" />
</template>
```


## 场景二（点击进行绘画）

```vue
<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { useDraw } from 'u-draw'

const dPoster = ref()

function withDrawPoster() {
  dPoster.value = useDraw('canvas', {
    debug: true,
  })
}

async function onDrawPoster() {
  await withDrawPoster()
  dPoster.value.draw(async (ctx) => {
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 100, 100)
  })
  await dPoster.value.render()
}
</script>

<template>
  <div @click="onDrawPoster">
    <canvas id="canvas" type="2d" />
  </div>
</template>
```