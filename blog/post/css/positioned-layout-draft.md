# 定位布局

定位布局是一种布局策略，启用了定位布局的元素将可以根据其 containing block 来进行偏移，其中我们使用 `top`、`right`、`bottom`、`left` 属性来操纵其偏移。

如果将元素的 `position` 属性设置为非 `static` 属性，那么就视该元素启用定位布局。

## 包含块

### 是什么？

在正式开始学习定位布局之前，我们需要先了解包含块（containing block）的概念。

包含块是包含元素的一块空间，当元素的 `width`、`height`、`top`、`right`、`bottom`、`left` 属性采用了百分比值的时候，这些百分比值的计算基准就取决于包含块，具体来说：元素的 `height`、`top`、`bottom` 属性的百分比值的计算基准是其包含块的 `height`，对于 `width`、`left`、`right` 而言，则是其包含块的 `width`。

另外，采用了定位布局的元素的偏移也是根据包含块的边界来计算的。

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

## 块级容器

块级容器（block container）是指那些作为容器的块级元素，其与块级元素的区别在于其必须包含内容（方可被称为容器）。

另外，块级容器要么只包含参与了行内格式化上下文（inline formatting context）的行内元素，要么只包含参与了块级格式化上下文（block formatting context）的块级元素（其实，我对该描述感到困惑，其摘自于 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#calculating_percentage_values_from_the_containing_block)）。

## 初始包含块

初始包含块（initial containing block）是一个由视口（viewport）派生的矩形区域，它的尺寸就等于视口的尺寸，它的位置就是视口的位置。

另外，初始包含块也是 `<html>` 元素的包含块。

## 相对定位

`position: relative` 的元素将会启用相对定位。

如果 `inset` 为 `auto`，那么相对定位元素的位置就是其在直接父元素下的流式布局下的位置。如果 `inset` 非 `auto`，那么相对定位元素就会以其初始位置为其起点来偏移，比如 `left: 10px` 代表相对定位元素的左边界和其初始位置的左边界的距离为 `10px`。

> [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset) 可以一次性设置 `top`、`right`、`bottom`、`left` 属性，需要注意的是 `inset` 只遵循物理方向，不遵循逻辑方向。

相对定位元素在其直接父元素中所占据的空间就等于其在流式布局中所占据的空间，无论偏移与否，其所占据的空间都是恒定的。并且哪怕其发生了偏移，也不会影响到其它元素的布局或撑大直接父元素，不过它会遮盖其它元素或超出直接父元素的边界。

[TODO: 示例代码 + 图片，参考「Relative Positioning」小节中的「This blue box is interactive」的互动示例]

```css
.blue-box {
    position: reltaive;
    top: 20px;
}
```

## 绝对定位

`position: absolute` 的元素将会启用绝对定位。

如果 `inset` 为 `auto`，那么绝对定位元素的位置就是其在直接父元素下的流式布局下的位置。如果 `inset` 非 `auto`，那么绝对定位元素就会以包含块的边界为其起点来偏移，比如 `left: 10px` 代表绝对定位元素的左边界和其包含块的左边界的距离为 `10px`，不过在垂直方向上，该元素会保持原来的位置，因为我们没有设置 `top` 或 `bottom`。

[TODO: 示例]

绝对定位元素不会在流式布局中占据任何空间。

另外，绝对定位元素的尺寸会尽可能的小以刚好包容其内容，就像是启用了 `fit-content` 那样。另外，如果行内元素启用了绝对定位，那么行内元素就可以使用 `block-size` 等那些平常无法在流式布局中使用的 CSS 属性。

[TODO: 示例代码 + 图片，参考「containing puzzle」章节的第八关，这个示例还可以顺便表达出「相对定位元素没有 fit-content 而绝对定位元素有该特性，因此这便是为什么第二和第三个图标会排列在下一行而不是同一行」这件事]

[TODO: 采用「Fixed Positioning」章节中的「Fixed without anchor points」中的例子来证明：它的初始位置就是其在流式布局下的位置，而该位置可能会很不可思议]

[TODO: 证明它哪怕以初始包含块来作为其包含块，可与固定定位不同的是，它会随着滚动而消失在可视区域，但固定定位则不会]

[TODO: 证明它在包含块中不占据任何空间，且具有 fit-content 特性，且行内元素可以启用一些平时无法使用的 CSS 属性]

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

## 固定定位

`position: fixed` 的元素将会启用固定定位。

事实上，固定定位是绝对定位的一种，所以固定定位会继承绝对定位的所有特性，只不过在对待初始包含块时，两者的行为表现会有差异，详情如下。

如果固定定位元素的包含块不是初始包含块，那么固定定位就会表现的和绝对定位一模一样。当固定/绝对定位元素的包含块是初始包含块时，在绝对定位眼中，初始包含块是一个视口大小且位于文档顶部的矩形，该初始包含块会随着页面的滚动而消失在屏幕的可视区域，因此基于初始包含块来定位的绝对定位元素也会消失在可视区。而在固定定位眼中，初始包含块就像是视口本身，所以固定定位元素会永远固定在屏幕上。

