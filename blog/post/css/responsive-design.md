---
typora-root-url: ./..\..\image
---

# 响应式设计

## 概述

网页会显示在形状和尺寸各异的各种电子设备的屏幕上，为了保证网页可以被恰当的展示，我们需要使用一些 CSS 技巧来使我们的网页可以自适应的变化，这便是本文要讨论的话题。

能够自适应变化的网页有什么优点？比如：

- 不会在高分辨率屏幕下缩水；
- 不会在小尺寸屏幕下溢出或出现丑陋的滚动条；
- 字号在小尺寸屏幕下适当的缩小以便于展示更多的文字；
- 段落之间的间隙会在障碍人士的特大字号模式下自动变大以便于不会过于紧凑；

## 屏幕与视口

### 像素密度

Apple 的「视网膜屏幕」是一个唬人的营销词汇，它其实就是像素密度很高的屏幕，当像素密度越高时，画面就会显得越细腻。

比如流行的 24 英寸 1920 × 1080 的屏幕的像素密度约为 96 ppi，我们可以察觉到屏幕中的像素，而 MacBook Pro 14-inch 2021（14.2 英寸，3024 × 1964）的像素密度约为 254 ppi，它的画面则非常细腻。

> PPI 是指 Pixels Per Inch（每英寸像素数），它是 DPI（Dots Per Inch）在数字屏幕领域的变体。

除了 Apple 的视网膜屏幕之外，许多电子设备的屏幕都配备了很高的 PPI，比如大多数中高端的智能手机。

### 视口元属性

为了确保网页可以正确的呈现在移动设备上，请将以下元标签添加至 HTML。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

该元标签用于设置视口的属性，其中 `content="width=device-width, initial-scale=1.0"` 是指令视口宽度等于网页窗口的宽度且缩放倍率重制为 1。之所以要这么做，是因为移动端浏览器在默认情况下会将视口的宽度设置的很大以至于溢出画面和产生横向滚动条。

> 视口和网页窗口的宽度都是指以 CSS 像素为单位的宽度。

另外，如果我们正在构建诸如网页地图等需要禁用用户的缩放功能的应用（以便于实现自己的捏合手势），那么我们可以直接在元标签中禁用掉缩放功能。

```html
<meta name="viewport" content="user-scalable=no">
```

### 设备像素比

屏幕的硬件像素和软件像素之间的比例就叫做「设备像素比」，你可以通过这个 API 来查看视口的设备像素比。

```js
globalThis.devicePixelRatio
```

设备像素比到底是什么意思？比如如果设备像素比等于 1，那么 1 个软件像素就对应 1 个硬件像素，如果设备像素比等于 2，那么 1 个软件像素就由 2 × 2 个硬件像素组成。其中，CSS 中的 px 指的就是软件像素。

无论软件像素是多少，显卡都会根据硬件像素来渲染画面，这意味着我们需要根据硬件像素来设置 canvas 和媒体资源的尺寸，否则 canvas 和媒体资源就会不清晰。具体来说，如果设备像素比等于 2，那么显卡就会使用 400 × 400 个像素来渲染一个 CSS 尺寸为 200 × 200 的图像元素，因此我们必须保证图像资源的分辨率至少达到 400 × 400，否则就会因拉伸而变模糊。同样的道理，如果画布元素的 CSS 尺寸为 200 × 200，那么画布元素就必须设置为 `<canvas width="400" height="400">`。

现在，大多数的设备的设备像素比都不等于 1，这是因为：

- 操作系统和浏览器中的缩放倍率都会改变设备像素比，并且 Windows 系统推荐的缩放倍率为 1.25（此时设备像素比也为 1.25）；
- 中高端的智能手机的设备像素比都至少为 2；

## 布局的类型

| 名称         | 描述                       | 自适应 | 推荐 |
| ------------ | -------------------------- | ------ | ---- |
| 固定宽度布局 | 采用固定尺寸               | 🚫      | 🚫    |
| 自适应布局   | 组合固定宽度布局和媒体查询 | ✅      | 🚫    |
| 流体布局     | 采用可变尺寸               | ✅      | ✅    |
| 响应式布局   | 组合流体布局和媒体查询     | ✅      | ✅    |

「固定宽度布局」是指采用固定的尺寸来设计网页的布局。它简单易用，但没有任何自适应变化的能力，请不要用它来设计网页的布局。但它也并非毫无用处，因为我们经常会用它来设计一些尺寸恒定的东西，比如 `hr { block-size: 1px }`。

```css
article { inline-size: 960px }
```

「自适应布局」是固定宽度布局的升级版，它要求开发者定义多套固定宽度布局，然后利用 CSS 的媒体查询来为不同尺寸的设备应用不同的布局方案。它简单易懂但不好用，因为有 2 个缺点：1）网页要适配的屏幕种类越多，我们要定义的布局方案就会越多；2）布局方案和布局方案之间的过渡形式是突变。

