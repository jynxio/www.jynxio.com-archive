## Terminology

```css
p {
    margin: 32px;
}
```

CSS 的术语：

- `unit`：单位，是指 `value` 的单位，比如 `px`
- `value`：值，是指赋予 `property` 的值，比如 `32px`
- `property`：属性，是指接收 `value` 的属性，比如 `margin`
- `selector`：选择器，是指用于选定页面元素的标志符，比如 `.pink`
- `declaration`：样式声明，是指`property` 和 `value` 的组合体，比如 `margin: 32px`
- `rule`：样式，比如 `p { margin: 32px }`，通常一个样式表会拥有多则 `rule`
- `media feature`：比如 `@media( max-width: 300px )` 中的 `max-width`

## Media Query

```css
@media ( condition ) {
    /* Some CSS that'll run if the condition is met. */
}

@media ( max-width: 300px ) {
    /* 如果viewport的宽度在[0px, 300ox]区间之内，那么下面的样式就会被应用 */
    div {
        color: red
    }
}
```

## Pseudo-classes

伪类是一个附加到选择器末尾的关键字，它是选择器的附加条件，用于限定目标元素的状态，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 查看到所有的伪类。

### :focus

`:focus` 表示获得焦点的元素，我们可以通过光标点击、触摸屏触摸、键盘的 `tab` 键来使元素进入到 focused 状态。并且当元素进入到了 focused 状态之后，键盘可以直接操控这个元素，比如可以输入表单（对于表单元素）、打开链接（对于超链接元素）、触发按钮（对于按钮元素）。

另外，只有表单、按钮、超链接元素才可以进入 focused 状态。

- 对于大多数操作系统的浏览器而言，光标点击或触摸屏触摸可以聚焦一个元素，`tab` 可以聚焦下一个元素，`shift+tab` 可以聚焦上一个元素。
- 对于 MacOS 的 Safari 而言，光标点击或触摸屏触摸无法聚焦一个元素（这是一个众所周知的 bug！），`tab` 和 `shift+tab` 只能聚焦表单元素，`option+tab` 和 `option+shift+tab`只能聚焦上一个按钮元素和下一个按钮元素。
- 对于 MacOS 的某些版本的 Firefox 而言，`tab` 和 `shift+tab` 只能聚焦按钮元素和表单元素。

> 如果你想要知道更多的相关信息，那么请查看 [这里](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button)。如果你想让 Safari 和 Firefox 变得正常，那么你就需要更改 MacOS 的系统设置，请从 [这里](https://www.scottohara.me/blog/2014/10/03/link-tabbing-firefox-osx.html) 查看教程。如果你想更加深入的学习可访问性，那么请查看 [这里](https://a11y.coffee/)。

### :checked

`:checked` 仅对处于勾选状态下的 `radio` 和 `checkbox` 类型的 `<input>` 有效，如果没有处于勾选状态，那么 `:checked` 就不会生效。

```html
<input type="radio" />
<input type="checkbox" />
```

### :first-child、:last-child、:first-of-type、:last-of-type

`p:first-child`：仅当 `p` 是其父元素内的第一个子元素时，它才会生效。

`p:first-of-type`：仅当 `p` 是其父元素内的第一个 `p` 型子元素时，它才会生效。

## Pseudo-elements

伪元素是一个附加到选择器末尾的关键字，它是选择器的附加条件，用于匹配选择器的子项，你可以从 [这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements) 查看到所有的伪元素。

> 一个选择器只能使用一个伪元素。
>
> 按照规范的要求，伪元素应该被设计成使用双冒号而不是单冒号，以便于与伪类进行区分，不过由于早期的 W3C 规范还没有出台这项规定，所以有一些伪元素早当初被设计成了使用单冒号，以致于这些伪元素现在既支持双冒号也支持 单冒号。

为什么它会取名叫伪元素呢？请查看下面这个例子，我们通过为 `<input>` 赋予 `placeholder` 属性，便可让其创建出一个提示元素 `<placeholder>`，这个提示元素的内容是 `please enter here...`。由于 `<placeholder>` 不是通过 HTML 的 tag 来创建的，所以我们认为它是一个伪元素，然后我们把用于匹配伪元素的 `::placeholder` 也称为伪元素。

```html
<style>
    input::placeholder {
        color: teal;
    }
</style>
<input type="text" placeholder="please enter here..." />
```

### ::before、::after

`::before` 和 `::after` 会在元素内部的首部和尾部创建出 2 个 `<span>`，所以你可以认为 `::before` 和 `::after` 是一种用于创建 `<span>` 的语法糖。比如下面两个例子的效果是一样的，而且它们的性能也没有显著差异。

```html
<style>
    p::before {
        content: "-> ";
    }
    p::after {
        content: " <-"
    }
</style>
<p>
    This paragraph has little arrows!
</p>
```

```html
<p>
    <span>-> </span>
    This paragraph has little arrows!
    <span><- </span>
</p>
```

Josh 表示我们应该只用 `::before` 和 `:after` 来进行装饰（即 `content` 属性的值为 `""`），而不要为其输入内容，原因有二:

- 有些屏幕阅读器会阅读其中的内容，而有些则不会，使用 `::before` 或 `::after` 来渲染 HTML 的内容会降低应用的可访问性。
- 使用 CSS 来渲染 HTML 的内容是一种耦合行为，因为 CSS 应该只负责装饰而不要干涉 HTML 的工作。

```html
<style>
    p::before {
        content: "";

        width: "1em";
        height: "1em";

        border-radius: 50%;
        border: 1px solid teal;
    }
</style>
```

### combinator

组合器是指多个选择器所组成的选择器，比如后代选择器。
