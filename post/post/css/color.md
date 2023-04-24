---
typora-root-url: ./..\..\image
---

# Color

## named color

named color 即命名颜色，比如 `pink`、`orange`、`tomato`、`teal` 等。截至目前（CSS Level 4，下同），CSS 一共定义了 140 种命名颜色，你可以在 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) 找到所有的颜色。

命名颜色的名字和颜色没有特别严谨的关联，比如 `rebeccapurple` 中的 `rebecca` 是为了纪念 [rebecca](https://codepen.io/trezy/post/honoring-a-great-man)，而与颜色无关，再比如 `dray` 的颜色比 `darkgray` 的颜色更浅。

## hex code

hex code 是一种基于 RGB 和十六进制的颜色表示法，它是基于 sRGB 的。

### 语法

```css
#rgb
#rgba
#rrggbb
#rrggbbaa
```

- `r`、`g`、`b`、`a` 都是属于 `[0, f]` 的十六进制数字值。
- `#rgb` 是 `#rrggbb` 的简写，`#rgba` 是 `#rrggbbaa` 的简写。
- 不区分大小写，`#fff` 等价于 `#FFF`。

### 示例

```css
#f00
#f00f
#ff0000
#ff0000ff
```

### 兼容性

IE 11 只支持 `#rgb` 和 `#rrggbb`，不支持 `#rgba` 和 `#rrggbbaa`。

## rgb()

`rgb()` 也是一种基于 RGB 的颜色表示法，它也是基于 sRGB 的。

### 语法

```css
rgb( r g b )
rgb( r g b / a )
```

- `r`、`g`、`b` 是属于 `[0, 255]` 的数字值，或属于 `[0%, 100%]` 的百分比值。
- `a` 是属于 `[0, 1]` 的数字值，或属于 `[0%, 100%]` 的百分比值。

### 示例

```css
rgb( 255 255 255 )
rgb( 255 255 255 / 1 )
```

### 兼容性

IE 11 不支持该语法，如果你需要兼容 IE 11，那么请使用 `rgb( r, g, b )` 和 `rgba( r, g, b, a )`。

## hsl()

`hsl()` 是一种基于 HSL 的颜色表示法，它基于 sRGB。

> RGB 是一种基于物理的颜色格式，即使用三原色来表示颜色，通过混合不同量的三原色，即可得到不同的颜色，其中 R 代表红色（Red）、G 代表绿色（Green）、B 代表蓝色（Blue）。
>
> HSL 是一种人类可读的颜色格式，其中 H 代表色调（Hue）、S 代表饱和度（Saturation）、L 代表亮度（Lightness）。
>
> 另外，大多数的图形设计软件都提供了一种名为 HSB 的颜色格式，其中的 B 代表 Brightness。Brightness 与 Lightness 在概念上没有明显区别，不过在使用方法上有很大的不同。HSB 与 HSL 的相同之处在于，当 Brightness  为 `0%` 时，颜色也会表现为黑色，不同之处在于，当 Brightness 为 `100%` 时，如果 Saturation 为 `0%`，那么颜色就会表现为白色，如果 Saturation 为 `100%`，那么颜色就会表现为本来的颜色。需要提醒的是，CSS 没有 `hsb()`，只有 `hsl()`。

### 语法

```css
hsl( h s l )
hsl( h s l / a )
```

- `h` 是属于 `[0deg, 360deg]` 的角度值。除了 `deg` 外，你还可以使用的单位有 `rad`、`grad`、`turn`。如果你没有为它指定单位，那么它就会使用 `deg` 来作为默认单位。
- `s` 是属于 `[0%, 100%]` 的百分比值。当 `s` 为 `0%` 时，由于颜色完全不饱和，此时颜色会呈现为灰色，如果你想渲染出鲜艳的颜色，那么请将 `s` 设置为 `100%`。
- `l` 是属于 `[0%, 100%]` 的百分比值。当 `l` 为 `0%` 时，由于没有亮度，此时颜色会呈现为黑色，当 `l` 为 `100%` 时，由于亮度过高，此时颜色会呈现为白色，如果你想渲染出颜色本来的颜色，那么请将 `l` 设置为 `50%`。
- `a` 是属于 `[0, 1]` 的数字值，或属于 `[0%, 100%]` 的百分比值。

### 示例

```css
hsl( 0 100% 50% )
hsl( 0 100% 50% / 1 )
```

### 兼容性

IE 11 不支持该语法，如果你需要兼容 IE 11，那么请使用 `hsl( h, s, l )` 和 `hsla( h, s, l, a )`。

## color()

CSS 的默认颜色空间是 sRGB（standard RGB color space），由命名颜色、`hex code`、`rgb()`、`hsl()` 所创建出来的颜色都是基于 sRGB 的，如果我们想要创建出基于其它颜色空间的颜色，那么我们就必须使用 `color()`。

> 颜色空间是指一系列颜色的集合，常用的颜色空间有 sRGB、Adobe RGB、DCI-P3。请注意，下文出现的 display-p3 不等价于 DCI-P3，你可以把 display-p3 立即为 DCI-P3 的变种，display-p3 是由 Apple 公司创造的。

### 语法

```css
color( colorspace-name r g b / a )
```

### 示例

```css
color( display-p3 1 0.5 0 )
```

### 兼容性

目前只有 Safari 和 Chrome 支持 `color()`，你可以从 [这里](https://caniuse.com/?search=color()) 找到最新的兼容性情况。

> Safari 的控制台提供了 `sRGB -> Display P3` 或 `Display P3 -> sRGB` 的能力，你可以从 [这里](https://webkit.org/blog/10042/wide-gamut-color-in-css-with-display-p3/) 找到具体的使用方法。

### 图像使用 P3 色域

在 Photoshop 中，我们可以将图像的颜色空间设置为 P3，如此一来，哪怕浏览器不支持 `color()`，图像也可以呈现出更加艳丽的色彩。

## lch()

`lch()` 是一种基于 LCH 的颜色表示法，它不受限于任何颜色空间。

### 语法

```css
lch( l c h )
lch( l c h / a )
```

- `l` 是属于 `[0%, 100%]` 的百分比值。当 `l` 为 `0%` 时，由于没有亮度，此时颜色会呈现为黑色，当 `l` 为 `100%` 时，由于亮度过高，此时颜色会呈现为白色，如果你想渲染出颜色本来的颜色，那么请将 `l` 设置为 `50%`。
- `c` 是属于 `[0, 正无穷]` 的数字值
- `h` 是属于 `[0deg, 360deg]` 的角度值。除了 `deg` 外，你还可以使用的单位有 `rad`、`grad`、`turn`。如果你没有为它指定单位，那么它就会使用 `deg` 来作为默认单位。
- `a` 是属于 `[0, 1]` 的数字值，或属于 `[0%, 100%]` 的百分比值。

### 示例

```css
lch( 50% 150 0 )
lch( 50% 150 0 / 1 )
```

### 特点

LCH 和 HSL 很相似，LCH 是另一种人类可读的颜色格式，其中 L 代表亮度（Lightness）、C 代表浓度（Chroma）、H 代表色调（Hue）。

相比于 HSL，LCH 有 2 个显著的特点：

- 如果 2 个颜色的 Lightness 是相同的，那么它们在视觉上的明亮程度就是相同的（详见下图）；
- 不受限于任何色彩空间，只受限于显示器的性能，因为它的色彩浓度（Chroma）没有上限（详见下例代码）；

当显示器使用 sRGB 色彩空间时，`.red` 和 `.redder` 会呈现出一样的红色，当显示器使用更宽的色域时，`.redder` 会更红。

```css
.red { background: lch( 50% 100 0 ) }
.redder { background: lch( 50% 230 0 ) }
```

![hsl 和 lch](/css/color/hsl-vs-lch.png)

### 兼容性

目前只有 Safari 和 Chrome 支持 `lch()`，你可以从 [这里](https://caniuse.com/?search=lch()) 找到最新的兼容性情况。

## oklch()

OKLCH 和 LCH 很相似，并且 OKLCH 要比 LCH 更好，因为 OKLCH 修复了 LCH 中关于蓝色色调的一些 bug。

如果你想了解更多，请阅读 [这篇文章](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl#oklch-vs-oklab--lch-vs-lab)。

### 兼容性

目前，仅仅只有 Safari 支持 `oklch()`。

## Color Picker

- RGB/HSL 调色板：https://jynxio.github.io/color-picker/
- LCH 调色板：https://css.land/lch/
- OKLCH 调色板：https://oklch.com/

## 扩展阅读

- [LCH colors in CSS: what, why, and how? - Lea Verou](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)