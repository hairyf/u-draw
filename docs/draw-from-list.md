# draw-from-list 绘制表单扩展

## 基本使用流程

~~~html
<template>
  <div class="from-list">
    <image :src="imgUrl" style="width: 100px; height: 100px" />
    <!-- #ifdef MP-WEIXIN -->
    <canvas id="canvas" type="2d" :style="{height: height}" style="width: 750px;" />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas canvas-id="canvas" :style="{height: height}" id="canvas" style="width: 300px;"/>
    <!-- #endif -->
  </div>
</template>
<script>
import DrawPoster from "u-draw-poster";
import createFromList from "u-draw-poster/extends/create-from-list";
// 引入绘制表单扩展
DrawPoster.use(createFromList);
export default {
  data: () => ({
    height: 0
  }),
  async onReady() {
    const dp = await DrawPoster.build({
      selector: "canvas",
      loading: true,
    });
    dp.canvas.width = 750;
    dp.setFromOptions({
      // 初始化单元格内边距 dp.from.padding = 15
      padding: 15,
      // 初始化表单外边距 dp.from.margin = 8
      margin: 8
      // 初始化表单高度 dp.from.height = 0
      height: 0,
    })
    // 创建基本层, 每调用一次, 内部会累加 dp.from.height
    dp.createLayer({ background: "#ECECEC" }, [
      { text: "产品报价清单", font: "bold 34px sans-serif", center: true },
    ]);
    dp.createLayer({ background: "#ECECEC" }, [
      { text: `报价单号：暂无` },
      { text: `报价日期：暂无` },
    ]);
    dp.createLayer({ background: "#ECECEC" }, [
      { text: `优势品牌：暂无、暂无、暂无` },
    ]);
    dp.createLayer({ background: "#ECECEC" }, [
      { text: `报价单位：暂无、暂无、暂无` },
    ]);
    dp.createLayer({ background: "#ECECEC" }, [
      { text: `联系人：暂无` },
      { text: `联系方式：暂无` },
    ]);
    dp.createLayer({ y: h, self: false }, [
      { text: "序号", center: true, width: 67 },
      { text: "品牌/规格", center: true, width: 180 },
      { text: "单价", center: true, width: 128 },
      { text: "单位", center: true, width: 96 },
      { text: "数量", center: true, width: 71 },
      { text: "金额(元)", center: true, width: 110 },
      { text: "备注", center: true, width: 68 },
    ]);
    this.height = dp.canvas.height = dp.from.height;
    
    const imageUrl = await dp.createImagePath();
  },
}
</script>
~~~