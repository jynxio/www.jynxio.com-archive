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

注意：flex 子项会自动充满副轴，除非用 block-size 来覆写。

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

陷阱：If a flexbox item's cross-axis margin is `auto`, then `align-self` is ignored.

陷阱：align-self: flex-start 似乎有 fit-content 的效果

陷阱：似乎只要设置 align-*，相应的元素就会自动 fit-content！快验证一下！

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

> `flex` 缩写陷阱，下例中，width会无效，因为它会被 flex-basis 遮盖，而这个遮蔽挺隐晦的。
>
> ```css
> div {
>     flex: 1;
>     width: 100px; /* width会被flex-basis覆盖掉 */
> }
> ```

## flex-wrap

「Wrapping」的第一个交互示例很棒！

这节课的练习作业说明了一件事情：如果换行了，那么就会有多条主轴！

> flex-wrap 被用于双维度布局，但事实上，此时我们应该使用 Grid 布局，后者更棒。

## 其它

「Groups and Gaps」中的第一个交互示例里，`margin-right: auto` 可以模拟 float 效果，可是却没有解释为什么可以。

我们可以用 flex-direction、flex-wrap、order 属性来操纵 flex 布局为双维度布局，可是 Grid 提供了更加简单的方案，所以我们不要再去研究这种奇技淫巧了吧！

## flex-direction

「Interactive Review」中的首图也太漂亮了吧！很美观的展示了方向的定义欸！

row、row-reverse、column、column-reverse 是和 writing-mode 有关的，在英语中（ltr 语种），row 是从左到右，row-reverse 是从右到左，column 是从上到下，column-reverse 是从下到上。比如在 MDN 中，row 代表主轴方向遵循文本方向。

利用 `flex-direction: row-reverse; justify-content: flex-end` 可以轻松的反转 flex 子项的排序，但这种反转只是视觉上的，当用户使用键盘来聚焦项目的时候，其顺序仍然会遵循 dom 顺序，于是这就有可能会成为无障碍访问的障碍（因为这会让视觉与 DOM 相反）。

## flex-wrap

nowrap：禁止换行（将会导致溢出），行头行尾方向遵循 flex-direction 的方向

wrap、wrap-reverse 则是可以换行。然而换行的方向是怎么确定的呢？？？

## order

flex 容器会按照 order 的升序和自己的方向来排序子项，如果 order 相同，则按照 dom顺序来排序，默认情况下，大家的 order 都是 0。

order 只是改变了子项在视觉上的布局顺序，但是没有改变子项在 dom 中的顺序，因此对于 tab 聚焦这种事情来说，它可能会造成可访问性的障碍。

## z-index

flex 和 grid 布局都支持 z-index，当子项发生重叠时（用 margin 来实现重叠），z-index 大者获胜。

## 布局冲突

> 事实上，一个元素只能参与一种布局，如果有应用多种布局，那么最后也只有一种布局会被采用。

如果一个元素同时被赋予了定位布局和其它布局策略，那么定位布局就总是会被采用，另一种布局则会被忽略。比如下例中的 div 会采用定位布局而不是弹性布局，section 会忽略掉这个 div，就好像 section 内部只有一个 p 一样。

```html
<section>
	<div></div>
    <p></p>
</section>

<style>
    section {
        display: flex;
    }
    
    div:first-child {
        position: fixed;
    }
</style>
```

relative 和 sticky 是例外，如果你给 flex 子项赋予了 relative 或 sticky 布局，那么弹性布局和相对定位布局/沾滞定位布局功存，对于相对定位布局而言，他就是表现的和一个正常的 flex 子项一模一样，不过我们还可以额外的使用 top/right/bottom/left 来偏移它。对于沾滞定位布局，虽然也能工作，但是有很多额外的陷阱...
