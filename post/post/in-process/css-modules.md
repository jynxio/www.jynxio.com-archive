# CSS Modules

## 概述

CSS Modules 是一种解决 CSS 全局污染的技术，它简洁易用，它不是 CSS 预处理器，它可以和 Sass、Less、PostCSS、Stylus 等预处理器一起工作。

## 原理

CSS Modules 的核心原理是「对类名进行哈希化处理」，通过保证类名的唯一性来避免选择器的冲突，于是便可以避免样式的冲突了。具体来说，同一个样式文件内的相同类名的哈希化结果是相同的，不同样式文件内的相同类名的哈希化结果是不一样的，比如：

- 样式表 A 内的所有 `.color` 都会被转换为 `._color_1xugd_37`；
- 样式表 B 内的所有 `.color` 都会被转换为 `._color_kbtd9_37`；

虽然我们在两个样式表（A 和 B）中使用了重复的类名，不过由于 CSS Modules 把他们哈希化成了不同的结果，所以实际上它们是不同的类名，于是它们的样式就不会发生冲突了。

> CSS Modules 还可以对 id 进行哈希化处理！但我们不应该在样式表中使用 id 选择器，不是吗？
>

下面是一个由 Vite 驱动的 CSS Modules 示例：

```
# 文件结构
|- index.jsx
|- a.module.css
|- b.module.css
```

```css
/* a.module.css */
.color { color: pink; }
```

```css
/* b.module.css */
.color { color: teal; }
```

```jsx
// index.jsx
import styleA from "./a.module.css";
import styleB from "./b.module.css";

function ReactComponent () {
    styleA.color; // _color_1xugd_37
    styleB.color; // _color_kbtd9_37

    return <>
    	<p className={ styleA.color }>a pink paragraph</p>
    	<p className={ styleB.color }>a teal paragraph</p>
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
.color { color: pink; }
```

```jsx
// index.jsx
import style from "./style.module.css";

function ReactComponent () {
    return <p className={ style.color }>a pink paragraph</p>
}
```

### :local()

`:local()` 是一个由 CSS Modules 所定义的伪类选择器，它可以接受任意选择器，不过它只会对 ID 选择器和类名选择器进行哈希化处理。

// TODO

### :global()

### 全局作用域

凡是以 `:global(.className)` 形式所声明的类名都不会被哈希化，它们会保持原样，所以它们就是全局的。

```css
:global(.red) {
    color: red;
}
```

但是在 JavaScript 中，你就不能用和局部类名一样的方式来使用了，你必须得直接使用其全局类名字符串，因为：

```js
import style from "./color.module.css";

console.log( style.red ); // undefined
elementNode.classList.add( "red" ); // 你只能这样直接用类名
```

事实上，存在一个和 `:global()` 相对的语法 `:local()`，后者其实是默认启用的。比如，下述两行代码是等价的：

```css
.red { color: red; }
:local(.red) { color: red; }
```

### 组合

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