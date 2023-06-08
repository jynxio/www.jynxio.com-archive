# CSS Modules

## 概述

CSS Modules 是一种解决 CSS 全局污染的技术，它简洁易用，它不是 CSS 预处理器，它可以和 Sass、Less、PostCSS、Stylus 等预处理器一起工作。

## 原理

CSS Modules 的核心原理是「对类名选择器和 ID 选择器的标识符进行哈希化处理」，然后通过标识符的唯一性来避免选择器之间的冲突，于是便就可以避免样式冲突了。具体来说，同一个样式表文件内的相同的标识符（指类名选择器和 ID 选择器的标识符）的哈希化结果是相同的，不同样式表文件之间的相同的标识符的哈希化结果是不一样的：

- 样式表 A 内的所有 `.color` 和 `#color` 都会被转换为 `._color_1xugd_37` 和 `#_color_1xugd_37`；
- 样式表 B 内的所有 `.color` 和 `#color` 都会被转换为 `._color_kbtd9_37` 和 `#_color_kbtd9_37`；

虽然我们在两个样式表（A 和 B）中使用了重复的标识符（即 `color`），不过由于 CSS Modules 把它们哈希化成了不同的结果，所以实际上它们是不同的标识符，于是它们的样式就不会发生冲突了。

下面是一个由 Vite 驱动的 CSS Modules 示例：

```
# 文件结构
|- index.jsx
|- a.module.css
|- b.module.css
```

```css
/* a.module.css */
.color {}
#color {}
```

```css
/* b.module.css */
.color {}
#color {}
```

```jsx
// index.jsx
import styleA from "./a.module.css";
import styleB from "./b.module.css";

function ReactComponent () {
    return <>
	    <p id={ styleA.color } className={ styleA.color }>{ styleA.color }</p>
	    { /* <p id="_color_1xugd_37" class="_color_1xugd_37">_color_1xugd_37</p> */ }

	    <p id={ styleA.color } className={ styleB.color }>{ styleB.color }</p>
	    { /* <p id="_color_kbtd9_37" class="_color_kbtd9_37">_color_kbtd9_37</p> */ }
    </>;
}
```

## 如何启用

在正式开始使用之前，你首先需要知道如何启用 CSS Modules。

### 如果你正在使用开发服务器

如果你正在使用诸如 Vite、Webpack 之类的开发服务器，那么 CSS Modules 功能已经以内建或插件的形式提供给了开发者。

