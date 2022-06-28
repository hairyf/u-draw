<script>
import pagesJson from '../pages.json'

export default {
  data: () => ({
    links: pagesJson.pages
      .slice(1)
      .map(page => ({
        label: page.style.navigationBarTitleText,
        path: `/${page.path}`,
      })),
    navigateTo: uni.navigateTo,
  }),
}
</script>

<template>
  <div class="index__list">
    <div
      v-for="(item, index) in links" :key="index" class="index__item"
      @click="navigateTo({ url: item.path })"
    >
      {{ item.label }}
    </div>
  </div>
</template>

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