```css
article {
    /* for desktop */
    inline-size: 960px;
    
    /* for laptop */
    @media (width <= 1500px) {
        inline-size: 820px;
    }
    
    /* for tablet */
    @media (width <= 1100px) {
        inline-size: 680px;
    }
    
    /* for mobile */
    @media (width <= 550px) {
        inline-size: 320px;
    }
}
```

「流体布局」是指采用可变的尺寸来设计网页的布局，它通过采用相对单位来为样式赋予自适应变化的能力。并且我推荐使用 `clamp` 函数，因为它可以避免样式在极端尺寸下的变糟，比如 `article` 在宽屏上过分宽，在窄屏上过分细。

```css
/* 🙅🏻 不要 */
article { inline-size: 80vw }

/* 💁🏻 推荐 */
article { inline-size: clamp(20rem, 40vw + 10rem, 60rem) }
```

「响应式布局」是流体布局的升级版，它通过 CSS 媒体查询来弥补了流体布局无法控制样式显隐的短板。

```css
.menu-mobile {
    display: none;
    
    @media (width <= 550px) {
        display: initial;
        block-size: clamp(1.8rem, 4vh + 0.5rem, 2.5rem);
    }
}

.menu-desktop {
    inline-size: clamp(12rem, 6vw + 10rem, 15rem);
    
    @media (width <= 550px) {
        display: none;
    }
}
```

## 媒体查询

媒体查询（Media queries）用于根据用户代理的硬件特性来选择性的应用不同的 CSS 样式。

```css
@media (prefers-color-scheme: dark) and (resolution >= 2dppx) {
    header { background-image: url("dark-2x.png") }
}
```

媒体查询和容器查询都不会影响选择器的优先级，于是我们可以这样来编写一个桌面端优先的方案（颠倒过来便是一个移动端优先的方案）。

```css
.jynxio {
    inline-size: var(--desktop-size);
    
    @media (width <= var(--laptop-breakpoint)) {
        inline-size: var(--laptop-size);
    }
    
    @media (width <= var(--tablet-breakpoint)) {
        inline-size: var(--tablet-size);
    }
    
    @media (width <= var(--mobile-breakpoint)) {
        inline-size: var(--mobile-size);
    }
}
```

