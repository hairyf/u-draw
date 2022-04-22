<template>
  <div class="index__list">
    <div v-for="(item, index) in navis" :key="index" class="index__item" @click="navigateTo({ url: `/pages/${item.path}/${item.path}` })">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      navis: [
        { label: '基本绘制', path: 'basic' },
        { label: '换行字体绘制', path: 'warpText' },
        { label: '图片绘制', path: 'image' },
        { label: '图片Fit绘制', path: 'imageFit' },
        { label: '完整海报绘制', path: 'complete' },
        { label: '重复绘制', path: 'repeat' },
        { label: '扩展程序', path: 'plugin' },
        { label: '二维码生成', path: 'qrcode' },
        { label: '表单绘制插件', path: 'table' },
        { label: '声明式绘制插件', path: 'painter' }
      ],
      navigateTo: uni.navigateTo
    })
  }
</script>

<style>
  .index__list {
    display: flex;
    flex-direction: column;
  }
  .index__item {
    padding: 35rpx 15rpx;
    border-top: 1rpx solid rgb(236, 236, 236);
  }
</style>
