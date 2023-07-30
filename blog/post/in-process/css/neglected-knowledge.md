## Border

如果你没有指定 `border-color`，那么 `border-color` 就等于当前元素的字体颜色。

## Outline

在 2021 年 9 月之前，无论你是否设置了 `border-radius`，`outline` 在大多数浏览器里面的样式都是四四方方的，而直至现在，只剩下 Safari 继续保持如此。

`outline-offset` 可以在 `border` 和 `outline` 之间设置间隙。

`outline` 常被用于高亮当前被聚焦的元素，请勿轻易改动可交互元素上的 `outline`，以维护网页的可访问性。

## Color

`currentColor` 关键字代表了当前元素的字体颜色，哪怕当前元素是 `color: inherit`。

## accent-color

`accent-color` 是强调色，用于设置 `input` 的默认颜色，比如：

```html
<style>
    input {
        accent-color: auto;
    }
    input.custom {
        accent-color: rebeccapurple;
    }
</style>
<body>
    <input type="checkbox"/>                <!-- 复选框的背景色是蓝色 -->
    <input class="custom" type="checkbox"/> <!-- 复选框的背景色是紫色 -->
</body>
```

