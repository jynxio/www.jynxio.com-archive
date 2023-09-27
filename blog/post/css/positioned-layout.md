# 定位布局

定位布局是一种布局策略，它允许我们通过 `top`、`right`、`bottom`、`left` 属性来操纵元素的偏移，以使其锚定在我们期望的位置上。只要将元素的 `position` 属性设置为非 `static` 属性，那么便可以对元素启用定位布局，定位布局一共有 4 种类型，分别是：

- 相对定位；
- 绝对定位；
- 固定定位；
- 沾滞定位；

本文旨在指导如何使用定位布局，并澄清那些隐晦的概念。

## 相对定位

「相对定位」是一种通过让元素相对其原始位置来偏移以达到定位目的技术。如果 `position: relative`，那么元素便会启用相对定位布局。

```css
.jynxio { position: relative }
```

如果 `inset: auto`，那么元素就会留在原始位置，这个原始位置就是其在流式布局下的位置。如果 `inset` 非 `auto`，那么元素就会以原始位置为参考系来偏移，比如 `left: 10px` 代表元素的左边界和其原始位置的左边界的距离为 `10px`。

> [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset) 可以一次性设置 `top`、`right`、`bottom`、`left` 属性，需要注意的是 `inset` 只遵循物理方向，不遵循逻辑方向。

无论元素偏移与否，它都会在父元素中占据恒定的空间，这份空间就是其在流式布局下所占据的空间。自然的，当它偏移时，它也不会影响其它元素的布局，不过它会遮盖其它元素或超出父元素的边界。

[TODO: 示例代码 + 图片，参考「Relative Positioning」小节中的「This blue box is interactive」的互动示例]

```css
.blue-box {
    position: reltaive;
    top: 20px;
}
```

## 绝对定位

「绝对定位」是一种通过让元素相对其包含块来偏移以达到定位目的的技术。如果 `position: absolute`，那么元素便会启用绝对定位布局。

```css
.jynxio { position: absolute }
```

如果 `inset: auto`，那么元素就会留在原始位置，这个原始位置就是其在流式布局下的位置。如果 `inset` 非 `auto`，那么元素就会以包含块为参考系来偏移，比如 `left: 10px` 代表元素的左边界和其包含块的左边界的距离为 `10px`，需要注意的是，由于没有设置垂直偏移，所以元素会在垂直方向上保持原位。

元素不会在流式布局中占据任何空间，并且元素的尺寸会尽可能地小以刚好包含其内容（就像使用了 `fit-content`）。另外，启用了绝对定位布局的行内元素可以使用 `block-size`、`margin-block` 等那些平常无法在流式布局中使用的 CSS 属性。

[TODO: 基于上述描述的示例]

[TODO: 示例代码 + 图片，参考「containing puzzle」章节的第八关，这个示例还可以顺便表达出「相对定位元素没有 fit-content 而绝对定位元素有该特性，因此这便是为什么第二和第三个图标会排列在下一行而不是同一行」这件事]

[TODO: 采用「Fixed Positioning」章节中的「Fixed without anchor points」中的例子来证明：它的初始位置就是其在流式布局下的位置，而该位置可能会很不可思议]

无论是绝对定位元素，还是固定定位元素，它们都可以选择初始包含块作为其包含块，但效果却是不一样的，具体来说，对于绝对定位元素而言，初始包含块仿佛就像是一个视口大小的、位于页面首屏位置的矩形空间，这块空间会随着页面的滚动而消失在可视区域，于是参考这块空间来锚定的绝对定位元素也会随之一并消失。

[TODO: 证明它哪怕以初始包含块来作为其包含块，可与固定定位不同的是，它会随着滚动而消失在可视区域，但固定定位则不会]

### 居中技巧

绝对定位布局有一个特别的技巧，那就是：如果元素的 `top` 和 `bottom` 为非 `auto`，且 `height: auto`，那么元素就会自动填充满包含块的垂直高度，对于水平方向，也同样如此。

利用这个技巧，我们可以实现元素居中，并且还可以实现 2 种不同的效果，分别是「弹性居中」和「固定居中」。

