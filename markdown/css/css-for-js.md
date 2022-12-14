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

伪类允许我们根据元素的状态来应用 CSS 的 rule，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 来查看所有的伪类。

`:focus`：鼠标点击一个元素，使用 table 键切换到一个元素上时，这个元素都会进入到 focused 状态，当元素进入到 focused 状态后，键盘可以直接操控这个元素，比如输入表单，或者回车键打开连接。

> 只有表单元素、按钮元素、超链接元素才可以被选中。
>
> `click` 可以选中一个元素，`tab` 可以选中下一个元素，`shift + tab` 可以选中上一个元素。
>
> 但是对于 MacOS：
>
> 1.在 Safari 上，`click` 不能选中一个元素（这是一个众所周知的 bug）。
>
> 2.在某些版本的 Firefox 上，`tab` 只能选中表单元素和按钮元素，无法选中超链接元素。
>
> 3.对于 Safari，`tab` 只能选中表单元素，`option + tab` 和 `option + shift + tab` 可以选中下一个和上一个按钮元素。
>
> 你可以从 [这里](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button) 找到更多详细信息，你也可以通过设置 MacOS 的系统设置，来让 Safari 和 Firefox 的 `tab` 功能变得正常，请看 [这里](https://www.scottohara.me/blog/2014/10/03/link-tabbing-firefox-osx.html)。

如果你想更加深入的学习可访问性，那么请看 [这里](https://a11y.coffee/)。