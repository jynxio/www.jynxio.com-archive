## calc

四个运算符 `+ - * /`

# 单位

`vw`、`vh`

手机浏览器上的底栏是动态存在的，`vh` 总是代表最大高度，因为 `100vh` 有时候会超出设备的高，一种解决方案是：使用百分比值 `100%`，另一种是：使用 `svh`、`lvh`、`dvh`，分别代表最小视口高度、最大视口高度、动态视口高度。`100dvh` 可以完全替代 `100%`，只不过 `dvh` 的兼容性只有八成以上，所以不妨这么写：

```
.some-element {
  height: 100vh; /* 回退 */
  height: 100dvh;
}
```

另外，桌面端的滚动条是会占据元素的空间的（移动端的则不占据，滚动条总是悬浮在内容之上），无论 box-sizeing 是什么，滚动条都会消耗元素的内容盒的空间，滚动条会被夹在padding box 和border box之间。然后这会导致 section 放不下 div 从而发生滚动：

```html
<section>
	<div></div>
</section>

<style>
    * {
        padding: 0;
    }
    
    section {
        overflow: scroll;
        width: 100vw;
        height: 100vw;
    }
    
    div {
        width: 100vw;
        height: 100vh;
    }
</style>
```

如果你想计算出纵向滚动条的宽度？那么：

```
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
```

`window.innerWidth` 指视口宽度；它不关心滚动条，然而， `documentElement.clientWidth` 指的是文档中的可用空间。

`vmin` 和 `vmax` 代表总是取 `vw` 和 `vh` 之间的最小值和最大值，和 `dvh`、`dvw` 等单位没关系。

## clamp

`clamp()` 是 `width`、`min-width`、`max-width` 的语法糖：

```
clamp(min-width, ideal-width, max-width)
```

另外，还有 `min(v1, v2)` 和 `max(v1, v2)`

## 工具

Discord 的 SSHari 分享了一个用于识别比视口更宽的元素的脚本：

```
function checkElemWidth(elem) {
  if (elem.clientWidth > window.innerWidth) {
    console.info(
      "The following element has a larger width than " +
      "the window’s outer width"
    );
    console.info(elem);
    console.info("\n\n");
  }

  // Recursively check all the children
  // of the element to find the culprit.
  [...elem.children].forEach(checkElemWidth);
}

checkElemWidth(document.body);
```

# 文本

所有浏览器（所有品牌、所有平台）的默认字体大小都是 16px，这是前辈们为你设定好的最佳的选择了，不要改动它，让文章主体的字就保持 16px 吧。如果你想增大或缩小字体，那么要用百分比，比如 `font-size: 125%`，但是千万不要使用 px 这种绝对尺寸，比如 `font-size: 18px`。

因为浏览器的设置里可以设置字号，这是通过改变所有字体的默认大小来实现的，特小时为 12px，特大时为 24px，如果你设置了 30px，那么无论你怎么设置浏览器，这个元素的字号就永远都是 30px，如果你设置 `125%`，那么字号就是字体的原尺寸乘以 1.25 倍，所以用后者。

rem 代表 html 元素的字号，如果你要改变 1rem 的大小，亦或者想要改变 html 元素的字号，也要用百分比值。

## 表单

表单的元素的默认字体大小都更小，比如 input 元素的字号是 13.3333px，这在移动设备上会很难阅读，所以请总是放大他们为正常字号是一个好主意：

```
input, select, textarea {
  font-size: 1rem;
}
```

## 标题

桌面端最大的标题为 2.5rem 是合理的，但是在移动端上就不合理了，因为移动端的屏幕很小，这样做的话标题会占据很多屏幕空间，我们应该使用媒体查询来限制标题的尺寸（或者让字号随着移动端的宽度变化而变化也是可以的，不一定非得 1.75rem）：

```
h1 {
  font-size: 2.5rem;
}

@media (max-width: 550px) {
  h1 {
    font-size: 1.75rem;
  }
}
```

# 排版

流体排版的想法是，我们的排版不是在特定的断点处创建离散的字体大小，而是随着视口平滑地缩放。这是通过 `vw` 单元完成的：

```
  h1 {         
    font-size: clamp(1.5rem, 4vw + 1rem, 3rem);

    /* HACK: Add this declaration if you're using Safari to see the text scale when resizing: */
    /* min-height: 0vh; /*
  }
```

