---
typora-root-url: ./..\..\image
---

# Flex 布局

## 概述

flex 布局（flexible box layout）是一种弹性布局。

相较于 grid 布局，flex 布局在处理一维布局的时候更加简单，因此哪怕 grid 布局可以完全替代 flex 布局，我也仍然钟爱使用 flex 布局。

## 启用

如果元素为 `display: flex | inline-flex`，那么元素就会变成 flex 容器（flex container），子元素就会变成 flex 项（flex item），然后 flex 容器的内部将会激活 flex 布局，flex 项们都会参加进这个 flex 布局，不过 flex 容器还会留在原来的布局模式之中。

`display: flex` 和 `display: inline-flex` 的区别在于，前者会使 flex 容器成为块级元素（block-level element），后者会使 flex 容器成为行内块元素（inline-block element），除此之外，便再无其他区别了。

另外，flex 项的 `float`、`clear`、`vertical-align` 属性会失效。

## 语法

| 用于 flex 容器    | 用于 flex 项  |
| ----------------- | ------------- |
| `flex-direction`  | `flex-basis`  |
| `justify-content` | `flex-grow`   |
| `align-content`   | `flex-shrink` |
| `align-items`     | `align-self`  |
| `gap`             |               |

## 方向

flex 布局中有一至多条主轴（main axis）和一条交叉轴（cross axis），flex 项会沿着主轴来堆叠，沿着交叉轴来换行，主轴和交叉轴总是相互垂直的。

主轴和交叉轴的方向是由 `flex-direction`、`writing-mode`、`dir`、`direction` 共同决定的，我个人不使用 `direction` 属性，所以我不会介绍它。

> 为什么不使用 `direction`？这是因为 `direction` 和 `dir` 的作用都是相同的（其实有一些微妙的差别），即设置书写方向的「始与终」。如果我们想要设置书写方向的「始与终」，那么我们应该直接设置 `<html>` 的 `dir` 和 `lang`，而不是 `direction`，这样做的好处是，哪怕 CSS 还未加载，网页也能正确处理书写方向的「始与终」。

[TODO: 所有组合情况 + 多条主轴]

### dir 与 writing-mode

`dir`  设置书写的「始与终」，`writing-mode` 设置书写的「横与纵」。其中，「横与纵」是指文本沿着水平或垂直方向书写，「始与终」是指文本在横行或纵列中书写时的起点与终点。

| writing-mode 属性 | 描述                                                       |
| ----------------- | ---------------------------------------------------------- |
| `horizontal-tb`   | 文本沿着水平方向书写，沿着从上（`t`）到下（`b`）的方向换行 |
| `vertical-lr`     | 文本沿着垂直方向书写，沿着从左（`l`）到右（`r`）的方向换行 |
| `vertical-rl`     | 文本沿着垂直方向书写，沿着从右（`r`）到左（`l`）的方向换行 |
| `sideways-lr`     | 除了 Firefox 之外，没有任何浏览器实现该特性，故忽略        |
| `sideways-rl`     | 除了 Firefox 之外，没有任何浏览器实现该特性，故忽略        |

| dir 属性 | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| `ltr`    | 对于横行模式（`writing-mode: horizontal-*`），文本沿着从左（始）到右（终）的方向书写；对于纵列模式（`writing-mode: vertocal-*`），文本沿着从上（始）到下（终）的方向书写； |
| `rtl`    | 与 `ltr` 相反                                                |
| `auto`   | 浏览器自动的根据文本的语种来决定采用 `ltr` 或 `rtl`          |

### flex-direction

TODO

TODO

TODO

TODO

TODO

`flex-direction` 可以影响主轴和交叉轴的方向，但它不能决定主轴和交叉轴的方向。事实上，主轴和交叉轴的方向要由 `flex-direction`、`writing-mode` 和 `dir` 3 个属性一起决定，这 3 个属性可以搭配出 24 种不同的组合（指属性值的组合），不过最后只有 8 种不同的情况（指主轴和交叉轴的情况）。

```
flex-direction: row | row-reverse | column | column-reverse
```



其实，`ltr` 和 `rtl` 分别是「left to right」和「right to left」的缩写。我个人喜欢把 `ltr` 当作「start to end」，把 `rtl` 当作「end to start」，然后想象 `writing-mode: horizontal-tb` 的 start 是 left，end 是 right；`writing-mode: vertical-*` 的 start 是 top，end 是 bottom。

TODO: dir 和 writing-mode 的 6 种情况的图

## 尺寸

## 对齐

## 间隙



### justify-content

它可以控制所有 flex 项在主轴上的分布，仅当主轴上有多余的空间时，它才有效。

它是在 flex 项的尺寸和外边距计算完成之后才运行的，这意味着如果 flex 项通过膨胀或外边距扩张（比如 auto margin）来消耗完了主轴上的多余空间，那么该属性就会失效。

