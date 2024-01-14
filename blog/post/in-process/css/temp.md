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

### 调用方式

我们可以在 html、css、js 文件中使用媒体查询。另外，无论媒体查询的结果是什么，`<link>` 和 `@import` 都会下载资源。

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

媒体特性（Media Feature）描述了用户代理的各种特征。

| 名称                     | 作用                               |          |
| ------------------------ | ---------------------------------- | -------- |
| `hover`｜`any-hover`     | 悬停                               |          |
|                          |                                    |          |
|                          |                                    |          |
|                          |                                    |          |
|                          |                                    |          |
|                          |                                    |          |
| `width`                  | 显示区域的宽度，如视口或页面框。   | 范围特性 |
| `height`                 | 显示区域的高度。                   | 范围特性 |
| `aspect-ratio`           | 显示区域的宽高比。                 | 范围特性 |
| `orientation`            | 设备的方向（纵向或横向）。         | 离散特性 |
| `resolution`             | 输出设备的分辨率。                 | 范围特性 |
| `color`                  | 设备的颜色能力。                   | 范围特性 |
| `color-index`            | 设备的颜色索引能力。               | 范围特性 |
| `monochrome`             | 设备的单色能力。                   | 范围特性 |
| `update`                 | 输出设备更新其外观的速度。         | 离散特性 |
| `hover`                  | 主输入机制是否能悬停在元素上。     | 离散特性 |
| `pointer`                | 主输入机制的精度。                 | 离散特性 |
| `prefers-reduced-motion` | 用户是否偏好减少动画。             | 离散特性 |
| `prefers-color-scheme`   | 用户是否偏好浅色或深色配色方案。   | 离散特性 |
| `grid`                   | 设备是否使用网格或位图屏幕。       | 离散特性 |
| `scan`                   | 输出设备的扫描过程（逐行或隔行）。 | 离散特性 |
| `display-mode`           | 应用程序的显示模式。               | 离散特性 |

### 主要输入机制及其对悬停和指针的支持程度

常见设备的主要输入机制如下。

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

所有输入机制对悬停和指针的支持情况如下。

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

### hover

```css
@media (hover: hover) {
    /* 如果至少有一种主要输入机制支持悬停 */
}

@media (hover: none) {
    /* 如果所有的主要输入机制都不支持悬停 */
}
```

### any-hover

```css
@media (any-hover: hover) {
    /* 如果至少有一种输入机制支持悬停 */
}

@media (any-hover: none) {
    /* 如果所有的输入机制都不支持悬停 */
}
```

### pointer

```css
@media (pointer: none) {
    /* 如果主要输入机制中不包含指针 */
}

@media (pointer: coarse) {
    /* 如果主要输入机制中包含指针，且位置精度是粗糙的 */
}

@media (pointer: fine) {
    /* 如果主要输入机制中包含指针，且位置精度是精确的 */
}
```

### any-pointer

```css
@media (any-pointer: none) {
    /* 如果所有输入机制中都不包含指针 */
}

@media (any-pointer: coarse) {
    /* 如果至少有一种输入机制是指针，且位置精度是粗糙的 */
}

@media (any-pointer: fine) {
    /* 如果至少有一种输入机制是指针，且位置精度是精确的 */
}
```

### color

此媒体特性用于测试用户代理的色深，即每个颜色通道的位数，如果不同颜色通道的位数是不一样的，则取最小位数来作为用户代理的色深，如果采用了索引颜色表，则采用最小位数来作为用户代理的色深。

取值：`<integer>`，如果用户代理不支持彩色，则该值为 `0`。

```css
@media (color: 8) {
    /* 如果色深为8 */
}

@media (min-color: 8) {
    /* 如果色深不小于8 */
}

@media (max-color: 8) {
    /* 如果色深不大于8 */
}
```

### color-gamut

此媒体特性用于测试用户代理的色域。

```css
@media (color-gamut: srgb) {
    /* 如果色域近似于或大于sRGB */
}

@media (color-gamut: p3) {
    /* 如果色域近似于或大于Display P3 */
}

@media (color-gamut: rec2020) {
    /* 如果色域近似于或大于 ITU-R Recommendation BT.2020 */
}
```

### color-index

此媒体特性用于测试用户代理是否使用了索引颜色表以及索引颜色表的总条目数。

取值：`<integer>`，如果用户不使用颜色索引表，则该值为 `0`。

```css
@media (color-index: 10000) {
    /* 如果总条目数为10000 */
}

@media (min-color-index: 10000) {
    /* 如果总条目数不小于100000 */
}

@media (max-color-index: 10000) {
    /* 如果总条目数不大于100000 */
}
```

### 逻辑运算

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



## 图像和排版

流体排版、文本、字体、图像



# 其他

国际化、色觉缺陷、虚拟键盘、主题切换



