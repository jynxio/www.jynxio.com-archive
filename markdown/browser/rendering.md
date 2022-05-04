---
typora-root-url: ..\..
---

# 渲染流程

## 概述

渲染流程是指浏览器是如何解析 HTML、CSS、JavaScript 并渲染出页面的过程，按照时间先后顺序，渲染流程分为 7 个阶段，依次是：

1. 构建 DOM 树
2. 样式计算
3. 布局
4. 分层
5. 绘制
6. 分块
7. 光栅化与合成

## 构建 DOM 树

HTML 解析器会将 HTML 转译为树形结构的数据，该数据保存于内存中，称为 DOM 树。之所以需要构建 DOM 树，是因为浏览器无法直接理解和使用 HTML。你可以通过在开发者工具的 `Console` 栏中输入 `document` 来查看当前页面的 DOM 树，下图则演示了如何将 HTML 转译为 DOM 树。

![HTML转译为DOM树](/static/image/markdown/browser/html-to-dom-tree.png)

## 样式计算

样式计算的目的是计算出 DOM 树中的每个元素的具体样式，样式计算又分为 3 个步骤：

1. 转译 CSS
2. TODO
3. TODO

### 转译 CSS