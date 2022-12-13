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

