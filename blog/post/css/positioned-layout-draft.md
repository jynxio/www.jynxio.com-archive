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

### 初始包含块

初始包含块（initial containing block）是一个由视口（viewport）派生的矩形区域，它的尺寸就等于视口的尺寸，它的位置就是视口的位置。

另外，初始包含块也是 `<html>` 元素的包含块。

## 块级容器

块级容器（block container）是指那些作为容器的块级元素，其与块级元素的区别在于其必须包含内容（方可被称为容器）。

另外，块级容器要么只包含参与了行内格式化上下文（inline formatting context）的行内元素，要么只包含参与了块级格式化上下文（block formatting context）的块级元素（其实，我对该描述感到困惑，其摘自于 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#calculating_percentage_values_from_the_containing_block)）。

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

## 沾滞定位

`position: sticky` 的元素将会启用沾滞定位。

如果 `inset` 为 `auto`，那么沾滞定位元素就会表现的和相对定位元素一样。如果 `inset` 非 `auto`，那么沾滞定位元素就会表现为相对定位和固定定位的结合体，比如 `top: 10px` 代表沾滞定位元素的 border box 上边界会距离最近滚动容器的 content box 上边界至少 `10px`。

> 最近滚动容器（the closest scroll container）是指距离元素最近的拥有滚动机制的祖先容器。如果元素的 `overflow` 的值为 `hidden`、`scroll`、`auto`、`overlay`，那么就认为这个元素拥有滚动机制。
>
> 「最近滚动容器的 content box 上边界...」这种说法是不准确的，可我不知道如何用文字来表达我的意思😫，所以你需要从示例中去领悟，加油。

[TODO: 示例 + 滚动时粘住 + 不滚动时粘住 + 前置元素尝试通过 margin 来拉近沾滞定位元素，可也没法使其突破最小间隙 + 「Sticky Positioning」的 offset 中的示例 + border box + content box]

和相对定位元素一样，沾滞定位元素也会在直接父元素中占据空间，并且无论其如何偏移，都不会影响其它元素的布局。

沾滞定位元素无法脱离其直接父元素的 content box，因此如果其直接父元素的 content box 在最近滚动容器中所残留的空间不足以容纳沾滞定位元素的时候，沾滞定位的粘性就会失效，它会随着直接父元素一起离开最近滚动容器。

[TODO: 示例｜两个 sticky，一个刚好被 content box 刚好框住，另一个则有余量，然后一起向下滚动，发现一个没办法 sticky，一个在 sticky]

（closeet  scroll container）

### 快速寻找最近滚动容器

