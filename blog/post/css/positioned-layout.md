## Overflow

Josh 给了一个建议，当你使用 `hidden` 时，请写一个关于你为什么要用他的注释，因为你通常都是使用 hidden 来解决一些小众的样式 bug，但是当你重构的时候，你可能会觉得这一行没用，然后删掉，并在最后的某个时刻才遇到这个小众 bug。所以留一行注释，以帮助未来的自己。

## scroll container

> `<body>` 和 `<html>` 天生就是 scroll container？对吗？可是他们的 overflow 的 x 轴和 y 轴都是 visible 欸！



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