- 弹性尺寸居中：元素相对于其包含块来居中，且元素尺寸是弹性的；
- 固定尺寸居中：元素相对于其包含块来居中，且元素尺寸是固定的；

```css
.auto-size-center {
    position: absolute;
    inset: 20px;
    block-size: auto;    /* 令垂直居中 */
    inline-size: auto;   /* 令水平居中 */
}

.fixed-size-center {
    position: absolute;
    inset: 0;
    block-size: 100px;
    inline-size: 100px;
    margin-block: auto;  /* 令垂直居中 */
    margin-inline: auto; /* 令水平居中 */
}
```

## 固定定位

「固定定位」是一种特殊的绝对定位，它会继承绝对定位的所有特性。如果 `position: fixed`，那么元素便会启用固定定位布局。

```css
.jynxio { position: fixed }
```

相较于绝对定位，固定定位有 2 个不同：

- 对待原始位置的方式不同；
- 对待初始包含块的方式不同；

### 对待原始位置的方式

和绝对定位不同的是，固定定位元素的原始位置不是「元素在流式布局下的位置」，而是「元素在流式布局下的位置在首屏上的投影」。

具体来说，想象一下：对于一个可以水平和垂直滚动的网页，视口正定位在首屏位置（水平滚动和垂直滚动的初始位置），渲染引擎像对待绝对定位元素一样，来找到固定定位元素在流式布局下的位置，然后绘制它，绘制的结果会投影到首屏的视口上，而这份投影的内容就是最终的渲染结果，无论用户如何滚动网页，这份投影都会始终渲染在视口上。

[TODO: 示例]

[TODO: 采用「Fixed Positioning」章节中的「Fixed without anchor points」中的例子来证明：它的初始位置就是其在流式布局下的位置，而该位置可能会很不可思议]

### 对待初始包含块的方式

如果固定定位元素没有选择初始包含块作为其包含块，那么固定定位元素就会表现得和绝对定位元素一模一样，否则...

当绝对定位元素和绝对定位元素都选择了初始包含块来作为其包含块时：

- 在绝对定位眼中，初始包含块仿佛就像是一块视口大小且位于页面首屏位置的矩形空间，这块空间会随着页面的滚动而消失在可视区域，于是参考这块空间来锚定的绝对定位元素也会随之一并消失。
- 在固定定位眼中，初始包含块仿佛就像是视口本身，参考着视口来锚定的固定定位元素的位置不会随着页面的滚动而发生变化；

[TODO: 示例]

### 自动搜寻包含块的函数

