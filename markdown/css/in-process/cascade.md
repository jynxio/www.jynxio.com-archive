# 层叠与继承

## 概述

如果样式规则之间发生了重叠，那么 CSS 就会通过层叠算法（cascade algorithm）和优先级算法（specificity algorithm）来决定应该保留哪些样式规则。

## 原理

1. 重要性更高的样式规则优先；
2. 如果重要性相同，那么优先级更高的样式规则优先；
3. 如果重要性和优先级都相同，那么后定义的样式规则优先；

## 重要性

样式规则的重要性（precedence）取决于：origin、layer、important。下表是样式规则重要性的速查表，其重要性由上到下逐渐递增。

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

Origin 是指样式规则的来源，样式规则只有 3 种来源，分别是：

- 用户样式表（user stylesheets）
- 开发者样式表（author stylesheets）
- 用户代理样式表（user-agent stylesheets）

其中，用户代理样式表是指浏览器的默认样式表，一些浏览器通过使用内置的 `.css` 文件来实现默认样式，比如 [Chromium 源码中的默认样式表](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/resources/html.css)，一些浏览器通过代码来模拟默认样式。

开发者样式表是指由开发者编写的样式规则的集合，由于开发者就是网页的作者，所以开发者样式表叫做“author stylesheets”。开发者编写样式的途径有：`.css` 文件、`<style>` 标签、`style` 属性。

用户样式表是指用户向浏览器注入的样式规则的集合，用户是指网页的读者。Firefox 浏览器允许用户通过在指定文件夹下放置 `.css` 文件的方式来向浏览器注入样式规则，而 Chrome 浏览器则必须借助插件才能完成类似的过程。如果你还不理解用户样式表，那么请阅读 [这篇文章](https://www.thoughtco.com/user-style-sheet-3469931)。

### Layer

一个样式表内的所有 `unlayered style` 都会按照它们声明的顺序来组合在一起，形成一个 `last anonymous layer`。更多细节请见 [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) 和 [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。

### Animation

animation 使用 `@keyframes` 来定义动画，需要注意的是：

- `@keyframes` 块内的样式规则不能使用 `!important`
- `@keyframes` 块内的样式规则不会参与层叠
- `@keyframes` 块本身会参与层叠

如果块内的样式规则使用了 `!important`，那么这条样式规则就会被忽略，详见下例。

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

优先级公式：

- id : 1,0,0,
- 类/伪类/属性选择器：0,1,0
- 元素/伪元素：0,0,1

**通配选择符**（universal selector）（[`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), [" "](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）和 **否定伪类**（negation pseudo-class）（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响。（但是，在 `:not()` 内部声明的选择器会影响优先级）。

通用选择器（`*`）、组合符（`+`、`>`、`~`、`space`）和调整优先级的选择器（`:where()`）不会影响优先级。否定（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）和任意匹配（[`:is()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:is)）伪类本身对优先级没有影响，但它们的参数则会带来影响。参数中，对优先级算法有贡献的参数的优先级的最大值将作为该伪类选择器的优先级。The matches-any pseudo-class [`:is()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:is) 实验性 and the negation pseudo-class [`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not) are *not* considered a pseudo-class in the specificity calculation. But selectors placed into the pseudo-class count as normal selectors when determining the count of [selector types](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity#Selector_Types).

`:not` 否定伪类在优先级计算中不会被看作是伪类。事实上，在计算选择器数量时还是会把其中的选择器当做普通选择器进行计数。

```html
<style>
    div.outer p {
  color: orange;
}

div:not(.outer) p {
  color: blueviolet;
}
</style>
<div class="outer">
  <p>orange</p>
  <div class="inner">
    <p>blueviolet</p>
  </div>
</div>
```

诀窍：选择器越具体，那么选择器的优先级就会更高；

The specificity-adjustment pseudo-class [`:where()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:where) 实验性 always has its specificity replaced with zero.

`:where()` 和 [`:is()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:is) 的不同之处在于，`:where()` 的[优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)总是为 0，但是 `:is()` 的优先级是由它的选择器列表中优先级最高的[选择器](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS_Selector)决定的。

两者的区别在于 `:is()` 计入整体选择器的优先级（它接受优先级最高参数的优先级），而 [`:where()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:where) 的优先级为 0。

选择器列表就是 `a, p, h1` 这样的东西。

规范将 `:is()` 和 `:where()` 定义为接受一个[可容错选择器列表](https://drafts.csswg.org/selectors-4/#typedef-forgiving-selector-list)。

伪元素在 `:is()` 的选择器列表中无效，比如这样写是无效的。

```
some-element:is(::before, ::after) {
  display: block;
}
```



## 继承

CSS 提供了 5 个特殊的属性值，以便于控制继承，每个 CSS 属性都可以使用这 5 个特殊的属性值。它们分别是：`inherit`、`initial`、`unset`、`revert`、`revert-layer`。

其中，`inherit` 意味着使用继承值，`initial` 意味着使用初始值，`unset` 意味着使用自然值（继承属性的自然值是 `inherit`，非继承属性的自然值是 `intial`）。

`revert` 和 `revert-layer` 复杂且少用，我不打算继续解释它们，你可以 [revert - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/revert) 和 [revert-layer - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/revert-layer) 来学习它们。

> 大多数于字体相关的属性都是继承属性。





`all` 

## 参考资料

- [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#which_css_entities_participate_in_the_cascade)
