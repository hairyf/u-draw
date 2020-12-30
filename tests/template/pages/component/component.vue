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
