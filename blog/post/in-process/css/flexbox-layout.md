---
typora-root-url: ./..\..\image
---

# Flex 布局

## 概述

flex 布局的全称为「flexible box layout」，它是一维的弹性的布局。

如果元素为 `display: flex | inline-flex`，那么元素就会变成 flex 容器（flex container），子元素就会变成 flex 项（flex item），然后 flex 容器的内部将会激活 flex 布局，flex 项们都会参加进这个 flex 布局，不过 flex 容器还会留在原来的布局模式之中。需要注意的是，flex 项的 `float`、`clear`、`vertical-align` 属性将会失效。

`display: flex` 和 `display: inline-flex` 的区别在于，前者会使 flex 容器成为块级元素（block-level element），后者会使 flex 容器成为行内块元素（inline-block element），除此之外，便再无其他区别了。

> 为什么不用 Grid 布局来替代 Flex 布局？因为在一维情况下，Flex 布局要更简单，尽管 Grid 布局已经可以完全替代 Flex 布局了。

## 布局的轴

flex 布局中有 2 种轴，分别是主轴（main axis）和交叉轴（cross axis），flex 项会沿着主轴的方向来堆叠与换行。

[TODO: 主轴与交叉轴 + 多主轴]

## 语法手册

| 用于 flex 容器    | 用于 flex 项  |
| ----------------- | ------------- |
| `flex-direction`  | `flex-basis`  |
| `justify-content` | `flex-grow`   |
| `align-content`   | `flex-shrink` |
| `align-items`     | `align-self`  |
| `gap`             |               |

### flex-direction

`flex-drection` 用于设置主轴的方向，其值为 TODO

`dir: ltr | rtl | auto` 决定文本的书写方向（从左到右书写或从右到左书写），`writing-mode: horizontal-tb | vertical-rl | vertical-lr` 决定了文本块的堆叠方向，比如 `horizontal-tb` 表示文本块的堆叠方向是「自上而下」，而在一个本文块之内，本文的书写方向则取决于 `dir` 属性，`vertical-rl` 表示文本块的堆叠方向是「从右到左（对于 `dir: ltr` 而言）」或「从左到右（对于 `dir: rtl` 而言）」，`vertical-lr` 则与 `vertical-rl` 相反，而文本块内的的书写方向则取决于 `dir` 属性，具体来说 `ltr` 表示从上往下写，`rtl` 表示从下往上写。

`flex-direction` 会受到 `dir` 和 `vertical-lr` 的共同影响。

使用 `*-reverse` 的时候会影响到无障碍性访问，比如屏幕阅读器。

TODO

TODO

TODO

TODO

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

## flex-shrink

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
