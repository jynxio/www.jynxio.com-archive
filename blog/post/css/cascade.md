# 层叠

## 概述

如果样式声明之间发生了重叠，那么 CSS 就会通过层叠算法（cascade algorithm）和优先级算法（specificity algorithm）来决定应该保留哪些样式声明。

## 原理

1. 重要性更高的样式声明优先；
2. 如果重要性相同，那么优先级更高的样式声明优先；
3. 如果重要性和优先级都相同，那么后定义的样式声明优先；

## 重要性

样式声明的重要性（precedence）取决于：origin、layer、important。下表是样式声明重要性的速查表，其重要性由上到下逐渐递增。

```
user-agent & first declared layer
user-agent & second declared layer
user-agent & unlayered styles

user & first declared layer
user & second declared layer
user & unlayered styles

author & first declared layer
author & second declared layer
author & unlayered styles
author & inline style

any & animations

author & unlayered styles & important
author & second declared layer & important
author & first declared layer & important
author & inline style & important

user & unlayered styles & important
user & second declared layer & important
user & first declared layer & important

useragent & unlayered styles & important
useragent & second declared layer & important
useragent & first declared layer & important

any & transitions
```

> 因为 CSS 会把一个样式表内的所有的 `unlayered styles` 都丢进一个 `last declared anonymous layer` 中去，所以我们可以把 `unlayered styles` 当成 `last declared anonymous layer`。

### Origin

Origin 是指样式声明的来源，样式声明只有 3 种来源，分别是：

- 用户样式表（user stylesheets）
- 开发者样式表（author stylesheets）
- 用户代理样式表（user-agent stylesheets）

其中，用户代理样式表是指浏览器的默认样式表，一些浏览器通过使用内置的 `.css` 文件来实现默认样式，比如 [Chromium 源码中的默认样式表](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/resources/html.css)，一些浏览器通过代码来模拟默认样式。

开发者样式表是指由开发者编写的样式声明的集合，由于开发者就是网页的作者，所以开发者样式表叫做“author stylesheets”。开发者编写样式的途径有：`.css` 文件、`<style>` 标签、`style` 属性。

用户样式表是指用户向浏览器注入的样式声明的集合，用户是指网页的读者。Firefox 浏览器允许用户通过在指定文件夹下放置 `.css` 文件的方式来向浏览器注入样式声明，而 Chrome 浏览器则必须借助插件才能完成类似的过程。如果你还不理解用户样式表，那么请阅读 [这篇文章](https://www.thoughtco.com/user-style-sheet-3469931)。

### Layer

一个样式表内的所有 `unlayered style` 都会按照它们声明的顺序来组合在一起，形成一个 `last anonymous layer`。更多细节请见 [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) 和 [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。

> `@import` 和 `<link>` 的作用是一样的，但 `@import` 会创建更多的网络请求，所以如果你追求极致性能，那么请使用 `<link>`。

### Animation

animation 使用 `@keyframes` 来定义动画，需要注意的是：

- `@keyframes` 块内的样式声明不能使用 `!important`
- `@keyframes` 块内的样式声明不会参与层叠
- `@keyframes` 块本身会参与层叠

如果块内的样式声明使用了 `!important`，那么这条样式声明就会被忽略，详见下例。

```css
@keyframes {
    from { top: 1vh !important; } /* 忽略 */
    to { top: 2vh; }              /* 生效 */
}
```

如果在同一个样式表内存在多个同名的 `@keyframes`，那么只有重要性最高的 `@keyframes` 才会生效，其余的 `@keyframes` 都会被忽略，详见下例。

```css
/* 生效 */
@keyframes foo {
    from { top: 1vh; }
    to { top: 2vh; }
}

/* 忽略 */
@layer {
    @keyframes foo {
        from { left: 1vw; }
        to { left: 2vw; }
    }
}
```

## 优先级

样式声明的优先级（specificity）等于组合选择器的优先级，组合选择器的优先级的计算公式如下（含义越具体，优先级越高）：

| 选择器               | 优先级  |
| -------------------- | ------- |
| ID 选择器            | `1,0,0` |
| 类、伪类、属性选择器 | `0,1,0` |
| 元素、伪元素选择器   | `0,0,1` |

另外：

- 通配符选择器（`*`）、组合器（`+`、`>`、`~`、` `、`||`）、优先级调整伪类（`:where()`）不参与优先级计算；
- 否定伪类（`:not()`）、任意匹配（`:is()`）的优先级取决于参数的优先级；

### :not() & :is() & where()

`:not( selector-list )` 和 `:is( selector-list )` 的优先级取决于 `selector-list` 中的优先级最高项的优先级。

```css
:not( #id, .classname ) {} /* 优先级为 1,0,0 */
:is(  #id, .classname ) {} /* 优先级为 1,0,0 */
```

> `selector-list` 指 [选择器列表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Selector_list)，比如 `h1, h2, h3, h4 {}`。

`:where()` 的作用和 `:is()` 一模一样，唯一区别是前者不参与优先级计算。

```css
article:where( .section-1, .section-2 ) {} /* 优先级为 0,0,1 */
```

## 继承

CSS 提供了 5 个特殊的属性值，以便于控制继承，每个 CSS 属性都可以使用这 5 个特殊的属性值。它们分别是：`inherit`、`initial`、`unset`、`revert`、`revert-layer`。

其中，`inherit` 意味着使用继承值，`initial` 意味着使用初始值，`unset` 意味着使用自然值（继承属性的自然值是 `inherit`，非继承属性的自然值是 `intial`）。

`revert` 和 `revert-layer` 复杂且少用，我不打算继续解释它们，你可以 [revert - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/revert) 和 [revert-layer - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/revert-layer) 来学习它们。

> 大多数于字体相关的属性都是继承属性。

另外，CSS 还提供了一个 `all` 属性，我们可以利用 `all` 来一键重置（几乎）所有的属性。

## 参考资料

- [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#which_css_entities_participate_in_the_cascade)
