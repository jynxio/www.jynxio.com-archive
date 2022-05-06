---
typora-root-url: ..\..
---

# 渲染流程

## 概述

渲染流程是指浏览器解析 HTML、CSS、JavaScript 并渲染出页面的过程，按照时间先后顺序，渲染流程分为 7 个阶段，依次是：

1. 构建 DOM 树
2. 样式计算
3. 布局
4. 分层
5. 图层绘制
6. 分块
7. 光栅化与合成

## 构建 DOM 树

首先，HTML 解析器会将纯文本的 HTML 转译为 DOM 树，DOM 树是树形结构的数据，它描绘了节点与节点之间的关系，浏览器可以通过修改 DOM 树来操纵元素，这也正是浏览器构建 DOM 树的原因。

你可以通过在开发者工具的 `Console` 栏中输入 `document` 来查看当前页面的 DOM 树，或者下图直接演示了如何将 HTML 转译为 DOM 树。

![HTML转译为DOM树](/static/image/markdown/browser/html-to-dom-tree.png)

另外，JS 和 CSS 都有可能会阻塞 DOM 树的构建。首先，外部的 JS 和 CSS 文件的下载都是异步的（它们会在解析 HTML 来构造 DOM 树的过程中异步下载），不过阻塞与否是取决于具体情形的。

情形 1：内联的 JS 脚本会引发阻塞

```html
<html>
    <body>
        <script>
        	document.write( "" );
        </script>
    </body>
</html>
```

HTML 解析器在解析 HTML 的过程中，如果遇到了内联的 JS 脚本，则会先执行完 JS 脚本之后，再继续往下解析，因此内联的 JS 脚本会引发阻塞。

情形 2：外部的 JS 脚本会引发阻塞

```html
<html>
    <body>
        <script src="test.js"></script>
    </body>
</html>
```

HTML 解析器在解析到 `script` 标签的时候，会暂停解析，并下载 `test.js` 文件，下载完成之后再执行该 JS 文件，最后再往下继续解析，因此外部的 JS 脚本会引发阻塞。

情形 3：外部的 CSS 文件有可能会引发阻塞

```html
<html>
    <html>
        <link src="test.css">
    </html>
    <body>
        <p></p>
        <script>
        	document.querySelector( "p" ).style.color = "red";
        </script>
    </body>
</html>
```

HTML 解析器在解析到 `script` 标签的时候，由于其中的 JS 脚本访问了某个元素的样式，这时就需要等待前面的样式文件下载完，才能继续往下解析，这种情况下的 CSS 文件也会引发阻塞。

## 样式计算

样式计算的目的是计算出 DOM 树中的每个元素的具体样式。样式计算又分为 3 个步骤，分别是：

1. 构建 styleSheets
2. 属性值标准化
3. 计算元素的样式

### 第一步 - 构建 styleSheets

页面的 CSS 资源有 3 种来源，分别是：

- `link` 标签引入的外部 CSS 文件。
- `style` 标签包围的 CSS 代码。
- 元素的 `style` 属性内嵌的 CSS 代码。

无论是何种来源的 CSS，渲染引擎（是 Blink 吗？）都会将它们转译为 styleSheets，styleSheets 记录了所有元素的样式，浏览器可以通过修改 styleSheets 来操纵元素的样式，这也正是浏览器构建 styleSheets 的原因。

你可以通过在开发者工具的 `Console` 栏中输入 `document.styleSheets` 来查看当前页面的 styleSheets，如下图所示：

![styleSheets](/static/image/markdown/browser/stylesheets.png)

### 第二步 - 属性值标准化

接下来，渲染引擎会将 styleSheets 中的属性值转换为计算值，其转换过程如下所示：

![标准化CSS的属性值](/static/image/markdown/browser/normalize-css-property.png)

> 什么是计算值：
>
> 样式表中的属性值需要经过一系列的计算和转化之后才能被渲染引擎所使用，这个过程依次是：指定值、计算值、应用值、实际值，显然计算值是该流程的第二个环节。这一系列处理的目的是为了将相对的值转换为绝对的值，因为只有绝对值才能明确的指示渲染引擎应该如何渲染页面，另外有的时候还需要根据用户代理的限制，来对转换后的绝对值再进行额外的处理，比如当某些设备要求像素数必须为整数的时候，小数的绝对值就需要进行取整。
>
> 其中，指定是是一个样式属性最初的值，它可能由开发者、用户代理或实际用户直接给定，也可能继承自父元素的属性值，也可能是使用该属性的默认值，指定值既有可能是一个绝对值，比如 `1px`，也有可能是一个相对值，比如 `1em`。
>
> 计算值是将指定值“尽可能”的转换为绝对值后所得到的结果，比如指定值 `1em` 的计算值可能是 `16px`，不过由于不是每个相对值都能转换成绝对值的，因此有时候计算值也可能是一个相对值。比如假设某个元素的 `width` 属性采用了百分数值，且其父元素的 `width` 属性的值又取决于页面的状态，而由于该计算过程发生在布局阶段之前，因此父元素的 `width` 是不确定的，因此该元素的 `width` 也是不确定的，所以该元素的 `width` 的计算值将会沿用其指定值。

### 第三步 - 计算元素的样式

最后，根据继承和层叠的规则来计算出每个元素的最终样式。你可以在开发者工具的 `Elements` 栏的 `Computed` 栏中查看到一个元素的最终样式。

## 布局

至此已经计算出了每个元素的样式，但是渲染引擎还不能确定每个元素在页面中的位置，因此接下来渲染引擎需要计算出每个元素的位置信息，这正是该阶段的目的。

渲染引擎通过构造布局树来计算元素的位置信息，布局树是 DOM 树和元素样式的合成体，不过布局树还剔除掉了不可见的元素，比如 `head` 元素及其子元素、`display: none` 的元素等。下图是合成布局树的过程：

![合成布局树](/static/image/markdown/browser/synthesize-layout-tree.png)

然后，渲染引擎会基于这棵布局树来计算出树中每个节点（元素）的坐标（位置），并将该计算结果重新写回布局树中。

> 注意，该布局系统并不合理，因为布局树既是该环节的输入内容，又是该环节的输出结果，针对这个问题，早在 2019 年或更早开始，Chrome 团队就开始重构有关布局的代码，下一代的布局系统叫做 `LayoutNG`，该系统清晰的分离开了输入与输出。

## 分层

接下来，渲染引擎需要为某些特定的元素生成专用的图层，并生成一棵对应的图层树（Layer Tree），分层的目的是为了更加方便的实现某些复杂样式，比如 3D 变换、页面滚动等。最后将所有图层叠加在一起就合成了最终看到的页面。你可以通过开发者工具的 `Layers` 栏来查看当前页面的分层情况：

![页面分层示意图](/static/image/markdown/browser/layout-example.png)

下图是布局树与图层树的关系，可见并不是每个元素都拥有自己的图层，实际上渲染引擎只会为满足下述任意一个条件的元素创建新的图层：

1. 元素拥有层叠上下文属性。
2. 元素发生了裁剪行为。

而如果一个元素没有自己的图层，那么这个元素就会从属于父元素的图层，比如下图中的 `span` 标签就从属于父元素 `div` 的图层，因此最终每个元素都会直接或间接的属于某个图层。

![布局树与图层树的关系](/static/image/markdown/browser/layout-tree-and-layer-tree.png)

那什么是裁剪呢？首先假设 HTML 页面的核心代码如下：

```html
<body>
    <div>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
</body>
```

如果 `div` 元素的样式如下，那么该页面就只有一个根元素图层。

```css
div {
	width: 200px;
	height: 200px;
	background-color: pink;
}
```

![单图层](/static/image/markdown/browser/layer-clip-no-scroll.png)

如果 `div` 元素的样式如下，那么该页面就有 3 个图层，分别是根元素图层、`div` 元素图层、水平滚动条图层。

```css
div {
    overflow: auto;
	width: 200px;
    height: 200px;
    background-color: pink;
}
```

![裁剪会产生新的图层](/static/image/markdown/browser/layer-clip-scroll.png)

TODO：这张图是错误的！！！

## 图层绘制

渲染引擎

接下来，渲染引擎要准备开始分别绘制每个图层了，渲染引擎会以类似于 Canvas API 的方式来绘制图层，因此在正式开始绘制之前，渲染引擎需要先将一个图层的绘制过程拆分成许多绘制指令，然后将这些会