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

虽然我们在两个模块样式表中使用了重复的类名，但是它们所对应的样式却并不会发生冲突，这是因为 CSS Modules 会把它们转译成不同的类名。

### 它其实还可以哈希化 ID！

CSS Modules 不仅仅会对类名进行哈希化处理，它还会对 ID 进行哈希化处理，比如：

- 模块样式表 A 中的 `.color` 和 `#color` 会被转译为 `._color_1xugd_37` 和 `#_color_1xugd_37`；
- 模块样式表 B 中的 `.color` 和 `#color` 会被转译为 `._color_kbtd9_37` 和 `#_color_kbtd9_37`；

### 别误会！它才没有创建局部作用域

CSS Modules 的名字和作用会让人误以为它会创建局部作用域，并且 `:local()` 和 `:global()` 这两个伪类选择器会进一步加深这种误会。然而实际上，CSS Modules 不会（也无法）创建出任何局部作用域。

值得重申的是：CSS Modules 的原理是对类名进行哈希化，而不是创建局部作用域并将类名限制在该作用域内。

## 最佳实践

CSS Modules 的某些特性容易引发意料之外的情况，为了避免此类事故，请让我们克制的使用它。下面是我总结的几条最佳实践，它可以帮助我们避免意外之外的情况。

- 禁止在模块样式表中使用 ID 选择器；
- 禁止在模块样式表中使用 `:global()`；
- 禁止使用 `composes` 导入另一个模块样式表中的其他样式；
- 如果需要使用 `composes` 来导入另一个模块样式表中的其他样式，那么务必确保导入者和被导入者之间没有样式冲突；
- 如果你使用 `composes` 来导入同一个模块样式表的其他样式，那么务必确保被导入者的声明顺序在导入者之前（暂时性死区）；
- 如果你使用 `composes` 来导入另一个模块样式表的其他样式，那么请务必确保被导入者没有导入导入者（循环导入）；

下面是一个遵循最佳实践的案例：

```
# 文件结构
|- ...
|- node_modules
|- src
  |- index.jsx
  |- reset.css
  |- global.css
  |- Component.jsx
  |- Component.module.css
```

```jsx
// index.jsx - 入口文件
import "./reset.css";
import "./global.css";

// ...
```

```jsx
import style from "./Component.module.css";

function Component () {
    style.button; // _button_db0cy_23 _reset_db0cy_1 _appearance_db0cy_9 _content_db0cy_18
    
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
}
```

### 为什么禁用 ID 选择器？

假设我们在一个模块样式表中使用了很多个类名选择器和 ID 选择器，然后我们在另一个 JavaScript 文件中导入了该模块样式表，并且准备把类名和 ID 赋值给相应的元素时，请问哪些要作为类名来赋值？哪些要作为 ID 来赋值呢？这很难记住，对不对？

为了避免出现这种情况，我们应该只使用类名选择器或 ID 选择器中的其中一种，那么为什么要选择类名选择器呢？原因有 3:

- 类名选择器比 ID 选择器更流行；
- 如果元素的样式有许多种来源，那么我们可以通过组合类名的方式来解决该需求，然而我们却并不能组合 ID，因为每个元素的 ID 必须是唯一的；
- CSS Modules 的 composition 的工作原理是把多个标识符（类名或 ID）组合在一起（以空白符来分隔不同的标识符），显然的是，类名可以被组合在一起，但 ID 不应该被组合在一起；

### 为什么禁用 :global()？

假设我们在许多模块样式表中都使用了 `:global()` 来创建全局样式，那么请问我们最后一共有哪些全局样式呢？

更加致命的是，如果这些全局样式之间发生了冲突，并且它们的选择器的重要性和优先级都是相同的，那么谁才是冲突的胜者呢？这就取决于谁是最晚定义的，可是谁才是最晚定义的呢？这就取决于模块样式表们的导入顺序了，可是模块样式表们的导入顺序是由什么决定的呢？是由 `import` 和 `composes` 共同决定的... 这一切真的很棘手，不是吗？