为什么使用 clamp？因为要避免字号在小屏幕上过小，在大屏幕上过大。

为什么要使用 `4vw + 1rem` 而不是 `5vw`，因为要保证字号会随着浏览器缩放而缩放，放大字体这个功能对阅读障碍人士而言非常重要，如果只用 `5vw`，那么字号就无法随着浏览器的缩放而缩放。其实这种缩放能力还不够强，因为他缩放的变化速度很慢，而 WCAG 指南规定文本至少可以缩放到原来的 2 倍（对障碍人士来说，这只是最低放大倍数）。

为什么 clamp 里可以直接用 `4vw + 1rem`，因为它会自动解析计算，而避免 calc 嵌套。

看下面这个有趣的公式：

|                                   | 400px          | 800px          | 1600px          |
| --------------------------------- | -------------- | -------------- | --------------- |
| `6vw`                             | 24px           | 48px           | 96px            |
| `calc(4vw + 1rem)`                | 16 + 16 = 32px | 32 + 16 = 48px | 64 + 16 = 80px  |
| `calc(5vw + 2rem)`                | 20 + 32 = 52px | 40 + 32 = 72px | 80 + 32 = 112px |
| `clamp(2.5rem, 4vw + 1rem, 4rem)` | 40px (clamped) | 32 + 16 = 48px | 64px (clamped)  |

最后，这种流体排版（Fluid typography）只适用于标题，不适用于正文，正文就应该用 16px，给正文用流体排版会在移动设备上变得很小。

流体排版的公式会影响流体排版缩放时的变化速率，Josh 给了一个工具让我们可视化这个过程，以方便我们做一些定制化：

https://courses.joshwcomeau.com/css-for-js/05-responsive-css/16-fluid-calculator



流体排版不仅适用于用来做标题字体，还适用于一切“会跟随页面尺寸变化而变化”的东西，比如导航栏的间隔随着页面变宽而变宽。

## 流体设计

媒体查询和流体排版都可以用来做流体设计，前者是在断点出瞬变，后者则是渐变。我们可以同时使用两者，也可以单独使用其中一种，渐变并不是一定比瞬变好，用哪一种取决于需求，比如更喜欢渐变还是瞬变，比如哪一种实现更容易理解。

## 其它



在 CSS 中，媒体查询不支持直接使用 CSS 变量。媒体查询主要用于根据不同的设备特性（如屏幕尺寸、分辨率等）应用不同的样式规则。而 CSS 变量（也称为自定义属性），通常用于存储可重复使用的值，以便在整个文档中保持一致性。

媒体查询的工作方式依赖于直接在查询中指定值，因为浏览器需要即时解析这些值以确定是否应用相关的 CSS 规则。CSS 变量的值在运行时才确定，这意味着它们不能用于媒体查询中，因为媒体查询的解析发生在较早的阶段，此时变量的最终值可能还未确定。

不过，您可以通过 JavaScript 动态更改媒体查询的阈值。例如，您可以将一个 CSS 变量的值读入 JavaScript，然后基于这个值动态构建样式表或直接应用样式。这样做虽然增加了复杂性，但可以实现类似于在媒体查询中使用变量的效果。

使用 @property 或 registryProperty 来注册的 CSS 变量也无法被媒体查询所使用。

即使使用 `@property` 注册的 CSS 变量，它们也无法直接在媒体查询中使用。`@property` 是一个较新的 CSS 功能，它允许您定义自定义属性（CSS 变量）的类型、初始值以及其他特性。这样做可以提高自定义属性的可靠性和表现力，但它并不改变 CSS 变量在媒体查询中的使用限制。

媒体查询的工作方式需要在解析时就能确定其条件值。CSS 变量（包括通过 `@property` 注册的变量）的值是在运行时确定的，并且它们的值可以根据文档中其他元素的状态而变化。因此，即使注册了 CSS 变量，它们也不能在媒体查询的表达式中使用。

然而，可以使用 JavaScript 来创建类似的效果。您可以读取 CSS 变量的值，然后使用 JavaScript 来动态应用不同的样式规则或修改 DOM，以响应类似于媒体查询的条件。这种方法提供了更大的灵活性，但需要更多的代码和可能的性能考虑。
