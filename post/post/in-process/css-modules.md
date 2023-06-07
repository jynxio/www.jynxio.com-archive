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

### composes

// TODO

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



## CSS Modules Library

- https://github.com/css-modules/css-modules
- https://glenmaddern.com/articles/css-modules
- https://www.ruanyifeng.com/blog/2016/06/css_modules.html

## CSS Modules Scripts

- https://css-tricks.com/css-modules-the-native-ones/
- https://web.dev/css-module-scripts/