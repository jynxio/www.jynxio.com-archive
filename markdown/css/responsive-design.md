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
    /* 该样式仅在视口宽度大于视口高度时生效 */
}
@media ( max-width: 100vh ) {
    /* 该样式仅在视口宽度小于视口高度时生效 */
}
```

### 文章断点

我们把查询条件变为真的点称为“断点”，断点对文章的阅读舒适性非常重要。

如果网页的文本行过长了，那么就会令阅读变得不舒服，这时我们就需要对文章进行分栏，而分栏的关键就是合适的断点和 `column-count` 属性。

```css
@media ( min-width: 50em ) {
    article {
        column-count: 2;
    }
}
```

> 对于不同的网页而言，文章的断点是不一样的。在这个例子中，我们假设了 `50em` 是文本行变得令人不舒服的断点。

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

## 参考

[Learn Responsive Design](https://web.dev/learn/design/)