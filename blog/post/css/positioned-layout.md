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