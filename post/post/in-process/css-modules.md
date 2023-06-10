# CSS Modules

## 概述

[CSS Modules](https://github.com/css-modules/css-modules) 是一种解决 CSS 全局污染的技术，它赋予了我们在不同的样式表之间使用重复类名的能力。

## 术语

在正式开始阅读本文之前，我们需要先约定好一些术语的定义。

| 名词       | 含义                                                 |
| ---------- | ---------------------------------------------------- |
| 样式声明   | 如 `inline-size: 100%`                               |
| 样式       | 样式声明的集合，如 `{ inline-size: 100% }`           |
| 样式表     | 样式集合的文件，如 `style.css`                       |
| 模块样式表 | 指采用了 CSS Modules 的样式表，如 `style.module.css` |

> 注意，「模块样式表」是我自创的术语。

## 原理

CSS Modules 核心原理是对类名进行哈希化处理，以使得类名可以在 CSS 的全局作用域中保持唯一性。具体来说，同一个模块样式表中的同名类名的哈希化结果是相同的，不同模块样式表之间的同名类名的哈希化结果是不同的，比如：

- 模块样式表 A 中的 `.color` 会被转译为 `._color_1xugd_37`；
- 模块样式表 B 中的 `.color` 会被转译为 `._color_kbtd9_37`；

如此一来，哪怕我们在两个模块样式表中使用了重复的类名，也不会发生样式冲突，因为 CSS Modules 会把它们转译成不同的类名。

### 不仅可以处理类名，还可以处理 ID

CSS Modules 不仅仅会对类名进行哈希化处理，它还会对 ID 进行哈希化处理，比如：

- 模块样式表 A 中的 `.color` 和 `#color` 会被转译为 `._color_1xugd_37` 和 `#_color_1xugd_37`；
- 模块样式表 B 中的 `.color` 和 `#color` 会被转译为 `._color_kbtd9_37` 和 `#_color_kbtd9_37`；

虽然可以，但是请不要在模块样式表中使用 ID 选择器，理由如下：

假设我们在模块样式表中使用了大量的类名选择器和 ID 选择器，那么当我们准备把类名和 ID 赋给元素的时候，我们将很难分辨出哪些才是类名、才哪些是 ID。所以我们应该只使用 ID 选择器和类名选择器中的其中一种，而我推荐的是类名选择器，这是因为我们可以通过为 HTML 元素赋予多个类名来组合使用不同的样式，但我们却无法对 ID 也这么做，因为 HTML 元素的 ID 必须是唯一的。另外，「为 HTML 元素赋予多个类名来组合使用不同的样式」正是 CSS Modules 的 composition 的工作原理。

> 对样式进行组合是一件很重要的事情，因为它可以帮助我们写出逻辑更清晰、复用率更高的 CSS 代码。

> 因为我不推荐在模块样式表中使用 ID 选择器，所以除了本小节之外，本文的其余部分几乎不会再出现 ID 这个词。

### 没有局部作用域，只是哈希化而已

CSS Modules 的名字和作用容易让人误以为它会创建局部作用域，并且 `:local()` 和 `:global()` 这两个伪类选择器会进一步加深这种误会。然而实际上，CSS Modules 不会（也无法）创建出任何局部作用域，它生效的原理是对类名进行哈希化，仅此而已。

## 最佳实践

CSS Modules 的某些特性容易引发难以排查的 bug，为了避免这些 bug，请让我们克制的使用它的特性，下面是我总结的几条最佳实践：

- 禁止使用 ID 选择器；
- 禁止使用 `:global()`；
- 禁止使用 `composes` 来导入另一个模块样式表；
- 尽量避免 `composes` 所导入的样式会与导入者的样式发生冲突；
- 必须保证 `composes` 语句被写在样式块的首部；
- 推荐使用驼峰命名法来命名类名；

> 如果我们不得不要使用 `composes` 来导入另一个模块样式表中的其他样式，那么请务必确保导入者和被导入者之间的样式没有冲突，并且导入者和被导入者之间没有循环导入。

下面是一个遵循最佳实践的案例：

```
# 文件结构
|- node_modules
|- src
  |- index.jsx
  |- reset.css
  |- global.css
  |- Component.jsx
  |- Component.module.css
|- ...
```

```jsx
// index.jsx（入口文件）
import "./reset.css";
import "./global.css";

// ...
```

```jsx
import style from "./Component.module.css";

function Component () {
    return <button className={ style.button }>Submit</button>;
}
```

```css
.reset {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: none;
}

.appearance {
    inline-size: 9rem;
    padding: 0.4rem 1rem;
    margin: 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(210 61% 31%);
    background-color: hsla(210 61% 51% / 0.1);
}

.content {
    color: hsl(210 61% 31%);;
    font-family: cursive;
}

.button {
    composes: reset appearance content;
    animation: 0.5s linear 0s infinite localRotate;
}

.button:focus {
    --value: 0.5s linear 0s infinite globalRotate;
    animation: var(--value);
}

@keyframes localRotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
```

## 如何启用

在正式开始使用之前，你首先需要知道如何启用 CSS Modules。

### 如果你正在使用开发服务器

如果你正在使用诸如 Vite、Webpack 之类的开发服务器，那么 CSS Modules 功能已经以内建或插件的形式提供给了开发者。

比如 Vite 内建支持 CSS Modules 特性，只要你用 `.module.css` 来作为 CSS 文件的命名后缀，那么该 CSS 文件就会启用 CSS Modules 特性，你可以从 [这里](https://vitejs.dev/guide/features.html#css-modules) 找到更多信息。

### 如果你没有使用开发服务器

如果你没有使用任何开发服务器，那么你就需要 [PostCSS-Modules](https://github.com/madyankin/postcss-modules) 了。

## 路径约定

在模块样式表中，`url(path)`、`@import path`、`composes: x from path` 中的 `path` 遵循下述约定：

- `./stuff.css` 代表基于相对路径的样式表；
- `stuff.css`、`package/stuff.css` 代表来自 `node_modules` 中的样式表；

## :local() 伪类选择器

`:local()` 是一个由 CSS Modules 所定义的伪类选择器，它不是原生的 CSS 伪类选择器，它可以接受任意数量的任意选择器，并对其中的 ID 选择器和类名选择器的标识符进行哈希化。其语法如下：

```css
:local(.icon > svg) {}
:local(#icon > svg) {}
```

`:local()` 会对 ID 选择器和类名选择器的标识符进行哈希化，比如：

```css
/* style.module.css */
:local(.icon > svg) {}
:local(#icon > svg) {}

/* bundle.css */
._icon_9adfw_81 > svg {}
#_icon_9adfw_81 > svg {}
```

`:local()` 是默认启用的，`.icon {}` 会被视为 `:local(.icon) {}`。

## :global() 伪类选择器

`:global()` 是一个由 CSS Modules 所定义的伪类选择器，它不是原生的 CSS 伪类选择器，它可以接受任意数量的任意选择器，它不会对任何选择器进行任何处理，因此它被用于在模块样式表中创建全局样式。其语法如下：

```css
:global(.icon > svg) {}
:local(#icon > svg) {}
```

`:global()` 不会对 ID 选择器和类名选择器的标识符进行哈希化，比如：

```css
/* style.module.css */
:global(.icon > svg) {}
:global(#icon > svg) {}

/* bundle.css */
.icon > svg {}
#icon > svg {}
```

`:global()` 不会将其所接收到的类名选择器和 ID 选择器的标识符抛出到外界，比如：

```css
/* style.module.css */
:global(.icon) {}
```

```jsx
import style from "./style.module.css";

function Component () {
    style.icon; // undefined
    
    return <p className="icon" />;
}
```

虽然可以，但是请不要使用 `:global()` 来创建全局样式，理由如下：

全局样式是最容易发生冲突的，为了方便检查它们是否发生了冲突、发生了怎样的冲突，我们应该尽可能的把它们都书写在同一个样式表文件中，以便于浏览。不仅如此，我还推荐尽可能早的导入所有的全局样式，如此一来，如果我们后续编写的样式声明和全局的样式声明发生了冲突，且重要性和优先级都一样时，后续的样式声明就可以直接覆盖全局的样式声明了，因为后续的样式声明的打包顺序更晚。然而使用 `:global()` 来声明的全局样式的打包顺序往往是未知的，因为它们的打包顺序取决于当前模块样式表的打包顺序，而模块样式表们的打包顺序有可能会很错综复杂，这就容易导致同一个全局的样式声明，在有的地方会覆盖别的样式声明，在有的地方却会被别的样式声明覆盖，这就很棘手了。

## composes 关键字

CSS Modules 有一项名为「composition」的特性，该特性允许用户对样式进行组合，以便于样式的复用。参与组合的样式可以有 3 种来源，分别是：

- 同一个模块样式表中的其他样式；
- 另一个模块样式表中的样式；
- 全局样式；

你需要通过 `composes` 属性来使用 composition 特性，这是一个由 CSS Modules 所定义的私有属性。

### 原理

composition 的原理是「组合」，具体来说 composition 会把被导入者的标识符附加到导入者的标识符之后，就像把多个字符串拼接在一起那样，并且会以空白符来作为标识符和标识符之间的分隔符。另外，局部类名需要经过哈希化之后才能进行拼接，全局类名则可以直接参与拼接。

比如在下例中，标识符 `a1`、`a2`、`a3`、`b1`、`b2` 首先会被哈希化为 `_a1_hns8f_92`、`_a2_kms6o_46`、`_a3_qiu4s_35`、`_b1_uhb51_10`、`_b2_pqu7_41`，而标识符 `g1`、`g2` 则不会被哈希化，然后 CSS Modules 会把所有处理好的标识符都按照其导入的先后顺序来拼接至 `_a3_qiu4s_35` 之后，最后类名 `a3` 会被 CSS Modules 转译为 `_a3_qiu4s_35 _a1_hns8f_92 _a2_kms6o_46 _b1_uhb51_10 _b2_pqu7_41 g1 g2`。

```css
.a1 {}
.a2 {}
.a3 {
    composes: a1 a2;
    composes: b1 b2 from "./b.module.css";
    composes: g1 g2 from global;
}
```

于是，类名 `a3` 就变成了一系列类名的集合体，把类名 `a3` 绑定至元素身上，就相当于把这一系列类名都绑定到元素身上。

```jsx
import style from "./style.module.css";

function Component () {
    return <p className={ style.a3 } />;
}
```

另外，`composes` 的参数的书写顺序会影响到字符串的拼接顺序，`composes` 语句的执行顺序会影响到模块样式表的打包顺序。当组合之后的样式声明之间发生了冲突，且这些样式声明的重要性和优先级都相同的时候，模块样式表的打包顺序就会相当重要，因为它会直接决定究竟应该采用哪些样式声明。当 `composes` 语句很多时，我们将很难推断出哪些样式声明会被覆盖、哪些样式声明会被采用，于是一个巨大的 bug 便产生了。

更加不幸的是，`import` 语句也会影响样式表的打包顺序，于是事情就变的更加复杂了！关于更多细节，请见下文的「危险」小节。

### 危险

composition 是实用的，也是危险的，其危险之处在于：当我们使用 `composes` 来导入其他的模块样式表的样式时，`composes` 就会影响模块样式表之间的打包顺序，继而影响到最终的样式呈现。详见下例：

> 实践发现，Vite 在打包样式表时的最小的打包单位是样式表，这意味着如果样式表 `style.css` 中的样式规则的书写是 `.a {}` 再到 `.b {}` 再到 `.c {}` 的话，那么在打包结果中，关于 `style.css` 的部分，也会保持 `.a {}` 再到 `.b {}` 再到 `.c {}` 的顺序。

```css
/* a.module.css */
.a { color: red }

/* b.module.css */
.b { color: green }

/* c.module.css */
.c {
    composes: a from "./a.module.css";
    composes: b from "./b.module.css";
}

/* d.module.css */
.d {
    composes: b from "./b.module.css";
    composes: a from "./a.module.css";
}
```

```jsx
// Example 1
import styleC from "./c.module.css";

function ReactComponent () {
    return <p className={ styleC.c }>It's green!</p>;
}

// 打包结果:
// ._a_11uf4_1 { color:red }
// ._b_i759l_1 { color:green }
// ._c_jpvh6_1 {}
```

```jsx
// Example 2
import styleD from "./c.module.css";

function ReactComponent () {
    return <p className={ styleD.d }>It's red!</p>;
}

// 打包结果:
// ._b_i759l_1 { color:green }
// ._a_11uf4_1 { color:red }
// ._d_vbmg7_1 {}
```

```jsx
// Example 3
import styleC from "./c.module.css";
import styleD from "./c.module.css";

function ReactComponent () {
    return <p className={ styleC.c }>It's red!</p>;
}

// 打包结果
// ._c_jpvh6_1 {}
// ._b_i759l_1 { color:green }
// ._a_11uf4_1 { color:red }
// ._d_vbmg7_1 {}
```

```jsx
// Example 4
import styleD from "./c.module.css";
import styleC from "./c.module.css";

function ReactComponent () {
    return <p className={ styleC.c }>It's green!</p>;
}

// 打包结果
// ._d_vbmg7_1 {}
// ._a_11uf4_1 { color:red }
// ._b_i759l_1 { color:green }
// ._c_jpvh6_1 {}
```

### 导入自同文件

```css
.a {}
.b {}
.c {
    composes: a b;
    /* 1.composes语句必须写在块首，自身的样式必须写在composes语句之后 */
    /* 2.当导入自同文件时，被导入者必须在导入者之前被定义好，比如a和b必须写在c之前 */
}
```

### 导入自异文件

```css
/* a.module.css */
.a1 {}
.a2 {}
```

```css
/* b.module.css */
.b1 {}
.b2 {}
```

```css
/* c.module.css */
.c {
    composes: a1 a2 from "./a.module.css";
    composes: b1 b2 from "./b.module.css";
    /* 1.composes语句必须写在块首，自身的样式必须写在composes语句之后 */
    /* 2.两个模块样式表之间不能互相导入，a.module.css或b.module.css不能再导入c.module.css */
}
```

虽然可以，但是请不要使用 `composes` 来导入另一个模块样式表，理由详见上文的「危险」小节。

### 导入全局样式

```css
.a {
    composes: globalClassName from global;
    /* composes语句必须写在块首，自身的样式必须写在composes语句之后 */
}
```

## 另一种 CSS Modules

互联网上存在两种 CSS Modules，一种是本文所描述的 CSS Modules，另一种是浏览器内建的 CSS Modules，它们是两种完全不同的东西，关于后者，请见 [Using CSS Module Scripts to import stylesheets](https://web.dev/css-module-scripts/)。

## 相关资料

- [CSS Modules repo](https://github.com/css-modules/css-modules)
- [CSS Modules by Glen Maddern](https://glenmaddern.com/articles/css-modules)