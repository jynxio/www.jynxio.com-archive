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

伪类是添加到选择器的关键字，它是选择器的附加条件，这个附加条件用于指定目标元素的状态，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 查看到所有的伪类。

### focus

`:focus` 表示获得焦点的元素，我们可以通过光标点击、触摸屏触摸、键盘的 `tab` 键来使元素进入到 focused 状态。并且当元素进入到了 focused 状态之后，键盘可以直接操控这个元素，比如可以输入表单（对于表单元素）、打开链接（对于超链接元素）、触发按钮（对于按钮元素）。

另外，只有表单、按钮、超链接元素才可以进入 focused 状态。

- 对于大多数操作系统的浏览器而言，光标点击或触摸屏触摸可以聚焦一个元素，`tab` 可以聚焦下一个元素，`shift+tab` 可以聚焦上一个元素。
- 对于 MacOS 的 Safari 而言，光标点击或触摸屏触摸无法聚焦一个元素（这是一个众所周知的 bug！），`tab` 和 `shift+tab` 只能聚焦表单元素，`option+tab` 和 `option+shift+tab`只能聚焦上一个按钮元素和下一个按钮元素。
- 对于 MacOS 的某些版本的 Firefox 而言，`tab` 和 `shift+tab` 只能聚焦按钮元素和表单元素。

> 如果你想要知道更多的相关信息，那么请查看 [这里](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button)。如果你想让 Safari 和 Firefox 变得正常，那么你就需要更改 MacOS 的系统设置，请从 [这里](https://www.scottohara.me/blog/2014/10/03/link-tabbing-firefox-osx.html) 查看教程。如果你想更加深入的学习可访问性，那么请查看 [这里](https://a11y.coffee/)。

### checked

`:checked` 仅对处于勾选状态下的 `radio` 和 `checkbox` 类型的 `input` 元素有效，如果没有处于勾选状态，那么 `:checked` 就不会生效。

```html
<input type="radio" />
<input type="checkbox" />
```

### first-child、last-child、first-of-type、last-of-type

`p:first-child`：仅当 `p` 是其父元素内的第一个子元素时，它才会生效。

`p:first-of-type`：仅当 `p` 是其父元素内的第一个 `p` 型子元素时，它才会生效。

## Pseudo-elements

