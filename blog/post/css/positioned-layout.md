## 定位布局

文字自动换行是流式布局的特性，定位布局没有这个特性，因此采用定位布局的元素不会换行，而是会直接溢出父盒子的边界。

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