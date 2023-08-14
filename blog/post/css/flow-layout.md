---
typora-root-url: ./..\..\image
---

# 流式布局

## 是什么？

首先，「布局」是指浏览器排列布置 HTML 元素的大小与位置的策略，而流式布局（flow layout）正是所有浏览器的默认的布局策略。流式布局就像微软的 Word 软件，段落从上到下堆叠，文本从左到右排列。

> 注意：为了便于叙述，本文假设了 `writing-mode: horizontal-tb`，此时 block 方向等于垂直方向，inline 方向等于水平方向。

流式布局将所有元素划分成了 3 个种类，分别是：块级元素（block-level elements）、行内元素（inline elements）、行内块元素（inline-block elements）。

其中，块级元素代表 `display: block`，行内元素代表 `display: inline`，行内块元素代表 `display: inline-block`。我们既可以通过 `display` 属性来查看元素的类型，也可以通过修改 `display` 属性来修改元素的类型。

每个种类都有特定的布局行为，通过了解它们的布局行为，我们就可以知道流式布局的具体运作机理了。

## 块级元素

块级元素的布局行为是：每个块级元素都会独占一行，哪怕该块级元素的内容的实际的水平尺寸很小，哪怕该块级元素应用了 `inline-size: fit-content`，最后所有的块级元素将会一个一个的从上到下依次堆叠。

> `fit-content` 是介于 `min-content` 和 `max-content` 之间的万金油。

```html
<p>block-level elements</p>
<b>inline elements</b>

<p>block-level elements (fit-content)</p>
<b>inline elements</b>

<style>
    p,  b { background-color: orange }
    * + p { inline-size: fit-content }
</style>
```

![块级元素](/css/flow-layout/block-element.png)

## 行内元素

行内元素总是被包裹在块级元素的内部以充当块级元素的内容，作为内容，行内元素会从左到右依次排列，并在达到容器的水平尺寸极限时自动换行。

```html
<p>Inline elements will automatically wrap to the next line when they <span>reach the horizontal size limit of the</span> container.</p>

<style>
    span { background-color: orange }
</style>
```

![行内元素](/css/flow-layout/inline-element.png)

另外，行内元素无法使用这些 CSS 属性：`inline-size`、`block-size`、`margin-block`、`padding-block`、`float`、`text-align`。所幸，可以使用 `margin-inline` 和 `padding-inline`。

## 行内块元素

行内块元素是行内元素和块级元素的结合体，它既遵循行内元素的布局行为，又可以使用块级元素的所有 CSS 属性（此处想表达的是：“可以使用那些行内元素所无法使用的 CSS 属性“）。

不过行内块元素的换行策略和行内元素的稍有不同，当需要换行的时候，行内元素会在内部直接换行，行内快元素则会整个另起一行，我认为行内元素的换行策略才是正确的。

```html
<p>When line breaking is necessary, inline elements will break within their content, <span class="a">while inline-block elements will start a new line as a whole.</span></p>

<p>When line breaking is necessary, inline elements will break within their content, <span class="b">while inline-block elements will start a new line as a whole.</span></p>

<style>
    span { background-color: orange }
    
    .a { display: inline }
    
    .b { display: inline-block }
</style>
```

![行内块元素](/css/flow-layout/inline-block-element.png)

## 可替换元素

可替换元素是一种特殊的行内块元素，它和普通的行内块元素之间的区别就在于它强调展示外部的资源。可替换元素有：

- `<iframe>`
- `<video>`
- `<embed>`
- `<img>`
- `<input type="image">`
- 作为 `<select>` 的子元素时的 `<option>`
- 激活了 `controls` 属性时的 `<audio>`
- 设置了 `width` 和 `height` 属性时的 `<canvas>`
- 设置了 `data` 属性时的 `<object>`

如果你用一个块级元素来包裹一个可替换元素，那么你会发现块级元素的底部会出现一条小小的缝隙，如果你想消除这条缝隙，那么有下述两种方案：

- 将可替换元素转换为块级元素；
- 将容器元素的 `line-height` 设置为 `0`；

![缝隙](/css/flow-layout/inline-block-element-gap.png)

## 百分比高度陷阱

如果容器元素没有明确的高度值，那么就不能为其子元素设置百分比类型的高度值，因为这个设置会静默失败，这就是「百分比高度陷阱」，其具体原理如下：

无论是块级元素、行内元素还是行内块元素，当它们作为容器的时候，其高度的计算策略都是「尽可能地收缩以刚好容纳所有子元素」，就像是抽真空包装那样。

可见，容器元素的高度值推算自子元素的高度，而当我们给子元素设置了百分比高度时，子元素的高度值便又需要推算自父元素，如此一来便产生了循环引用，最后布局引擎就会直接忽略掉子元素的百分比高度值。

