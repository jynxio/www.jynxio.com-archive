# 图像

## 图像的类型

网页中的图像可以被分为 2 种类型，分别是：

- 装饰性图像：仅用作装饰的图像，比如背景和纹理；
- 内容性图像：被当作内容的图像，比如文章配图和商品图；

## 加载的方式

对于图像的加载，我们有 2 种方式，分别是：

- CSS 方案；
- HTML 方案；

CSS 方案是指使用 `background-image` 等 CSS 属性来加载图像的方案，它适用于加载装饰性的图像，这是因为它提供了开箱即用的装饰能力，比如 `background-repeat` 可用于制造重复的纹理背景，`background-attachment` 可用于控制背景图像的滚动行为。

HTML 方案是指使用 `<img>` 和 `picture>` 等 HTML 元素来加载图像的方案，它适用于加载内容性的图像，这是因为它提供了开箱即用的无障碍访问能力，比如 `alt` 属性可以为加载失败或阅读障碍提供降级的处理方案。

> 屏幕阅读器会阅读 `alt` 属性的内容，如果 `alt=""`，那么屏幕阅读器就会忽略它。

在加载速度方面，HTML 方案比 CSS 方案更快，这是因为浏览器只有在解析到相关的元素标签或 CSS 属性时才会开始下载图像，而对 CSS 属性的解析环节（样式计算）是发生在对 HTML 字符串的解析环节（DOM 构建）之后的。

对于由 React 等工具来构建的网页而言，由于 HTML 元素都是由 JavaScript 动态创建的，所以图像的下载时机都会被推迟到 JavaScript 执行完之后，如果你想提升图像的加载速度，那么不妨：

- 使用 SSG 类型的网页构建工具，比如 Astro 和 VitePress；
- 使用 `fetchpriority="high"` 来提高下载优先级；
- 使用 `<link preload />` 来预下载图像；

如果你想 提升首屏的渲染速度，那么可以采用 `<img loading="lazy" />` 来懒加载图像，它可以减少首屏的下载负荷。

## 响应式设计

图像的响应式设计是指图像会在分辨率和美术效果两个方面自动的适应，具体描述如下。

### 关于分辨率

网页会被显示在各种尺寸的屏幕上，比如台式电脑、笔记本电脑、平板电脑、智能手机，这意味着图像的尺寸也往往是动态的，如果采用了固定分辨率的图像，那么就无法兼顾清晰度和加载速度，因为：

- 对于高分辨率的图像，虽然图像清晰，但是加载速度慢；
- 对于低分辨率的图像，虽然加载速度快，但是图像会在放大时模糊；

该问题的解决方案是：

1. 尽可能使用 SVG；
2. 如果使用位图，那么：
	1. 图像的软件比例尺和物理比例尺要一致；
	2. 根据图像的软件分辨率来加载不同物理分辨率版本的图像；

> 软件比例尺是指图像渲染在网页上时的比例尺，物理比例尺是指图像本身的比例尺，软件分辨率和物理分辨率同理，它们是我根据「软件像素」和「物理像素」来创造的新概念。

关于 2.ii，假设图像的软件分辨率是 100 × 200，如果浏览器的像素分辨率是 1，那么图像的物理分辨率就必须达到 100 × 200，如果像素分辨率为 2，则是 200 × 400，如果像素分辨率为 3，则是 300 × 600。

> 我认为没有必要考虑像素分辨率大于 2 的情况，因为对于人眼而言，像素分辨率大于 2 之后所带来的提升效果已经不明显了，但是它却会显著增大图像的体积，这是一种浪费。

### 关于美术效果

有时候，我们不能把大屏设备上的图像直接照搬到小屏设备上去，比如对于一幅 16:9 的图像，它在电脑屏幕上的展示效果很棒，但是在手机屏幕上的展示效果却不好，因为手机屏幕太窄了，图像的细节都看不太清了。为此，我们应该为手机屏幕提供一份不那么宽的图像。

TODO：关于宽幅图像在电脑屏幕和手机屏幕上的渲染效果

该问题的解决方案是：根据设备的尺寸来加载不同美术效果的图像。