同样的，[Josh W. Comeau](https://twitter.com/joshwcomeau) 也编写了一个可以寻找最近滚动容器的工具。

```js
function findCulprits(element) {
  if (!element) throw new Error('Could not find element with that selector');

  let parent = element.parentElement;

  while (parent) {
    const { overflow } = getComputedStyle(parent);

    if (['auto', 'scroll', 'hidden'].includes(overflow)) console.log(overflow, parent);

    parent = parent.parentElement;
  }
}
```

## 缝隙

在你使用绝对定位、固定定位、沾滞定位的时候，你偶尔会发现元素和目标位置之间存在 `1px` 的差距或缝隙，这是由浏览器的「舍入」机制所导致的，一个简单有效的解决方案是：

```css
.yourself {
    top: -1px;
}
```

## 层叠规则

如果元素与元素之间发生了层叠，那么层叠等级更高者在上，如果层叠等级相同，那么 DOM 顺序更晚者在上。

[TODO: 示例 | 层叠等级 | DOM 顺序]

另外，定位布局元素的背景、内容、轮廓都位于同一层，因此它不会出现像流式布局元素那样犬牙交错的层叠现象。

### 层叠等级

我将「层叠等级」定义成一种类似于「选择器优先级」的东西，其计算方式如下：

```html
<html>                  <!-- 层叠等级: 0     -->
    <body>              <!-- 层叠等级: 0-0   -->
        <section>       <!-- 层叠等级: 0-1   -->
        	<div></div> <!-- 层叠等级: 0-1-2 -->
        </section>
        <section>       <!-- 层叠等级: 0-0   -->
        	<div></div> <!-- 层叠等级: 0-2   -->
        </section>
    </body>
    
    <style>
        section:first-child {
            z-index: 1;         /* 创建层叠上下文 */
            position: relative;
        }
        div {
            z-index: 2;         /* 创建层叠上下文 */
            position: relative;
        }
    </style>
</html>
```

> 如果元素的 `z-index` 为 `auto`，那么便认为其在直接父层叠上下文中的等级为 `0`。事实上，所有元素的 `z-index` 的默认值均为 `auto`。
>
> 另外，不仅是定位布局元素，Flex 子项和 Grid 子项也可以使用 `z-index`，而上例中并未演示关于 Flex 子项和 Grid 子项的层叠等级的计算过程。
>
> 最后，请勿为 `z-index` 使用负值，因为它只会徒增复杂。

### 层叠上下文

层叠上下文（stacking context）是一个抽象且虚拟的空间，每个元素都会生活在某个层叠上下文之内，然后这个层叠上下文又会内嵌在另一个层叠上下文之内，以此类推，层层嵌套... 最后便会形成一个类似于洋葱的结构。

洋葱结构的好处是可以帮助我们快速的计算出元素的层叠等级，然后解决层叠矛盾，层叠等级的计算规则如上文所述。

[TODO: 画一个层叠上下文的洋葱图]

其中，层叠上下文的创建方法如下：

1. `<html>`；
2. `position` 为 `fixed | sticky` 的元素；
3. `position` 为 `relative | absolute` 且 `z-index` 非 `auto` 的元素；
4. `container-type` 为 `size | inline-size` 的元素；
5. `z-index` 非 `auto` 的 Flex 子项元素或 Gird 子项元素；
6. `opacity` 小于 `1` 的元素；
7. `mix-blend-mode` 非 `normal` 的元素；
8. `transform`、`filter`、`backdrop-filter`、`perspective`、`clip-path`、`mask`、`mask-image`、`mask-border` 中任意一个属性值非 `none` 的元素；
9. `isolation: isolate` 的元素；
10. `will-change` 属性值为「会在非默认值情况下创建层叠上下文的 CSS 属性」的元素；
11. `contain` 值为 `layout | paint | strict | content` 的元素；
12. 顶层元素及其 `::backdrop` 伪元素；

> 对于老旧的桌面端浏览器，`position: sticky` 不会创建层叠上下文。
>
> 关于 `will-change` 属性，推荐阅读 [Everything You Need to Know About the CSS `will-change` Property](https://dev.opera.com/articles/css-will-change-property/) 和 [我的另一篇博客](https://www.jynxio.com/browser/page-rendering)；
>
> [顶层元素](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) 大概是指进入全屏的元素、由 `HTMLDialogElement.showModal()` 唤醒的 `<dialog>`、由 `HTMLElement.showPopover()` 唤醒的 [Popover 元素](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)。

### 小心！位于同一个层叠上下文的父子元素

如果一个元素没有创建层叠上下文，那么这个元素和它的后代就会同处在一个层叠上下文之中，于是我们就可以制造出一些让人困惑的事情，比如让父元素遮蔽子元素！详见下例：

```html
<div>
	<div></div>
</div>

<style>
	div > div {
		position: relative;
		z-index: -1;
	}
</style>
```

另外，该例子中有一个容易被忽略掉的细节，那便是：如果一个元素创建了局部层叠上下文，那么它的子元素就会进入到这个局部层叠上下文中去，但是这个元素本身并不会，这个元素本身仍然留在原来的层叠上下文中。

### 善用 isolation 来主动创建层叠上下文

有时，我们会高强度的使用 `z-index` 来控制元素的层叠顺序并快速的速陷入到混乱中去，然后试图使用超级大或超级小的值（比如 9999 和 -9999）来搏出期望的效果，有时这会奏效，有时则不会，可是无论如何，这都会让事情变的更加难以维护并在未来的某一天再次遭遇这类麻烦，不过那时，麻烦已经更加麻烦了。

混乱的解决之道是厘清这颗“洋葱”的结构，并且适时的主动创建局部层叠上下文，因为「在同一个层叠上下文中，如果元素 A 的层叠等级比元素 B 的更大，那么我们只要为元素 A 创建局部层叠上下文，元素 A 的所有后代元素的层叠等级便都会比 B 的更大」。

于是，我们就可以主动的将某些可能会发生层叠矛盾的元素限定在相同或不同的层叠上下文中去，以此使事物更加有序，最终消解混乱。

我推荐使用 `isolation: isolate` 来主动创建层叠上下文，因为它简洁且无副作用。

```css
.yourself {
    isolation: isolate;
}
```

> 如果你开发的样式组件的内部使用了 `z-index`，那么你应该考虑为组件创建局部层叠上下文，以避免这些使用了 `z-index` 的元素会进入到组件外部的层叠上下文中去。

### 是工具！可视化层叠上下文树

无论你多么熟悉层叠上下文，你都无法避免陷入到关于层叠上下文的混乱中去（我明明已经这了做了，可是这个家伙为什么还没有出现在顶层啊喂！）。

[Stacking Contexts Inspector](https://github.com/andreadev-it/stacking-contexts-inspector) 是一个用于可视化层叠上下文树的浏览器插件，它可以帮助我们 debug。

## Overflow

如果你想用 hidden？那么不妨考虑 clip，因为 hidden 的副作用（创建为 scrolling container）可能会产生某些意料之外的影响。