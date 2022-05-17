---
typora-root-url: ..\..
---

# 页面的渲染

## 概述

本文讲解 Chrome 的渲染进程是将 HTML、CSS、JavaScript 转换为可交互的页面的，该过程即是页面的渲染，其中也会稍微涉及到浏览器进程和 GPU。

## 第 1 步：构建 DOM

当渲染进程接收到“提交导航”消息后，就会开始接收 HTML 数据，同时渲染进程的主线程就会开始解析接收到的文本字符串（即 HTML），并转换为 DOM，该过程由 HTML 解析器来完成。

其中，DOM 是 Document Object Model 的简写，它是一个树形结构的数据，用来描述和操纵页面的 HTML 结构。

### 额外：永不报错的 HTML

想必你肯定已经注意到，无论 HTML 的内容如何错漏百出，浏览器都永远不会就此抛出错误，这是因为 HTML 规范已经想好了该如何处理 HTML 中的错误，比如这个错误的 HTML 片段 `<b><i></b></i>` 会被纠正成 `<b><i></i></b><i></i>`，你可以通过阅读 [这篇文章](https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser) 来了解它是怎么纠错的。

### 额外：子资源加载

通常，网页都会使用到诸如图像、CSS 和 JavaScript 等的外部资源，而这些外部资源都是需要从网络或缓存中加载的。

主线程在构建 DOM 的过程中会发现这些外部资源，然后请求加载它们。不过，为了加速这个过程，在主线程构建 DOM 的同时，渲染进程会并发的运行一个名为 preload scanner 的东西。preload scanner 会查看从 HTML 所生成 token 来寻找诸如 `<img>`、`<link>` 等之类的标签，然后向浏览器进程中的网络线程发送请求来加载这些资源。

![构建DOM树](/static/image/markdown/chrome/page-rendering/build-dom-tree.png)

外部资源的加载和 DOM 的构建是两个并发运行的过程，不过有的时候 DOM 的构建会停下来等待外部资源的加载，我们把这种情况称为阻塞。

### 额外：阻塞 DOM 的构建

在构建 DOM 的过程中，如果 HTML 解析器发现了 `<script>`，那么 HTML 解析器就会暂停工作，直至加载和执行完 JavaScript 代码后才会重新运行。HTML 解析器之所以要这么做，是因为 JavaScript 拥有可以改变 DOM 的能力，比如 `document.write()` API。

具体来说，如果 HTML 解析器发现的 `<script>` 是一个内联的脚本，那么它就会暂停工作，直至主线程执行完该 JS 脚本后再重新工作。

```html
<script>
    document.write( "" );
</script>
```

如果 HTML 解析器发现的 `<script>` 指向一个外部的 JS 脚本，那么它也会暂停工作，直至加载并执行完这个 JS 脚本后再重新工作，其中加载脚本由浏览器进程的网络线程来负责，执行脚本由渲染进程的主线程来负责。

```html
<script src="/index.js"></script>
```

### 额外：提示浏览器该如何加载资源

如果你的 JS 脚本中没有使用类似 `document.write()` 这样会改变 DOM 的 API，那就可以为 `<script>` 添加 `async` 或 `defer` 属性，这样做的好处是浏览器会异步的加载和运行 JS 代码，并且完全不会阻塞 DOM 的构建。

另外，你也可以使用 `<link rel="preload">` 来通知浏览器尽快下载该资源。

