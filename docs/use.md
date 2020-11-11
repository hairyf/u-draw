## use 引入方式使用

### 绘画构建(useDrawPoster)

`useDrawPoster(string|object)`

初始化构建绘制工具，传入查询字符串与配置对象，当配置字符串时，则直接查询该字符串的`canvas`，当配置对象时，`object.selector`则为必选项，以下是`options`的配置项，需要注意的是，返回值为`Promise`，返回绘制构建对象`dp`。

~~~js
/** DrawPoster.build 构建配置 */
interface DrawPosterBuildOpts {
    // 查询字符串(必须), 注意不要写错对应canvas id, 不需要传入#符号
    selector: string;
    // 选取组件范围
    componentThis?: any;
    // 类型为2d绘制, 默认开启, 在微信小程序的时候动态加载
    type2d?: boolean;
    // 是否在绘制的过程中, 显示加载框, 默认关闭
    loading?: boolean,
    // 当存在绘制图片时, 等待绘画完毕的时间（毫秒），仅在App中生效
    drawImageTime?: 100,
    // 加载提示文字
    loadingText?: '绘制海报中...',
    // 创建图片加载提示文字
    createText?: '生成图片中...'
}
~~~

使用方式：

~~~js
import { useDrawPoster } from "uni-draw-poster"
async onReady() {
 const dp = await useDrawPoster("canvas")   
}
~~~


### 多绘画构建(useDrawPosters)

`useDrawPosters(Array<string|object>)`

构建多个绘画工具，传入build函数中参数string | options构成的数组，返回多个绘制工具组成的对象。key为canvasId，value为构建对象。