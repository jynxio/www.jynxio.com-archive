# 响应式设计

## 布局类型

### 固定宽度布局

固定宽度布局是指使用固定的宽度来设计网页的布局。固定宽度布局的通用性很差，因为现代设备的尺寸的多样性太丰富了。

比如这就是一个固定宽度布局：

```css
body {
    width: 1980ox;
}
```

### 流体布局

流体布局又称为液体布局、灵活布局，它是指使用列宽的百分比来设计网页的布局。流体布局在极端尺寸下的表现并不好，比如在宽屏上会显得拉伸，在窄屏上会显得压扁。

比如这就是一个流体布局：

```css
body {
    width: 50%;
}
```

### 自适应布局

自适应布局是固定宽度布局和 CSS 媒体查询的混合体，自适应布局会拥有多套固定宽度布局方案，然后根据 CSS 媒体查询的结果，来为不同尺寸的设备应用不同的方案。自适应布局还不够完美，因为现代设备的尺寸的多样性太丰富了，而自适应布局的方案数是有限的。

### 响应式布局

响应式布局是流体布局和 CSS 媒体查询的混合体。

## 媒体查询

媒体查询用于帮助我们将样式应用至特定的设备。

### 查询媒体类型

我们可以通过指定媒体的类型，来为特定类型的媒体应用特定的样式，我们有 2 种编写方法：

1. 在样式表内编写：

   我们先将网页在所有类型的媒体上的背景色设置为黑色，然后再将网页被打印时的背景色设置为透明色，这样可以节省打印机的墨水。

   ```css
   body {
       background-color: black;
   }
   
   @media print {
       body {
           background-color: transparent;
       }
   }
   ```

2. 在 `<link>` 标签内编写：

   我们先设置网页在所有类型的媒体上使用 `global.css`，然后再设置网页在被打印时使用 `print.css`。

   ```css
   <link rel="stylesheet" href="global.css">
   <link rel="stylesheet" href="print.css" media="print">
   ```

> 如果我们没有为 CSS 块和 `<link>` 标签指定任何媒体类型，那么它们就会使用默认的媒体类型，这个默认的媒体类型是 `all`。

### 查询条件

我们可以通过指定特殊的条件，来为满足特殊条件的所有类型的媒体应用特定的样式。比如，我们可以根据浏览器窗口是处于横向模式（视口宽度大于视口高度）还是纵向模式（视口高度大于视口宽度），来为其应用不同的样式。

我们有 2 种编写方法：

1. 在样式表内编写：

   ```css
   @media ( orientation: landscape ) {
       /* 横向模式的样式 */
   }
   @media ( orientation: portrait ) {
       /* 纵向模式的样式 */
   }
   ```

2. 在 `<link>` 标签内编写：

   ```html
   <link rel="stylesheet" href="landscape.css" media="(orientation: landscape)">
   <link rel="stylesheet" href="portrait.css" media="(orientation: portrait)">
   ```

### 响应尺寸

对于响应式布局，最有用的查询条件之一就是浏览器视口的尺寸，比如：

```css
@media ( min-width: 100vh ) {
    /* 该样式仅在视口宽度大于或等于视口高度时生效 */
}
@media ( max-width: 100vh ) {
    /* 该样式仅在视口宽度小于或等于视口高度时生效 */
}
```

### 组合使用

我们可以把查询媒体类型和查询条件结合在一起来使用，比如：

```css
@media all and ( orientation: landscape ) {
   /* 横向模式的样式 */
}
@media all and ( orientation: portrait ) {
   /* 纵向模式的样式 */
}
```

```html
<link rel="stylesheet" href="landscape.css" media="all and (orientation: landscape)">
<link rel="stylesheet" href="portrait.css" media="all and (orientation: portrait)">
```

也可以把多个查询条件结合在一起来说用，比如：

```css
@media ( min-width: 100vh ) and ( max-width: 200vh ) {
  /* 该样式仅在视口宽度大于一倍视口高度、小于两倍视口高度时生效 */
}
```

### 媒体特性手册

请参考这两篇文章，但它们都没有包含所有的媒体特性。

- https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media

## 国际化

汉语、英语的阅读习惯是从左到右，而阿拉伯语、希伯来语的阅读习惯是从右到左，为了使你的站点可以在不同阅读习惯的语种国家中正常的显示，请使用逻辑属性来替代方向属性，比如：

