<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-02 21:46:09
 * @LastEditTime: 2021-01-03 11:59:48
 * @Description: 测试在组件中使用
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <TestComponent></TestComponent>	
  </div>
</template>
<script>
import DrawPoster from "@/js_sdk/u-draw-poster";
import TestComponent from './TestComponent.vue'
export default {
  components:{ TestComponent }
};
</script>

<style lang="scss">
page,
.index {
  height: 100%;
}
</style>
