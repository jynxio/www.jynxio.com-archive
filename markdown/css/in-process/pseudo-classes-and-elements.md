# 伪类和伪元素

## 伪类

伪类（pseudo-classes）是一个附加到选择器末尾的关键字，它是选择器的附加条件，用于匹配处于特定状态下的元素，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 查看所有的伪类。

### focus

`:focus` 用于匹配获得焦点的元素，用户可以通过点击、触击、tab 键来聚焦一个元素（`tab` 代表聚焦下一个元素，`shift+tab`代表聚焦上一个元素）。

```css
a:focus {
    color: red;
}
```

只有锚、按钮、表单元素才能获得焦点。并且用户可以使用键盘来控制已经获得焦点的元素，比如对于锚元素而言，可以回车打开链接；对于按钮元素而言，可以回车出发按钮；对于表单元素而言，可以直接输入内容。

另外，如果操作系统不同、浏览器不同，那么聚焦的触发方式也不同，具体来说：

- 用户可以通过点击或触击来聚焦元素，用户可以使用 `tab` 来聚焦下一个元素，使用 `shift+tab` 来聚焦上一个元素。
- 对于 MacOS 的 Safari：
  - 用户无法通过点击或触击来聚焦元素（这是一个众所周知的 bug）。
  - `tab` 和 `shift+tab` 只能聚焦表单元素，不能聚焦锚元素和按钮元素。
  - `option+tab` 和 `option+shift+tab` 可以聚焦锚、按钮、表单元素。
- 对于 MacOS 的某些版本的 Firefox，`tab` 和 `shift+tab` 只能聚焦按钮、表单元素。

> 如果你想让 Safari 和 Firefox 的行为变得“正常”，那么你就需要更改 MacOS 的系统设置，请从 [这里](https://www.scottohara.me/blog/2014/10/03/link-tabbing-firefox-osx.html) 查看修改的教程。
>
> 如果你想更加深入的学习可访问性，那么你可以看 [这里](https://a11y.coffee/)。

### checked

`:checked` 用于匹配处于勾选状态下的元素，另外只有 `<input type="radio" />` 和 `<input type="checkbox" />` 才能被勾选。

### first & last child

`:first-child` 的作用是仅当锚元素是其父元素的第一个字元素时，才匹配该锚元素，`:last-child` 的作用则恰好相反。

> 此处的“锚元素”是指被伪类吸附的元素，而不是 `<a>`。

```html
<style>
    span:first-child {
        color: red;
    }
    span:last-child {
        color: blue;
    }
</style>
<body>
    <span>该文本的字体颜色是：红色</span>
    <span>该文本的字体颜色是：蓝色</span>
</body>
```

### first & last of type

`:first-of-type` 的作用是仅当锚元素是所有兄弟元素中的长兄元素时，才匹配该锚元素，`:last-of-type` 的作用则恰好相反。

```html
<style>
    span:first-of-type {
        color: red;
    }
    span:last-of-type {
        color: blue;
    }
</style>
<body>
    <div></div>
    <span>该文本的字体颜色是：红色</span>
    <span>该文本的字体颜色是：蓝色</span>
    <div></div>
</body>
```

## 伪元素

伪元素（pseudo-elements）是一个附加到选择器末尾的关键字，它是选择器的附加条件，用于匹配目标元素内的伪造的子元素，你可以从 [这里](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) 查看所有的伪元素。

> 根据规范，伪元素应当使用双冒号（`::`）语法，以便于与伪类进行区分。不过由于早期的 W3C 规范并为对此进行规定，因此一些早期实现伪元素也支持单冒号语法。
>
> 我们可以通过非 HTML tag 的方式来伪造一个元素，而伪元素的作用正是匹配这些伪造出来的元素，这就是伪元素得名的原因。比如下例中的提示文本是通过 `palceholder` 属性来伪造出的一个元素，你可以把它当成 `<placeholder>`，而 `::placeholder` 可以匹配到 `<placeholder>`。
>
> ```html
> <style>
>     input::placeholder {
>         color: gold;
>     }
> </style>
> <input placeholder="please entry here..." />
> ```

### before & after

`::before` 的原理是在元素内部的头部创建出一个 `<span>`，然后将 `content` 属性的值作为 `<span>` 的内容，`::after` 也是同理。所以你可以认为 `::before` 和 `::after` 是一种用于创建 `<span>` 的语法糖。

比如，下面两个例子的效果是一致的，性能也没有显著的差异。

```html
<p><span>-></span>www.jynxio.com</p>
```

```html
<style>
    p::before {
        content: "->"
    }
</style>
<p>www.jynxio.com</p>
```

Josh 建议只用 `::before` 和 `::after` 来进行装饰（即让 `content` 属性的值为 `""`），比如用来创建无序列表的圆点，而不要用它们来渲染 HTML 文本，原因有二：

- 有些屏幕阅读器会阅读它们的内容，有些屏幕阅读器则不会，如果使用它们来渲染 HTML 文本，那么就会降低可访问性。
- 使用 CSS 来渲染 HTML 的内容是一种不好的耦合行为，这会降低程序的可维护性。

## 区别

| 伪类                     | 伪元素                           |
| ------------------------ | -------------------------------- |
| 单冒号语法               | 双冒号语法（部分支持单冒号语法） |
| 匹配处于特定状态下的元素 | 匹配目标元素内的伪造的子元素     |
| 一个元素可以使用多个伪类 | 一个元素只能使用一个伪元素       |