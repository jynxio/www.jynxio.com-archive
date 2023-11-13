---
typora-root-url: ./..\..\image
---

# Flex 布局

## 概述

Flex 布局的全称为弹性盒布局（FLexible box layout），相较于 Grid 布局，它在处理一维情况时更加简单。

## 启用

令 `display: flex ｜ inline-flex` ，即可激活 Flex 布局。

> `flex` 令容器变成块级元素，`inline-flex` 使容器变成行内块元素。

激活 Flex 布局的元素会变成 Flex 容器（Flex container，即容器），容器的子元素会变成 Flex 项（Flex item，即项），项会参与 Flex 布局，容器还会留在原来的布局模式。另外。项的 `float`、`clear`、`vertical-align` 属性会失效。

## 方向

容器的内部有 2 个方向，分别是主方向和交叉方向，项会沿着主起点到主终点的方向来依次排列，沿着交叉起点到交叉终点的方向来换行，而且我们还可以控制项在主方向和交叉方向上的尺寸和对齐行为。

> 之所以称为交叉方向，是因为交叉方向总是垂直于主方向，即交叉。
>

CSS 规范用主轴（Main axis）和交叉轴（Cross axis）来分别标识主方向和交叉方向，这是一个具有误导性的命名，因为主轴和交叉轴的真正含义应该是「方向」而不是「轴线」，方向上是可以有无数条轴线的。因此，接下来我会使用主方向和交叉方向这 2 个名次来代替主轴和交叉轴。

主方向和交叉方向是由 `flex-direction`、`writing-mode`、`direction` 共同决定的，`writing-mode & direction` 用于设置书写方向和换行方向，`flex-direction` 用于设置如何根据书写方向和换行方向来推导出主方向和交叉方向。

[TODO: 所有组合情况 + 换行 + 在线示例 + 参考 Interactive Review 的首图]

### 主方向和交叉方向

主方向和交叉方向推导自书写方向和换行方向，`flex-direction` 用于设置推导的具体方式，详见「语法小册」的「flex-direction」部分。

### 书写方向和换行方向

`writing-mode` 用于设置书写方向的「横与纵」，即令文本沿着水平或垂直方向来书写，`direction` 用于设置书写方向的「始与终」，即文本在横行或纵列中的书写起点与终点。

[TODO: 6 种组合的示意图]

> `direction` VS `dir`：
>
> 它们两者的作用是几乎相同的，只是前者是 CSS 属性，后者是 HTML 属性，本文为了便于演示，故意忽略掉了 `dir`。实际上，如果我们想要设置整个网页的书写方向，那么我们应该在 `<html>` 上直接应用 `dir` 和 `lang` 属性，，如此做的好处便是“网页在加载之初就确定好了书写方向而不需要等待 CSS 文件”。

## 尺寸

项的尺寸有 2 个维度，分别是主方向上的主尺寸（Main size）和交叉方向上的交叉尺寸（Cross size）。

### 主尺寸的计算

主尺寸的计算是复杂的，下面是其计算步骤：

1. 敲定每个项在主方向上的假设尺寸和间隙大小；
2. 计算所有项在主方向上的总占用大小；
3. 如果项会溢出包含块：
	1. 如果禁止换行：
		1. 如果禁止收缩，那么就直接溢出；
		2. 如果允许收缩，那么就通过缩减假设尺寸来抵消溢出，未能抵消的部分仍会继续溢出；
	2. 如果允许换行：
		1. 换行，如果换行后仍会溢出，则回到 3.1；
		2. 换行，如果换行后未能占满，则回到 4；
4. 如果项未占满包含块：
	1. 如果禁止拉伸，那么就保持假设尺寸；
	2. 如果允许拉伸，那么就通过增加假设尺寸来瓜分冗余空间；

> 包含块是容器的内容盒（Content box）。

### 交叉尺寸的计算

交叉尺寸的计算是简单的，规律如下：

- 如果 `cross-size` 为 `auto`：
	- 如果为 `stretch`，则项将拉伸以填满交叉空间；
	- 如果非 `stretch`，则项的交叉尺寸就等于内容尺寸；
- 如果 `cross-size` 非 `auto`，则项的交叉尺寸就等于 `cross-size`；

> `cross-size` 是我对 `inline-size`、`block-size`、`width`、`height` 的简称。

### 最佳实践

