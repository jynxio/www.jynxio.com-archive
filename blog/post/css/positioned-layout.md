# 定位布局

文字自动换行是流式布局的特性，定位布局没有这个特性，因此采用定位布局的元素不会换行，而是会直接溢出父盒子的边界。

## 相对定位

「Relative Positioning」小节中的「This blue box is interactive」的示例图片很棒的解释了相对定位的特性！

```html
<section>
    <div></div>
</section>

<style>
    div {
        position: relative;
        left: 40px;
        inline-size: 100%;
    }
</style>
```

`<div>` 会直接溢出 `<section>`，而不是把 `<section>` 撑大，这是个被你忽略的细节，这似乎在暗示着采用了相对布局的元素所占据的空间永远是其在流式布局中的原始位置/空间，其的偏移是不会影响流式布局中的其它元素的。

相对布局中的 `left: 10px` 和 `right: -10px` 的效果是一样的。

相对布局可以让元素解锁一些其平时不能使用的 CSS 属性（主要是对于行内元素而言，对吗？

## 绝对定位

无论是行内元素、块级元素还是行内块元素，只要采用了绝对定位，那么元素的尺寸就会尽可能的小

### 居中技巧

```html
<div class="auto-size"></div>
<div class="fixed-size"></div>

<style>
    .auto-size {
        position: absolute;
        top: 20px;
        right: 20px;
        bottom: 20px;
        left: 20px;
        inline-size: auto; /* 弹性尺寸 */
        block-size: auto;  /* 弹性尺寸 */
    }
    
    .fixed-size {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        inline-size: 10rem;  /* 固定尺寸 */
        block-size: 10rem;   /* 固定尺寸 */
        margin-inline: auto; /* inline居中 */
        margin-block: auto;  /* block居中 */
    }
</style>
```

> `inset` 属性可以一次性设置 `top`、`right`、`bottom`、`left`，需要注意的是 `inset` 的多值语法采用物理偏移，而不是逻辑偏移。

### 包围盒

流式布局中的元素的包围盒的计算规则 + 图片；

定位布局中的绝对定位元素的包围盒是（Russian-nesting-dolls-type collection 的图片例子很棒！）：Absolute elements can only be contained by \*other\* elements using Positioned layout. What if it doesn't find one? the element will be positioned according to the **“initial containing block”**. 初始包围块是一个视窗大小的盒子。

另外，绝对定位元素会忽略包围盒的 padding，他们只会收到包围盒的 border 的影响，你可以认为 padding 只服务于流式布局，而绝对定位元素已经脱离了流式布局，因此 padding 并不适用于绝对定位元素。（把这件事也画进示例图片里面去！）

containing puzzle 游戏的第八关！也要抄下来！