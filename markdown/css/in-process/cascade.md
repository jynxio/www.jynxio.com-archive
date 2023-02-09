# 层叠

## 概述

层叠算法（cascade algorithm）是 CSS 的核心部分，CSS 的全称就叫做“Cascading Style Sheets”。

当多个样式规则同时匹配到了同一个元素，且这些样式规则之间发生了冲突的时候，CSS 就需要通过层叠算法来决定应该舍弃哪些样式规则、保留哪些样式规则。

## 原理

1. 重要性更高的样式规则优先；
2. 如果重要性相同，那么特异性更高的样式规则优先；
3. 如果重要性和特异性都相同，那么后定义的样式规则优先；

## 重要性

样式规则的重要性（precedence）取决于 3 个因素，分别是：origin、layer、important。这是样式规则重要性的速查表，其重要性由上到下逐渐递增。

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

其中，`unlayered styles` 等价于 `last declared anonymous layer`。

另外，`declared layer & important` 是指下例中的 `margin: 5px !important`，不包括 `padding: 5px`。

```css
@layer foo {
    div {
        padding: 5px;
        margin: 5px !important;
    }
}
```

### Origin

Origin 是指样式规则的来源，样式规则只有 3 种来源，分别是：

- 用户样式表（user stylesheets）
- 开发者样式表（author stylesheets）
- 用户代理样式表（user-agent stylesheets）

其中，用户代理样式表是指浏览器的默认样式表。大部分浏览器通过内置 `.css` 文件来实现默认样式，比如 [这](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/resources/html.css) 就是 Chromium 的默认样式表。

开发者样式表是指由开发者定义的样式规则的集合。具体来说，引入 `.css` 文件、编写 `<style>` 标签、编写 `style` 属性等都属于开发者样式表的范畴。

用户样式表是指由用户定义的样式规则的集合，许多浏览器都允许用户注入自定义的样式规则来覆盖用户代理和开发者的样式规则，而这些由用户所注入的样式规则的集合就叫做用户样式表。比如，Firefox 允许用户通过在指定文件夹下放置 `user.css` 文件的方式来注入用户的自定义样式，而这个 `user.css` 就是用户样式表。而对于 Chrome，我们需要借助插件才能注入用户样式表。关于用户样式表，推荐你阅读 [这篇文章](https://www.thoughtco.com/user-style-sheet-3469931)。

### Layer

`layer` 会影响样式规则的重要性，比如：

- `layered styles` 和 `unlayered styles` 的重要性是不同的
- `first declared layer` 和 `second declared layer` 的重要性也是不同的

详见上文的速查表。另外，如果你想创建 `layer`，那么请看 [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) 和 [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。

> 其实，CSS 会把一个样式表内的所有 `unlayered styles` 都丢进一个 `last declared anonymous layer` 中去。

### Important

`!important` 会影响样式规则的重要性，详见上文的速查表。

### Animation

animation 使用 `@keyframes` 来定义动画，需要注意的是：

- `@keyframes` 块内的样式规则不能使用 `!important`
- `@keyframes` 块内的样式规则不会参与层叠
- `@keyframes` 块本身会参与层叠

对于第一条，如果块内的样式规则使用了 `!important`，那么这条样式规则就会被忽略。比如，下例中的 `top: 1vh !important` 会被忽略。

```css
@keyframes {
    from { top: 1vh !important; }
    to { top: 2vh; }
}
```

对于第三条，如果在同一个样式表内存在多个同名的 `@keyframes`，那么只有重要性最高的 `@keyframes` 才会生效，其余的 `@keyframes` 都会被忽略，请见下例。

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

## 特异性

## 参考资料

- [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#which_css_entities_participate_in_the_cascade)