请总是使用 `flex` 的三值语法，而不要使用缩写语法，原因是：缩写语法可能会隐晦的修改 `flex-basis` 的值。

请总是使用 `flex-basis`，而不要使用 `main-size`，原因如下：

| 结果 | 项目                       | 分析                                                         |
| ---- | -------------------------- | ------------------------------------------------------------ |
| ✅    | `flex-basis`               | 总是指向主方向                                               |
| ❌    | `inline-size | block-size` | 不总是指向主方向，因为遵循逻辑方向，而逻辑方向因受书写方向和换行方向影响而复杂多变 |
| ❌    | `width | height`           | 不总是指向主方向，因为遵循物理方向，物理方向是不灵活的       |

> 其实还有一个原因，`main-size` 可以诡异的突破项内建的最小主尺寸，我想避免诡异的事情。

### 假设尺寸

假设尺寸（Hypothetical size）特指项在主方向上的假设尺寸，它由 `flex-basis` 或 `main-size` 设置，它会受到 `box-sizeing` 的影响，即如果 `box-sizeing: content-box`，则假设尺寸作用于内容盒，如果 `box-sizeing: border-box`，则假设尺寸作用于边框盒。

`flex-basis` 和 `main-size` 是互相冲突的，其关系如下：

- 如果 `flex-basis` 为 `auto`：
	- 如果 `main-size` 为 `auto`，则取 `flex-basis: content`；
	- 如果 `main-size` 非 `auto`，则取 `main-size`；
- 如果 `flex-basis` 非 `auto`，则取 `flex-basis`；

> `main-size` 是我对 `inline-size`、`block-size`、`width`、`height` 的简称。

### TODO

CSS 规范把多余的空间被称为「positive free space」(正可用空间)，把溢出的空间被称为「negative free space」（负可用空间），计算公式为：

```
正/负可用空间 = 包含块主尺寸 - ( 项的假设尺寸之和 + 项的外边距之和 + 项的间隙之和 )
```

### 极限尺寸

`min-inline-size | min-block-size` 和 `max-inline-size | max-block-size` 可以设置 flex 项的极限尺寸。

在流式布局中，元素的 `min-inline-size | min-block-size` 的默认值是 `0`。可是在 flex 布局中，flex 项的 `min-inline-size | min-block-size` 的默认值是 `auto`，这导致了以下两种 flex 项将会具有内建的最小主尺寸：

- 如果为 `<input type="text" />`，那么最小主尺寸约为 `170 ~ 200px`，具体值取决于浏览器的实现，且该值无法被控制台发现；
- 如果含有文本，那么最小主尺寸是 `min-content`；

这导致了 `flex-basis` 和 `flex-shrink` 无法突破 `min-content`，除非为其指定一个新的最小主尺寸，比如 `min-inline-size: 0`。

TODO：一个以“Awesome”为内容的 flex 项的例子

诡异的是，`inline-size | block-size` 可以直接突破内建的最小主尺寸。更诡异的是，如果 `inline-size | block-size` 小于内建的最小主尺寸，那么该属性就能够覆盖 `flex-basis` 🤯，所以请不要使用 `inline-size | block-size`。

TODO：一个以“Awesome”为内容的 flex 项的例子

### 拉伸规律

TODO

TODO

TODO

TODO

TODO

TODO

TODO

TODO: 斜线标记 grow 空间 | 图中写明“拉伸规律” | 含有 margin | 含有 gap | 「I think it'll be easier to explain visually. Try incrementing/decremen」的例子

注意：

- flex 项的自动外边距会吞掉所有的正可用空间，导致正可用空间归零，于是便不会再发生拉伸了（自动外边距也被用作为对齐技巧，详见下文的「对齐」小节）；
- 如果想让 flex 项的主轴尺寸完全相等，那么请设置 `flex-basis: 0; flex-grow: 1` ，这意味着所有的主轴空间都会变成正可用空间，并被 flex 项均分；

### 收缩规律

```
flex-shrink: <number>
```

TODO: 斜线标记 shrink 空间 | flex-shrink 会以 flex-basis 为系数来尺寸 | 图中写明“收缩规律” | 含有 margin | 含有 gap | 「**Let's test it.** Try shrinking the container to see wha」的例子

TODO：疑问 - flex 项的收缩极限时 `min-content`

> 之所以会考虑 `flex-basis`，是为了尽可能的维持 flex 项之间的（假设）尺寸比例。

