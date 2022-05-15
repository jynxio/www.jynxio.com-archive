---
typora-root-url: ..\..
---

# 页面的渲染

## 概述

本文讲解 Chrome 的渲染进程是将 HTML、CSS、JavaScript 转换为可交互的页面的，该过程即是页面的渲染，其中也会稍微涉及到浏览器进程和 GPU。

## 第 1 步：构建 DOM

当渲染进程接收到“提交导航”消息后，就会开始接收 HTML 数据，同时渲染进程的主线程就会开始解析接收到的文本字符串（即 HTML），并转换为 DOM。其中，DOM 是 Document Object Model 的简写，它是一个树形结构的数据，用来描述和操纵页面的 HTML 结构。

### 额外：永不报错的 HTML

想必你肯定已经注意到，无论 HTML 的内容如何错漏百出，浏览器都永远不会就此抛出错误，这是因为 HTML 规范已经想好了该如何处理 HTML 中的错误，比如这个错误的 HTML 片段 `<b><i></b></i>` 会被纠正成 `<b><i></i></b><i></i>`，你可以通过阅读 [这篇文章](https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser) 来了解它是怎么纠错的。

### 额外：子资源加载

通常，网页都会使用到诸如图像、CSS 和 JavaScript 等的外部资源，而这些外部资源都是需要从网络或缓存中加载的。

主线程在构建 DOM 的过程中会发现这些外部资源，然后请求加载它们。不过，为了加速这个过程，在主线程构建 DOM 的同时，渲染进程会并发的运行一个名为 preload scanner 的东西。preload scanner 会查看 token 来寻找诸如 `<img>`、`<link>` 等之类的标签，然后向浏览器进程中的网络线程发送请求来加载这些资源。

token 是构建 DOM 时的中间产物，因为主线程会运行一个 HTML 解析器来解析 HTML 以生成 token，然后根据 token 来生成 DOM。

![构建DOM树](/static/image/markdown/chrome/page-rendering/build-dom-tree.png)

### 额外：JavaScript 会阻塞 HTML 解析

当 HTML 解析器发现了一个 `<script>` 时，HTML 解析器就会暂停工作，直至加载和执行完 JavaScript 代码后才会重新运行。HTML 解析器之所以要这么做，是因为 JavaScript 拥有可以改变 DOM 的能力，比如 `document.write()` API。