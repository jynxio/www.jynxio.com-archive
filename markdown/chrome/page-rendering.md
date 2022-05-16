---
typora-root-url: ..\..
---

# 页面的渲染

## 概述

本文讲解 Chrome 的渲染进程是将 HTML、CSS、JavaScript 转换为可交互的页面的，该过程即是页面的渲染，其中也会稍微涉及到浏览器进程和 GPU。

## 第 1 步：DOM 的构建

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

## 第 2 步：样式计算

只有 DOM 还不足以了解页面的外观，除了 DOM 外，我们还需要知道每个元素的样式。主线程会解析 CSS 样式表来确定每个元素的具体样式，具体过程是主线程会根据继承和层叠的规则来确定最终哪些样式会应用到元素上。并且相对的 CSS 属性值（如 `1em`）会尽可能的转换为绝对的 CSS 属性值（如 `16px`）。

![样式计算](/static/image/markdown/chrome/page-rendering/style-calculation.png)

你可以通过 DevTools 的 Elements 选项卡下的 Computed 栏来查看元素的具体样式。

## 第 3 步：布局

现在，渲染进程已经知道了页面的结构（DOM）和元素的样式，不过它还不知道元素在页面中的位置。如果渲染进程不知道应该将元素绘制在页面的哪个地方，那么渲染进程就无法绘制页面。

因此，渲染进程就需要计算元素的位置信息（类似于 xy 坐标），而在本质上元素在页面的位置是基于元素的大小和元素在 DOM 中的位置来推算的，因此渲染进程还必须先计算出元素的包围盒尺寸。

布局阶段的作用就是计算元素的几何和位置信息，它的具体做法是让主线程遍历 DOM 和元素的样式，来创建一棵类似于 DOM 树的布局树（layout tree），布局树和 DOM 树的区别是：

- DOM 树中的节点只记录了元素的样式信息，布局树中的节点还记录了元素的几何和位置信息。
- DOM 树包含了页面的所有元素，布局树只包含页面中可见的元素。