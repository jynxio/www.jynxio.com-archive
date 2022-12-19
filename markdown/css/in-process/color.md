# 颜色格式

## Named color

命名颜色（named color）是指具有特定名称的颜色，比如 `red`、`tomato`、`teal` 等。截至目前（CSS Level 4），CSS 一共定义了 140 种命名颜色（named color），你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) 找到所有的颜色。

> 命名颜色摘录自很多来源，比如 HTML 4 规范、X11 Unix windowing 系统、[一个令人心碎的故事](https://codepen.io/trezy/post/honoring-a-great-man) 等，这导致命名颜色本身并不严谨，比如 `darkgray` 的颜色比 `gray` 的更浅。

## RGB

RGB 是一种基于物理的颜色表示法，即使用三原色来表示颜色，通过混合不同量的三原色，即可得到不同的颜色，其中 R 代表红色（Red）、G 代表绿色（Green）、B 代表蓝色（Blue）。

CSS 提供了两种使用 RGB 的方式，分别是 `rgb()` 和 `hex color`。

### rgb()

```css
rgb( r g b );
rgb( r g b / a );
```

其中，`r`、`g`、`b` 是属于 `[0, 255]` 的数字值或属于 `[0%, 100%]` 的百分比值，而 `a` 是属于 `[0, 1]` 的数字值或属于 `[0%, 100%]` 的百分比值。

> 该语法由 CSS Colors Module Level 4 定义，并且从该规范开始，浏览器会将 `rgba()` 视作 `rgb()` 的别名。
>
> 该语法的 [兼容性高](https://caniuse.com/mdn-css_types_color_rgb_alpha_parameter)，但不兼容 IE 11，如果你需要兼容 IE 11，那么请使用：
>
> ```css
> rgb( r, g, b );
> rgba( r, g, b, a );
> ```

## hex color

```css
#rgb;
#rgba;
#rrggbb;
#rrggbbaa;
```

其中，`r`、`g`、`b`、`a` 都是属于 `[0, f]` 的十六进制数字值。并且，`#rgb` 等价于 `#rrggbb`，`#rgba` 等价于 `#rrggbbaa`。另外，该语法不区分字母的大小写，比如 `#fff` 等价于 `#FFF`。

> 该语法由 CSS Colors Module Level 4 定义，IE 11 只支持 `#rgb` 和 `#rrggbb`，不支持 `#rgba` 和 `#rrggbbaa`。

## HSL

HSL 是一种基于视觉的颜色表示法，其中 H 代表色调（Hue）、S 代表饱和度（Saturation）、L 代表亮度（Lightness）。

```css
hsl( h s l );
hsl( h s l / a )
```

其中，`h` 是一个角度值，具体来说

> HSL 比 RGB 更符合人对颜色的感知

## LCH

## OKLCH