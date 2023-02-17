---
typora-root-url: ./..\..\..
---

# 排版

## Font family

`font-family` 可以设置字体。

```css
font-family: "Noto Sans", Arial, sans-serif;
```

> 之所以称为 “family”，是因为一种字体通常会包含很多份字符集，比如字体 Roboto 就包含了 12 份字符集，囊括了 6 种字重和 2 种字形。

### 最佳实践

> TODO：font stack

### 字体风格

字体有很多种风格，其中最受欢迎的两种风格分别是 `Serif` （衬线）和 `Sans-serif`（无衬线），前者相对后者，其字符笔画的边缘会有更多的修饰。

印刷行业很青睐 `Serif` 风格的字体，因为这种字体看起来更加精致、典雅。但是对于网页，如果屏幕的像素密度不够大，那么就不推荐使用 Serif 风格的字体，因为字符会显得发虚，这是因为屏幕无法精确渲染出字符的细节。

![字体风格](/static/image/markdown/css/typography/font-style.png)

`font-family` 允许我们直接指定字体风格，此时操作系统会自动使用属于该风格的默认字体。对于 Windows 11 系统而言，`Sans-serif` 风格的默认字体是 `Segoe UI`，对于 MacOS 而言，则是 `SF Pro`。

```css
font-family: sans-serif;
```

### 网络字体

> TODO

### 自定义字体

> TODO

## Font weight

`font-weight` 可以设置字重。

当我们指定渲染粗体时（比如 `font-weight: bold`），哪怕字体文件中不包含粗体的字符集，浏览器也会通过人工加粗来模拟出粗体效果，只不过这种效果并不漂亮。

## 字形

`font-style` 可以设置字形。

当我们指定渲染斜体时（比如 `font-style: italic`），哪怕字体文件中不包含斜体的字符集，浏览器也会通过人工倾斜来模拟出斜体效果，只不过这种效果并不漂亮。

## 修饰

`text-decoration` 可以设置字体的修饰效果，比如下划线，关于它的具体用法，请查阅 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration)。

## 对齐

`text-align` 可以设置文本的水平对齐方式

Josh：虽然 `text-align` 可以控制所有 `inline` 元素的水平对齐方式，但我们应该只用它来控制文本。我们应该使用其他的方法来控制图像、按钮、输入框等其他 `inline` 元素的水平对齐方式。

## 大小写

`text-transform` 可以设置文本的大小写，比如单词首字母大写、全大写等。

## 空隙

`letter-spacing` 可以设置字符之间的空隙大小，`line-height` 可以设置行之间的空隙大小。

## 语义化

`<strong>` 用于展示重要且紧急的信息，比如“**警告：产品遇高温将有可能发生爆炸**”。

`<em>` 用于展示重要的信息（em 是 emphasis 的缩写），比如强调句子中的某个词“我很*口渴*”。

> 自 HTML 5 施行之后，`<i>` 和 `<b>` 就被废弃了，请勿再使用它们，尽管仍有很多人在使用它们。

我们可以通过编写不同的样式，来告诉用户哪些东西是链接、哪些是重点内容、哪些是注释，然而视力障碍人士无法看见我们编写的样式，他们需要通过屏幕阅读器来浏览网页，而屏幕阅读器会根据 HTML 标签的语义来选择朗读的方式（比如屏幕阅读器会重读 `<em>` 的内容）。所以语义化 HTML 很重要。

## 书写方向

如果你想了解更多有关于书写方向的知识，那么请看 [这篇文章](https://24ways.org/2016/css-writing-modes/)。

书写方向会影响逻辑属性，请使用逻辑属性（logical property），比如 `inline-size`、`padding-inline-start`，从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) 找到所有逻辑属性。

逻辑属性旨在完全替代非逻辑属性，比如 `margin-inline-start` 会完全替代 `margin-left`。