我们可以根据 [这里](https://gs.statcounter.com/screen-resolution-stats) 的统计数据来设置合适的尺寸断点，或者直接采纳下面这个结论：1）Mobile：0-550px；2）Tablet：550-1100px；3）Laptop：1100-1500px；4）Desktop：1500+px。

### 关键字

媒体查询有一个关键字 `only`，它用来确保老旧的浏览器不会误用媒体查询语句中的样式。

比如，旧版浏览器不认识 `(width >= 10rem)`，然后它会把 `@media screen and (width >= 10rem)` 当作 `@media screen` 来使用。解决方案就是在媒体查询的句首增加一个旧版浏览器不认识的 `only` 关键字，让旧版浏览器把整个语句都忽略掉。

```css
@media only screen and (width >= 10rem) {}
```

根据规范的要求，`only` 关键字有 2 个硬性规定：1）写在句首；2）其后紧跟媒体类型。

```css
/* 🙅🏻 不要 */
@media only (10rem < width < 30rem) {}

/* 🙅🏻 不要 */
@media all and only (10rem < width < 30rem) {}

/* 💁🏻 推荐 */
@media only all and (10rem < width < 30rem) {}
```

### 逻辑运算

媒体查询的逻辑运算很混乱，所以最好遵循这份最佳实践：

- 使用 `or`，不用 `,`；
- 善用 `()` 来明确标记运算的优先级；

```css
/* 🙅🏻 不要 */
@media screen and not (aspect-ratio: 1/1) or (resolution >= 2ddpx) {}

/* 💁🏻 推荐 */
@media screen and ((not (aspect-ratio: 1/1)) or (resolution >= 2dppx)) {}
```

| 运算符      | 描述 |
| ----------- | ---- |
| `not`       | 非   |
| `and`       | 与   |
| `or` 与 `,` | 或   |

注意，`,` 的两侧是两个独立的媒体查询，而 `not` 只能作用于其中一个媒体查询。

### 媒体类型

媒体类型（Media type）是媒体查询的查询条件，它描述了用户代理是一种什么机器。

| 值       | 描述                               |
| -------- | ---------------------------------- |
| `all`    | 任何设备（默认值）                 |
| `screen` | 屏幕设备                           |
| `print`  | 打印机、处于打印预览模式的其他设备 |

```css
@media screen {}
```

根据 [Media Queries 4](https://drafts.csswg.org/mediaqueries/#media-types) 的描述，所有的媒体类型都会在未来被废除掉，因为规范正致力于通过改进媒体特性来使其可以完全区分出不同的设备，届时就不再需要媒体类型了。

### 媒体特性

媒体特性（Media feature）也是媒体查询的查询条件，它比媒体类型更加详细，可以描述用户代理的更多特征。

媒体特性中不能使用 CSS 变量，因为媒体查询需要在解析样式表的阶段就敲定掉值，然而 CSS 变量是在执行样式表的过程中被创建的。

| 名称                   | 描述                                           |
| ---------------------- | ---------------------------------------------- |
| width                  | 视口宽度                                       |
| height                 | 视口高度                                       |
| aspect-ratio           | 视口宽度和高度的比率                           |
| orientation            | 视口宽度和高度的关系                           |
| update                 | 屏幕刷新率                                     |
| resolution             | 屏幕像素分辨率                                 |
| prefers-color-scheme   | 主题色倾向，如浅色模式、深色模式、自动模式     |
| prefers-contrast       | 对比度倾向，如低对比度模式、高对比度模式       |
| prefers-reduced-motion | 是否启用了减少动画模式                         |
| hover                  | 是否至少有一种主要输入机制支持悬停             |
| any-hover              | 是否至少有一种输入机制支持悬停                 |
| pointer                | 是否至少有一种主要输入机制支持指针及指针的精度 |
| any-pointer            | 是否至少有一种输入机制支持指针及指针的精度     |
| color                  | 色深或索引颜色表的位数                         |
| color-gamut            | 色域                                           |
| color-index            | 是否使用索引颜色表及索引颜色表的总条目数       |
| forced-colors          | 是否启用了强制色彩模式，如色盲或高对比度模式   |
| inverted-colors        | 是否启用了颜色反转                             |
| monochrome             | 是否为单色（黑白）设备及单色帧缓冲区的像素位数 |
| grid                   | 是否启用了网格屏幕，如点阵显示屏和早年的诺基亚 |
| display-mode           | 网页的展示模式，如标准、全屏、PWA等            |
| dynamic-range          | 是否支持高动态范围                             |
| video-dynamic-range    | 是否支持高动态范围（针对视频）                 |
| overflow-block         | 初始包含块对块方向上的溢出内容的处理方式       |
| overflow-inline        | 初始包含块对行内方向上的溢出内容的处理方式     |
| scripting              | 是否支持 JavaScript                            |

下表示常用设备的主要输入机制。

| 设备         | 主要输入机制               |
| ------------ | -------------------------- |
| 桌面电脑     | 鼠标、键盘                 |
| 笔记本电脑   | 触控板、键盘               |
| 平板电脑     | 触摸屏                     |
| 智能手机     | 触摸屏                     |
| 智能手表     | 触摸屏、语音输入           |
| 智能音箱     | 语音输入                   |
| 车载系统     | 触摸屏、物理按键、语音输入 |
| 电子阅读器   | 触摸屏、物理按键           |
| 游戏控制器   | 物理按键、摇杆             |
| 电视遥控器   | 物理按键                   |
| 虚拟现实头显 | 手柄、手势                 |
| 增强现实头显 | 手势、语音输入、触摸屏     |

下表是所有的输入机制对悬停和指针的支持情况。

| 输入机制 | 悬停  | 指针   |
| -------- | ----- | ------ |
| 鼠标     | hover | fine   |
| 键盘     | none  | none   |
| 触控板   | hover | fine   |
| 触摸屏   | none  | coarse |
| 触控笔   | none  | fine   |
| 语音输入 | none  | none   |
| 物理按键 | none  | none   |
| 眼球追踪 | none  | fine   |
| 摇杆     | none  | coarse |
| 手柄     | none  | coarse |
| 手势     | none  | coarse |

### 其他调用方式

此处罗列一些除了 CSS 之外的使用媒体查询的方法。

```shell
# CSS
@import url("landscape.css") screen;

# HTML
<style media="screen"></style>
<source src="" media="screen" />
<link rel="stylesheet" src="" media="screen" />
```

> 无论媒体查询的结果是什么，`<link>` 都会下载资源，只不过下载的优先级更低。

```js
const mediaQueryList = globalThis.matchMedia("screen");

// check
mediaQueryList.matches ? `it's screen` : `it's not`;

// subscribe
mediaQueryList.addEventListener("change", handleChange);
mediaQueryList.removeEventListener("change", handleChange);

function handleChange(mediaQueryList) {
    mediaQueryList.matches ? `it's screen` : `it's not`;
}
```

## 容器查询

容器查询（Container queries）可以让元素基于查询容器的特征来选择性的应用 CSS 样式，而查询容器是 `container-type` 非 `normal` 的祖先元素，详见下文的「查询容器」小节。

```html
<div id="a">
    <div id="b">
        <div id="c">
        	<div id="d"></div>
        </div>
    </div>
</div>

<style>
    #a { container: a / size }        /* 行块查询容器 */
    #b { container: b / inline-size } /* 行查询容器 */
    #c { container: c / normal }      /* 非查询容器 */
    
    /* 匿名查询 */
    @container (block-size >= 10px) {
        /* 查询容器为a */
        #d {
            block-size: 50cqb;  /* a的块向尺寸的50% */
            inline-size: 50cqi; /* b的行向尺寸的50% */
        }
    }
    
    /* 匿名查询 */
    @container (inline-size >= 10px) {
        /* 查询容器为b */
        #d {
            block-size: 50cqb;  /* a的块向尺寸的50% */
            inline-size: 50cqi; /* b的行向尺寸的50% */
        }
    }
    
    /* 具名查询 */
    @container a (inline-size >= 10px) {
        /* 查询容器为a */
        #d {
            block-size: 50cqb;  /* a的块向尺寸的50% */
            inline-size: 50cqi; /* b的行向尺寸的50% */
        }
    }
    
    /* 嵌套查询 */
    @container a (block-size >= 10px) {
        @container b (inline-size >= 10px) {
            /* 查询容器首先是a，然后是b */
            #d {
	            block-size: 50cqb;  /* a的块向尺寸的50% */
    	        inline-size: 50cqi; /* b的行向尺寸的50% */
            }
        }
    }
</style>
```

> 匿名查询会自动寻找距离最近的满足查询条件的祖父元素，比如如果查询条件中涉及了块向尺寸，那么就会匹配距离最近的行块查询容器，而不会匹配行向查询容器。

### 查询容器

查询容器是容器查询中的参考对象，关于「使用了容器查询的元素如何找到它的查询容器」，请参考「查询容器」小节的第一个代码示例。

请使用 `container-type` 来创建查询容器，可选的用 `container-name` 来命名查询容器，或直接使用两者的简写属性 `container`。`container-type` 的取值如下：

| container-type 取值 | 描述                                   |
| ------------------- | -------------------------------------- |
| `normal`            | 非查询容器（默认值）                   |
| `size`              | 行块查询容器，支持行向和块向尺寸的查询 |
| `inline-size`       | 行向查询容器，仅支持行向尺寸的查询     |

`container-name` 的取值是一至多个字符串，多个名字之间以空格符来分隔，名字可以使用任意命名方法。

```css
.anonymous-query-container {
	container-type: size;
}

.named-query-container {
	container-type: size;
    container-name: name-1 name-2;
}

.named-query-container {
    container: nam1-1 name-2 / size;
}
```

查询容器会产生 4 种副作用，分别是：

- 创建层叠上下文；
- 创建容器上下文；
- 施加布局、样式、尺寸隔离；
- 成为绝对和固定定位元素的包含块；

关于「容器上下文」，这是一种类似于层叠上下文的概念，当某个元素使用匿名的容器查询时，它便会沿着容器上下文的嵌套关系来向上寻找距离自身最近的容器元素来作为参照物，不过你也可以通过使用具名的容器查询来突破这个规则。

关于「成为绝对和固定定位元素的包含块」，对于绝对和固定定位元素而言，如果最近的祖先元素是一个查询容器，那么查询容器的内边距盒就会成为该定位元素的包含块。

关于「施加布局、样式、尺寸隔离」，隔离（Containment）是一种用于将元素的内部环境和外部环境隔离开来的技术，内部环境和外部环境将不再互相影响，CSS 规范一共定义了 5 种隔离方式，分别是布局隔离（layout）、绘制隔离（paint）、样式隔离（style）、尺寸隔离（size 或 inline-size），这些隔离方式的影响包括但不限于：

- 裁剪溢出的内容；
- 消除元素内部的浮动对外界文字排版的影响；
- 限定 [counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters) 和 [quotes](https://developer.mozilla.org/en-US/docs/Web/CSS/quotes) 特性的作用域于容器元素之内；
- 无视子元素的行向和块向尺寸（这意味着必须为元素指定明确的行向和块向尺寸）；

> `container-type: size` 的查询容器的尺寸隔离是行向和块向的，`container-type: inline-size` 则是行向的。你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/contain) 了解每一种隔离方式的具体作用。

### 容器特性

容器特性（Container feature）是容器查询的查询条件。

| 容器特性     | 取值                      | 描述               |
| ------------ | ------------------------- | ------------------ |
| width        | `<length>`                | 容器的宽度         |
| height       | `<length>`                | 容器的高度         |
| block-size   | `<length>`                | 容器的块向尺寸     |
| inline-size  | `<length>`                | 容器的行向尺寸     |
| orientation  | `landscape` 或 `portrait` | 宽度更大或高度更小 |
| aspect-ratio | `<ratio>`（如 `1/1`）     | 宽度与高度之比     |

### 逻辑运算

| 运算符 | 描述 |
| ------ | ---- |
| `and`  | 与   |
| `not`  | 非   |
| `or`   | 或   |

容器查询的逻辑运算和媒体查询的逻辑运算的陷阱是不一样的，请至少记住：

- 一个容器查询只能使用一个 `not`；
- `not` 不可以和 `and` 或 `or` 混用；

### 样式查询

容器查询不仅支持容器特性，还支持任意 CSS 属性（甚至是 CSS 变量），不过截至目前（Chrome v124）该特性的 [兼容性还非常差](https://caniuse.com/?search=container%20style%20query)。

```html
<div class="parent">
    <div class="child">I'm blue</div>
</div>

<style>
    .parent {
        --me: jynxio;
        color: red;
    }
    
    @container style(--me: jynxio), style(color: red) {
        .child { color: blue }
    }
</style>
```

不同于针对容器特性的容器查询，它不需要创建查询容器，而是似乎会将直接父元素当作查询容器，我不清楚它的具体原理，因为 MDN 并未描述此事。

关于如何使用逻辑运算、如何查询简写属性以及一些细节和陷阱，请见 [此处](https://developer.mozilla.org/en-US/docs/Web/CSS/@container#container_style_queries)。

### 长度单位

CSS 中有 6 个特殊的长度单位，它们是以查询容器来作为参考对象的相对长度单位，如果匹配不到查询容器，那么就会以视口来作为参考对象，此时这 6 个长度单位就等同于 `vw`、`vh`、`vi`、`vb`、`vmin`、`vmax`。

| 单位    | 描述                                 |
| ------- | ------------------------------------ |
| `cqw`   | 行向查询容器的 `width` 的 `1%`       |
| `cqh`   | 行块查询容器的 `height` 的 `1%`      |
| `cqi`   | 行向查询容器的 `inline-size` 的 `1%` |
| `cqb`   | 行块查询容器的 `block-size` 的 `1%`  |
| `cqmin` | `cqi` 和 `cqb` 的较小者              |
| `cqmax` | `cqi` 和 `cqb` 的较大者              |

> 上表假设了物理宽度的方向就等于行内方向。

对于 `cqmin` 和 `cqmax` 而言，`cqi` 和 `cqb` 可以分别取自两个不同的查询容器，比如 `cqi` 取自最近的行向查询容器，`cqb` 取自最近的行块查询容器。

```html
<div id="a">
    <div id="b">
        <div id="c">
        	<div id="d"></div>
        </div>
    </div>
</div>

<style>
    #a { container-type: size }
    #b { container-type: inline-size }
    #c { container-type: normal }
    
    #d {
        block-size: 50cqb;  /* a的块向尺寸的50% */
        inline-size: 50cqi; /* b的行向尺寸的50% */
        padding: 5cqmin;    /* min(a的块向尺寸5%, b的行向尺寸5%) */
    }
</style>
```

## CSS 变量

CSS 变量是自定义的 CSS 属性，其名称总是以 `--` 开头，并需通过 `var()` 来调用，CSS 变量有 3 种创建方式。

```
# 方式一
div {
	--width: 100px;
	width: var(--width, 100px);
	
	& * { width: var(--width, 100px) }
}

# 方式二
@property --width {
	syntax: "<length>";
	inherits: false;
	initial-value: 100px;
}

div {
	width: var(--width, 100px)；
	transition: --width 1s ease;
	
	&:hover { --width: 200px }
}

# 方式三
globalThis.CSS.registerProperty({
	name: "--width",
	syntax: "<length>",
	inherits: false,
	initialValue: "100px",
});

div {
	width: var(--width, 100px);
	transition: --width 1s ease;
	
	&:hover { --width: 200px }
}
```

第一种方式最简单，CSS 变量只对当前元素及其后代元素有效，并且后代元素会自动继承该 CSS 变量，该 CSS 变量没有初始值。

第二和第三种方式是一样的，只是使用形式不同。它们创建的 CSS 变量是全局的，并且可以像真正的 CSS 属性那样被 `transition` 属性所影响。但是这两种方式在 Firefox 上的兼容性差，Firefox 直到 125 版本才实现它们。

如果你想为 CSS 变量定义更加复杂的值语法，比如接受多种值或关键字，那么就需要采用第二和第三种方式，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/@property#descriptors) 查看更多信息。

CSS 变量的另一个灵活之处在于，你可以用 JavaScript 来在后期修改它，比如：

```javascript
div.style.setProperty("--width", "200px");
```

CSS 函数 `var()` 的第二个参数是回退值，当第一个参数（CSS 变量）无效时，该 CSS 函数就会返回回退值。你当然可以使用另一个 CSS 变量来作为回退值，比如：

```css
div { var(--width, var(--fallback-width, 100px)) }
```

## 长度单位

### 关于字体的单位

| 名称   | 描述                              |
| ------ | --------------------------------- |
| `cap`  | 当前元素的大写字母的高度          |
| `em`   | 当前元素的 `font-size` 的计算值   |
| `lh`   | 当前元素的 `line-height` 的计算值 |
| `ex`   | 当前元素的字形 `x` 的高度         |
| `ch`   | 当前元素的字形 `0` 的预测尺寸     |
| `ic`   | 当前元素的字形 `水` 的预测尺寸    |
| `rcap` | 根元素的 `cap`                    |
| `rem`  | 根元素的 `em`                     |
| `rlh`  | 根元素的 `lh`                     |
| `rex`  | 根元素的 `ex`                     |
| `rch`  | 根元素的 `ch`                     |
| `ric`  | 根元素的 `ic`                     |

> 水平书写模式下的预测尺寸是指宽度，垂直书写模式下的预测尺寸是指高度，关于预测尺寸（advance measure），详见 [此处](https://developer.mozilla.org/en-US/docs/Glossary/Advance_measure)。
>
> 另外，如果无法预测字形 `0` 的预测尺寸，那么就会假定字形 `0` 的宽度为 `0.5rem`，高度为 `1rem`。

### 关于视口的单位

移动端浏览器的顶部导航栏和底部导航栏会随着手势操作而出现和消失，因为导航栏会挤占视口空间，所以移动端浏览器上的视口尺寸往往是动态的。这会导致 `100vh` 高的元素会溢出小尺寸模式下的视口，因为 `vh` 是视口在大尺寸模式下的 `height` 的 1%。

为了解决这个问题，于是便有了 `sv*`、`lv*`、`dv*` 这些单位，它们之间的关系大致如下：

![视口的高度单位](/css/responsive-design/viewport-height-unit.png)

> 在 iOS 上实测发现，不同浏览器对视口尺寸的处理是不一样的，比如 chrome 上的 vh、svh、lvh、dvh 都是一样的，仿佛虚拟 UI 都被忽略掉的，而 Safari 则又略有不同。

| 名称    | 描述                                        |
| ------- | ------------------------------------------- |
| `vw`    | 视口在大尺寸模式下的 `width` 的 1%          |
| `svw`   | 视口在小尺寸模式下的 `width` 的 1%          |
| `lvw`   | 视口在大尺寸模式下的 `width` 的 1%          |
| `dvw`   | 视口在动态尺寸模式下的 `width` 的 1%        |
| `vh`    | 视口在大尺寸模式下的 `height` 的 1%         |
| `svh`   | 略                                          |
| `lvh`   | 略                                          |
| `dvh`   | 略                                          |
| `vi`    | 视口在大尺寸模式下的根元素行向上的尺寸的 1% |
| `svi`   | 略                                          |
| `lvi`   | 略                                          |
| `dvi`   | 略                                          |
| `vb`    | 视口在大尺寸模式下的根元素块向上的尺寸的 1% |
| `svb`   | 略                                          |
| `lvb`   | 略                                          |
| `dvb`   | 略                                          |
| `vmin`  | `vw` 和 `vh` 的较小者                       |
| `svmin` | `svw` 和 `svh` 的较小者                     |
| `lvmin` | `lvw` 和 `lvh` 的较小者                     |
| `dvmin` | `dvw` 和 `dvh` 的较小者                     |
| `vmax`  | `vw` 和 `vh` 的较大者                       |
| `svmax` | `svw` 和 `svh` 的较大者                     |
| `lvmax` | `lvw` 和 `lvh` 的较大者                     |
| `dvmax` | `dvw` 和 `dvh` 的较大者                     |

### 关于物理的单位

| 名称 | 描述                   |
| ---- | ---------------------- |
| `px` | 一个软件像素           |
| `cm` | 一厘米                 |
| `mm` | 一毫米                 |
| `Q`  | 一毫米的 1/4           |
| `in` | 一英寸，等于 2.54厘米  |
| `pc` | 一派卡，等于 1/6 英寸  |
| `pt` | 一个点，等于 1/72 英寸 |

### 关于容器查询的单位

请参考「容器查询」小节的「长度单位」部分。

## 体验优化

### 点击

对于触控屏来说，指针的位置精度是粗糙的，这是因为手指头是很粗的。如果智能手机上的网页按钮过小，那么就会导致我们的手指头很难击中按钮，Apple 的建议是将最小尺寸设置为 44*44 像素，因此我们可以这样做：

```css
:root {
    /* desktop & laptop */
    --min-block-size: 32px;
    --min-inline-size: 32px;
    
    /* tablet & mobile */
    @media (any-pointer: coarse) {
        --min-block-size: 44px;
        --min-inline-size: 44px;
    }
}

button {
    min-block-size: var(--min-block-size);
}
```

### 悬停

iOS 和 Android 的浏览器上的点击行为会使可交互元素（如按钮、链接、输入框）进入 hover 状态，直到点击了其他的地方。这是不合理的，解决方案如下。

```css
@media (hover: hover) and (pointer: fine) {
    button:hover {}
}
```

### 滚动条

浏览器的滚动条会夹在内边距盒和边框盒之间，对于 MacOS 的桌面端浏览器和所有移动端浏览器而言，滚动条不会挤占元素的内部空间而是悬浮在元素之上，对于 Windows 的桌面端浏览器而言，滚动条会挤占元素的内容盒的空间（不论 box-sizing 是什么），这有时会引发一些问题，比如下例中的 `.child` 会溢出。

```css
.parent {
    overflow: scroll;
    block-size: 100px;
    inline-size: 100px;
    
    > .child {
    	block-size: 100px;
	    inline-size: 100px;
    }
}
```

为此，你或许需要主动计算并减去滚动条的尺寸，下面是一个计算纵向滚动条的宽度的方案：

```javascript
globalThos.innerWidth - document.documentElement.clientWidth
```

其中 `globalThis.innerWidth` 代表视口宽度，它会包含滚动条。`document.documentElement.clientWidth` 代表文档的可用空间，它不包含滚动条。

## 工具

寻找比宽于视口的元素，它来自 Discord 的 SSHari。

```javascript
checkElementWidth(document.body);

function checkElementWidth (element) {
    if (element.clientWidth > globalThis.innerWidth) {
		console.info(
            "The following element has a larger width than " +
            "the window’s outer width"
    	);
    	console.info(element);
	    console.info("\n\n");
    }
    
    [...element.children].forEach(checkElementWidth);
}
```

## 排版

### 字体

设置字体的 CSS 属性叫 `font-family`，之所以称为 `family`，是因为一种字体通常会包含多份字符集，比如字体 Roboto 就包含了 12 份字符集，其中涉及 6 种字重和 2 种字形。

字体有很多种风格，其中最受欢迎的两种风格分别是 `Serif` （衬线）和 `Sans-serif`（无衬线），前者相对后者，其字符笔画的边缘会有更多的修饰。

印刷行业很青睐 `Serif` 风格的字体，因为这种字体看起来更加精致、典雅。但是对于网页，如果屏幕的像素密度不够大，那么就不推荐使用 Serif 风格的字体，因为字符会显得发虚，这是因为屏幕无法精确渲染出字符的细节。

![字体风格](/css/responsive-design/font-style.png)

`font-family` 可以直接指定字体风格，此时操作系统会自动使用属于该风格的默认字体。对于 Windows 11 系统而言，`Sans-serif` 风格的默认字体是 `Segoe UI`，对于 MacOS 而言，则是 `SF Pro`。

```css
font-family: sans-serif;
```

对于外部字体，我们可以通过 `@font-face` 来加载字体资源，其最佳实践是：

```css
@font-face {
    font-family: "Fira Code";
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: local("Fira Code"),
         url("./fira-code-400.woff2") format("woff2"),
         url("./fira-code-400.woff") format("woff"),
         url("./fira-code-400.ttf") format("turetype"),
         url("./fira-code-400.otf") format("opentype");
}

pre, code {
    font-family: "Fira Code";
    font-weight: 400;
    font-style: normal;
}
```

> 我们必须在 `@font-face` 中指定 `font-weight` 和 `font-style`，这是因为 `fira-code-400` 只支持标准字重和非斜体，`pre, code { /* ... */ }` 仅会在 `font-weight: 400` 和 `font-style: normal` 时才使用 Fira Code，否则就会降级使用默认字体。
>
> 如果 `@font-face` 中没有指定 `font-weight` 和 `font-style`，那么浏览器会通过自动加粗和拉斜来使 Fira Code 适应粗体和斜体文本，这种效果这并不美观。

如果我们想要优先下载字体资源，那么可以在 `<head>` 内添加下述标签：

```html
<link href="/fira-code.woff2" as="font" type="font/woff2" rel="preload" crossorigin>
```

对于 CJK 表意文字，外部字体资源往往很大，为了减少网络资源的传输体积，通常有 2 个办法，分别是：1）字体子集化，推荐使用 [fontTools](https://github.com/fonttools/fonttools)；2）字体分割，推荐使用 [cn-font-split](https://github.com/KonghaYao/cn-font-split)；

外部字体的下载需要时间，因此网页需要等待一段时间才能用上外部字体，`font-display` 用于控制等待期间的字体渲染问题，我认为 `font-display: swap` 是大多数情况下的最好选择。

当网页从备用字体切换到外部字体的时候，网页通常会发生闪烁，这个闪烁其实是一种布局偏移。触发该闪烁的原因是，切换前后的两种字体族的间距等属性是不一样的，你可以通过 [这篇文章](https://web.dev/css-size-adjust/) 来详细了解这个闪烁。

如果想要解决这个闪烁，那么请考虑 [size-adjust 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust) 和 [font-style-matcher 工具](https://github.com/notwaldorf/font-style-matcher)，不过这两种手段都很麻烦，因为它的思路是通过反复的手工校准切换前后的字体，来使切换前后的字体可以尽可能的拥有相似的布局。

### 字号

所有浏览器的默认字体的大小都是 16px，这是前辈们为你设定好的最佳的选择了，不要改动它，让文章字号保持为 16px 吧。

如果你想增大或缩小字体，那么请用百分比（如 `font-size: 125%`），而不要使用 px 这种绝对尺寸（如 `font-size: 18px`），因为这会使字号失去响应性。具体来说，浏览器可以设置字体的默认字号（如特小、小、中、大、特大），它是通过将根元素的默认字号改变成某个绝对字号来实现的，如果你设置了 `font-size: 18px`，那么无论用户如何设置浏览器，根元素的字号都将是 `18px`，而 `font-size: 125%` 则不会引发该问题，因为它代表字号为原尺寸的 1.25 倍。

表单元素的默认字号都更小，比如 `<input>` 的字号是 13.3333px，这在移动设备上会很难阅读，所以请总是将它们放大为正常的字号。

```css
input, select, textarea {
	font-size: 1rem;
}
```

### 标题

正文的字号就应该使用 16px，标题的字号则应该使用流体排版（即流体布局），因为同一个等级的标题在桌面端浏览器上应该显示的更大（比如 2.5rem），在移动端浏览器上则应该显示的稍微小一些（比如 1.75rem）。

```css
h1 {
    font-size: clamp(1.75rem, 4vw + 1rem, 2.5rem);
}
```

Josh 做了一个可视化的工具来帮助我们创建 clamp 公式，请查看 [这里](https://courses.joshwcomeau.com/css-for-js/05-responsive-css/16-fluid-calculator)。同样的，我也创建了一个工具，但是它更简洁，请查看 [这里](https://jynxio.github.io/fluid-calculator/)。

### 字重

`font-weight` 可以设置字重，当 `font-weight: bold` 时，哪怕字体文件中不包含粗体的字符集，浏览器也会通过自动加粗来模拟粗体效果，只不过这种效果并不漂亮。

### 字形

`font-style` 可以设置字重，当 `font-style: italic` 时，哪怕字体文件中不包含斜体的字符集，浏览器也会通过自动拉斜来模拟斜体效果，只不过这种效果并不漂亮。

### 语义化

屏幕阅读器会根据 HTML 标签的语义来选择朗读的方式，比如 `<em>` 中的内容会被重读，所以要用正确的 HTML 标签来包裹文本。

> 自 HTML 5 施行之后，`<i>` 和 `<b>` 就被废弃了，请勿再使用它们，尽管仍有很多人在使用。

### 断行与分段

如果文本行太长了，那么阅读体验就会变差，因此我们需要在合适的位置断行，比如：

```css
article { max-inline-size: 50ch }
```

如果页面宽度大，那么我们还可以考虑分列：

```css
@media (width >= 110ch) {
    article { column-count: 2 }
}
```

> `ch` 和 `ic` 是最适合用来判断行长了。

断行与分段的关键是合适的断点，[《The Elements of Typographic Style Applied to the Web》](http://webtypography.net/2.1.2) 中提到 “对于单列文章而言，45～75个字符（包括空格）都是较好的行长，尤其是66个字符。对于多列文章而言，40～50个字符则更加合适”。

## 色觉缺陷

FireFox 和 Chrome 的开发者工具都可以模拟色觉缺陷的视觉效果，在 FireFox 中是 `开发者工具 -> 无障碍环境 -> 模拟`，在 Chrome 中是 `开发者工具 -> 渲染选项卡 -> 模拟视觉缺陷`。

## 虚拟键盘

智能手机使用虚拟键盘来代替实体键盘，你可以通过参阅 [这篇文章](https://web.dev/learn/design/interaction/#virtual-keyboards) 来学习如何优化虚拟键盘，这些优化是指：

- 如何唤醒整数数字键盘；
- 如何唤醒浮点数数字键盘；
- 如何让虚拟键盘自动联想出相关内容，比如电话号码、邮箱、国家。
