---
typora-root-url: ./..\..\image
---

**Flexbox is still relevant,** even with CSS Grid reaching wide browser support. It's a different tool for a different job: CSS Grid works best for two-dimensional layouts, while Flexbox offers more flexibility for working with a single dimension.

Grid 是 Flexbox 的完全替代品，目前仍旧使用 Flexbox 的原因有 2：

- Flexbox 的兼容性更好；
- Flexbox 在单轴控制上更方便；

When we apply `display: flex` to an element, we toggle the "Flexbox" layout algorithm for the element's *children*. The parent element will still use Flow layout.

如果 `display: flex`，那么元素的子元素就会启用 Flexbox 布局，而元素本身仍然会处于其原来的布局系统之中，元素本身会变成 flex container。

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

## flex-basis & flex-grow & flex-shink

flex-basis 比 width（或 height）的优先级更高（所以 width 和 height 是一种建议尺寸或假设尺寸，而不是最终尺寸）。并且实际上，flex-basis 和 width 或 height 的作用是完全一样的，只不过发生冲突时前者的优先级更高。TODO: flex-basis、flex-shink、flex-grow 会根据 width 或 height 来活动吗？会。

flex-basis、width、height 会受到 min-width、max-width、min-height、max-height 的限制。

flex-basis 可以接受百分比值，百分比值根据其包含块来计算，flex 子项的包含块是其父元素（即 flex container）的 content box。

flex-basis: auto 时，就会使用 width（水平书写模式）或 height（垂直书写模式）的值，如果 width 或 height 的值刚好也是 auto 时，那么就会干脆使用 flex-basis: content，即意味着根据 flex 子项的内容尺寸来自动调整 flex 子项的尺寸。

1. `min-content`: 该值指定子项元素的尺寸应根据其内容的最小尺寸来确定。换句话说，子项元素将尽可能缩小到其内容所需的最小空间。
2. `max-content`: 该值指定子项元素的尺寸应根据其内容的最大尺寸来确定。换句话说，子项元素将尽可能扩展到其内容所需的最大空间。
3. `fit-content`: 该值指定子项元素的尺寸应根据其内容的适合尺寸来确定，但不超过父级容器的尺寸。换句话说，子项元素将根据其内容自动调整尺寸，但不会超出父级容器的限制。
4. `content`: 这是一个相对于 `auto` 的别名。当 `flex-basis` 设置为 `content` 时，子项元素的尺寸将根据其内容和其他 Flex 子项元素的尺寸进行分配。

> 上面的四点来自于 Poe 的 AI 回答，似乎还不够正确或清晰。

flex-grow 只接受非负整数，当所有 flex 子项的主尺寸之和小于 flex 容器的 content box 的主尺寸时，flex 子项的主尺寸就会根据该属性来瓜分「剩余空间」，剩余空间是指 flex container 的主尺寸（应该是指 content box 的尺寸吧？需要确定一件事情，flex 子项只占用 flex container 的 content box，对吗？）减去所有 flex 子项的主尺寸之和之后所得到的差值。默认值是 0。

> 当 box-sizing: content-box 时，flex 子项主持寸是 content box 的主尺寸，box-sizeing: border-box 时，则是 border box 的主尺寸。

flex-shink 只接受非负整数，当所有 flex 子项的主尺寸之和大于 flex 容器的 content box 的主尺寸时，flex 子项的主尺寸就会根据该属性来收缩自身的主尺寸，收缩的基数是超出的长度。默认值是 1。flex-shink 无法将子项收缩到最小尺寸以下（但是 width 可以）。最小尺寸是什么？是 min-content 吗？
