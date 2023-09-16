### 包围盒

> 之所以写包围盒，是因为绝对定位元素们都是根据包围盒来定位的，然后我需要一个方法论来寻找真正的包围盒

流式布局中的元素的包围盒的计算规则 + 图片；

MDN 对包围盒有一个很棒的解释，你要看看，似乎和你的理解是不一样的 https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

每个元素都有一个包围盒（containing block），在流式布局中，包围盒就是父元素的内容盒（不包含 padding），在定位布局中，对于 relative 元素而言，包围盒也是父元素的内容盒，但是对于 absoluted 元素而言，包围盒是最近的使用了定位布局的祖先元素的内边距盒（不包含边框）。fixed 元素和 sticky 元素呢？

> Jpsh 说，padding 是为了给流式布局用的，因为 relative 元素还会在流式布局中占据空间，所以它的包围盒会考虑 padding 的影响，而 absoluted 元素已经脱离了流式布局，它不会占用任何空间，因此它就不用考虑 padding 对它的影响了。这个说法还不错欸！那么对于 fixed 元素和 sticky 元素呢？

Josh 说，如果 absoluted 元素的所有祖先元素都没有使用定位布局，那么 absoluted 元素就会根据 `initial containing block` 来定位，根据 [W3C](https://drafts.csswg.org/css-display-3/#initial-containing-block) 的定义，initial containing block 就是 `html` 元素的包围盒，但实际上 W3C 的定义和实践发现的结果根本不一致。

Josh 说 initial containing block 是一个尺寸为视口大小的盒子，然后实践发现当 absoluted 元素真的根据 initial containing block 来定位的时候，确确实实是把它当成了一个视口大小的盒子，并且这个盒子并不是定死在屏幕上的，这个盒子就像是一个位于流动布局的最顶部的视口大小的盒子，如果页面可以滚动（横着滚或者竖着滚），那么随着滚动，盒子会滚走，absoluted 元素也会随之滚走。关于滚走这一点，Josh 根本没有提到。

> MDN 顺嘴提到了一下 initial containing block，和我想的不是一样的吧？[Fixed positioning is similar to absolute positioning, with the exception that the element's [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) is the initial containing block established by the *viewport*](https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed_positioning)

如果 initial containing block 真是 `<html>` 元素的话，那这根本就不符合实践的结果，因为如果我无论把 `<html>` 设置的多大或者多小，absoluted 都不受 `<html>` 的影响。你可以看看这个代码👇

```html
<html>
    <body>
        <div></div>
    </body>
</html>

<style>
    html {
        inline-size: 99999px;
        block-size: 99999px;
    }
    
    div {
        position: absoluted;
        inset: 0; 
        margin: auto;
        inline-size: 200px;
        block-size: 200px;
    }
</style>
```

containing puzzle 游戏的第八关！也要抄下来！

## 层叠规则

在流式布局中，当元素之间发生重叠的时候，DOM 顺序更后的元素会出现在层叠的上层。怪异的是，流式布局的元素的背景、内容、轮廓是分开绘制的，先绘制背景，再在上面绘制内容，再在上面绘制轮廓，于是就会出现下面这种怪诞的现象：

```html
<div>A</div>
<div>B</div>

<style>
  div {
    inline-size: 100px;
    block-size: 100px;
    font-size: 5rem;
    text-align: center;
  }

  div:nth-child(1) {
    color: black;
    border: 6px solid currentcolor;
    outline: 6px solid gray;
    background-color: orangered;
  }

  div:nth-child(2) {
    margin-inline-start: 2rem;
    margin-block-start: -5rem;
    color: cornflowerblue;
    border: 6px solid currentcolor;
    outline: 6px solid darkcyan;
    background-color: hotpink;
  }
</style>

```

定位元素的层叠规则要简单很多！

1. 定位元素（relative、absolute、fixed、sticky）总是层叠在非定位元素（流式布局元素、Flexbox、Grid...）的上面；
2. 如果定位元素之间发生了层叠，那么 z-index 更大的定位元素会出现在上层；
3. 如果定位元素之间发生了层叠，且 z-index 都一样，那么 DOM 顺序更后的定位元素会出现在上层；

> z-index 服务于定位元素和 flex/grid 子元素

做一个关于 z-index 的 Z 轴方向的图？

z-index 代表的是“层叠等级”，层叠等级高得元素会覆盖层叠等级低得元素，z-index 的默认值是 auto，auto 代表该元素在当前层叠上下文中的层叠等级是 0，然后当前元素也不会创建一个本地的新的层叠上下文，这就意味着它和它的后代（这里指定位元素）都会处于同一个层叠上下文中，这就会出现一些容易让人困惑的事情，下例中 child 元素会被 parent 元素覆盖，因为它们都处在同一个层叠上下文中，但是 child 元素的层叠等级比 parent 元素的层叠等级要更低。

```html
<div class="parent">
  <div class="child"></div>
</div>

<style>
  .parent {
    position: relative;
    z-index: auto;
    inline-size: 100px;
    block-size: 100px;
    background-color: orangered;
  }

  .child {
    position: relative;
    z-index: -1;
    inline-size: 50px;
    block-size: 50px;
    background-color: hotpink;
  }
</style>
```

z-index 的取值只能是 auto 或整数，当 z-index 取整数时，那么当前元素在层叠上下文中的层叠等级就等于这个整数，并且这个元素自己还会创建一个本地的层叠上下文，因为该元素已经创建了一个属于自己的本地层叠上下文，所以它的后代元素也肯定会无论如何都显示在该元素之上，把上面的例子改一下，你可以看到 child 元素的 z-index 明明比 parent 元素的 z-index 小，但是 child 元素还是会覆盖 parent 元素；

```html
<div class="parent">
  <div class="child"></div>
</div>

<style>
  .parent {
    position: relative;
    z-index: 0;
    inline-size: 100px;
    block-size: 100px;
    background-color: orangered;
  }

  .child {
    position: relative;
    z-index: -1;
    inline-size: 50px;
    block-size: 50px;
    background-color: hotpink;
  }
</style>
```

该元素创建了本地的层叠上下文之后，该元素的后代定位元素就只会在这个新的层叠上下文中比较层叠等级了，不会和其它的层叠上下文中的其它元素比较层叠等级了，看下面的例子：

```html
<div class="p1">
  <div class="c1"></div>
</div>

<div class="p2">
  <div class="c2"></div>
</div>

<style>
  .p1, .p2 {
    position: relative;
    inline-size: 100px;
    block-size: 100px;
  }

  .c1, .c2 {
    position: relative;
    inline-size: 50px;
    block-size: 80px;
  }

  .p1 {
    z-index: 1;
    background-color: orangered;
  }

  .c1 {
    z-index: -9999;
    background-color: cornflowerblue;
  }

  .p2 {
    z-index: 0;
    margin-inline-start: 20px;
    margin-block-start: -40px;
    background-color: hotpink;
  }

  .c2 {
    z-index: 9999;
    background-color: crimson;
  }
</style>
```

z-index 当然可以使用负数，不过 Josh 不推荐，因为他觉得这把事情弄得更复杂了。

> 翻译成局部层叠上下文更加贴切！

还有其他办法也可以创建层叠上下文！

- Setting `opacity` to a value less than `1`
- Setting `position` to `fixed` or `sticky` (No z-index needed for these values!)
- Applying a `mix-blend-mode` other than `normal`
- Adding a `z-index` to a child inside a `display: flex` or `display: grid` container
- Using `transform`, `filter`, `clip-path`, or `perspective`
- Explicitly creating a context with `isolation: isolate` (More on this soon!)

If you're curious, you can see the [full list of how stacking contexts are created](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) on MDN.

无论你多么精通层叠上下文，你都会陷阱层叠上下文的陷阱（我明明这么这么做了，为什么这个家伙还是永远在最上层啊！巴拉巴拉），所以你需要一个工具来帮你可视化层叠上下文！这个工具就是 [Stacking Contexts Inspector](https://github.com/andreadev-it/stacking-contexts-inspector)，他是一个浏览器插件，你可以在 [这里](https://chrome.google.com/webstore/detail/css-stacking-context-insp/apjeljpachdcjkgnamgppgfkmddadcki) 找到它的 Chrome 版本，或者在他的 readme 页面找到 Firefox 版本。

### isolation: isolate

当我们高强度的使用 `z-index` 来控制元素的层叠顺序时，时常会遇到「z-index 混乱」难题，即元素的层叠顺序并不是我们所期望的顺序，为了解决这个问题，我们通常会立即疯狂的增大或减小元素的 `z-index` 值（比如使用诸如 9999 这样的大数值），有时候这会奏效，有时候又不会奏效，然后后面还会周而复始的遇到这个问题，最后 `z-index` 就会很混乱很难以维护/调试。

造成这种问题的根本原因是：层叠上下文的结构混乱。我们需要像厘清 DOM 的层次结构一样，来厘清层叠上下文之间的层次结构，基于这个层叠上下文的结构，我们可以把每个定位元素的 `z-index` 变成类似于选择器优先级那样子的东西（比如 `1-2-0-3`）。

而厘清层叠上下文之间的层次结构的重要手段就是善于主动创建局部层叠上下文，为此推荐使用 `isolation: isolate` 属性，它会创建局部层叠上下文，并且该元素会具有隐式的 `z-index: 0`。

```html
<section>中层</section>
<section>下层</section>
<section>上层</section>

<style>
    section:nth-child(1) {
        position: relative;
        z-index: 1;
    }
    
    section:nth-child(2) {
        isolation: isolate;
    }
    
    section:nth-child(3) {
        position: relative;
        z-index: 2;
    }
</style>
```

尤其是在组件化的今天，如果你的组件内部使用了 `z-index`，可是你又不知道你的组件会被用在何处，如果你不给组件的外层套一个层叠上下文，那么这个 `z-index` 就会和外部环境种的同一个层叠上下文的其它 `z-index` 作比较，这很可怕...

React 的 `createPortal` 是一个由此衍生出的解决方案，另外，你也应该关注一下原生的关于这类问题的解决方案 [dialog 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog)，原生的解决方案似乎已经可以完全取代掉 `createPortal` 了（maybe）。

## 固定定位

> position 一旦被设置成 absolute 或fixed，那么元素的宽高就会自动的 fit-content。

固定定位就像是一种特别的绝对定位，特别的地方在，它的包围盒更特别，没了。

> MDN 也把固定定位归类为绝对定位的一种 https://developer.mozilla.org/en-US/docs/Web/CSS/position#types_of_positioning，看第三点。
>
> 似乎你也需要学一下 BFC ：https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context

如果你不设置 top、right、bottom、left，那么固定定位元素的位置就会留在它在流式布局中的位置在屏幕上的投影，具体的你可以看 [这里的 Fixed without anchor points?](https://courses.joshwcomeau.com/css-for-js/02-rendering-logic-2/13-fixed) 里面的例子。（你可以测试一下四个方向都不设置，或者只有 top 不设置，这时你会发现，left 的位置会继承流式布局的位置）

如果固定定位元素有一个最近的祖先元素使用了 transform、perspective、filter 不为 none 时，那么这个祖先元素就为它提供包围盒，否则就由 initial containing block 来提供包围盒，这个 initial containing block 是由视口建立的，你可以把它完全当成视口。

关于这种奇怪的现象，请看 http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/

> Josh: but *fixed* children are only ever contained by the “initial containing block”, a box that exists outside the DOM structure.

> will-change: transform 也算！

有时候我们的应用程序的 DOM 结构会很深，如果我们想找到某个 fixed 元素的包围盒是不是被某些 transform 元素拦截了怎么办？Josh 写了一个蛮有用的方法！直接在控制台跑它就可以了！

```js
// Replace “.the-fixed-child” for a CSS selector
// that matches the fixed-position element:
const selector = '.the-fixed-child';

function findCulprits(elem) {
  if (!elem) {
    throw new Error(
      'Could not find element with that selector'
    );
  }

  let parent = elem.parentElement;

  while (parent) {
    const {
      transform,
      willChange,
      filter,
    } = getComputedStyle(parent);

    if (
      transform !== 'none' ||
      willChange === 'transform' ||
      filter !== 'none'
    ) {
      console.warn(
        '🚨 Found a culprit! 🚨\n',
        parent,
        { transform, willChange, filter }
      );
    }
    parent = parent.parentElement;
  }
}

findCulprits(document.querySelector(selector));
```

> 如果你要抓的 DOM 元素在 iframe 里面，那么你首先要找到 iframe 的运行环境，怎么抓？看这里 [Beware of iframes!](https://courses.joshwcomeau.com/css-for-js/02-rendering-logic-2/13-fixed)。

## Overflow

对于 `overflow: visible`，对于一个固定宽高的元素，当元素的内容（文本或其它元素都行）超出了元素的边界时，内容就会直接超出边界，但是超出边界的内容不会影响外界的其它元素的布局。但是它有可能会导致更外层的容器产生滚动条。

```html
<section><div></div></section>
<section></section>

<style>
  section {
    inline-size: 200px;
    block-size: 200px;
  }

  section:nth-child(1) {
    background-color: hotpink;
  }

  section:nth-child(2) {
    background-color: cornflowerblue;
  }

  div {
    inline-size: 50%;
    block-size: 300%;
    border: 2px solid red;
  }
</style>
```

对于 `scroll`，在 Windows 和 Linux 系统上，盒子始终都会渲染出滚动条，对于 MacOS 则不是。如果 MacOS 使用的是触控板，那么仅仅在光标在盒子内滚动的时候，才会渲染出滚动条，否则就会隐藏滚动条，如果使用的是鼠标，那么就会一直显示滚动条。

由于大多数用户都是 Windows，所以我们应该在设置中令 MacOS 的滚动条常显（Show scroll bars 设置），一点牺牲，来换取更好的用户体验。

`overflow: auto` 其实就很万金油啦，只不过它也有一个小缺点，就是如果内容忽然溢出容器，那么容器就会立即创建出滚动条，这个滚动条又会挤占容器的空间，导致内容会闪烁一下。如果你知道某些元素一开始就需要滚动，那么干脆给他们 `scroll` 算了，以避免他们渲染出来之后闪烁一下。

Josh 给了一个建议，当你使用 `hidden` 时，请写一个关于你为什么要用他的注释，因为你通常都是使用 hidden 来解决一些小众的样式 bug，但是当你重构的时候，你可能会觉得这一行没用，然后删掉，并在最后的某个时刻才遇到这个小众 bug。所以留一行注释，以帮助未来的自己。

## scroll container

> `<body>` 和 `<html>` 天生就是 scroll container？对吗？可是他们的 overflow 的 x 轴和 y 轴都是 visible 欸！

这是 CSS 中的一个隐藏概念，一旦我们为元素的 `overflow-x` 或 `overflow-y` 或 `overflow` 设置了 `auto` 或 `scroll` 或 `hidden`，那么这个元素就会变成可滚动容器（scroll container）。 

对于一个 scroll container 元素，在外界看起来，它永远都是那么大，但是它的内部却可以容纳无限多的内容，它的内容永远也不会溢出来，它就像是一扇异次元的大门，这扇门看起来永远都那么大，但是进入这扇门里面，里面的空间却是无限大的。

一旦内容的大小超出外界的大小，那么才会出现滚动条。scroll containers only start to scroll when the *inner size* exceeds the *outer size*. As long as the outer size can keep on growing, that doesn't happen.

一个元素一旦成为 scroll container，那么它的 x 轴和 y 轴都会变成可滚动的，这就意味着它的 x 轴和 y 轴就只能处于 hidden 或 scroll 状态，看下面的例子：

`div` 元素溢出了 `section` 元素，然后在 y 轴上一旦设置了 `overflow-y: hidden` 后，`<section>` 就变成了可滚动元素，那么 x 轴就会在暗地里被当成 `overflow-x: auto`，最后呈现出来的效果就是 y 轴是截断的，x 轴是可滚动的。

```html
<section>
  <div></div>
</section>

<style>
  section {
    overflow-x: visible;
    overflow-y: hidden;
    inline-size: 300px;
    block-size: 100px;
    padding: 1px;
    background-color: hotpink;
  }

  div {
    inline-size: 50px;
    block-size: 50px;
    margin-inline-start: 260px;
    margin-block-start: 60px;
    border-radius: 999rem;
    background-color: cornflowerblue;
  }
</style>
```

所以我们没有办法令一个元素的某一个轴是 visible 然后另一个轴是可滚动的，要么大家都是 visible，要么大家都是可滚动的。

> hidden 也是可滚动的，不过它其实是一个删掉了滚动轴的 scroll，我们可以用比较 hack 的方法令 hidden 滚动起来：
>
> 用 tab 键选中可交互元素，然后用 tab 键继续切换元素，你会发现 hidden 滚动起来了。
>
> ```html
> <section>
>   <a href="/">link-1</a>
>   <a href="/">link-2</a>
>   <a href="/">link-3</a>
>   <a href="/">link-4</a>
>   <a href="/">link-5</a>
>   <a href="/">link-6</a>
> </section>
> 
> <style>
>   section {
>     overflow-y: hidden;
>     block-size: 100px;
>     background-color: hotpink;
>   }
> 
>   a {
>     display: block;
>   }
> </style>
> ```

**And here's the problem:** when a container becomes a scroll container, it manages overflow in *both directions*. The moment we set `overflow-x` *or* `overflow-y`, it becomes a portal to an alternative dimension, and all children/descendants will be affected.

## Overflow: clip

在上一节的第二个例子中，这个例子其实会被大家觉得是一个 bug，因为谁都想不到它居然会因为 `overflow-y: hidden` 而创建出一个 scroll container 继而废掉了 `overflow-x: visible`，以至于最后呈现出了让人意外的结果。

`clip` 属性是对这件事情的一个修正，它不会创建 scroll container，它就是简单粗暴的直接裁剪掉溢出的部分，可以只裁 x 轴或 y 轴，也不会像 hidden 那样可以被暗地里滚动起来（虽然不能滚动起来，但是还是可以用 tab 选中那些被裁剪掉的可交互元素！）。

> 这个属性比较新，不支持 IE，并且 Safari 直至 16 版本才开始支持。

由于这个属性比较新，它在 Chrome 中有 bug，就是当你一旦启用 `border-radius` 之后，那么 x 轴和 y 轴都会一起 clip！Firefox 则没有这个 bug！把下面这段代码运行在两个浏览器试试！（TODO：Safari 呢？）

```html
<section>
  <div></div>
</section>

<style>
  section {
    overflow-y: clip;
    inline-size: 300px;
    block-size: 100px;
    padding: 1px;
    border-radius: 5px;
    background-color: hotpink;
  }

  div {
    inline-size: 50px;
    block-size: 50px;
    margin-inline-start: 260px;
    margin-block-start: 60px;
    border-radius: 999rem;
    background-color: cornflowerblue;
  }
</style>
```

另外，就像前面说的，clip 里还是可以选中可交互元素，但是用户完全看不到他们选中了的可交互元素，这对于页面的无障碍访问而言是一种灾难性的 bug！

## Overflow: clip 的 polyfill？

下面是 Josh 提供的 Overflow: clip 的更好的替代方案，完全实现了 clip 的效果，但是不用担心它在 Chrome 中犯病，而且兼容性更好。

> 但还是会可以用 tab 来触发滚动。

```html
<style>
  html, body {
    height: 100%;
  }
  .outer-wrapper {
    overflow-x: hidden;
    min-height: 100%;
    /*
      Adding a border so you can see the
      size/shape of this container:
    */
    border: 2px dashed silver;
  }
  .wrapper {
    background: pink;
  }
</style>

<div class="outer-wrapper">
  <div class="wrapper">
    <div class="flourish one"></div>
    <div class="flourish two"></div>
  </div>
  <p>Hello world</p>
</div>
```

## Overflow 和固定布局

scroll 容器不一定是固定布局元素的容器，当他们用 relative 时，absoluted 元素可以被圈起来，fixed 元素不可以。诸如此类的。

## 参考资料

写笔记之前，下面的参考资料要看完：

https://developer.mozilla.org/en-US/docs/Web/CSS/position#types_of_positioning