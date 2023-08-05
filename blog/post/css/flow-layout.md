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

### 百分比高度陷阱

在流式布局中，block 元素的默认高度（即 `block-size: auto`）的计算策略是「尽可能地收缩以便于刚好容纳下子元素」，就像是真空包装那样。

可见，block 元素的默认高度是根据子元素的尺寸来推算的，这意味着“如果我们给一个 `block-size` 为 `auto` 的 block 元素的子元素设置百分比高度，那么该设置就会不生效”。因为在该场景中，父元素和子元素都需要根据彼此的高度来推算出自己的高度，布局引擎显然无法处理这种循环引用，最后唯有忽略掉子元素的百分比高度，这便是「百分比高度陷阱」。

如何解决这个问题？我的方案是为最外层的 block 元素指定一个明确的高度值，即：

```css
html, body {
    min-block-size: 100%;
}
```

此时 html 元素的最小高度为视口高度，body 元素的最小高度等于 html 元素的高度。

> 不要使用 `100vh` 来替代 `100%`，因为这会在移动端浏览器发生故障。
>
> 具体来说，Safari 和 Chrome 浏览器会在用户下滑时隐藏掉底栏和顶栏，在用户上滑时显示出底栏和顶栏，由于底栏和顶栏并不属于视口，所以 `1vh` 的大小就会随着用户的上滑和下滑操作而频繁改变，如果某些元素使用了 `vh` 单位，那么该元素就会随着 `vh` 的频繁改变而发生闪烁。Safari 和 Chrome 浏览器为了避免闪烁问题，便决定始终采用隐藏掉底栏和顶栏时的 `vh` 值来作为最终的 `vh` 值。
>
> 这便意味着当底栏和顶栏消失时，`100vh` 会大于实际的视口高度。由于浏览器在首次加载网页后通常都会展示底栏和顶栏，于是如果你采用了 `min-block-size: 100vh`，那么就会导致网页在首次加载时就出现垂直滑动条，哪怕网页内容的实际高度很小。显然，这是 bug。
>
> 另外，`min-block-size: 100dvh` 也是完全正确的方案，它的效果和 `min-block-size: 100%` 是一样的，只不过 IE 完全不支持 `dvh` 单位，详见 [这里](https://caniuse.com/?search=types%3A%20dvh)。

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

相比于普通的元素，replaced 元素更加强调「展示外部资源」，外部资源才是该类元素的内容。我认为 replaced 元素属于 inline-block 元素，因为它表现得就像 inline-block 元素。replaced 元素一共有：

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
