# 响应式设计

## 概述

网页会显示在形状和尺寸各异的各种电子设备的屏幕上，为了保证网页可以被恰当的展示，我们需要使用一些 CSS 技巧来使我们的网页可以自适应的变化，这便是本文要讨论的话题。

能够自适应变化的网页有什么优点？比如：

- 不会在高分辨率屏幕下缩水；
- 不会在小尺寸屏幕下溢出或出现丑陋的滚动条；
- 字号在小尺寸屏幕下适当的缩小以便于展示更多的文字；
- 段落之间的间隙会在障碍人士的特大字号模式下自动变大以便于不会过于紧凑；

## 屏幕的像素

Apple 在很久以前便开始推广使用「视网膜屏幕」，这是一个唬人的营销话术，实际上视网膜屏幕就是像素密度更高的屏幕，通过增加屏幕的像素密度来使人类在正常的观看距离下

现在，许多电子设备的屏幕都采用了「视网膜显示屏」，视网膜显示屏是指像素密度超过某个阈值的屏幕，

## 布局的类型

| 名称         | 描述                         | 自适应 | 推荐 |
| ------------ | ---------------------------- | ------ | ---- |
| 固定宽度布局 | 采用固定尺寸                 | 🚫      | 🚫    |
| 自适应布局   | 结合了固定宽度布局和媒体查询 | ✅      | 🚫    |
| 流体布局     | 采用可变尺寸                 | ✅      | ✅    |
| 响应式布局   | 结合了流体布局和媒体查询     | ✅      | ✅    |

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

媒体查询（Media queries）用于根据用户代理或设备的媒体类型和媒体特性来应用特定的样式。

```css
@media only screen and ((not (aspect-ratio: 1/1)) or (resolution >= 2dppx)) {}
```

### 调用方式

我们可以在 html、css、js 文件中使用媒体查询。

```html
<style media="screen"></style>

<source src="" media="screen" />

<link rel="stylesheet" src="" media="screen" />
```

> 无论媒体查询的结果是什么，`<link>` 都会下载资源，只不过下载的优先级更低。

```css
@media screen {}

@import url("landscape.css") screen;
```

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

### 媒体类型

媒体类型（Media Type）描述了用户代理的类型，它只有 3 种值：

| 值       | 描述                               |
| -------- | ---------------------------------- |
| `all`    | 任何设备（默认值）                 |
| `screen` | 屏幕设备                           |
| `print`  | 打印机、处于打印预览模式的其他设备 |

```css
@media screen {}
```

> 根据 [Media Queries 4](https://drafts.csswg.org/mediaqueries/#media-types) 的描述，所有的媒体类型都会在未来被废除掉，因为规范正致力于通过改进媒体特性来使其可以完全区分出不同的设备，届时就不再需要媒体类型。

### 媒体特性

媒体特性（Media Feature）是指媒体查询所支持的查询规则，媒体特性都是关于用户代理的各种特征的描述，下面便是所有的媒体特性：

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

下面是常见设备的主要输入机制如下，`hover`、`any-hover`、`pointer`、`any-pointer` 需要用到这些信息。

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

下面是所有输入机制对悬停和指针的支持情况，`hover`、`any-hover`、`pointer`、`any-pointer` 需要用到这些信息。

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

### 关键字

关键字 `only` 用于确保媒体查询语句只会被现代浏览器所应用，它有 2 个硬性要求：

- 写在句首；
- 其后紧跟媒体类型；

```css
/* 🙅🏻 不要 */
@media only (10rem < width < 30rem) {}

/* 🙅🏻 不要 */
@media all and only (10rem < width < 30rem) {}

/* 💁🏻 推荐 */
@media only all and (10rem < width < 30rem) {}
```

旧版浏览器会将 `@media screen and (10rem < width <30rem) {}` 当作 `@media screen {}`，因为旧版浏览器不认识 `(10rem < width < 30rem)`。为了避免这种情况，规范创造了一个新的关键字 `only`，它只被现代浏览器所识别，因此如果把它放在媒体查询语句的句首，那么旧版浏览器就会因为不认识 `only` 关键字而忽略掉整个媒体查询。

我不知道为什么它其后必须紧跟媒体类型，我只知道这是规范的要求。

### 逻辑运算

| 运算符      | 描述 |
| ----------- | ---- |
| `not`       | 非   |
| `and`       | 与   |
| `or` 与 `,` | 或   |

> `,` 两侧是两个独立的媒体查询，多个媒体查询组合形成媒体查询列表，`not` 只能作用于其中一个媒体查询，而不能作用于媒体查询列表。

最佳实践：

- 使用 `or` 来替代 `,`：因为 `or` 和 `,` 的作用相同且语义更明显；
- 总是明确的书写 `()`：因为逻辑运算符的优先级很混乱，书写 `()` 可以避免意外；

```css
/* 🙅🏻 不要 */
@media screen and not (aspect-ratio: 1/1) or (resolution >= 2ddpx) {}

/* 💁🏻 推荐 */
@media screen and ((not (aspect-ratio: 1/1)) or (resolution >= 2dppx)) {}
```

## 容器查询

容器查询（container queries）用于根据查询容器的容器特性来应用特定的样式。

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
    @container (inline-size >= 100cqi) {
        .c {}
    }
    
    /* 具名查询，查询容器为a */
    @container a (block-size >= 100cqb) {
        .c {}
    }
    
    /* 嵌套查询，查询容器依次为a和b */
    @container a (block-size >= 100cqb) {
        @container b (inline-size >= 100cqi) {
            .c {}
        }
    }
</style>
```

### 查询容器

如果你要使用容器查询，那么就必须先指定至少一个查询容器，因为查询容器是容器查询的参照物。你之所以不需要为媒体查询指定参照物，是因为媒体查询已经将用户代理设作为其参照物了。

请使用 `container-type` 来创建查询容器，用 `container-name` 来命名查询容器，或直接使用简写属性 `container`，其语法如下：

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

如果 `container-type` 非 `normal`，那么当前元素就会变成查询容器，如果为查询容器指定了 `container-name`，那么这就是具名查询容器，否则便是匿名查询容器，`container-name` 支持一至多个名字，你可以用小驼峰命名法、大驼峰命名法、蛇形命名法、烤肉串命名法等方法来命名这些名字。

```
container-type: normal | size | inline-size
container-name: name-1 name-2 name-3 name-4
```

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

其中，`container-type: size` 的查询容器的尺寸隔离是行向和块向的，`container-type: inline-size` 则是行向的。你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/contain) 了解每一种隔离方式的具体作用。

### 容器特性

容器特性是指容器查询所支持的查询规则，容器特性要比媒体特性少得多，下面便是所有的容器特性：

| 容器特性     | 取值                      | 描述               |
| ------------ | ------------------------- | ------------------ |
| width        | `<length>`                | 容器的宽度         |
| height       | `<length>`                | 容器的高度         |
| block-size   | `<length>`                | 容器的块向尺寸     |
| inline-size  | `<length>`                | 容器的行向尺寸     |
| orientation  | `landscape` 或 `portrait` | 宽度更大或高度更小 |
| aspect-ratio | `<ratio>`（如 `1/1`）     | 宽度与高度之比     |

### 逻辑运算符

| 运算符 | 描述 |
| ------ | ---- |
| `and`  | 与   |
| `not`  | 非   |
| `or`   | 或   |

容器查询有 2 个特别的禁令：

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

## 媒体查询

使用 em 或 rem 而不是 px，这样可以响应浏览器文本大小的变化而变化

## 图像和排版

流体排版、文本、字体、图像



# 其他

国际化、色觉缺陷、虚拟键盘、主题切换



