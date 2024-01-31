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

我们可以根据 [这里](https://gs.statcounter.com/screen-resolution-stats) 的统计数据来设置合适的尺寸断点，或者直接采纳下面这个适用于当前的结论：1）Mobile：0-550px；2）Tablet：550-1100px；3）Laptop：1100-1500px；4）Desktop：1500+px。

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

容器查询（Container queries）用于根据祖先元素的特征来选择性的应用不同的 CSS 样式。

```html
<section class="a">
	<section class="b">
    	<section class="c"></section>
    </section>
</section>

<style>
    .a { container: a / size }
    .b { container: b / size }

    /* 匿名查询，查询容器为b */
    @container (inline-size >= 100cqi) { .c {} }
    
    /* 具名查询，查询容器为a */
    @container a (block-size >= 100cqb) { .c {} }
    
    /* 嵌套查询，查询容器依次为a和b */
    @container a (block-size >= 100cqb) {
        @container b (inline-size >= 100cqi) { .c {} }
    }
</style>
```

### 查询容器

查询容器是指被作为查询目标的祖先元素，请使用 `container-type` 来初始化查询容器，用 `container-name` 来命名查询容器，或直接使用它们的简写属性 `container`。

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

> `container-name` 支持以空格为分隔符来输入多个名字，名字可以使用各种命名方法，我青睐与烤肉串命名法。

`container-type` 有 3 个值，但是只有 `size` 和 `inline-size` 才能变成查询容器。

| 取值          | 描述                                   |
| ------------- | -------------------------------------- |
| `normal`      | 不变成查询容器（默认值）               |
| `size`        | 变成查询容器，支持行向和块向尺寸的查询 |
| `inline-size` | 变成查询容器，仅支持行向尺寸的查询     |

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

## CSS 变量

媒体查询和容器查询中都可以使用 CSS 变量，这极大扩展了容器查询和媒体查询的能力（真的可以用吗？），比如：

```
@container style(--accent-color: blue) {
  /* <stylesheet> */
}

/* 媒体查询可以写这个吗？其他更简单的css变量的用法呢？ */
```

## 长度单位

容器查询的长度单位

| 单位    | 描述                           |
| ------- | ------------------------------ |
| `cqw`   | 容器元素的 `width` 的 1%       |
| `cqh`   | 容器元素的 `height` 的 1%      |
| `cqi`   | 容器元素的 `inline-size` 的 1% |
| `cqb`   | 容器元素的 `block-size` 的 1%  |
| `cqmin` | `cqi` 和 `cqb` 的最小者        |
| `cqmax` | `cqi` 和 `cqb` 的最大者        |

```html
<section>
	<div></div>
</section>

<style>
    /* Section 1: Enable container queries */
    section {
        width: 100px;
        
        > div {
            width: 1cqw; /* equal to 1vw */
        }
    }

    /* Section 2: Disable container queries */
    section {
        width: 100px;
        container-type: inline-size;
        
        > div {
            width: 1cqw; /* equal to (100px * 1%) */
        }
    }
</style>
```

1

## TODO

移动端浏览器的顶部导航栏、底部控制栏、虚拟键盘等虚拟 UI 都会影响视口的高度（甚至宽度），进而影响到依赖视口和初始包含快的高度单位（因为视口的尺寸会影响初始包含块的尺寸），详见下表。

设置 meta 标签的 interactive-widget 属性来避免视口和可用视口单位的长度被虚拟 UI 的出现而影响（比如虚拟键盘）

在 iOS 上实测发现，interactive-widget 属性没生效，并且不同浏览器 chrome、safari 对虚拟 UI 的处理也不一样，chrome 把虚拟 UI 都忽略掉了，它会让所有 vh svh lvh dvh 都呈现一样

这里是属性介绍 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Viewport_meta_tag

还有关于高度单位的有意思的推特：https://twitter.com/aaroniker_me/status/1706311305030680598/photo/1

1

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

## 媒体查询

使用 em 或 rem 而不是 px，这样可以响应浏览器文本大小的变化而变化

## 图像和排版

流体排版、文本、字体、图像



# 其他

国际化、色觉缺陷、虚拟键盘、主题切换



