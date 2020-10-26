## 项目规范说明

项目采用`luch-request`，`scss`，`uniapp`，`vuex` 等主体技术进行开发
项目要求组件化开发，结构化，清晰化项目结构。 请遵循代码中所定义的规范进行开发

### CSS 预编辑器规范

- 所有字体字号，主题色号不允许在单独组件使用，只允许使用src/style中存在的变量/集合。
- 将嵌套深度限制在2级。对于超过3级的嵌套，给予重新评估。这可以避免出现过于详实的CSS选择器
- 避免大量的嵌套规则。当可读性受到影响时，将之打断。推荐避免出现多于20行的嵌套规则出现
- 少用#，少用*，少用标签选择器
- 尽量避免使用 !important

### CSS 属性书写顺序

- 建议遵循以下顺序

1. 布局定位属性：`display / position / float / clear / visibility / overflow`
2. 自身属性：`width / height / margin / padding / border / background`
3. 文本属性：`color / font / text-decoration / text-align / vertical-align / white- space / break-word`
4. 其他属性（CSS3）：`content / cursor / border-radius / box-shadow / text-shadow / background:linear-gradient …`

### class 标签命名

- 尽量采用-分开关键字命名
- 英文单词尽量不要缩写

### js 规范

- 采用模块化编程，通过`ES6`语法暴露 `-> export`
- 重复代码进行封装为方法，减少代码臃肿，让代码清晰明了
- 减少代码圈复杂度，减少代码嵌套，善于`return`，少用`else`
- 函数与变量命名采用驼峰命名法 `-> userInfo or getUserInfo`
- 常量(不会再次进行修改)命名采用大写加下划线命名 `-> USER_STATUS`

### vuex 规范

- 规范定义mutations-type常量命名

~~~markdown
# 常量前缀采用动词, 后缀为对应的数据名称
- export const RECEIVE_[DATA_NAME] = 'receive_[data_name]' ->  接收并覆盖某个数据
- export const MODIFY_[DATA_NAME] = 'modify_[data_name]' ->  修改某个数据或数据项
- export const DELETE_[DATA_NAME] = 'delete_[data_name]' -> 删除某个数据或数据项
- export const UNSHIFT_[DATA_NAME_ITEM] = 'unshift_[data_name_item]' -> 向某个数据前端添加一项数据
- export const PUSH_[DATA_NAME_ITEM] = 'push_[data_name_item]' -> 向某个数据后端添加一项数据
~~~

- vuex保持数据精简, 必要时可先存storage, 必要小程序的性能消耗过大

## 项目构建命令清单

``` bash
# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```