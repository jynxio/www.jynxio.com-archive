# 选择器

## 基础选择器

| 名称       | 示例         |
| ---------- | ------------ |
| 通用选择器 | `*`          |
| 元素选择器 | `html`       |
| 类选择器   | `.classname` |
| id 选择器  | `#id`        |
| 属性选择器 | `a[href]`    |

请从 [这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors) 查看所有属性选择器。

## 组合选择器

| 名称           | 示例        |
| -------------- | ----------- |
| 后代组合器     | `p a`       |
| 紧邻后代组合器 | `p > a`     |
| 兄弟组合器     | `p ~ a`     |
| 紧邻兄弟组合器 | `p + a`     |
| 列组合器       | `col || td` |

请从 [这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors#%E7%BB%84%E5%90%88%E5%99%A8%EF%BC%88combinators%EF%BC%89) 查看它们的具体用法。

## 伪类选择器

伪类（pseudo-classes）选择器用于匹配处于特定状态下的元素，请从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 查看所有的伪类选择器。此文仅描述几个常用、重要、隐晦的伪类选择器。

### :focus

`:focus` 用于匹配获得焦点的元素，用户可以通过点击、触击、tab 键来聚焦一个元素，其中 `tab` 可以聚焦下一个元素，`shift+tab` 可以聚焦上一个元素。

另外，只有锚、按钮、表单元素才能获得焦点。

另外，聚焦的触发条件取决于 2 个因素：操作系统、浏览器，具体来说：

- 对于大多数操作系统上的浏览器，用户可以通过点击、触击来聚焦元素，用户可以使用 `tab` 来聚焦下一个元素，使用 `shift+tab` 来聚焦上一个元素；
- 对于 MacOS 的Safari：
  - 用户无法通过点击、触击来聚焦元素，这是一个众所周知的 bug；
  - `tab` 和 `shift+tab` 只能聚焦表单元素，无法聚焦锚、按钮元素；
  - `option+tab` 和 `option+shift+tab` 可以聚焦锚、按钮、表单元素；
- 对于 MacOS 的某些版本 Firefox，`tab` 和 `shift+tab` 只能聚焦按钮、表单元素。

> 如果你想要 Safari 和 Firefox 的行为变正常，那么你就需要更改 MacOS 的系统设置，这是 [操作指南](https://www.scottohara.me/blog/2014/10/03/link-tabbing-firefox-osx.html)。

### :checked

`:checked` 用于匹配处于勾选状态下的元素，需要注意的是，只有 `<input type="radio"/>` 和 `<input type="checkbox"/>` 才能被勾选。

## 伪元素选择器

伪元素（pseudo-elements）选择器用于匹配无法被 HTML 语义所表达的元素实体，请从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) 查看所有的伪元素选择器。

不同于伪类选择器，一个选择器只能使用一个伪元素，且伪元素必须紧跟在基础选择器之后（比如 `p::first-line`）。

> 根据规范，伪元素选择器使用双冒号语法，伪类选择器使用单冒号语法，这是为了区分两者。不过，由于早期的 W3C 没有出台这项规定，所以一些早期的伪元素选择器也支持单冒号语法。

### ::before & ::after

`::before` 和 `::after` 是一种创建 `<span>` 的语法糖，因为其工作原理是：在元素内部的首尾创建一个 `<span>`，然后将 `content` 属性的值作为 `<span>` 的内容。

一种良好的实践是，只用 `::before` 和 `::after` 来渲染装饰性内容（即令 `content: ""`）。主要原因是：有些屏幕阅读器会阅读它们的 `content`，而有些则不会，`content: ""` 有利于网页的可访问性。