### 解决方案

解决方案是为容器元素设定一个明确的高度值。如果容器元素乃至其所有祖先元素都需要使用百分比高度，那么我们就需要为文档的根元素（`<html>`）设定一个明确的高度值，我奉行的方案是：

```css
/* 方案一 */
html, body {
    min-block-size: 100%;
}

/* 方案二 */
html, body {
    min-block-size: 100dvh;
}
```

此时，`<html>` 的最小高度为视口高度，`<body>` 的最小高度等于 `<html>` 的高度。另外，推荐使用方案一，因为 `dvh` 的兼容性不如 `%`，比如 `dvh` 不支持 [全系列的 IE](https://caniuse.com/?search=types%3A%20dvh)。

> 为什么不用 `vh`？因为它会在移动端中引发 bug。
>
> 具体来说，移动端浏览器会在用户下滑时隐藏底栏和顶栏，在用户上滑时显示底栏和顶栏，由于底栏和顶栏会挤占视口的高度，所以当用户频繁的在上滑和下滑之间切换时，视口的高度就会发生频繁的改变，而使用了 `vh` 单位的元素就会发生抖动或闪烁。浏览器厂商为了避免这种不良体验，于是干脆把去掉底栏和顶栏之后的视口高度作为视口的最终的高度，可是当用户首次加载网页的时候，底栏和顶栏是会默认存在的，这会导致 `100vh` 大于实际的视口高度，如果你将根元素的最小高度设置为了 `100vh`，那么网页就会有垂直滑动条，哪怕网页的内容的实际高度很小。这便是不推荐在该解决方案中使用 `100vh` 的原因。

## 外边距折叠陷阱

在流式布局中，如果两个块级元素的 block 外边距发生了直接接触，那么它们的外边距就会融合，这就是外边距折叠（margin collapse）。之所以说外边距折叠是一个陷阱，是因为它那复杂且怪异的折叠规则常常会让开发者感到困扰。

> 如果可以，请不要使用外边距，取而代之的是使用内边距与各种布局策略，这样可以避免很多来自于外边距陷阱。可遗憾的是，外边距在项目中太常见了...另外，请不要给组件的施加外边距，因为这会破坏它的通用性。细想一下，如果你不知道组件的外部环境，那么你就不知道组件的外边距会带来什么影响。

在正式阐述外边距折叠的规则之前，请先让我们厘清外边距的概念。

### 外边距是什么？

外边距有 3 个作用，分别是：

- 影响元素的行内尺寸；
- 影响元素的行内位置；
- 影响元素之间的间距；

关于「影响元素的行内尺寸」，在流式布局中，对于一个 `inline-size: auto` 的块级元素，`margin-inline` 可以控制其内容盒的行内尺寸。在 FLex 布局中，对于一个 `inline-size: 100%` 的块级元素，`margin-inline` 也可以控制其内容和的行内尺寸。

TODO：插图

关于「影响元素的行内位置」，在流式布局中，对于一个 `inline-size` 为固定值的块级元素，`margin-inline: auto` 可以令其在行内方向上剧中。

TODO：插图

关于「影响元素之间的间距的」，在流式布局中，外边距可以调整元素与元素之间的间距，有时是通过移动元素自己来实现的，有时是通过移动相邻元素来实现的，具体来说：

- `margin-inline-start` 和 `margin-block-start` 会移动当前元素；
- `margin-inline-end` 和 `margin-block-end` 会移动相邻元素；

TODO：插图

### 折叠的规则

在流动布局中，当两个块元素的 block 方向上的外边距直接接触时，就会发生外边距折叠。

> 行内元素、行内块元素、浮动元素、绝对定位元素、根元素、`overflow` 值为非 `visibility` 的元素都不会产生这种现象。

折叠之后的外边距的尺寸遵守下述公式：

- 如果两个外边距都不小于零，那么最终的外边距就等于两者中的最大值；
- 如果两个外边距都不大于零，那么最终的外边距就等于两者中的最小值；
- 如果一个外边距不大于零，另一个外边距不小于零，那么最终的外边距就等于两者的代数和；

### 折叠的例子

```html
<section class="pink">
	<div class="orange"></div>
    <hr />
	<div class="orange"></div>
</section>

<section class="blue">
	<div class="red"></div>
    <div class="purple"></div>
</section>

<style>
    .pink { margin-block: 8rem }
    .orange { margin-block: 4rem }
     hr { block-size: 0 }
    
    .blue { margin-block: -4rem }
    .red { margin-block: -2rem }
    .purple { margin-block: -4rem }
</style>
```

> 下图中的 border 只是为了突显元素边界的视觉效果而不是真正的 border，上述元素均没有创建任何 border。

![外边距折叠示例](/css/flow-layout/margin-collapse-example.png)
