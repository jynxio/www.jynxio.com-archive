---
typora-root-url: ./..\..\..
---

# 排版

## Font family

在 CSS 中，我们使用 `font-family` 来设置文本的字体。之所以称为 “family”，是因为一种字体通常会包含很多份字符集，比如字体 Roboto 就包含了 12 份字符集，囊括了 6 种字重和 2 种字形。

### 最佳实践

> TODO：font stack

```css
font-family: "Noto Sans", Arial, sans-serif;
```

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
