# 定位布局

定位布局是一种布局策略，启用了定位布局的元素将可以根据其 containing block 来进行偏移，其中我们使用 `top`、`right`、`bottom`、`left` 属性来操纵其偏移。

如果将元素的 `position` 属性设置为非 `static` 属性，那么就视该元素启用定位布局。

THINK ABOUT IT: 行内元素启用了定位布局之后可以启用一些平时不能用的 CSS 属性？所有元素启用了定位布局之后，其默认的尺寸似乎都是 `fit-content` 的？

## 包含块

### 是什么？

包含块（containing block）是元素的生活空间，每一个元素都生活在某一个包含块之中，如果元素的 CSS 属性采用了百分比值时，那么这些百分比值的计算基准取决于包含块。比如：

- 如果元素的 `height`、`top`、`bottom` 属性采用了百分比值，那么其计算基准就是包含块的 `height`；
- 如果元素的 `width`、`padding`、`margin`、`left`、`right` 属性采用了百分比值，那么其计算基准就是包含块的 `width`；

### 怎么找？

- 如果元素的 `position` 值为 `static`、`relative`、`sticky`，那么其包含块就是满足下述任意一个条件的最近的祖先元素的 content box，条件为：
	- 该元素是一个块级容器；
	- 该元素会创建格式化上下文；
- 如果元素的 `position` 值为 `absolute`，那么其包含块就是 `position` 值为非 `static` 的最近的祖先元素的 padding box；如果没有任何一个祖先元素满足条件，那么就会采用初始包含块来作为其包含块；
- 如果元素的 `position` 值为 `fixed`，那么其包含块就是初始包含块（initial containing block）
- 如果元素的 `position` 值为 `absolute` 或 `fixed`，那么满足下述任意一个条件的最近的祖先元素的 padding box 就会成为其包含块，条件为：
	- 该元素的 `transform` 值为非 `none`；
	- 该元素的 `perspective` 值为非 `none`；
	- 该元素的 `container-type` 值为非 `normal`；
	- 该元素的 `backdrop=filter` 值为非 `none`；
	- 该元素的 `will-change` 值为 `transform` 或 `perspective`；
	- 该元素的 `contain` 值为 `layout`、`paint`、`strict`、`content`；
	- 该元素的 `filter` 值为非 `none` 或 `will-change` 值为 `filter`（此条仅作用于 Firefox 浏览器）；

> 虽然绝对定位元素也有可能会采用初始包含块来作为其包含块，但其仍然会因页面滚动而离开可视区域，然而固定定位元素却不会，这是其与固定定位元素的一大区别。

### 初始包含块是什么？

初始包含块（initial containing block）是一个由视口（viewport）派生的矩形区域，初始包含块的尺寸就等于视口的尺寸。

初始包含块也是 `<html>` 元素的包含块。

### 块级容器是什么？

块级容器（block container）是指那些作为容器的块级元素，其与块级元素的区别在于其必须包含内容（方可被称为容器）。

另外，块级容器要么只包含参与了行内格式化上下文（inline formatting context）的行内元素，要么只包含参与了块级格式化上下文（block formatting context）的块级元素（我对该描述感到困惑，其摘自于 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#calculating_percentage_values_from_the_containing_block)）。

## 相对定位

如果将元素的 `position` 属性设置为 `relative`，那么该元素就会启用相对定位。

相对定位元素在其 containing block 中的初始位置就是其在流式布局下的位置，并且其在 containing block 中所占据的空间是恒定的（无论其是否发生偏移），其所占据的空间就是其在流式布局中所占据的空间。无论相对定位元素是否发生偏移，它都不会影响到其他元素的布局，也不会撑大 containing block，因此它可以覆盖其他元素和超出 containing block 的边界。

> 初始位置是指 `inset: auto` 时的位置，后文下同。

[TODO: 示例代码 + 图片，参考「Relative Positioning」小节中的「This blue box is interactive」的互动示例]

```css
.blue-box {
    position: reltaive;
    top: 20px;
}
```

## 绝对定位

如果将元素的 `position` 属性设置为 `absolute`，那么该元素就会启用绝对定位。

绝对定位元素在其 containing block 中的初始位置就是其在流式布局下的位置，不过其在 containing block 中不占据任何空间。无论绝对定位元素是否发生偏移，它都不会影响到其他元素的布局，也不会撑大 containing block，因此它可以覆盖其他元素和超出 containing block 的边界。

一旦启用了绝对定位，那么元素的尺寸就会尽可能的小，就像是启用了 `fit-content` 那样。并且特别的是，启用了绝对定位的行内元素可以使用 `block-size`、`margin-block` 等其在流式布局中所无法使用 CSS 属性。

[TODO: 示例代码 + 图片，参考「containing puzzle」章节的第八关]

### 居中技巧

绝对定位可以被用来居中元素，具体有 2 种居中方案，分别是「弹性尺寸型居中」和「固定尺寸型居中」，详见下例。

```html
<div class="auto-size"></div>
<div class="fixed-size"></div>

<style>
    .auto-size {
        position: absolute;
        inset: 20px;
        inline-size: auto; /* 弹性尺寸 */
        block-size: auto;  /* 弹性尺寸 */
    }
    
    .fixed-size {
        position: absolute;
		inset: 0;
        inline-size: 10rem;  /* 固定尺寸 */
        block-size: 10rem;   /* 固定尺寸 */
        margin-inline: auto; /* inline居中 */
        margin-block: auto;  /* block居中 */
    }
</style>
```

> [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset) 可以一次性设置 `top`、`right`、`bottom`、`left` 属性，需要注意的是 `inset` 只遵循物理方向，不遵循逻辑方向。

## 固定定位

## 粘性定位