```css
/* 禁用 */
label {
    margin-top: 1em;
    margin-right: 1em;
}
/* 请用 */
label {
    margin-block-start: 1em;
    margin-inline-end: 1em;
}
```

详见 [Learn Responsive Design - Internationalization](https://web.dev/learn/design/internationalization/)。

> 请注意，目前媒体查询中的查询条件还不支持逻辑属性，即 `@media ( min-inline-size: 100vh ) {}` 是不起作用的。

## 宏布局

宏布局是指可以响应多种不同尺寸的媒体的布局。

详见 [Learn Responsive Design - Macro layouts](https://web.dev/learn/design/macro-layouts/)。

## 微布局

微布局是指组件层面的布局，即为组件设计样式，而非为页面设计样式。另外，Chrome 推出了一个 [容器查询](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) 特性，这是一个和媒体查询平级的有趣特性，不过目前它仅支持最新的 Chromium (PC) 和 Safari (PC & iOS)。

另外，关于微布局，有一个“容器查询”新特性

详见 [Learn Responsive Design - Micro layouts](https://web.dev/learn/design/micro-layouts/)。

## 文字

### 固定字号

如果网页被显示在小屏幕上，那么我们就应该使用更小的字号，如果网页被显示在大屏幕上，那么我们就应该使用更大的字号。之所以要这么做，是因为用户的眼睛往往距离小屏幕更近，距离大屏幕更远，想象一下我们使用智能手机和投影仪时的场景。

下例是一个固定字号的例子：

```css
@media ( min-width: 30em ) {
    html { font-size: 125%; }
}

@media ( min-width: 40em ) {
    html { font-size: 150%; }
}

@media ( min-width: 50em ) {
    html { font-size: 175%; }
}

@media ( min-width: 60em ) {
    html { font-size: 200%; }
}
```

不过，固定字号方案有一个明显的缺陷，那就是字号会在断点（查询条件变为真的点）处发生突变。比如在上例中，当页面宽度为 `39em` 时，字号大小是 `1.25` 倍，当页面宽度稍微增长到 `40em` 时，字号就会猛增至 `1.5` 倍。

为了解决固定字号方案的这个缺陷，于是便有了弹性字号方案。

### 弹性字号

弹性字号方案可以解决固定字号方案的缺陷，它的做法就是让字号与页宽挂钩，请看下面的例子：

```css
html {
    font-size: clamp( 1rem, 0.75rem + 1vw, 2rem );
}
```

上例中，字号会随着页宽的变化而变化，这可以让字号的过渡显得更加自然，并且我们限制了字号的极限大小，这样就不用担心字号在窄屏幕上变得太小，在宽屏幕上变得太大了。如果你不熟悉 `clamp`，那么请见 [MDN - clamp](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clamp)。

#### 陷阱 1

请不要像下面这样编写弹性字号方案，因为这会导致无论用户如何缩放网页，网页字体的大小都不会变化。

```css
html {
    font-size: clamp( 1rem, 1vw, 2rem );
}
```

#### 陷阱 2

请不要像下面这样编写弹性字号方案，因为这会导致字号在窄屏幕下变得太小，在宽屏幕下变得太大。

```css
html {
    font-size: clacl( 0.75rem + 1vw );
}
```

### 断行 & 分段

如果文本行的行长太长了，那么就会破坏阅读的体验，因此我们需要在合适的位置断行。如果页面宽度有充分的余量，那么我们还可以进行分列。

```css
/* 分段 */
@media { min-width: 110ch } {
    article { column-count: 2; }
}

/* 断行 */
article {
    max-inline-size: 50ch;
}
```

> 请使用 `ch` 和 `ic` 来作为断行的长度单位，`ch` 代表阿拉伯数字 `0` 的宽度，`ic` 代表 CJK 表意文字 `水` 的宽度。

断行与分段的关键之一是合适的断点，[《The Elements of Typographic Style Applied to the Web》](http://webtypography.net/2.1.2) 中提到：

```
Anything from 45 to 75 characters is widely regarded as a satisfactory length of line for a single-column page set in a serifed text face in a text size. The 66-character line* (*counting both letters and spaces*) *is widely regarded as ideal. For multiple column work, a better average is 40 to 50 characters

对于单列文章而言，45～75个字符（包括空格）都是较好的行长，尤其是66个字符。对于多列文章而言，40～50个字符则更加合适。
```

### 行高

行高越大，越不利于读者的眼睛从上一行的末尾移动到下一行的开头，因此较短的文本行可以拥有较大的行高，但是较长的文本行则不应使用较大的行高。

另外，你应该使用 `line-height: 1.5`，而不要使用 `line-height: 24px`，因为这样可以确保文本行的行高可以自动适应 `font-size` 的大小。

### 字体族

#### 加载 & 使用

我们可以通过 `@font-face` 来为网页添加外部的字体族资源。

```css
@font-face {
    font-family: "Fira Code";
    src: url( "/font/fira-code.woff2" ) format( "woff2" );
}
```

因为我们在 `@font-face` 中将外部的字体族资源命名为了 `Fira Code`，所以我们可以通过 `font-family: "Fira Code"` 来直接使用这个字体族。

```css
html {
    font-family: "Fira Code";
}
```

#### 字形 & 字重

因为 `Fira Code` 字体不支持细体、粗体、斜体，所以我们需要在 `@font-face` 中补充 `font-style: normal` 和 `font-weight: normal`。

这样做的用处是，仅当元素的 `font-style` 和 `font-weight` 均为 `normal` 时，`Fira Code` 字体族才会生效，否则就不会生效（回退到使用默认字体族）。

```css
@font-face {
    font-family: "Fira Code";
    font-style: normal;
    font-weight: normal;
    src: url( "/font/fira-code.woff2" ) format( "woff2" );
}

/* Fira Code生效 */
p.italic {
    font-familg: "Fira Code";
    font-style: italic;
}

/* Fira Code不生效 */
p.normal {
    font-familg: "Fira Code";
    font-style: normal;
}
```

如果我们不增加这两条规则，那么浏览器就会通过强行加粗和拉斜来使 `Fira Code` 适应粗体和斜体文本。不过强行加粗和拉斜的效果并不美观，而我们使用字体的目的不就是为了美观吗？

#### 可变字体

另外，有些字体族可以自适应斜体和不同的字重，这是因为这些字体族文件的内部包含了多套字形，我们把这些字体族称为“可变字体”。可变字体的好处是更加易用，坏处是体积更大，因为它们包含了更多的字形数据。

不过，现在越来越多的系统字体已经变成了可变字体，比如 `system-ui`。

#### 短路加载

我们可以通过 `@font-face` 中的 `src` 属性来让浏览器短路加载字体族资源，这可以加速字体族资源的加载，具体做法是：

```css
@font-face {
    font-family: "Fira Code";
    src: local( "Fira Code" ),
         url( "/font/fira-code.woff2" ) format( "woff2" ),
         url( "/font/fira-code.woff" ) format( "woff" ),
         url( "/font/fira-code.ttf" ) format( "ttf" );
}
```

其工作原理如下：

1. 浏览器检查本地机器中是否存在名为 `Fira Code` 的字体族资源：
   1. 如果不存在，则跳转到 2。
   2. 如果存在，则直接使用该字体族资源，然后结束。
2. 浏览器检查自身是否支持 `woff2`：
   1. 如果不支持，则跳转到 3。
   2. 如果支持，则尝试下载 `/font/fira-code.woff2` 的字体族资源：
      1. 如果下载失败，则跳转到 3。
      2. 如果下载成功，则直接使用该字体族资源，然后结束。
3. 浏览器检查自身是否支持 `woff`：
   1. 如果不支持，则跳转到 4。
   2. 如果支持，则尝试下载 `/font/fira-code.woff` 的字体族资源：
      1. 如果下载失败，则跳转到 4。
      2. 如果下载成功，则直接使用该字体族资源，然后结束。
4. 浏览器检查自身是否支持 `tff`：
   1. 如果不支持，则跳转到 5。
   2. 如果支持，则尝试下载 `/font/fira-code.ttf` 的字体族资源：
      1. 如果下载失败，则跳转到 5。
      2. 如果下载成功，则直接使用该字体族资源，然后结束。
5. 浏览器使用默认字体来替代 `Fira Code`。

#### 优先加载

我们可以通过 `<link>` 标签来让浏览器优先下载我们的字体族资源，具体做法是：

```html
<head>
    <link href="/font/fira-code.woff2" as="font" type="font/woff2" rel="preload" crossorigin>
</head>
```

`rel="preload"` 属性用于告知浏览器优先下载该资源。`as="font"` 用于告知浏览器该资源的类型。`type="font/woff2"` 用于进一步告知浏览器该资源的类型。`crossorigin` 用于告知浏览器使用 CORS 来获取资源，并且无论你的字体族资源是否被托管在别的域，你都必须设置该属性，否则浏览器就会不加载。

#### 切换字体族

下载外部的字体族资源需要时间，因此网页需要等待一段时间才能使用上外部的字体族，那么我们的网页在这个等待的期间会怎样渲染字体呢？

我们可以通过在 `@font-face` 中定义 `font-display` 属性来控制等待期间的字体渲染，它有 5 种取值：`auto`、`block`、`swap`、`fallback`、`optional`。

我认为下例是大多数情况下的最佳选择。

```css
@font-face {
    font-family: "Fira Code";
    font-display: swap;
    src: url( "/font/fira-code.woff2" ) format( "woff2" );
}
```

- 网页会先经历一个极短的无字时间：
  - 如果在此期间，网页还没有加载好外部的字体族资源，那么任何使用该字体族资源的元素都会渲染不可见的后备字体，这看起来就像是没有渲染字体。
  - 如果在此期间，网页加载好了外部的字体族资源，那么就立即使用该字体族组件。
- 网页会进入到无限长的有字时间：
  - 如果在此期间，网页还没有加载好外部的字体资源，那么任何使用该字体族资源的元素都会渲染后备字体。
  - 如果在此期间，网页加载好了外部的字体族资源，那么就立即使用该字体族组件。

你可以通过 [MDN - font-display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face/font-display#Browser_compatibility) 来了解其他用法。

#### 切换时闪烁

切换字体族时，网页通常发生闪烁，这个闪烁其实是一种布局偏移。触发该闪烁的原因是，切换前后的两种字体族的间距等属性是不一样的。你可以通过 [这篇文章](https://web.dev/css-size-adjust/) 来详细了解这个闪烁。

我们可以通过 `@font-face` 中的 `size-adjust` 属性来解决这个闪烁，请通过 [这篇文章](https://web.dev/css-size-adjust/) 来学习具体的处理方法，不过我可以提前告诉你，这个处理很麻烦，因为它的思路是通过反复的手工校准切换前后的字体，来使切换前后的字体可以尽可能的拥有相似的布局。

## 图像

### 尺寸

如果我们不主动设置图像的尺寸，那么网页就会使用图像的自然尺寸，如果图像的自然尺寸超出了视口的大小，那么网页就会在水平或垂直方向上生成滚动条，这是一种糟糕的体验，因此我们需要主动设置图像的尺寸。

下例方案可以让图像在铺满屏幕某一轴的同时，又保持原来的横纵比。

```css
img {
    max-inline-size: 100%;
    block-size: auto;
}
```

### 横纵比

请使用 `aspect-ratio` 属性来一次性的设置图像的横纵比，而不要通过手写宽高属性来设置图像的横纵比，这不仅仅是因为前者更加简洁，还因为前者遵循方向逻辑。

比如，当 `writing-mode: horizontal-tb` 时，`aspect-ratio: 2/1` 代表横是纵的两倍。

```css
img {
    max-inline-size: 100%;
    block-size: auto;
    aspect-ratio: 2/1;
}
```

### 框内布局

`max-inline-size`、`block-size`、`aspect-ratio` 等属性用于设置图像元素的内容框的尺寸，而我们还可以进步一设置图像元素的内容相对于内容框的布局，这就需要用到 `object` 系列的属性。

其中，图像元素的内容是指图像本身，图像元素的内容框是指盒子的内容框。

#### object-fit

`object-fit` 属性用于设置图像元素的内容在其内容框中的布局，它有一点点像 `background-size` 属性，它有 5 种取值，分别是：`contain`、`cover`、`fill`、`none`、`scale-down`。

其中 `contain` 属性最有趣，它可以在保持图像横纵比的前提下，缩放图像以使其至少铺满内容框的某一轴，如果图像没有铺满另一轴，那么图像就会在该轴方向上居中，并在两侧留下透明的空余空间。

```css
img {
    max-inline-size: 100%;
    block-size: auto;
    object-fit: contain;
}
```

#### object-position

`object-position` 属性用于设置图像元素的内容在其内容框中的偏移，它很像 `background-position` 属性，详见 [MDN - object-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position)。

### 尺寸提示

如果你预先就知道图像的尺寸，那么请务必为 `<img>` 标签设置 `width` 和 `height` 属性，浏览器可以通过这两个属性来提前获知图像的尺寸，然后为图像预留相应的空间来“占位”。

```html
<img width="100" height="100">
```

想象一下，如果浏览器没有为图像预留占位的空间，那么当图像还未加载完成时，图像元素的高度就是 `0`，此时图像元素的上文和下文会紧紧的挨在一起，而当图像加载完成后，由于图像元素拥有了高度，此时图像元素的上文和下文就会一下子被挤开，这在视觉上表现为闪烁和跳转，这会破坏用户的阅读体验，因为用户的视觉锚点一下子就消失了。

如果浏览器为图像预留了占位的空间，那么无论图像是否加载完成，图像元素都会占据相同的空间，当图像还未加载完成时，占位空间表现为透明色，当图像加载完成后，占位空间就会渲染出图像，这样就可以解决上述问题了。

[这个视频](https://web.dev/learn/design/responsive-images/#sizing-hints) 直观的演示了有无占位空间时的区别。

### 惰性加载

`<img>` 标签的 `loading` 属性可以启用惰性加载，如下所示。启用惰性下载后，浏览器会延迟加载图像，直至图像接近视口时，浏览器才会加载图像，建议总是为首屏以下的图像启用惰性加载。

```html
<img loading="lazy">
```

`loading` 属性的默认值时 `eager`，此时无论图像是否出现在视口之内，浏览器都会立即加载图像。

### 惰性解码

`<img>` 标签的 `decoding` 属性可以启用惰性解码，如下所示。图像解码会阻塞其他的操作，如果我们设置了异步解码，那么浏览器就可以优先处理网页的其他内容，我通常会为博客中的图像添加惰性解码。

```html
<img decoding="async">
```

如果图像对你很重要，那么请使用同步解码。

```html
<img decoding="sync">
```

> `decoding` 的默认值是 `auto`，此时将由浏览器来决定到底使用 `async` 还是 `sync`。

### 响应尺寸

如果你为同一幅图像制作了多个不同分辨率的版本，那么你就可以通过 `<img>` 标签的 `srcset` 属性来让浏览器智能的下载合适版本的图像，这可以节省流量和加速图像资源的加载速度。

详请参阅 [Responsive images with `srcset`](https://web.dev/learn/design/responsive-images/#responsive-images-with-srcset) 和 [The picture element](https://web.dev/learn/design/picture-element/)。

## 主题

### 嗅探系统主题

许多操作系统都支持浅色模式和深色模式，比如 Windows 和 MacOS，`prefers-color-scheme` 媒体特性可以检测出操作系统正在使用哪种模式，然后我们就可以使用不同的主题色。

```css
/* 操作系统正在使用浅色模式 */
@media ( prefers-color-scheme: light ) {
    html { background-color: white; }
}

/* 操作系统正在使用深色模式 */
@media ( prefers-color-scheme: dark ) {
    html { background-color: black; }
}
```

如果操作系统不支持主题色，或未设置主题色，或禁止获取主题色，那么就需要使用：

```css
@media ( prefers-color-scheme: no-preference ) {
    html { background-color: white; }
}
```

### accent-color

CSS 的 `accent-color` 属性可以设置单选框、复选框、进度条的颜色。

```css
input {
    accent-color: black;
}
```

## 色觉缺陷

FireFox 和 Chrome 的开发者工具都可以模拟色觉缺陷的视觉效果，在 FireFox 中，`开发者工具 -> 无障碍环境 -> 模拟`，在 Chrome 中，`开发者工具 -> 渲染选项卡 -> 模拟视觉缺陷`。

Chrome 的色觉缺陷模拟功能比较难找，如果你找不到，那么你可以查看 [这篇文章](https://developer.chrome.com/blog/new-in-devtools-83/#vision-deficiencies)。

## 虚拟键盘

智能手机使用虚拟键盘来代替实体键盘，你可以通过参阅 [这篇文章](https://web.dev/learn/design/interaction/#virtual-keyboards) 来学习如何优化虚拟键盘，这些优化是指：

- 如何唤醒整数数字键盘；
- 如何唤醒浮点数数字键盘；
- 如何让虚拟键盘自动联想出相关内容，比如电话号码、邮箱、国家。

## 参考

[Learn Responsive Design](https://web.dev/learn/design/)