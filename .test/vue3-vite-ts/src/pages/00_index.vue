<template>
  <div class="index__list">
    <div v-for="(item, index) in links" :key="index" class="index__item"
      @click="navigateTo({ url: item.path })">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import pagesJson from '../pages.json'
const links = pagesJson.pages
  .slice(1)
  .map(page => ({
    label: page.style.navigationBarTitleText,
    path: `/${page.path}`
  }))
  
const title = ref('Hello')
const navigateTo = uni.navigateTo
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
