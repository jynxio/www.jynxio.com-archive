# CSS Modules

## 概述

CSS Modules 是一种解决 CSS 全局污染和选择器名冲突的技术，它简洁易用，它不是 CSS 预处理器，它可以和 Sass、Less、PostCSS、Stylus 等预处理器一起工作。

CSS Modules 的核心原理大致是「将类名哈希化」，以此来保证类名的唯一性，于是便可以解决全局污染和选择器名冲突问题了。下文的「如何使用」小节描述了 CSS Modules 的运作方式，阅读它！然后你就知道 CSS Modules 的具体原理了。

## 如何启用

在正式开始使用之前，你首先需要知道如何启用 CSS Modules。

### 如果你正在使用开发服务器

如果你正在使用诸如 Vite、Webpack 之类的开发服务器，那么 CSS Modules 功能已经以内建或插件的形式提供给了开发者。

比如 Vite 内建支持 CSS Modules 特性，只要你用 `.module.css` 来作为 CSS 文件的命名后缀，那么该 CSS 文件就会启用 CSS Modules 特性，你可以从 [这里](https://vitejs.dev/guide/features.html#css-modules) 找到更多信息。

### 如果你没有使用开发服务器

如果你没有使用任何开发服务器，那么你就需要 [PostCSS-Modules](https://github.com/madyankin/postcss-modules) 这个家伙。

## 如何使用

### 项目结构

```
|- node_modules
|- src
    |- style
        |- color.module.css
        |- typography.module.css
    |- index.js
|- index.html
|- package.json
```

### 基本用法

这是打包前的代码：

```css
/* color.module.css */
.red {
    color: hsl(0 100% 50%);
}
```

```js
// index.js
import style from "./color.module.css";

elementNode.setAttribute( "class", style.red );
```

这是打包后的代码：

```css
/* color.module.css */
._red_1jhzg_11 {
    color: hsl(0 100% 50%);
}
```

```js
// index.js
elementNode.setAttribute( "class", "._red_1jhzg_11" );
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