# 流式布局

## 概述

布局是指如何排列布置 HTML 元素的大小与位置。流式布局（flow layout）是浏览器默认的布局方式，它就像微软的 Word 软件，从上到下的堆叠段落，从左到右的排列文本。

> 准确的说法是“在 block 方向上排列段落，在 inline 方向上排列文本”，而 block 方向和 inline 方向具体为何则取决于文档的 `writing-mode` 属性。
>
> 为方便写作，本文假设文档的 `writing-mode` 为 `horizontal-tb`，且使用的语种为汉语。

流式布局将元素分成了 3 种，然后根据元素的类型来决定如何排布它们，这 3 种元素分别是：block 元素、inline 元素、inline-block 元素，请通过阅读下文来了解它们的细节。

每种 HTML 元素都被分配了默认类型，我们可以通过 `display` 属性来查看元素的类型，比如 `section` 元素的默认类型是 `block`，`kbd` 元素的默认类型是 `inline`。我们也可以通过修改元素的 `display` 属性来更改他们的类型。

## block 元素

在流式布局中，每个 block 元素都会独占一行，哪怕该 block 元素的内容的实际水平尺寸很小，哪怕该 block 元素使用了 `inline-size: fit-content`，因此所有 block 元素将会从上到下依次堆叠。

TODO：请在此处附图