## 对齐

flex 项在主轴和交叉轴方向上的对齐方式是可设置的，不过仅当轴上有正可用空间时，设置才会有视觉效果。

### 主轴对齐

`justify-content` 用于设置主轴上的对齐方式。

| justify-content | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `normal`        | 等价于 `flex-start`                                          |
| `start`         | 如果 `flex-direction: row | row-reverse`，则紧贴 `flex-direction: row` 时的主起点；如果 `flex-direction: column | column-reverse`，则紧贴 `flex-direction: column` 时的主起点 |
| `end`           | 如果 `flex-direction: row |row-reverse`，则紧贴 `flex-direction: row` 时的主终点；如果 `flex-direction: column |column-reverse`，则紧贴 `flex-direction: column` 时的主终点 |
| `left`          | 如果主轴水平，则紧贴物理左侧                                 |
| `right`         | 如果主轴水平，则紧贴物理右侧                                 |
| `center`        | 居中                                                         |
| `flex-start`    | 紧贴主起点                                                   |
| `flex-end`      | 紧贴主终点                                                   |
| `stretch`       | 等价于 `flex-start`                                          |
| `space-between` | 两端的项紧贴边缘，项之间间隔相等                             |
| `space-around`  | 两端的项距离边缘 1 个单位，项之间间隔 2 个单位               |
| `space-evenly`  | 项与边缘的间隔和项之间的间隔皆相等                           |
| `safe *`        | ？                                                           |
| `unsafe *`      | ？                                                           |

### 交叉轴对齐

`align-items`、`align-content`、`align-self` 都可以设置交叉轴上的对齐方式，区别在于：

| 名称            | 作用域 | 作用                                   |
| --------------- | ------ | -------------------------------------- |
| `align-items`   | 容器   | 设置所有项在自己的交叉空间上的对齐方式 |
| `align-content` | 容器   | 设置所有项在整个交叉空间上的对齐方式   |
| `align-self`    | 项     | 设置一个项在自己的交叉空间上的对齐方式 |

TODO: 区别图

