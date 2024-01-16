# 响应式设计

## 概述

网页会显示在形状和尺寸各异的各种电子设备的屏幕上，为了保证网页可以被恰当的展示，我们需要使用一些 CSS 技巧来使我们的网页可以自适应的变化，这便是本文要讨论的话题。

能够自适应变化的网页有什么优点？比如：

- 不会在高分辨率屏幕下缩水；
- 不会在小尺寸屏幕下溢出或出现丑陋的滚动条；
- 字号在小尺寸屏幕下适当的缩小以便于展示更多的文字；
- 段落之间的间隙会在障碍人士的特大字号模式下自动变大以便于不会过于紧凑；

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

媒体查询（Media queries）用于根据设备的媒体类型和媒体特性来应用特定的样式。

### 语法

```css
@media screen, print {}

@media screen and (width >= 900px) {}

@media (30em <= width <= 50em) {}
```



### 调用方式

我们可以在 html、css、js 文件中使用媒体查询。另外，无论媒体查询的结果是什么，`<link>` 都会下载资源，只不过下载的优先级更低。

```html
<style media="screen"></style>

<source src="" media="screen" />

<link rel="stylesheet" src="" media="screen" />
```

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

媒体特性（Media Feature）描述了用户代理的各种特征，下面是所有的媒体特性：

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

### 逻辑运算

not, and, only, `,`

逗号代表或，and 代表且

```
@media screen and (min-width: 30em) and (orientation: landscape) {
  /* … */
}

@media (min-height: 680px), screen and (orientation: portrait) {
  /* … */
}
```

not 一定会反转媒体查询列表中的一个媒体查询而不是这个媒体查询里的一部分

```
@media not all and (monochrome) {
  /* … */
}

等价于

@media not (all and (monochrome)) {
  /* … */
}

@media not screen and (color), print and (color) {
  /* … */
}

等价于

@media (not (screen and (color))), print and (color) {
  /* … */
}
```

`only` 关键字用于媒体查询（Media Queries），它用来限定样式仅适用于特定类型的设备，而不会被老旧的浏览器（不支持媒体查询的浏览器）应用。这样可以防止在旧版浏览器中出现意外的布局问题。

例如，你可能想要编写一些仅适用于屏幕（而非打印机等其他媒体类型）的样式。在这种情况下，可以使用 `only` 关键字。这里有一个使用 `only screen` 的例子：

```
@media only screen and (max-width: 600px) {
    body {
        background-color: lightblue;
    }
}
```

这段代码的意思是：仅当媒体类型是屏幕且视口宽度不超过 600 像素时，应用这些样式。这里的 `only` 关键字确保了这些样式不会被不支持媒体查询的旧浏览器应用，从而避免了潜在的布局问题。

在现代前端开发中，大多数情况下你可能不需要经常使用 `only`，因为大多数现代浏览器都支持媒体查询。但在某些情况下，特别是需要确保兼容性的场合，使用 `only` 是一个很好的做法。

`or` 关键字的作用也是或，但它的可读性更好，它和 `,` 不同的地方在于，一个媒体查询中似乎不能同时含有 or 和 not，否则会语法错误（我还没有找到权威资料，实践看起来是这样的，又或者是运算符的优先级在干扰）。

## 容器查询

媒体查询、容器查询、CSS 变量

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

### 图像

resolution 媒体特性

## 图像和排版

流体排版、文本、字体、图像



# 其他

国际化、色觉缺陷、虚拟键盘、主题切换



