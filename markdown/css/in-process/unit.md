# 单位

## px

`px` 是一个绝对单位，`1px` 等于一个软件像素，正因如此，`px` 是最具象的 CSS 单位。

### Pixel ratio

大多数的现代智能手机都有一种叫做高清显示（HD-DPI）的特性（Apple 则将该特性称为 Retina Display），该特性的原理是使用多个物理像素来渲染一个软件像素，这可以明显提升画面的细腻程度。

物理像素与软件像素之间的比率就叫做像素分辨率（pixel ratio）。我们可以通过 `globalThis.devicePixelRatio` 这个 API 来获取屏幕的像素分辨率。

Apple 的 Retina Display 的像素分辨率通常是 `2`，大多数安卓设备屏幕的像素分辨率也是 `2`，甚至有些达到了 `3`。像素分辨率越高，便意味着画面越细腻，但同时性能负荷也会更大，因为机器要绘制更多的像素。所以你需要在画面的细腻与流畅中做一个权衡，通常来讲，`2` 是一个不错的选择。

由于有像素分辨率的存在，所以软件像素不一定等于硬件像素。具体来说：

- 如果像素分辨率是 `1`，那么 `devicePixelRatio = 1`，即 `1` 个软件像素就等于 `1` 个硬件像素；
- 如果像素分辨率是 `2`，那么 `devicePixelRatio = 2`，即 `1` 个软件像素就等于 `2*2` 个硬件像素；

另外，浏览器的缩放比率也会影像软件像素与硬件像素的关系，具体来说：

- 如果浏览器的缩放比率是 `100%`，那么 `devicePixelRatio = 1`，即 `1` 个软件像素就等于 `1` 个硬件像素；
- 如果浏览器的缩放比率是 `500%`，那么 `devicePixelRatio = 5`，即 `1` 个软件像素就等于 `5*5` 个硬件像素；

像素分辨率和浏览器的缩放比率可以共同影响 `devicePixelRatio`，比如：

- 如果像素分辨率是 `2`，且浏览器的缩放比率是 `500%`，那么 `devicePixelRatio = 10`；

## em

`em` 是一个相对单位，`1em` 就等于当前元素的 `font-size` 的计算值。

请使用 `rem` 来替代 `em`，因为 `em` 存在一种名为“复合”的缺点，它会给页面带来一些意想不到的混乱，比如：

```html
<style>
    main { font-size: 1.25em }
    article { font-size: 0.9em }
    p { font-size: 1.25em }
</style>

<main>
    <article>
        <p>What size is this text?</p>
    </article>
</main>
```

## rem

`rem` 是一个相对单位，`1rem` 就等于 `<html>` 的 `font-size` 的计算值，`<html>` 的 `font-size` 的默认值是 `16px`，REM 代表“Root EM”。

> 如果你想改变 `<html>` 的字号大小，那么请这样做 `font-size: 120%`，而不要这样做 `font-size: 20px`，后者是一个不良的实践，它会降低文档的“弹性”。

## percentage

`%` 是一个相对单位，它通常基于 `width` 或 `height`。

> 有的时候，`%` 会有一些怪癖，我会在学习之后再回来补充相关的内容。

