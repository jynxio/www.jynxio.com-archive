---
typora-root-url: ./..\..\image
---

# 流式布局

## 概述

布局是指如何排列布置 HTML 元素的大小与位置。流式布局（flow layout）是浏览器默认的布局方式，它就像微软的 Word 软件，从上到下的堆叠段落，从左到右的排列文本。

> 准确的说法是“在 block 方向上排列段落，在 inline 方向上排列文本”，而 block 方向和 inline 方向具体为何则取决于文档的 `writing-mode` 属性。
>
> 为方便写作，本文假设文档的 `writing-mode` 为 `horizontal-tb`，且使用的语种为汉语。

流式布局将元素分成了 3 种，然后根据元素的类型来决定如何排布它们，这 3 种元素分别是：block 元素、inline 元素、inline-block 元素，请通过阅读下文来了解它们的细节。

每种 HTML 元素都被分配了默认类型，我们可以通过 `display` 属性来查看元素的类型，比如 `section` 元素的默认类型是 `block`，`kbd` 元素的默认类型是 `inline`。我们也可以通过修改元素的 `display` 属性来更改他们的类型。

## Block 元素

在流式布局中，每个 block 元素都会独占一行，哪怕该 block 元素的内容的实际水平尺寸很小，哪怕该 block 元素使用了 `inline-size: fit-content`。总而言之，所有 block 元素将会从上到下的依次堆叠。

> `fit-content` 是介于 `min-content` 和 `max-content` 之间的万金油。

![block 元素总是独占一行](/css/flow-layout/block-element.png)

## Inline 元素

inline 元素总是被包裹在 block 元素的内部以充当 block 元素的内容，作为内容，inline 元素会从左到右依次排列，并在达到容器的水平尺寸极限时自动换行。

![block 元素总是独占一行](/css/flow-layout/inline-element.png)

另外，规范还规定了下述这些 CSS 属性对 inline 元素是无效的：

- `inline-size`
- `block-size`
- `margin-block`
- `padding-block`
- `float`
- `text-align`

> `margin-inline` 和 `padding-inline` 是可用的。

## Inline-block 元素

inline-block 元素会从左到右依次排列，这表现得就像 inline 元素一样。同时 inline 元素也可以使用 block 元素的所有属性，这表现得就像 block 元素一样。

不过需要小心的是，inline-block 元素和 inline 元素的换行行为是不同的。当需要换行的时候，inline-block 元素会另起一行，如下图所示。其中，inline 元素的换行行为才是合理的。

![inline-block 元素的换行机制](/css/flow-layout/inline-block-element.png)

## Replaced 元素

replaced 元素是一种用于展示外部内容的元素，它就像是一个容器，外部资源嵌入到这个容器的内部然后被展示出来。replaced 元素表现得就像 inline-block 元素。replaced 元素有：

- `<iframe>`
- `<video>`
- `<embed>`
- `<img>`
- `<input type="image">`
- 作为 `select` 的子元素时的 `<option>`
- 激活了 `controls` 属性的 `<audio>`
- 设置了 `width` 和 `height` 属性的 `<canvas>`
- 设置了 `data` 属性的 `<object>`

> 由于大多数浏览器都会默认将 `<canvas>` 的宽度设置为 300 像素，高度设置为 150 像素，因此在这些浏览器中，`<canvas>` 就是默认的 replaced 元素。

### 多余的空白

如果你将 replaced 元素插入到一个 block 元素中，那么你就会发现 block 元素的底部会出现多余的空白，就像下图这样。消灭它的方法有 2 个：

- 将 replaced 元素的 `display` 设置为 `block`；
- 将容器元素的 `line-height` 设置为 `0`；

![意料之外的空白](/css/flow-layout/unexpected-space.png)