对齐主体是外边距盒子！见 [此](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_alignment#%E5%AF%B9%E9%BD%90%E4%B8%BB%E4%BD%93)。怪不得要考虑 auto margin？对齐主体指的是 flex 项的外边距盒子，对齐容器指的是 flex 容器。

基线自对齐通过在盒子外部增加外边距，从而移动盒子，实现对齐。那么 center 这些对齐也是需要移动 margin 的吗？

start 在意书写方向、left 在意物理方向、flex-start 在意 flex-direction 的 start 方向，是这样的，对吗？

我可以直接内嵌 codepen 到网页？！这是比 MDX 更好的方法吗！？

```
`flex-start` takes into account the presence of the `-reverse` values of the flex direction, while `start` does not.

For example, in a left-to-right writing mode with a flex container set to `flex-direction:row-reverse`, `justify-content:start` would cause all items to be justified to the left, while `justify-content:flex-start` would cause all items to be justified to the right.
```

[这篇文章在说好几个值之间的区别](https://csslayout.news/whats-the-difference-between-the-alignment-values-of-start-flex-start-and-self-start/)

[stackoverflow 的第二个回答很简单直白地说明了他们的区别](https://stackoverflow.com/questions/50919447/flexbox-flex-start-flex-end-self-start-self-end-and-start-end-whats-the-dif)

如果 `flex-direction: column | column-reverse` 时 `left` 和 `right` 就表现为 `start`，真的吗？

`space-between` 的每个相邻项的距离是相同的，然后两侧贴边。

`space-around` 的每个相邻项的距离是相同的，然后开头空白空间和结尾空白空间是中间空白空间的一半。

`space-evenly` 的两侧空白，然后所有空白的空间都是平均的。

`safe` 似乎总是等同于 `start`？？？ `safe` 和 `unsafe` 都不是有效值？？？？是真的吗？

box aligment 是一个对齐方案，flexbox 的对齐属性也被收纳成为了它的一部分，这个规范详细说明了在所有布局中（不仅仅是 flexbox）对齐属性是如何起作用的。这样的意义之一是，使用 box aligment 里面的对齐属性，并同时开启 flex 布局和 grid 布局，然后 grid 布局不兼容的时候，也能会退到 flex 布局。

flex 布局是一维布局，一旦换行之后，那么每一行都相当于一个新的 flex 容器，行与行之间的 flex 项不会彼此影响，grid 项则不然。比如，它没有办法让下一行的项和上一行的项对齐，所以它是单维布局。

要使 `align-content` 生效，那么容器的高度也要高于所有项目的总高度。

flex 布局中没有定义 `justify-content & align-content: space-evenly`，`evenly` 是 box alignment 定义的。

`gap` 是 `row-gap` 和 `column-gap` 的缩写，当 `flex-wrap: wrap | wrap-reverse` 时，`column-gap` 就会有效。

`flex-basis` 应该被当作是起始尺寸，而不是假设尺寸。`min-content` 会尽可能的让元素变得小，对于一段文本来讲，这就相当于是字符串中的最长的单词的尺寸。规范把多余的空间翻译成“正可用空间”，另一个则是“负可用空间”。在正可用空间情况下，才有拉伸和分布（即对齐），在负可用空间下，才会讲收缩。

flex-basis 的优先级比 width 更高，只有当 flex-basis 为 auto 时，为了确定基础尺寸，才会去检查 width，并用作为 flex-basis。如果您希望 Flexbox 在进行空间分配时完全忽略项目的大小，请将 `flex-basis` 设置为 `0` ，但是 `flex-basis` 可以突破最小尺寸吗？

在本例中， `flex-basis` 值为 `auto` ，并且项目没有设置宽度，因此会自动调整大小。这意味着 Flexbox 正在查看项目的 `max-content` 大小。为什么是 `max-content` 而不是 `content`，它们的区别是什么？

`visibility: collapse` 的作用：https://developer.mozilla.org/zh-CN/docs/Web/CSS/visibility

但是该属性在 Chrome Safari 中的表现似乎是不正确的，见 https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Mastering_wrapping_of_flex_items#collapsed_items 的「**Note:** Use Firefox for the below two examples as Chrome and Safari treat collapse as hidden.」

## 布局冲突

通常，元素只能采用一种布局模式，如果我们尝试为元素赋予多种布局模式，那么元素最后也只会采用其中的一种。具体来说，如果一个元素被同时赋予了定位布局和其他布局，那么元素就总是会采用定位布局，然后忽略另一种布局。

比如，下例中的 `<div>` 会采用定位布局而不是 flex 布局。最后，对于 `<section>` 而言，它会忽略掉 `<div`，对于 `<div>` 而言，它会忽略掉其他的 flex 项（此行为对 `<div>` 的初始位置的计算会有影响）。

```html
<!-- 原始代码 -->
<section style="display: flex">
	<aside></aside>
    <div style="position: fixed"></div>
	<aside></aside>
</section>

<!-- section视角 -->
<section style="display: flex">
	<aside></aside>
    <aside></aside>
</section>

<!-- div视角 -->
<section style="display: flex">
    <div style="position: fixed"></div>
</section>
```

例外的是，flex 布局可以和相对定位布局稳定的共存，也可以和沾滞定位布局不稳定的共存。比如只要为 flex 项激活相对定位布局，那么就可以直接使用相对定位布局的所有特性了，比如使用 `inset` 来偏移元素的位置，就像下例那样。不过，请不要为 flex 项激活沾滞定位布局，因为这两种布局不能稳定的共存，它们结合之后会触发一些难以理解的行为。

```html
<section style="display: flex">
	<aside></aside>
    <div style="position: relative; top: 1rem; left: 1rem"></div>
    <aside></aside>
</section>
```

## 可用性障碍

`flex-direction: row-reverse | column-reverse` 和 `order` 可以在视觉上改变元素的渲染顺序，有时候这会造成一些可用性上的障碍，因为屏幕阅读器和 Tab 键等辅助设备仍然会遵循 DOM 顺序来聚焦元素。

如下例所示，Tab 键会从右向左聚焦元素，屏幕阅读器会从右向左阅读内容，这会让人感得困惑。

```html
<ul>
    <li>Josh</li>
    <li>John</li>
    <li>Sam</li>
</ul>

<style>
    ul {
        display: flex;
        flex-direction: row-reverse;
    }
</style>
```

## align-items

> 疑问：如果子项们的 baseline 是不一样的，那么 `align-items: baseline` 时，应该选用谁的 baseline 来锚定呢？

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

## gap

## flex-basis

## flex-grow

举一个这样的例子：有 3 个 flex 项，flex-basis 不一样，flex-grow 一样，然后分配的空间都是一样的，但是最后的大小却不是一样的，这样子就说明了最终尺寸等于 flex-basis + 相等的多余尺寸，然后多余尺寸用多重斜线在盒子模型中标记出来！

如果我们真的想要让所有的 flex 项的大小都完全相等，那么就应该设置 `flex: 1 1 0`，因为 `flex-basis: 0` 意味着每个 flex 项的基础尺寸都是 0，那么就意味着 flex container 中的所有空间都会成为正可用空间，并因为 `flex-grow: 1` 而平均分配给每一个项。

## flex-shrink

分配负空间时，伸缩收缩系数乘以伸缩基本尺寸。这会根据项目能够收缩的程度按比例分配负空间，这样，例如，一个小项目不会在较大的项目之前收缩到零。项目明显减少

“flex 项的收缩极限是 min-content”，仔细研究一下这个规律。

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

我们可以用 flex-direction、flex-wrap、order 属性来操纵 flex 布局为双维度布局，可是 Grid 提供了更加简单的方案，所以我们不要再去研究这种奇技淫巧了吧！比如，flex-wrap 可以实现换行，然后实现双维布局，但是他是有限制的，比如你做终极练习的时候，最后一个商品的尺寸很难和前面的商品的尺寸完全一致，这就是 flexbox 的限制。因为有这些情况，所以才推荐你使用 grid 来做双维度布局。

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

## flex

flex 缩写是有陷阱的，比如 `flex: 1` 时的 `flex-basis` 为 `0`，而不是默认值 `auto`。你要继续看看有没有别的陷阱！

## 关于阮一峰的 Flex 教程的笔记



容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

## 关于 Josh 的文章
When we flip display to flex, we create a “flex formatting context”.

默认情况下，子项将聚集在主轴（primary axis）的开头，并且会通过拉伸自己来填满整个交叉轴（cross axis）。

### 为什么没有 justify-items，并且为什么用 content 和 items

因为子项（item）可以在不影响其它子项的前提下，在交叉轴方向上自由移动，因此会有 align-self/align-items 属性。然而，子项没有办法在不影响其它子项的前提下，在主轴上自由移动，因此不会有 justify-items 属性。

justify 代表在主轴上的布局，align 代表在交叉轴上的布局。子项在主轴方向上，只能成群的行动，因此要用 justify-content，因为 content 代表一堆东西。子项在交叉轴方向上可以单独行动，因此可以用 items 或 self，因为这就代表着单个东西。

> 那有没有 align-content 呢？其实 align-items 就对应 align-content，对不对？（content 对应 items 嘛）

一个不太容易理解的事情，看下面的代码，这说明一件事情，在弹性盒布局中，width 只能代表一个假设宽度，而不是一个硬性宽度，规范对此给了一个名字“hypothetical size”。Josh：`flex-basis` and `width` set the elements' *hypothetical size*. 

```html
<main>
  <div></div>
  <hr />
  <section>
    <div></div>
  </section>
</main>

<style>
  main {
    inline-size: 9rem;
    padding: 1rem;
    border: 2px dashed black;
  }
  
  section {
    display: flex;
  }
  
  div {
    /* flex-shrink: 0; */
    block-size: 3rem;
    inline-size: 100rem;
    border: 2px solid black;
    background-color: hotpink;
  }
</style>
```

`flex-basis` 和 `width / height` 的区别在于，前者更加灵活，在 Flex row 模式中，它代表 `width`，在 Flex column 中，它代表 `height`。而 width 永远都代表 width，height 永远都代表 height。`flex-basis` 的好处就是，它的方向永远跟着主轴走。

但是 width 也会有一些区别，比如在可替换元素（比如 img 元素）中，width 的作用和 flex-basis 是不同的，另外，width 可以突破元素的最小宽度，但是 flex-basis 不可以。

对于 `flex-grow` 的计算机制，文章中的「I think it'll be easier to explain visually. Try incrementing/decrementing each child:」部分的例子非常棒！

对于 `flex-shrink` 的计算机制，抄这个例子！「**Let's test it.** Try shrinking the container to see what happens:」🧠 原来 flex-shrink 的收缩会收到 flex-basis 的影响！（width 也和 flex-basis 一样会影响 flex-shrink）。flex-shrink 之所以会收到 flex-basis 的影响，是因为这样可以在收缩之后，item 之间的尺寸的比例关系也可以继续维持下去。

“Alright, so: we have two children, each with a hypothetical size of 250px. The container needs to be at least 500px wide to contain these children at their hypothetical size.” 从这句话可以看出，当容器尺寸小于子项的假设尺寸之和时，才开始考虑 shrink，同理可得，当容器尺寸大于子项的假设尺寸之和时，此开始考虑 grow。这也意味着，shrink 和 grow 不可能同时发挥作用。

这个例子在说「Take a couple of minutes and poke at this demo. **See if you can figure out what's going on here.** We'll explore below.」shrink 的原理。

关于 shrink 的原理，见：

```html
<section>
  <div></div>
  <div></div>
</section>

<style>
  section {
    display: flex;
    block-size: 300px;
    inline-size: 400px;
    border: 2px dashed black;
  }

  div:first-child {
    flex: 1 5 250px; /* 5 */
    background-color: hotpink;
  }

  div:last-child {
    flex: 1 2 500px; /* 4 */
    background-color: cornflowerblue;
  }
</style>
```

原来 min-inline-size 和 max-inline-size 会限制收缩和拉伸的极限。当 `flex-shrink: 0` 之后，便意味着不再会收缩，便意味着 `width` 或 `flex-basis` 就是最小宽度。

### 最小宽度陷阱

flex 布局无法将子项缩小至最小尺寸以下，哪怕你设置了 `flex-shrink`，而有两种情况下，元素是会有隐形的最小尺寸的，这会导致设置了 `flex-shrink` 的元素无法收缩至 0 尺寸：

- text input 元素有内建的最小尺寸，170px-200px 不等（取决于浏览器），这个最小尺寸似乎是无法在浏览器开发者面板所检查到的；
- 元素的文字内容，最长的不可换行的字符串将会成为元素的最小尺寸；

如何解决这个问题？就是 `mini-width: 0`，可是这样做其实也会引发糟糕的事情，比如虽然元素尺寸收缩为 0，但是内容却会溢出元素的范围。

### auto margin 技巧

将 margin-?-? 设置为 auto，那么就可以将页面的多余空间全部转化为该元素的该方向上的 margin，使其与其它元素隔离开来，这个技巧有利于做某些布局。详见「Auto margins are much more interesting in Flexbox:」的例子。

### flex-wrap

`flex-wrap: wrap` 之后，子项就不会被缩小，而是当空间不足时就直接换行。当然，如果独占一行时空间还不够假设空间的话，那么就会缩小。

当换行之后，容器内就有多个主轴了，而不是一条主轴。

当有了多条主轴之后，有意思的事情便发生了。`justify-content` 会一次性的控制所有主轴上的对齐方式（空间分布，distribution of space），而如果我们想把交叉轴上的所有项目的空间分布，那么就要使用 `align-content`（content 和 items 的命名的区别证明就来了）。并且，我们还可以用 `align-self` 来控制交叉轴上的特定子项的对齐方式！

align-content 控制所有项目在交叉轴上的空间分布，align-items 控制一条主轴上的所有项目在交叉轴方向上的空间分布。

> 理所当然的，`align-content` 只对多行的 flex 容器有影响。

## 参考资料

https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
