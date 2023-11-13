---
typora-root-url: ./..\..\image
---

# Flex 布局

## 概述

flex 布局（flexible box layout）是一种弹性布局。相较于 grid 布局，flex 布局在处理一维布局的时候更加简单。

## 启用

如果元素为 `display: flex | inline-flex`，那么元素就会变成 flex 容器（flex container），子元素就会变成 flex 项（flex item），然后 flex 容器的内部将会激活 flex 布局，flex 项们都会参加进这个 flex 布局，不过 flex 容器还会留在原来的布局模式之中。

`display: flex` 和 `display: inline-flex` 的区别在于，前者会使 flex 容器成为块级元素（block-level element），后者会使 flex 容器成为行内块元素（inline-block element），除此之外，便再无其他区别了。

另外，flex 项的 `float`、`clear`、`vertical-align` 属性会失效。

## 语法

| 用于 flex 容器    | 用于 flex 项  |
| ----------------- | ------------- |
| `flex-direction`  | `flex-basis`  |
| `justify-content` | `flex-grow`   |
| `align-content`   | `flex-shrink` |
| `align-items`     | `align-self`  |
| `gap`             |               |

## 方向

flex 布局有一条主轴（main axis）和一条交叉轴（cross axis），主轴和交叉轴总是互相垂直。flex 项沿着主起点（main start）到主终点（main end）的方向来排列，flex 项沿着交叉起点（cross start）到交叉终点（cross end）的方向来换行。

实际上，主轴和交叉轴的方向是由 `writing-mode`、`direction`、`flex-direction` 共 3 个属性一起决定的。

[TODO: 所有组合情况 + 多条主轴]

### direction 与 writing-mode

`direction`  设置书写方向的「始与终」，`writing-mode` 设置书写方向的「横与纵」以及换行方向，「横与纵」是指文本沿着水平或垂直方向来书写，「始与终」是指文本在横行或纵列中的书写起点与终点。

| writing-mode    | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `horizontal-tb` | 文本沿着水平方向书写，沿着从上（`t`）到下（`b`）的方向换行   |
| `vertical-lr`   | 文本沿着垂直方向书写，沿着从左（`l`）到右（`r`）的方向换行   |
| `vertical-rl`   | 文本沿着垂直方向书写，沿着从右（`r`）到左（`l`）的方向换行   |
| `sideways-lr`   | 略，因为 [除了 Firefox 之外，没有任何浏览器实现该特性](https://caniuse.com/mdn-css_properties_writing-mode_sideways_values) |
| `sideways-rl`   | 略，因为 [除了 Firefox 之外，没有任何浏览器实现该特性](https://caniuse.com/mdn-css_properties_writing-mode_sideways_values) |

| direction | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| `ltr`     | 对于横行模式，文本沿着从左（始）到右（终）的方向书写；对于纵列模式，文本沿着从上（始）到下（终）的方向书写； |
| `rtl`     | 与 `ltr` 相反                                                |

> direction 和 dir 的区别：
>
> `direction` 是 CSS 属性，`dir` 是 HTML 属性，它们的作用是几乎相同的，为了便于演示，本文故意忽略了 `dir` 属性。
>
> 实际上，如果我们想要设置整个网页的书写方向，那么我们应该在 `<html>` 上直接应用 `dir` 和 `lang` 属性，如此做的好处便是“网页在加载之初就确定好了书写方向而不需要等待 CSS 文件”。

TODO: direction 和 writing-mode 的 6 种情况的图

### flex-direction

| flex-direction   | 描述                                             |
| ---------------- | ------------------------------------------------ |
| `row`            | 主轴方向与书写方向相同，交叉轴方向与换行方向相同 |
| `row-reverse`    | 主轴方向与书写方向相反，交叉轴方向与换行方向相同 |
| `column`         | 主轴方向与换行方向相同，交叉轴方向与书写方向相同 |
| `column-reverse` | 主轴方向与换行方向相反，交叉轴方向与书写方向相同 |

TODO：补图或代码，参考「Interactive Review」中的首图

## 尺寸

flex 项在主轴方向和交叉轴方向上分别有 2 个尺寸，分别是主尺寸（main size）和交叉尺寸（cross size）。

主尺寸的计算方式相对曲折，具体来说：首先设置主轴方向上的假设尺寸（hypothetical size），然后如果 flex 项会溢出包含块，那么就削减自身的假设尺寸来抵消溢出，反之就瓜分多余的空间来填满空余，最后才得到主尺寸。

CSS 规范把多余的空间被称为「positive free space」(正可用空间)，把溢出的空间被称为「negative free space」（负可用空间），计算公式为：

```
正/负可用空间 = 包含块主尺寸 - ( 项的假设尺寸之和 + 项的外边距之和 + 项的间隙之和 )
```

> 其中，flex 项的包含块是 flex 容器的 content box。

交叉尺寸的计算方式相对直白，具体来说：直接通过 `inline-size` 或 `block-size` 来设置，或被 `align-items: stretch` 拉伸至填满交叉轴空间，如果两种方式发生冲突时，那么取前者。

### 最佳实践

1. 总是使用 `flex` 的三值语法；
2. 总是使用 `flex-basis`，不要使用 `inline-size | block-size` 或 `width | height`；

关于第一点：`flex` 的单值或双值语法会暗地里篡改 `flex-basis` 的默认值。

关于第二点：`flex-basis` 的方向总是等于主轴方向，这很简洁。相比之下，逻辑方向会在 `dir`、`writing-mode`、`flex-direction` 多变时变得非常烧脑，而且物理方向又过于死板。另外，逻辑方向尺寸和物理方向尺寸都可以诡异的突破内建的最小主尺寸（详见「极限尺寸」小节），我想避免这些诡异的事情。

### 假设尺寸

`flex-basis`、`inline-size | block-size` 都可以设置假设尺寸。

> 如果 `box-sizing: content-box`，那么 `flex-basis` 设置 content box 的主尺寸；如果 `box-sizing: border-box`，那么 `flex-basis` 设置 border box 的主尺寸。

- 如果同时设置了两者，那么取 `flex-basis` 的值；
- 如果 `flex-basis: auto`，那么取 `inline-size | block-size` 的值；
- 如果 `flex-basis: auto` 且 `inline-size | block-size: auto`，那么取 `flex-basis: content`；

| flex-basis     | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `auto`         | 等价于 `inline-size` 或 `block-size` 的值                    |
| `content`      | 等价于 `max-content`                                         |
| `max-content`  | 表示元素内容的最大宽度，对于文本内容而言，最终宽度就等于文本不换行时的宽度，比如对于“A title for an awesome”而言，最终宽度就等于“A title for an awesome”的宽度 |
| `min-content`  | 表示元素内容的最小宽度，对于文本内容而言，将会通过换行来缩减宽度，最终宽度将会等于最长单词的宽度。比如对于“A title for an awesome”而言，最终宽度将会等于“awesome”的宽度 |
| `fit-content`  | 如果当前的可用空间大于 `max-content`，那么就等价于 `max-content`；如果当前空间小于 `min-content`，那么就等价于 `min-content`；否则就等于可用空间 |
| `<length>`     | 绝对值，如 `10em`                                            |
| `<percentage>` | 百分比值，如 `10%`（flex 项的包含块是 flex 容器的 content box） |

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

```
flex-grow: <number>
```

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

## 参考资料

https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