### 为什么禁用 composes 的跨文件导入？

因为如果我们使用 `composes` 来导入另一个模块样式文件的样式，那么 `composes` 就会影响模块样式文件之间的打包顺序，继而影响到最终的样式呈现。

详见下例：

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

// CSS的打包结果:
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

// CSS的打包结果:
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

// CSS的打包结果
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

// CSS的打包结果
// ._d_vbmg7_1 {}
// ._a_11uf4_1 { color:red }
// ._b_i759l_1 { color:green }
// ._c_jpvh6_1 {}
```

## 如何启用

在正式开始使用之前，你首先需要知道如何启用 CSS Modules。

### 如果你正在使用开发服务器

如果你正在使用诸如 Vite、Webpack 之类的开发服务器，那么 CSS Modules 功能已经以内建或插件的形式提供给了开发者。

比如 Vite 内建支持 CSS Modules 特性，只要你用 `.module.css` 来作为 CSS 文件的命名后缀，那么该 CSS 文件就会启用 CSS Modules 特性，你可以从 [这里](https://vitejs.dev/guide/features.html#css-modules) 找到更多信息。

### 如果你没有使用开发服务器

如果你没有使用任何开发服务器，那么你就需要 [PostCSS-Modules](https://github.com/madyankin/postcss-modules) 了。

## :local()

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

## :global()

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

## composes

CSS Modules 有一项名为「composition」的特性，该特性允许用户对样式进行组合，以便于样式的复用。参与组合的样式可以有 3 种来源，分别是：

- 同一个模块样式表中的其他样式；
- 另一个模块样式表中的样式；
- 全局样式；

你需要通过 `composes` 关键字来使用 composition 特性，这是一个由 CSS Modules 所定义的私有的关键字。

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

### 危险

composition 是实用的，也是危险的，其危险之处在于：`composes` 会影响模块样式表之间的打包顺序。

> 仅当我们使用 `composes` 来导入其他模块样式表时，它才会影响模块样式表之间的打包顺序。



### 导入自同文件

```css
.a {}
.b {}
.c {
    composes: a b;
}
```

注意，请保证被导入者是已经提前声明好的，比如上例中的 `.a` 和 `.b` 必须在 `.c` 之前。

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
}
```

注意，请保证被导入者没有导入导入者（即循环导入），比如上例中的 `a.module.css` 和 `b.module.css` 不能再导入 `c.module.css`，否则就会造成循环导入。

另外，`composes` 会影响模块样式表的打包顺序，你可以从「最佳实践」的「为什么禁用 composes 的跨文件导入」中获得更多细节。

### 导入全局样式

```css
.a {
    composes: globalClassName from global;
}
```





允许将样式彼此组合在一起，这便是

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

// 如果导入一个虚空样式，比如导入 z1 from "./c.module.css"，那么 z1 的值是 undefined，然后 CSS Modules 会把它字符串化为 "undefined" 并拼接到结果中去。

// 如果composes一个global，那么global先生效还是后生效呢？如果这个global是被放在一个style.css文件中呢？如果这个global是被一个style.module.css的:global()所声明的呢？... 似乎谁先生效取决于导入顺序，而和composes 本身没有任何关系，对吗？

// 如果global是由style.css文件声明的，那么global的生效时机就取决于import的先后，我通常会把她放在最前，这样子就能保证global样式不会覆盖任意样式。如果global是由某个.module.css的:global()声明的，然后.module.css又有composes的话，global的生效顺序就取决于其打包顺序了，但是它会被打包在那个位置？取决于composes，然后就会引发前面讨论过的问题，超级麻烦！所以不要用:global()来声明全局样式。

// composes globalClassName from global 就是单纯的组合上一个 globalClassName，它不涉及任何的文件导入，它不会影响打包器对文件的打包顺序。

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