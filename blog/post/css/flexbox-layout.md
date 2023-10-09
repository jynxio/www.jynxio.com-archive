---
typora-root-url: ./..\..\image
---

**Flexbox is still relevant,** even with CSS Grid reaching wide browser support. It's a different tool for a different job: CSS Grid works best for two-dimensional layouts, while Flexbox offers more flexibility for working with a single dimension.

Grid 是 Flexbox 的完全替代品，目前仍旧使用 Flexbox 的原因有 2：

- Flexbox 的兼容性更好；
- Flexbox 在单轴控制上更方便；

When we apply `display: flex` to an element, we toggle the "Flexbox" layout algorithm for the element's *children*. The parent element will still use Flow layout.

如果 `display: flex`，那么元素的子元素就会启用 Flexbox 布局，而元素本身仍然会处于其原来的布局系统之中。

「Directions and Alignment」中的关于 Flexbox layout 的各种值的「可互动例子」真是太棒了！这让我开始考虑“我要不要切换到 MDX ？”。

## align-items: baseline

> 疑问：如果子项们的 baseline 是不一样的，那么 `align-items: baseline` 时，应该选用谁的 baseline 来锚定呢？
>

`align-items: baseline` 具有穿透性，下例中，虽然 3 个 `Sph` 的字号不同，但是它们的文字基线都会对齐（关于文字基线，请看 [这里](https://en.wikipedia.org/wiki/Baseline_(typography))）。

```html
<section>
	<p>Sph<span>Sph</span></p>
    <p>Sph</p>
</section>

<style>
    section {
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }
    
    span {
        font-size: 2rem;
    }
    
    p:first-child {
        font-size: 3rem;
    }
</style>
```



## align-self

flex 容器通过 `align-items` 来控制所有子项在副轴方向上的位置，子项则可以通过 `align-slef` 来控制自己在副轴方向上的位置。

> 不存在 `justify-self` 属性（这是合理的设计），如果你想要控制子项在主轴方向上的位置，那么需要借助 `flex-grow`、`flex-shrink`、`flex-basis`、`order`。