比如 Vite 内建支持 CSS Modules 特性，只要你用 `.module.css` 来作为 CSS 文件的命名后缀，那么该 CSS 文件就会启用 CSS Modules 特性，你可以从 [这里](https://vitejs.dev/guide/features.html#css-modules) 找到更多信息。

### 如果你没有使用开发服务器

如果你没有使用任何开发服务器，那么你就需要 [PostCSS-Modules](https://github.com/madyankin/postcss-modules) 了。

## 如何使用

### 基础用法

```
# 文件结构
|- index.jsx
」- style.module.css
```

```css
/* style.module.css */
.color {}
```

```jsx
// index.jsx
import style from "./style.module.css";

const ReactComponent = () => <p className={ style.color } />;
```

### :local()

`:local()` 是一个由 CSS Modules 所定义的伪类选择器（不是原生的 CSS 伪类选择器），它可以接受任意数量的任意选择器，不过它只会对 ID 选择器和类名选择器的标识符进行哈希化处理。比如，在 CSS Modules 文件中，`:local(.icon > svg)` 选择器最后会被转换为为 `_icon_9adfw_81 > svg`。

另外，`:local()` 是默认启用的，因此下述的两则样式是等价的：

```css
/* style.module.css */
.icon > svg {}
:local(.icon > svg) {}
```

关于其使用方法，请见上文的「基础用法」。

### :global()

`:global()` 是一个由 CSS Modules 所定义的伪类选择器（不是原生的 CSS 伪类选择器），它可以接受任意数量的任意选择器，它不会对任何选择器进行任何处理，因此它被用于在 CSS Modules 样式表中创建全局样式。另外，它不会将其所接收到的类名选择器和 ID 选择器的标识符抛出到外界，这是它与 `:local()` 的第二个区别。

关于其使用方法，请见下例：

```
# 文件结构
|- index.jsx
」- style.module.css
```

```css
/* style.module.css */
:global(.icon > svg) {}
```

```jsx
// index.jsx
const ReactComponent = () => <span id={ "icon" } />
```

因为 `:global()` 不会把其所接收到的类名选择器或 ID 选择器的标识符抛出到外界，所以 `style` 对象上根本就不存在 `icon` 属性，因此请直接使用 `"icon"` 字符串来为 `id` 属性赋值，而不要用 `style.icon`。

### Composition

CSS Modules 允许

// composes 的原理是把所有类名都组合在一起，在组合好的哈希类名组合中，哈希类名的先后顺序不代表其所对应的样式所生效的顺序，实际上是没关系的，生效顺序只和打包后的样式文件中的样式的定义的先后顺序有关系，而这又很复杂...

// composes 可以写在非首行（不符合规范，但确实可行

// 在一个文件内，某个选择器使用了 composes 来组合当前文件内的其他类名/id，那么composes所接收的参数必须在当前样式之前就被定义好。

// 在一个文件内，某个选择器使用 composes 来组合当前文件内的其他类名/id，样式生效的顺序就是所有样式在当前文件内定义的先后顺序，越晚的生效，和 composes: className1 className2 中的 className1 和 className2 的先后顺序没有关系，只和 className1 和 className2 在文件中的定义顺序有关系，越晚的生效。

// 如果在a.module.css中，先使用composes导入了b.module.css的某个类名，然后再用composes导入了c.module.css的某个类名，那么 vite 打包时会先打包b.module.css中所有样式，然后再打包c.modulecss中所有样式！

// 继续上一条，如果在d.module.css 中，先使用composes导入了c.module.css的某个类名，然后再用composes导入了b.module.css的某个类名，然后在 js 中先倒入 a 的模块，再倒入 d 的模块，你猜怎么着！最终 vite 会先打包c.modulecss中所有样式，然后再打包b.modulecss中所有样式！

// 另外，如果你在a.module.css中，使用composes: color1 color2 from "./b.module.css"，那么color1和color2谁生效呢？这取决于color1和color2在b.module.css中谁更晚被定义！更晚被定义的就会生效！

// 然后！如果你在a.module.css中，先在.colorA1{}中使用composes导入了b.module.css的某个样式，然后后用（指书写顺序更晚，在CSS文件中行数更大）composes导入了c.module.css，然后！你还在a.module.css的.colorA2（.colorA2比.colorA1的书写顺序更晚）中使用composes导入了c.module.css，然后后用composes导入了b.module.css，那么最终 Vite 会先打包整个c.module.css的样式，然后再打包整个b.module.css的样式！

// 接上一条，如果有另一个d.module.css也做了和a.module.css同样的事情，然后在js脚本中你既导入了a.module.css的模块又导入了d.module.css的模块，那么会发生什么？bomb！

// composes 会导入类名和 id 名的哈希值，如果你既用了类名选择器，又用了 id 选择器，那么为了要让你的样式生效，你就要为元素绑定类名和 id，可是如果在导出的一系列哈希值中，只有一个哈希值才有 id 样式，或者只有一个哈希值才有类名样式，那么你该怎么办？id 只能指绑定一个，那么你要怎么筛选出哪个 id 是声明了样式的呢？另一个问题，由于 composes 本身的复杂度，如果你既用 id 又用类名，那么最后 composes 会打包出什么 css 来？复杂度更爆炸了！所以... 不要用 id 来写 css modules！对吗？

// 最后，不要循环composes，比如在a.module.css中composes了b.module.css，然后在b.module.css中composes了a.module.css，在 Vite 中，开发服务器和打包器都会死机（就是一直在工作，但是始终没更新或打包结果）。CSS Modules 没有要求打包器对这种情况跑出错误，因为它的原话是：The module system 「may」 emit an error。

// 如果composes一个global，那么global先生效还是后生效呢？如果这个global是被放在一个style.css文件中呢？如果这个global是被一个style.module.css的:global()所声明的呢？... 似乎谁先生效取决于导入顺序，而和composes 本身没有任何关系，对吗？

定义

语法

示例

```css
.baseStyle {
    color: red;
}

.moreStyle {
    composes: baseStyle;
    font-weight: 700;
}

/* 打包成 */
._baseStyle_981e2_11 { color: red; }
._moreStyle_279f1_32 { font-weight: 700; }
```

```js
import style from "./style.module.css";

style.baseStyle; // _baseStyle_981e2_11
style.moreStyle; // _baseStyle_981e2_11 _moreStyle_279f1_32
```

### 跨文件组合

```css
.test {
    composes: className from "./another.module.css";
}
```

### 多组合

TODO：多组合的注意事项

```css
.test {
    composes: className1 className2 className3;
}

.test {
    composes: className1;
    composes: className2;
    composes: className3;
}
```



## 命名格式

推荐使用驼峰命名法（camelCase），如此一来，我们就可以直接使用 `.` 属性访问符来访问类名了。即 `style.className`。你当然也可以用蛇形命名法或连字符命名法（kebab-casing），不过你就得使用计算属性的形式来访问类名了，即 `style[class-name]` 形式。

## 路径约定

## 关于 @keyframes

## CSS Modules Library

- https://github.com/css-modules/css-modules
- https://glenmaddern.com/articles/css-modules
- https://www.ruanyifeng.com/blog/2016/06/css_modules.html

## CSS Modules Scripts

- https://css-tricks.com/css-modules-the-native-ones/
- https://web.dev/css-module-scripts/