## 实践的方案

### 关于装饰性图像

```css
div {
	display: block;
    aspect-ratio: 3/2;
	inline-size: 100%;

    /* pixel ratio: 1 */
	background-image: url("desktop-1x.png");                            /* desktop */
    @media (width <= 1500px) { background-image: url("laptop-1x.png") } /* laptop  */
    @media (width <= 1100px) { background-image: url("tablet-1x.png") } /* tablet  */
    @media (width <= 550px)  { background-image: url("mobile-1x.png") } /* mobile  */

    /* pixel ratio: 2 */
	@media (resolution >= 2) {
		background-image: url("desktop-2x.png");                            /* desktop */
		@media (width <= 1500px) { background-image: url("laptop-2x.png") } /* laptop  */
		@media (width <= 1100px) { background-image: url("tablet-2x.png") } /* tablet  */
		@media (width <= 550px)  { background-image: url("mobile-2x.png") } /* mobile  */
    }
}
```

> 补充：满足媒体查询的图像才会被下载，不满足的则不会被下载。

### 关于内容性图像

我认为在大多数情况下，内容性图像的软件分辨率都不是固定的，并且会被限制在一个区间之内，比如：

```css
img {
    display: block;
    aspect: 1/1;
    inline-size: clamp(min, formula, max);
}
```

如果我们不确定图像的软件分辨率，那么响应式设计的实现方案就如下所示：

```html
/* 如果只关心分辨率 */
<style>
    img, picture {
        aspect-ratio: 16/9;
        inline-size: clamp(desktop-min, desktop-formula, desktop-max);

        @media (width <= 1500px) {
            inline-size: clamp(laptop-min, laptop-formula, laptop-max);
        }
        @media (width <= 1100px) {
        	inline-size: clamp(tablet-min, tablet-formula, tablet-max);
        }
        @media (width <=  550px) {
        	inline-size: clamp(mobile-min, mobile-formula, mobile-max);
        }
    }
</style>

<img
	srcset="1x.png 1x, 2x.png 2x"
	loading="lazy"
	src="2x.png"
	alt=""
/>
```

```html
/* 如果既关心分辨率，又关心美术效果 */
<style>
    img, picture {
        aspect-ratio: 16/9;
        inline-size: clamp(desktop-min, desktop-formula, desktop-max);

        @media (width <= 1500px) {
            aspect-ratio: 3/2;
            inline-size: clamp(laptop-min, laptop-formula, laptop-max);
        }
        @media (width <= 1100px) {
            aspect-ratio: 2/1;
        	inline-size: clamp(tablet-min, tablet-formula, tablet-max);
        }
        @media (width <=  550px) {
            aspect-ratio: 1/1;
        	inline-size: clamp(mobile-min, mobile-formula, mobile-max);
        }
    }
</style>

<picture>
    /* pixel ratio: 1 */
	<source media="(resolution >= 1) and (width <= 550px)"  srcset="mobile-1x.png"  />
    <source media="(resolution >= 1) and (width <= 1100px)" srcset="tablat-1x.png"  />
    <source media="(resolution >= 1) and (width <= 1500px)" srcset="laptop-1x.png"  />
    <source media="(resolution >= 1) and (width >  1500px)" srcset="desktop-1x.png" />
    
    /* pixel ratio: 2 */
    <source media="(resolution >= 2) and (width <= 550px)"  srcset="mobile-2x.png"  />
    <source media="(resolution >= 2) and (width <= 1100px)" srcset="tablat-2x.png"  />
    <source media="(resolution >= 2) and (width <= 1500px)" srcset="laptop-2x.png"  />
    <source media="(resolution >= 2) and (width >  1500px)" srcset="desktop-2x.png" />
    
    /* fallback */
    <img alt="" src="desktop-2x.png" />
</picture>
```

> 为了保证图像的渲染质量，我们要确保：`物理分辨率 = max(软件分辨率) * 像素分辨率`。比如 mobile-2x.png 的物理分辨率应当等于 `(mobile-max * 2) * (mobile-max * 2)`。
>
> 该公式亦是该方案的缺点，因为它会带来明显的心智负担。