你可以通过阅读 [这篇文章](https://web.dev/fast/#prioritize-resources) 来了解更多加速网页加载的方法，其中就包含了该如何让浏览器更快速的加载资源。

## 第 2 步：计算样式

只有 DOM 还不足以了解页面的外观，除了 DOM 外，我们还需要知道每个元素的样式。主线程会解析 CSS 样式表来确定每个元素的最终样式，具体过程是主线程会根据继承和层叠的规则来确定最终哪些样式会应用到元素上。并将相对的 CSS 属性值（如 `1em`）尽可能的转换为绝对的 CSS 属性值（如 `16px`）。

![样式计算](/static/image/markdown/chrome/page-rendering/style-calculation.png)

你可以通过 DevTools 的 Elements 选项卡下的 Computed 栏来查看元素的具体样式。

## 第 3 步：计算布局

现在，渲染进程已经知道了页面的结构（DOM）和元素的样式，不过它还不知道元素在页面中的位置。如果渲染进程不知道应该将元素绘制在页面的哪个地方，那么渲染进程就无法绘制页面。

因此，渲染进程就需要计算元素的位置信息（类似于 xy 坐标），而在本质上元素在页面的位置是基于元素的大小和元素在 DOM 中的位置来推算的，因此渲染进程还必须先计算出元素的包围盒尺寸。

布局阶段的作用就是计算元素的几何和位置信息，它的具体做法是让主线程遍历 DOM 和元素的样式，来创建一棵类似于 DOM 树的布局树（layout tree），布局树和 DOM 树的区别是：

- DOM 树中的节点只记录了元素的样式信息，布局树中的节点还记录了元素的几何和位置信息。
- DOM 树包含了页面的所有元素，布局树只包含页面中可见的元素。注意，布局树不包含 `display: none` 的元素，但是会包含 `visibility: hidden` 的元素。另外，布局树还包含 `::before{}` 之类的伪类元素（因为它是可见的），但是 DOM 树不会包含伪类元素。

![构建布局树](/static/image/markdown/chrome/page-rendering/build-layout-tree.png)

计算页面的布局是一件非常复杂的工作，你可以通过 [这个视频](https://www.youtube.com/watch?v=Y5Xa4H2wtVA) 来了解布局的细节过程。

## 第 4 步：创建绘图指令

除了 DOM、样式信息和布局信息外，渲染进程还需要知道绘图的指令才能绘制页面，绘图指令用来告诉渲染进程应该先画什么、再画什么、最后画什么，它类似于：

1. 第一步，在 (x,y) 处绘制一个宽高为 (w,h) 的红色矩形。
2. 第二步，在 (x,y) 处绘制一个圆心为 r 的蓝色圆形。
3. ......
4. 第 n 步，......

一个实际的例子是，如果渲染进程按照元素出现的先后顺序来绘制元素，且刚好元素又应用了 `z-index` 属性的话，那么就有可能会画出错误的页面。

![页面画错了](/static/image/markdown/chrome/page-rendering/paint-wrong-page.png)

在该阶段中，主线程会通过遍历布局树来计算和创建绘图指令。其实 Chrome 官方没有使用过“绘图指令”这个术语，而是使用“paint record”这个术语，我只是个人倾向于使用前者。

![创建绘制指令](/static/image/markdown/chrome/page-rendering/generate-paint-record.png)

## 插播：如何绘制页面

现在，渲染进程已经知道了页面的结构、样式信息、几何信息还有绘图指令，它已经能够绘制页面了，不过它到底是怎样绘制的呢？

在开始介绍之前，我们需要先了解“光栅化”这个概念，它的意思就是将信息转换为位图，在这里的具体含义就是根据上述信息来生成页面的位图。之所以将生成位图这种行为称为光栅化，是因为位图又被称为光栅图或栅格图。另外，Chrome 的页面其实就是一幅位图，Chrome 的 UI 界面也是一幅位图，你之所以可以和 UI 界面或网页页面交互，是因为 Chrome 会根据你的行为来立即更新对应的位图，从而让你感觉到 Chrome 响应了自己的动作。

在 Chrome 首次发布的时候，它绘制页面的策略是这样的：首先光栅化视窗内的画面，如果用户滚动了页面，那就继续光栅化视窗内未光栅化的画面。

![首次发布时的光栅化策略](/static/image/markdown/chrome/page-rendering/initial-rasterizing.png)

不过，现在的 Chrome 早已重构了这个绘制策略。它目前的绘制页面的策略被称为“合成”，具体做法是：将单层的页面拆分成多个图层，并将每个图层分割成多个图块，然后生成每个图块的位图，再将图块位图拼接成图层位图，最后再将图层位图合成为最终的网页位图并截取视窗处的画面，这样就绘制好了页面。如果网页中还有动画，比如位移动画，那么就只需要移动相应的图层，然后再重新合成一幅网页位图并截取视窗处的画面就可以了。

![合成](/static/image/markdown/chrome/page-rendering/compositing-animation.png)

总的来说，合成一共包含：分层、分块、光栅化、合成共 4 个步骤。

## 第 5 步：分层

分层的作用是将单层的页面拆分成多个图层，它的具体做法是：主线程遍历布局树上的元素，然后智能的为需要的元素创建专属的图层，而没有专属图层的元素将会依附于父元素的图层，最后布局树中的每个元素都会依附于某个图层，并且主线程还会根据图层的结构来创建一棵图层树（layer tree）。

![生成图层树](/static/image/markdown/chrome/page-rendering/generate-layer-tree.png)

通常情况下，主线程会自动的为使用了层叠上下文属性的元素或发生了裁剪的元素创建专属的图层。另外，我们也可以通过主动的为元素应用 `will-change` 属性来通知主线程为该元素创建一个专属图层。

主线程是如何判断一个元素是否需要创建专属图层的呢？答案是 `will-change`。具体来说，其实页面中的每个元素都会默认应用 `will-change: auto`，此时主线程就会根据元素的其他 CSS 属性（如层叠上下文属性）和行为（如裁剪）来判断是否应该为其创建专属图层。并且，你可以通过修改 `will-change` 的属性来强制让主线程为该元素创建专属的图层，比如如果元素使用了 `will-change: transform`，那么主线程就一定会为该元素创建专属的图层，并提前做好准备来应对该元素将来发生的 transform 动作，以加速页面的渲染速度。

但是创建图层是有代价的，因为图层是需要消耗 GPU 内存的，更多的图层就意味着需要消耗更多的 GPU 内存。具体原因是，当页面有 n 个图层时，GPU 就需要生成 n 幅位图，并且这些位图会存储在 GPU 的内存中。另外，更多的图层就需要消耗更多的 CPU 和 GPU 之间的带宽。你可以从 [这篇文章](https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/) 来进一步了解创建图层的代价。

如果创建了过多的图层，那么其带来的性能负荷将可能远远超过其带来的好处。因此请不要滥用图层，而是只为需要的元素创建图层。

### 额外：元素裁剪

如果某个元素应用了 `overflow: auto`，且该元素的内容超出了元素的尺寸，那么该元素就会隐藏超出的内容并创建滚动条。在这种情况下，主线程就会为该元素创建专属的图层，显然创建图层的目的是为了更快速的响应滚动事件（即当滚动查看元素的内容时，可以加速页面的渲染）。

比如，如果 DIV 元素没有应用 `overflow: auto`，那么整个页面就只有 1 个图层，即根元素图层，DIV 元素将依附于该图层。

```css
div {
    width: 200px;
    height: 200px;
    background-color: pink;
}
```

你可以通过 DevTools 的 Layers 选项卡来查看当前页面的分层情况。

![单图层](/static/image/markdown/chrome/page-rendering/single-layer.png)

如果 DIV 元素应用了 `overflow: auto`，那么整个页面将会有 3 个图层，分别是根元素图层、DIV 元素图层、水平滚动条图层。仔细查看你会发现 DIV 元素图层在垂直方向上少了 `17px`，这是因为水平滚动条图层占用了这 `17px`。

```css
div {
    overflow: auto;
    width: 200px;
    height: 200px;
    background-color: pink;
}
```

![多图层](/static/image/markdown/chrome/page-rendering/multi-layer.png)

另外，如果你激活了 Layers 选项卡中的 Show internel layers 特性，那么就能看到图层的内部图层，其中 DIV 元素图层有 2 个内部图层，其中一个内部图层的尺寸是 `200px*183px`，它代表了 DIV 元素的可见范围，另一个内部图层的尺寸是 `478px*187px`，它代表了 DIV 元素内容的实际尺寸。

在渲染页面时，浏览器进程只会渲染前一个内部图层范围内的画面，而后一个图层的超出部分则会被裁掉。如果 DIV 元素的内容发生了滚动，那么就只需要平移后一个内部图层的位置，然后再截取前一个内部图层范围内的画面，最后再合成所有图层，就能完成页面的渲染了。

![激活Show internel layers](/static/image/markdown/chrome/page-rendering/multi-layer-internel.png)

## 第 6 步：分块

接下来，主线程会将图层树与绘制指令发送给合成线程，合成线程是一个独立的线程，它负责图层分块与光栅化。合成线程在光栅化图层之前，需要先将图层分割成小块，因为一个图层有可能会和整个页面那么大，分块更有利于光栅化。



## TODO：更新渲染管道的某个环节会带来什么影响