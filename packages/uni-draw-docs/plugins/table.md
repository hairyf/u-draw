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
import { useDrawPoster } from "u-draw-poster";
import table from "u-draw-poster/plugins/table";
export default {
  data: () => ({
    height: 0
  }),
  async onReady() {
    const dp = await DrawPoster.build({
      selector: "canvas",
      loading: true,
      plugins: [ 
        // 1. 引入扩展, 并传入参数(可选)
        table({
          // 初始化单元格内边距
          padding: 15,
          // 初始化表单外边距
          margin: 8
          // 初始化表单高度,
          height: 0,
        })
      ],
      width: 750,
    });
    // 创建基本层, 每调用一次, 内部会累加 dp.from.height
    dp.createLayer({ background: "#ECECEC" }, [
      { text: "产品报价清单", font: "bold 34px sans-serif", center: true },
    ]);
    // 去除内线(line) 外边框(border)
    dp.createLayer({ background: "#ECECEC", border: false, line: false }, [
      { text: `报价单号：暂无` },
      { text: `报价日期：暂无` },
    ]);
    // 去除内线(line) 外边框(border)
    dp.createLayer({ background: "#ECECEC" }, [
      { text: `优势品牌：暂无、暂无、暂无` },
    ]);
    // 自定义行高（默认取当前字行高）
    dp.createLayer({ background: "#ECECEC", lineHeight: 40 }, [
      { text: `报价单位：暂无、暂无、暂无` },
    ]);
    // 自定义栅格尺寸, 关闭自适应栅格, 这里注意, 关闭后需要对每列都设置宽度
    dp.createLayer({ y: h, self: false }, [
      { text: "序号", center: true, width: 67 },
      { text: "品牌/规格", center: true, width: 180 },
      { text: "单价", center: true, width: 128 },
      { text: "单位", center: true, width: 96 },
      { text: "数量", center: true, width: 71 },
      { text: "金额(元)", center: true, width: 110 },
      { text: "备注", center: true, width: 68 },
    ]);
    // 2. 同时赋值高度和 canvas 高度
    this.height = dp.canvas.height = dp.table.height;
    // 3. 创建图像
    const imageUrl = await dp.create();
  },
}
</script>
~~~

## 绘制层

`dp.createLayer(BaseOpts, RowOpts[])`

用于创建一行表单项, 自动计算行高边距, 调用自动累加 `dp.from.height`，`BaseOpts` 为当前行配置, `RowOpts[]` 为存放着多个列信息的数组, 以下为行可配置项

~~~js
interface BaseOpts {
  // 当前行背景色 默认 "#fff"
  background?: string
  // 当前行 Y 轴偏移量, 默认 dp.from.height || dp.from.margin
  columnY?: number
  // 当前行是否开启自适应栅格宽度, 默认 true
  self?: boolean
  // 当前行是否开启内边框显示, 默认 true
  line?: boolean
  // 当前行高度, 默认当前字体行高
  lineHeight?: number
  // 当前行是否开启外边框显示, 默认 true
  border?: boolean
}
~~~

以下为列配置项

~~~js
interface BaseOpts {
  // 当前列文字
  text: string
  // 当前列文字样式, 默认 "24px sans-serif"
  font?: string
  // 当前列文字颜色, 默认 "#333"
  color?: string
  // 当前列文字是否居中, 默认 false
  center?: boolean
  // 当前列自定义宽度, 只有 self 为 false 才起效果
  width?: number
}
~~~