关于文字基线，请看 [这里](https://en.wikipedia.org/wiki/Baseline_(typography))。

`baseline` 值具有穿透性，具体来说，flex 项内的元素也会参与基线对齐。

| align-items      | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| `normal`         | 等价于 `stretch`                                             |
| `stretch`        | 如果交叉尺寸为 `auto`，则自动填满交叉空间，否则采用交叉尺寸  |
| `flex-start`     | 紧贴交叉起点                                                 |
| `flex-end`       | 紧贴交叉终点                                                 |
| `center`         | 居中                                                         |
| `baseline`       | 等价于 `first baseline`                                      |
| `first baseline` | 令所有项的首行文本的基线互相对齐                             |
| `last baseline`  | 令所有项的末行文本的基线互相对齐                             |
| `start`          | 等价于 `flex-start`                                          |
| `end`            | 等价于 `flex-end`                                            |
| `self-start`     | 其受项自身的 `writing-mode` 与 `direction` 的影响，具体影响不确定 |
| `self-end`       | 其受项自身的 `writing-mode` 与 `direction` 的影响，具体影响不确定 |
| `safe *`         | ？                                                           |
| `unsafe *`       | ？                                                           |

`align-content` 的作用类似于 `justify-content`，并且仅当 `flex-wrap: wrap | wrap-reverse`时，`align-content` 才会生效。如果 `align-content: normal`，那么 `align-items` 生效，否则 `align-items` 将会被 `align-content` 遮蔽（TODO：baseline 不会被遮蔽）。

要使 `align-content` 生效，那么容器的高度也要高于所有项目的总高度。

| align-content    | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| `normal`         | `align-content` 不生效，`align-items` 生效                   |
| `stretch`        | 等价于 `align-items` 的 `stretch`                            |
| `flex-start`     | 等价于 `justify-content` 的 `flex-start`                     |
| `flex-end`       | 等价于 `justify-content` 的 `flex-end`                       |
| `center`         | 等价于 `justify-content` 的 `center`                         |
| `baseline`       | 等价于 `justify-content` 的 `flex-start` 和 `align-items` 的 `baseline` 的结合 |
| `first baseline` | 等价于 `baseline`                                            |
| `last baseline`  | 无效属性值                                                   |
| `start`          | 等价于 `flex-start`                                          |
| `end`            | 等价于 `flex-end`                                            |
| `space-between`  | 等价于 `justify-content` 的 `space-between`                  |
| `space-around`   | 等价于 `justify-content` 的 `space-around`                   |
| `space-evenly`   | 等价于 `justify-content` 的 `space-evenly`                   |
| `safe *`         | ？                                                           |
| `unsafe *`       | ？                                                           |

`align-self` 是属于 flex 项的 CSS 属性，它会覆盖 `align-items` 为其指定的对齐方式，它的取值及值的作用和 `align-items` 的值一模一样，区别在于它还有一个额外的 `auto` 值，该值的作用是令其采纳 `align-items` 为其指定的对齐方式。

陷阱：If a flexbox item's cross-axis margin is `auto`, then `align-self` is ignored.

陷阱：align-self: flex-start 似乎有 fit-content 的效果

陷阱：似乎只要设置 align-*，相应的元素就会自动 fit-content！快验证一下！

### content 和 items 的术语之差

items 的控制粒度是一个 flex 项，它用于设置每一个 flex 项在自己的独立空间中的对齐方式，相邻的项与项之间是互不影响的。content 的控制粒度是一群 flex 项，它用于设置一群 flex 项和一群 flex 项之间在整个空间中的对齐方式，一群项和一群项之间的对齐是互相影响的。

### 自动外边距技巧

`margin: auto` 可以帮助 flex 项吃掉主轴方向上的多余空间，但是没法吃掉交叉轴方向上的多余空间，这个可以用来做一些特别的布局。

TODO: logo 和导航分居两侧的对齐案例

## 间隙

`gap` 是 `row-gap` 和 `column-gap` 的缩写，当 `flex-wrap: wrap | wrap-reverse` 时，`column-gap` 就会有效。

## 换行

“flex 布局是一维布局，一旦换行之后，那么每一行都相当于一个新的 flex 容器，行与行之间的 flex 项不会彼此影响，grid 项则不然。比如，它没有办法让下一行的项和上一行的项对齐，所以它是单维布局。”

「Wrapping」的第一个交互示例很棒！

这节课的练习作业说明了一件事情：如果换行了，那么就会有多条主轴！

> flex-wrap 被用于双维度布局，但事实上，此时我们应该使用 Grid 布局，后者更棒。

换行的方向是怎么确定的呢？

`flex-wrap: wrap` 之后，子项就不会被缩小，而是当空间不足时就直接换行。当然，如果独占一行时空间还不够假设空间的话，那么就会缩小。

## 顺序

flex 容器会按照 order 的升序和自己的方向来排序子项，如果 order 相同，则按照 dom顺序来排序，默认情况下，大家的 order 都是 0。

order 只是改变了子项在视觉上的布局顺序，但是没有改变子项在 dom 中的顺序，因此对于 tab 聚焦这种事情来说，它可能会造成可访问性的障碍。

## 重叠

flex 和 grid 布局都支持 z-index，当子项发生重叠时（用 margin 来实现重叠），z-index 大者获胜。

## visibility 属性

在 flex 项上应用 `visibility: collapse` 等价于为该项应用 `display: none`，不过 Chrome 和 Safari 仍有 [bug](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Mastering_wrapping_of_flex_items#collapsed_items)，该 bug 导致它们将 `visibility: collapse` 解析为 `visibility: hidden`，Firefox 则可以正确解析 `visibility: collapse` 的行为。

## 布局冲突

通常，元素只能采用一种布局模式，如果我们尝试为元素赋予多种布局模式，那么元素最后也只会采用其中的一种。具体来说，如果一个元素被同时赋予了定位布局和其他布局，那么元素就总是会采用定位布局，然后忽略另一种布局。

比如，下例中的 `<div>` 会采用定位布局而不是 flex 布局。最后，对于 `<section>` 而言，它会忽略掉 `<div`，对于 `<div>` 而言，它会忽略掉其他的 flex 项（此行为对 `<div>` 的初始位置的计算会有影响）。

```html
<!-- 原始代码 -->
<section style="display: flex">
	<aside></aside>
    <div style="position: fixed"></div>
	<aside></aside>
</section>

<!-- section视角 -->
<section style="display: flex">
	<aside></aside>
    <aside></aside>
</section>

<!-- div视角 -->
<section style="display: flex">
    <div style="position: fixed"></div>
</section>
```

例外的是，flex 布局可以和相对定位布局稳定的共存，也可以和沾滞定位布局不稳定的共存。比如只要为 flex 项激活相对定位布局，那么就可以直接使用相对定位布局的所有特性了，比如使用 `inset` 来偏移元素的位置，就像下例那样。不过，请不要为 flex 项激活沾滞定位布局，因为这两种布局不能稳定的共存，它们结合之后会触发一些难以理解的行为。

```html
<section style="display: flex">
	<aside></aside>
    <div style="position: relative; top: 1rem; left: 1rem"></div>
    <aside></aside>
</section>
```

## 可用性障碍

`flex-direction: row-reverse | column-reverse` 和 `order` 可以在视觉上改变元素的渲染顺序，有时候这会造成一些可用性上的障碍，因为屏幕阅读器和 Tab 键等辅助设备仍然会遵循 DOM 顺序来聚焦元素。

如下例所示，Tab 键会从右向左聚焦元素，屏幕阅读器会从右向左阅读内容，这会让人感得困惑。

```html
<ul>
    <li>Josh</li>
    <li>John</li>
    <li>Sam</li>
</ul>

<style>
    ul {
        display: flex;
        flex-direction: row-reverse;
    }
</style>
```

## 语法小册

| 容器属性          | 项属性        |
| ----------------- | ------------- |
| `flex-direction`  | `flex-basis`  |
| `justify-content` | `flex-grow`   |
| `align-content`   | `flex-shrink` |
| `align-items`     | `align-self`  |
| `gap`             |               |

### writing-mode

| 值              | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `horizontal-tb` | 文本沿着水平方向书写，沿着从上（`t`）到下（`b`）的方向换行   |
| `vertical-lr`   | 文本沿着垂直方向书写，沿着从左（`l`）到右（`r`）的方向换行   |
| `vertical-rl`   | 文本沿着垂直方向书写，沿着从右（`r`）到左（`l`）的方向换行   |
| `sideways-lr`   | 略，因为 [除了 Firefox 之外，没有任何浏览器实现该特性](https://caniuse.com/mdn-css_properties_writing-mode_sideways_values) |
| `sideways-rl`   | 略，因为 [除了 Firefox 之外，没有任何浏览器实现该特性](https://caniuse.com/mdn-css_properties_writing-mode_sideways_values) |

### direction

| 值    | 描述                                                         |
| ----- | ------------------------------------------------------------ |
| `ltr` | 对于横行模式，文本沿着从左（始）到右（终）的方向书写；对于纵列模式，文本沿着从上（始）到下（终）的方向书写； |
| `rtl` | 与 `ltr` 相反                                                |

### flex-direction

| 值               | 描述                                             |
| ---------------- | ------------------------------------------------ |
| `row`            | 主轴方向与书写方向相同，交叉轴方向与换行方向相同 |
| `column`         | 主轴方向与换行方向相同，交叉轴方向与书写方向相同 |
| `row-reverse`    | 主轴方向与书写方向相反，交叉轴方向与换行方向相同 |
| `column-reverse` | 主轴方向与换行方向相反，交叉轴方向与书写方向相同 |

### flex-basis

| 值             | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `auto`         | 若 `main-size` 非 `auto`，则采用 `main-size`，否则采用 `flex-basis: content` |
| `content`      | 等价于 `max-content`                                         |
| `min-content`  | 采用元素的最小尺寸。对于文本而言，将会通过换行来缩减宽度，最终宽度即是最长单词的宽度，比如假设元素内容为“A title for an awesome”，元素宽度即是“awesome”的宽度 |
| `max-content`  | 采用元素的最大尺寸。对于文本而言，最终宽度即是文本不换行时的宽度，比如假设元素内容为“A title for an awesome”，元素宽度即是“A title for an awesome”的宽度 |
| `fit-content`  | 如果可用空间大于 `max-content`，则采用 `max-content`；如果可用空间小于 `min-content`，则采用 `min-content`；否则就采用可用空间的尺寸 |
| `<length>`     | 绝对值，如 `10em`                                            |
| `<percentage>` | 百分比值，如 `10%`（flex 项的包含块是 flex 容器的 content box） |

### flex-grow

| 值         | 描述   |
| ---------- | ------ |
| `<number>` | 正数值 |



## 参考资料

https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