[Josh W. Comeau](https://twitter.com/joshwcomeau) 就编写了一个自动搜寻固定定位元素的包含块的脚本，它在 debug 时非常有用。

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

如果你想在 iframe 环境中运行该脚本，那么：

1. 打开浏览器控制台；
2. 打开「控制台」标签页；
3. 打开「JavaScript 上下文」多选栏（其默认选项应为 `top`，代表控制台的 JavaScript 上下文就是当前网页）；
4. 选择目标 iframe 的 JavaScript 上下文；

### 缝隙

在使用固定定位布局时，或许你偶尔会发现元素和目标位置之间存在 `1px` 的差距或缝隙，这是由浏览器的「舍入」机制所导致的，一个简单有效的解决方案是：

```css
.yourself {
    top: -1px;
}
```

> 其实其他的定位布局也会遇到此类问题，只不过该问题最常发生于固定定位布局。

## 沾滞定位

「沾滞定位」用于将元素沾滞在「最近滚动容器」的边界上，它通过设定元素与最近滚动容器边界的最小距离来实现。如果 `position: sticky`，那么元素便会启用沾滞定位布局。

```css
.jynxio { position: sticky }
```

如果 `inset: auto`，那么元素就完全等价于相对定位元素。如果 `inset` 非 `auto`，那么当元素的 border box 与最近滚动容器的 content box 之间的距离达到预设极限时，元素就会沾滞在极限位置处，否则元素就会表现的像是一个相对定位元素。

> 最近滚动容器是指距离元素最近的滚动容器。另外，上文中的“最近滚动容器的 content box ...”这种说法是不准确的，可是我不知道如何用文字来表达我真正的意思，所以你需要从示例中去领悟。

[TODO: 示例 + 滚动时粘住 + 不滚动时粘住 + 前置元素尝试通过 margin 来拉近沾滞定位元素，可也没法使其突破最小间隙 + 「Sticky Positioning」的 offset 中的示例 + border box + content box]

无论元素沾滞与否，它都会在父元素中占据很定的空间，这份空间就是其在流式布局下所占据的空间。

> 为避免混淆，我需阐明一个事情：沾滞定位元素会根据包含块来计算百分比宽度和偏移量，然后在父元素中占据空间，最后沾滞在最近滚动容器上。

一个易被忽略的知识是：沾滞定位元素仍然收到父元素的限制，当父元素的 content box 逐渐离开最近滚动容器的可视区域时，沾滞定位元素也会一并离开。不过，如果你想让沾滞定位元素更晚一些离开，那么可以尝试为其设置 `margin` 来使其超出父元素的 content box 以达到你的目的。

[TODO: 示例｜两个 sticky，一个刚好被 content box 刚好框住，另一个则有余量，然后一起向下滚动，发现一个没办法 sticky，一个在 sticky]

### 自动搜寻最近滚动容器

[Josh W. Comeau](https://twitter.com/joshwcomeau) 还编写了一个自动搜寻最近滚动容器的脚本：

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

## 包含块

包含块（containing block）是一块用于包含元素的空间，比如元素的 content box 或 padding box 都能成为包含块。

当元素的 `width`、`height`、`top`、`right`、`bottom`、`left` 属性采用了百分比值的时候，这些百分比值的计算基准就取自于包含块。具体来说：元素的 `height`、`top`、`bottom` 属性的百分比值的计算基准是其包含块的 `height`，对于 `width`、`left`、`right` 而言，则是其包含块的 `width`。

### 定位布局元素的包含块

- 如果元素的 `position` 值为 `static`、`relative`、`sticky`，那么其包含块就是满足下述任意一个条件的最近的祖先元素的 content box，条件为：
	- 该元素是一个块级容器；
	- 该元素会创建格式化上下文；
- 如果元素的 `position` 值为 `absolute`，那么其包含块就是 `position` 值为非 `static` 的最近的祖先元素的 padding box。如果没有任何一个祖先元素满足条件，那么就会采用初始包含块来作为其包含块；
- 如果元素的 `position` 值为 `fixed`，那么其包含块就是初始包含块（initial containing block）
- 如果元素的 `position` 值为 `absolute` 或 `fixed`，那么满足下述任意一个条件的最近的祖先元素的 padding box 就会成为其包含块，条件为：
	- 该元素的 `transform` 值为非 `none`；
	- 该元素的 `perspective` 值为非 `none`；
	- 该元素的 `container-type` 值为非 `normal`；
	- 该元素的 `backdrop=filter` 值为非 `none`；
	- 该元素的 `will-change` 值为 `transform` 或 `perspective`；
	- 该元素的 `contain` 值为 `layout`、`paint`、`strict`、`content`；
	- 该元素的 `filter` 值为非 `none` 或 `will-change` 值为 `filter`（此条仅作用于 Firefox 浏览器）；

> 初始包含块（initial containing block）是一个由视口（viewport）衍生的矩形区域，它的尺寸就等于视口的尺寸，它的位置就是视口的位置。另外，初始包含块也是 `<html>` 元素的包含块。
>
> 块级容器（block container）是指那些作为容器的块级元素，其与块级元素的区别在于其必须包含内容（方可被称为容器）。
>
> 另外，块级容器要么只包含参与了行内格式化上下文（inline formatting context）的行内元素，要么只包含参与了块级格式化上下文（block formatting context）的块级元素（其实，我对该描述感到困惑，其摘自于 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#calculating_percentage_values_from_the_containing_block)）。

## 滚动容器

> 滚动容器就像是一扇通往异次元的大门，在外界看来，它永远都只有那么大，可它里面却可以装下无限多的内容。

滚动容器（scroll container）是指激活了滚动机制的元素，只要把 `overflow-x` 或 `overflow-y` 设置为 `auto | hidden | scroll | overlay` ，那么就可以激活元素的滚动机制。

注意，只要激活了一条轴的滚动机制，那么整个元素都会变成滚动元素，另一条轴的滚动机制也会被自动激活，即 `overflow-*` 自动变为 `auto`。

```html
<section>
  <div></div>
</section>

<style>
  section {
    overflow-y: hidden;
    inline-size: 200px;
    block-size: 200px;
    background-color: hotpink;
  }

  div {
    inline-size: 100px;
    block-size: 100px;
    margin-inline-end: 200px;
    margin-block-end: 200px;
    border-radius: 999rem;
    background-color: cornflowerblue;
  }
</style>
```

[TODO: 示例]

### 关于 Overflow

当我们将 `overflow` 设置为非 `visible` 时，我们还必须明确的指定元素的宽度和高度，否则 `overflow` 无法生效。

有时，我们还需要使用 `white-space: nowrap`。

### 关于 Overlay

`overlay` 是废弃值，它已经被 `auto` 替代了，如果你尝试使用 `overflow: overlay`，那么现代的浏览器会将其转译为 `overflow: auto`。

`overflow` 和 `auto` 的区别是，前者的滚动条是不占空间并直接绘制在内容之上的，后者的滚动条是会挤占 padding box 空间的。

### 关于 Hidden

`overflow: hidden` 会隐藏超出 padding box 之外的内容，然而那些被隐藏的内容仍然真实存在，因为 hidden 只不过是一个删掉滚动条的 scroll。只要让滚动容器滚动起来，那么那些被隐藏的内容就会重新出现在可视区域。

我们有很多种手段可以办到这件事情，比如 `scrollLeft` 属性和 `scrollTo()` 方法。如果隐藏内容里有超链接元素，那么 Tab 键就可以直接达到目的，因为滚动容器会滚动到超链接元素。

```html
<ol>
	<li><a href="/">♥️</a></li>
	<li><a href="/">💀</a></li>
	<li><a href="/">🤖️</a></li>
	<li><a href="/">👑</a></li>
	<li><a href="/">🧊</a></li>
</ol>

<style>
    ol {
        overflow-y: hidden;
        blick-size: 3rem;
    }
</style>
```

[TODO: 示例｜Tab 键｜超链接]

基于上述案例，请不要使用 `hidden` 来裁剪溢出内容，而是使用 `clip`（原因见下文）。在现代，人们一般只用 `hidden` 来实现一些罕见的需求，因此请总是在使用 `hidden` 时注释你的使用原因，因为未来的维护者非常需要知道“你为什么会在此处使用它”。

### 关于 Clip

`clip` 是比 `hidden` 更加 hidden 的方案，且更好用，比如：

- 无法像滚动 `hidden` 那样滚动 `clip`；
- 不会激活元素的滚动机制；
- 自定义裁剪边界；

所以如果我们想要隐藏溢出内容，那么请使用 `clip`，而不是 `hidden`。

> 隐藏内容其实仍然存在，我们依然可以使用 Tab 键来聚焦那些被隐藏掉的超链接元素。
>
> 不同于 `hidden` 的是，由于滚动容器不再会滚动至超链接元素，所以用户根本看不到超链接元素身上的聚焦，而这对无障碍访问而言，是一种灾难性的 bug。

由于 `clip` 不会激活滚动机制，所以我们可以实现：一条轴是 `visible` 的同时另一条轴是 `clip`，比如：

```css
.jynxio {
    overflow-x: clip;
    overflow-y: visible;
}
```

如果想要自定义裁剪边界，那么请使用 `overflow-clip-margin` 属性，其语法如下：

> 该属性仅在 `overflow: clip` 时才生效，单独的 `overflow-x: clip` 或 `overflow-y: clip` 都无法使该属性生效。

```
# 语法
overflow-clip-margin: <length>;
overflow-clip-margin: content-box;
overflow-clip-margin: content-box <length>;
overflow-clip-margin: padding-box;
overflow-clip-margin: padding-box <length>;
overflow-clip-margin: border-box;
overflow-clip-margin: border-box <length>;

# 注意
<length>必须是非负数值，比如5px是合法的，-5px是不合法的
```

注意，`clip` 在 Chrome（目前截止v117）和 Safari（目前截止v16.4）上存在一个 bug，表现为：如果激活了 `border-radius`（即其值非零），那么哪怕只为一个轴启用 `clip`，另一个轴也会表现为 `clip`（实际上 `overflow-*` 不为 `clip`）。

```css
.jynxio {
	overflow-x: clip;
    overflow-y: visible; /* 🐛 表现为clip */
    border-radius: 5px;
}
```

### 关于滚动条的样式

对于 Windows 和 Linux，元素要么始终渲染滚动条，要么始终不渲染，滚动条会占用元素的 padding box 的空间。

对于 MacOS，当用户使用触控板时，元素只会在发生滚动时才渲染滚动条，滚动条不会占用元素的任何空间，当用户使用鼠标时，则会表现得和 Windows 和 Linux 系统一致。

其实大多数的 Web 用户所使用的操作系统都是 Windows，为了更加贴近用户，建议将 MacOS 设置为总是常显滚动条。

## 偏移冲突

如果 `top` 和 `bottom` 发生了冲突，那么取 `top`。如果 `left` 和 `right` 发生了冲突，那么取 `left`（当 `direction: ltr`）或 `right`（当 `direction: rtl`）。

```css
.jynxio {
    position: relative;
    top:  10px; /*👑*/ bottom: 30px; /*💀*/
    left: 40px; /*👑*/ right:  20px; /*💀*/
}
```

## 层叠规则

当元素与元素之间发生层叠时，层叠等级更高者在更上层，如果层叠等级也相同，那么 DOM 顺序更晚者在更上层。

[TODO: 示例 | 层叠等级 | DOM 顺序]

> 在流式布局中，由于元素的背景、内容、轮廓是分开绘制的，于是便会在层叠时产生犬牙交错的现象。而在定位布局中，则不会产生这类现象。

我个人将「层叠等级」定义成一种类似于「选择器优先级」的东西，其计算方式大致如下：

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

> `z-index: auto` 的层叠等级被视作为 `0`。

> Flex 子项和 Grid 子项也可以使用 `z-index` 来主动调整层级，不过上例中并未演示该内容。

> 请勿使用负值 `z-index`，因为它只会徒增复杂。

## 层叠上下文

层叠上下文（stacking context）是一个虚拟空间，每个元素都会生活在某个层叠上下文之内，然后这个层叠上下文又会内嵌在另一个更大的层叠上下文之内，以此类推，层层嵌套... 最后便会形成一个类似于洋葱的结构。

[TODO: 层叠上下文洋葱图]

### 创建方法

层叠上下文的创建方法如下：

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

对于老旧的桌面端浏览器，`position: sticky` 不会创建层叠上下文。

关于 `will-change` 属性，推荐阅读 [Everything You Need to Know About the CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/) 和 [我的另一篇博客](https://www.jynxio.com/browser/page-rendering)；

[顶层元素](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) 大概是指进入全屏的元素、由 `HTMLDialogElement.showModal()` 唤醒的 `<dialog>`、由 `HTMLElement.showPopover()` 唤醒的 [Popover 元素](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)。

### 共处于同一个层叠上下文的父子元素

层叠上下文树的结构和 DOM 树的结构不是对应的，因此如果父元素没有创建层叠上下文，那么父元素和子元素就会同处在一个层叠上下文之中，于是我们就可以制造出一些让人困惑的事情。比如在下例中，父元素会遮蔽子元素。

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

[TODO: 示例]

另外，如果父元素创建了层叠上下文，那么子元素就会进入到这个新的层叠上下文中去，但是父元素仍然会留在原来的层叠上下文中。

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

### 可视化层叠上下文树的工具

无论你多么熟悉层叠上下文，你都无法避免陷入到关于层叠上下文的混乱中去（我明明已经这了做了，可是这个家伙为什么还没有出现在顶层啊喂！）。

[Stacking Contexts Inspector](https://github.com/andreadev-it/stacking-contexts-inspector) 是一个用于可视化层叠上下文树的浏览器插件，它可以帮助我们 debug。