[TODO: 示例]

需要细说的是，当固定定位元素的包含块是初始包含块时，如果 `inset: auto`，那么固定定位元素的行为表现就会有些复杂，具体来说：想象一下，对于一个可以水平和垂直滚动的网页，视口正定位在水平滚动和垂直滚动的初始位置，此时，渲染引擎会根据流式布局的规则来在固定定位元素的直接父元素内为其寻找一个位置，然后固定定位元素投影在视口上的部分就是其最终的渲染结果，无论用户如何滚动网页，那个投影都会始终出现在视口上。

[TODO: 示例]

[TODO: 采用「Fixed Positioning」章节中的「Fixed without anchor points」中的例子来证明：它的初始位置就是其在流式布局下的位置，而该位置可能会很不可思议]

### 快速寻找包含块

如果 DOM 结构很复杂，那么我们就很难找到固定定位元素的包含块，因为固定定位元素会采用符合特定条件的祖先元素的 padding box 来作为其包含块，而不会永远都采用初始包含块。

我们需要一个可以快速寻找包含块的工具，而幸运的是，[Josh W. Comeau](https://twitter.com/joshwcomeau) 就编写了这样一个。

```js
function findCulprits(element) {
    if (!element) throw new Error('Could not find element with that selector');

    let parent = element.parentElement;

    while (parent) {
        const { transform, willChange, filter } = getComputedStyle(parent);

        if (transform !== 'none' || willChange === 'transform' || filter !== 'none')
            console.warn('🚨 Found a culprit! 🚨\n', parent, { transform, willChange, filter });

        parent = parent.parentElement;
    }
}
```

> 如果你需要在 iframe 环境中执行这项任务，那么你需要这么做：1.打开浏览器控制台；2.打开「控制台」标签；3.打开「JavaScript 上下文」多选栏，其默认选项应为 `top`；4.选择目标 iframe 的 JavaScript 上下文；
>
> 补充：`top` 表示当前的 JavaScript 上下文是当前网页。

## 粘性定位

`position: sticky` 的元素将会启用粘性定位。

如果 `inset` 为 `auto`，那么粘性定位元素就会表现的和相对定位元素一样。如果 `inset` 非 `auto`，那么粘性定位元素就会表现为相对定位和固定定位的结合体，比如 `top: 10px` 代表粘性定位元素的 border box 上边界会距离最近滚动容器的 content box 上边界至少 `10px`。

> 最近滚动容器（the closest scroll container）是指距离元素最近的拥有滚动机制的祖先容器。如果元素的 `overflow` 的值为 `hidden`、`scroll`、`auto`、`overlay`，那么就认为这个元素拥有滚动机制。
>
> 「最近滚动容器的 content box 上边界...」这种说法是不准确的，可我不知道如何用文字来表达我的意思😫，所以你需要从示例中去领悟，加油。

[TODO: 示例 + 滚动时粘住 + 不滚动时粘住 + 前置元素尝试通过 margin 来拉近粘性定位元素，可也没法使其突破最小间隙 + 「Sticky Positioning」的 offset 中的示例 + border box + content box]

和相对定位元素一样，粘性定位元素也会在直接父元素中占据空间，并且无论其如何偏移，都不会影响其它元素的布局。

粘性定位元素无法脱离其直接父元素的 content box，因此如果其直接父元素的 content box 在最近滚动容器中所残留的空间不足以容纳粘性定位元素的时候，粘性定位的粘性就会失效，它会随着直接父元素一起离开最近滚动容器。

[TODO: 示例｜两个 sticky，一个刚好被 content box 刚好框住，另一个则有余量，然后一起向下滚动，发现一个没办法 sticky，一个在 sticky]

（closeet  scroll container）

```js
// Replace “.the-sticky-child” for a CSS selector
// that matches the sticky-position element:
const selector = '.the-sticky-child';

function findCulprits(elem) {
  if (!elem) {
    throw new Error(
      'Could not find element with that selector'
    );
  }

  let parent = elem.parentElement;

  while (parent) {
    const { overflow } = getComputedStyle(parent);

    if (['auto', 'scroll', 'hidden'].includes(overflow)) {
      console.log(overflow, parent);
    }

    parent = parent.parentElement;
  }
}

findCulprits(document.querySelector(selector));
```

> 技巧：If the culprit uses `overflow: hidden`, we can switch to `overflow: clip`. Because `overflow: clip` doesn't create a scroll container, it doesn't have this problem!
>
> 如果你想用 hidden？那么不妨考虑 clip，因为 hidden 的副作用（创建为 scrolling container）可能会产生某些意料之外的影响。

当你发现你的 `top: 0` 仍距离 viewport 顶部有 1px 的缝隙时，这往往是由「舍入」问题导致的，一个简洁好用的修复方法就是：

```css
div {
    position: sticky;
    top: -1px;
}
```
