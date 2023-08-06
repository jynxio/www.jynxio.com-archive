---
typora-root-url: ./..\..\image
---

# 外边距

## 概述

`margin` 是盒子模型的外边距，它真正的作用是**调整元素的行内尺寸**和**调整元素之间的间隙**。并且它还有很多怪异的行为和花哨的技巧。

## 元素间隙

对于一个拥有固定宽高的元素，`margin` 可以调整它与相邻元素之间的间隙，有时是通过移动它自己来实现的，有时则是通过移动相邻元素来实现的，具体来说：

- `margin-inline-start` 和 `margin-block-start` 会移动当前元素；
- `margin-inline-end` 和 `margin-block-end` 会移动相邻元素；

![调整元素的 block 间隙](/css/margin/adjust-block-gap.png)

![调整元素的 inline 间隙](/css/margin/adjust-inline-gap.png)

## 行内尺寸

对于一个 `width: auto` 的块元素，`margin-inline` 可以调整它的行内尺寸。

> 这也适用于 `width: 100%` 的 `flex` 子元素。

![调整元素的 inline 尺寸](/css/margin/adjust-inline-size.png)

## 行内居中

对于一个拥有固定 `inline-size` 的元素，`margin-inline: auto` 可以令元素在 `inline` 方向上居中。

![inline 居中](/css/margin/inline-center.png)

## 边距折叠

在流动布局中，如果处于同一块格式上下文中的两个块元素的 `block` 方向上的外边距相接触了，那么这两个外边距就会发生融合，我们把这种现象称为「边距折叠」。边距折叠又分为「相邻折叠」和「内嵌折叠」两种。

行内元素、行内块元素、浮动元素、绝对定位元素、根元素、`overflow` 值为非 `visibility` 的元素都不会产生这种现象。

相邻折叠的规律：

- 如果两个外边距都不小于零，那么最终的外边距就等于两者中的最大值；
- 如果两个外边距都不大于零，那么最终的外边距就等于两者中的最小值；
- 如果一个外边距不大于零，另一个外边距不小于零，那么最终的外边距就等于两者的代数和；

![相邻折叠](/css/margin/neighbor-collapsing.png)

> 兄弟元素之间可以发生相邻折叠，非兄弟元素之间也可以发生相邻折叠。

父子折叠的规律：

- 如果父元素和子元素的外边距都不小于零，那么父元素的外边距就会等于两者中的最大值，子元素的外边距总是会等于零；
- 如果父元素和子元素的外边距都不大于零，那么父元素的外边距就会等于两者中的最小值，子元素的外边距总是会等于零；
- 如果一个外边距不大于零，另一个外边距不小于零，那么父元素的外边距就会等于两者的代数和，子元素的外边距总是会等于零；

![父子折叠](/css/margin/parent-child-collapsing.png)





When margin-collapse was added to the CSS specification, the language designers made a curious choice: horizontal margins (`margin-left` and `margin-right`) shouldn't collapse.

So that's our first rule: *only vertical margins collapse.*So our first rule is a bit of a misnomer; it would be more accurate to say that only *block-direction margins collapse*.

## Margins only collapse in Flow layout

## Nesting doesn't prevent collapsing

Alright, here's where it starts to get weird. Consider the following code: