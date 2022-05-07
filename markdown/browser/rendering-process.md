---
typora-root-url: ..\..
---

# 渲染流程

## 概述

渲染流程是指浏览器解析 HTML、CSS、JavaScript 并渲染出页面的过程，按照时间先后顺序，渲染流程分为 8 个阶段，依次是：

1. DOM：创建 DOM 树
2. Style：计算元素的样式
3. Layout：计算可见元素的样式与位置
4. Layer：创建页面的图层
5. Paint：创建图层的绘制指令列表
6. Tiles：将图层分割为图块
7. Raster：创建图块的位图
8. Display：合并位图并显示网页

![完整的渲染流程](/static/image/markdown/browser/rendering-process.png)

## DOM

第一步是创建 DOM 树。

HTML 解析器会将纯文本的 HTML 转译为 DOM 树，DOM 树是树形结构的数据，它描绘了节点与节点之间的关系，浏览器可以通过修改 DOM 树来操纵元素，这也正是浏览器构建 DOM 树的原因。

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

## Style

第二步是计算元素的样式。

渲染进程会计算出 DOM 树中的每个元素的具体样式，计算过程分为 3 个步骤，分别是：

1. 构建 styleSheets
2. 属性值标准化
3. 计算元素的样式

### 构建 styleSheets

页面的 CSS 资源有 3 种来源，分别是：

- `link` 标签引入的外部 CSS 文件。
- `style` 标签包围的 CSS 代码。
- 元素的 `style` 属性内嵌的 CSS 代码。

首先，无论是何种来源的 CSS，渲染进程都会将它们转译为 styleSheets，它记录了所有的样式。你可以通过在开发者工具的 `Console` 栏中输入 `document.styleSheets` 来查看当前页面的 styleSheets，如下图所示：

![styleSheets](/static/image/markdown/browser/stylesheets.png)

### 属性值标准化

接下来，渲染进程会将 styleSheets 中的属性值转换为计算值，其转换过程如下所示：

![标准化CSS的属性值](/static/image/markdown/browser/normalize-css-property.png)

> 计算值：
>
> 样式表中的属性值需要经过一系列的计算和转化之后才能被渲染引擎所使用，这个过程依次是：指定值、计算值、应用值、实际值，显然计算值是该流程的第二个环节。这一系列处理的目的是为了将相对的值转换为绝对的值，因为只有绝对值才能明确的指示渲染引擎应该如何渲染页面，另外有的时候还需要根据用户代理的限制，来对转换后的绝对值再进行额外的处理，比如当某些设备要求像素数必须为整数的时候，小数的绝对值就需要进行取整。
>
> 其中，指定是是一个样式属性最初的值，它可能由开发者、用户代理或实际用户直接给定，也可能继承自父元素的属性值，也可能是使用该属性的默认值，指定值既有可能是一个绝对值，比如 `1px`，也有可能是一个相对值，比如 `1em`。
>
> 计算值是将指定值“尽可能”的转换为绝对值后所得到的结果，比如指定值 `1em` 的计算值可能是 `16px`，不过由于不是每个相对值都能转换成绝对值的，因此有时候计算值也可能是一个相对值。比如假设某个元素的 `width` 属性采用了百分数值，且其父元素的 `width` 属性的值又取决于页面的状态，而由于该计算过程发生在布局阶段之前，因此父元素的 `width` 是不确定的，因此该元素的 `width` 也是不确定的，所以该元素的 `width` 的计算值将会沿用其指定值。

### 计算元素的样式

最后，因为不同来源的样式可能会彼此冲突，因此渲染进程会根据继承和层叠的规则来选出每个元素的最终样式。你可以在开发者工具的 `Elements` 栏的 `Computed` 栏中查看到一个元素的最终样式。

## Layout

第三步是计算可见元素的样式与位置。

至此已经计算出了每个元素的样式，但是还不能确定每个元素在页面中的位置，因此接下来渲染进程需要计算出每个元素的位置信息，这正是该阶段的目的。

渲染进程通过构造布局树来计算元素的位置信息，布局树是 DOM 树和元素样式的合成体，不过布局树还剔除掉了不可见的元素，比如 `head` 元素及其子元素、`display: none` 的元素等。下图是合成布局树的过程：

![合成布局树](/static/image/markdown/browser/synthesize-layout-tree.png)

然后，渲染进程会基于这棵布局树来计算每个（可见的）元素在页面中的位置，然后将计算结果重新写回到布局树中。由于布局树既是该环节的输入，又是该环节的输出，因此这个 Layout 过程并不够合理。针对这个问题，早在 2019 年或更早开始，Chrome 团队就开始重构有关布局的代码，下一代的布局系统叫做 `LayoutNG`，该系统清晰的分离开了输入与输出。

## Layer

第四步是创建页面的图层。

接下来，渲染进程需要为某些特定的元素生成专用的图层，并生成一棵对应的图层树（Layer Tree），分层的目的是为了更加方便的实现某些复杂样式，比如 3D 变换、页面滚动等。最后将所有图层叠加在一起就合成了最终看到的页面。你可以通过开发者工具的 `Layers` 栏来查看当前页面的分层情况，比如：

![页面分层示意图](/static/image/markdown/browser/layout-example.png)

下图是布局树与图层树的关系，可见并不是每个元素都拥有自己的图层，实际上渲染引擎只会为满足下述任意一个条件的元素创建新的图层：

1. 元素拥有层叠上下文属性。
2. 元素发生了裁剪行为。

而如果一个元素没有自己的图层，那么这个元素就会从属于父元素的图层，比如下图中的 `span` 标签就从属于父元素 `div` 的图层，因此最终每个元素都会直接或间接的属于某个图层。

![布局树与图层树的关系](/static/image/markdown/browser/layout-tree-and-layer-tree.png)

那什么是裁剪行为呢？首先假设 HTML 页面的核心代码如下：

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

另外，如果你启用了 `Layers` 的 `Show internel layers`，你会发现该页面有不止 3 个图层，其中 `div` 元素就有 2 个图层，其中一个是宽高为 `200*183` 像素的矩形图层，它代表 `div` 元素的显示范围，其中高度缺少了 `17px` 的原因是该元素内有水平滚动条，另一个则是 `478*183` 像素的矩形图层，它代表文本框的尺寸，如下图所示。虽然文本框的尺寸大于 `div` 元素的尺寸，但是超出的部分被裁剪掉了，最后的显示范围也只有 `div` 元素的尺寸大小，这便是裁剪行为。

![Show internel layers](/static/image/markdown/browser/layer-clip-scroll-internel.png)

## Paint

第五步是创建图层的绘制指令列表。

绘制指令列表用于描述如何绘制图层，它是一系列绘制指令的集合。因为绘图是要讲究步骤的，因此绘图指令列表内的指令也是按调用的先后顺序来排列的。最后，绘图指令是一种形如 Canvas API 一样的命令，下图是一个假设的绘制指令列表，你可以从中看到每个绘制指令都是很简单的命令。

![绘制指令列表](/static/image/markdown/browser/drawing-command-list.png)

另外，绘制一个图层就需要一个绘制指令列表，如果页面有多个图层需要绘制，那么该阶段就会输出多个绘制指令列表。

## Tiles

第六步是将图层分割为图块。

DOM、Style、Layout、Layer、Paint 等过程都是由渲染进程的主线程来完成的，而图层的绘制操作则是由渲染进程的合成线程来完成的，如下所示：

![主线程与合成线程的关系](/static/image/markdown/browser/compositing-thread-and-main-thread.png)

渲染进程的主线程会将绘制指令列表提交给合成线程，合成线程将会使用它们来绘制位图。不过在正式绘制开始之前，合成线程还要对每一个图层进行分块处理。

分块是指合成线程会将图层切割为图块，这些图块的尺寸通常是 `256*256` 或 `512*512`。分块之后，合成线程会判断出图层中的哪些图块才是被当前视口可见的，然后就优先绘制这些可见的图块，而不必一下子绘制出整个图层，这样做的好处是可以加速首屏渲染的速度，尤其是对于页面很长的网页。下图展示了合成线程是如何分块，以及如何筛选出优先绘制的图块的。

![图层分块](/static/image/markdown/browser/cut-layer.png)

## Raster

第七步是创建图块的位图。

Raster 的直译是栅格化，这就是创建位图的意思，因为位图就是栅格图的同义词。渲染进程的内部维护了一个用于栅格化的线程池，池内拥有多个用于栅格化的线程，这些线程称为栅格化线程，这个线程池称为栅格化线程池，如下图所示。

![栅格化线程池](/static/image/markdown/browser/rasterization-thread-pool.png)

通常，渲染进程会借助 GPU 来生成图块的位图，具体做法是栅格化线程会通过 IPC 向 GPU 发送绘制指令，然后由 GPU 来生成图块的位图并将位图存储在 GPU 的内存中，如下图所示。而借助了 GPU 来栅格化的行为则被称为快速栅格化或 GPU 栅格化。

![GPU栅格化](/static/image/markdown/browser/rasterization-gpu.png)

## Display

第八步是合并位图并显示网页。

当完成了 Raster 之后，合成线程会向浏览器进程发送一个 `DrawQuad` 命令，浏览器进程的 viz 组件将会接受到该命令，然后将页面内容绘制到内存中，最后将内存显示到屏幕上。