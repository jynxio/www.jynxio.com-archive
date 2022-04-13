# 严格模式

## 概述

严格模式由 ES5 引入，它修正了 JavaScript 这门语言中的不良设计并引入了许多新特性。严格模式的影响是破坏性的，为了保持向后兼容，严格模式没有默认开启，你需要一个特殊的指令——`"use strict"` 来明确的激活它，并且严格模式一旦激活便无法退出。

## "use strict"

若 `"use strict"` 出现在脚本文件的顶部，则整个脚本文件将使用严格模式。若 `"use strict"` 出现在函数体的顶部，则该函数将使用严格模式，比如：

```js
"use strict";

// 整个脚本文件将使用严格模式
```

```js
function f() {
    "use strict";
    
    // 该函数将使用严格模式
}
```

若 `"use strict"` 的书写位置不是整个脚本文件的顶部或函数体的顶部，则会静默失败。例外的是，注释可以出现在 `"use strict"` 的上方。

## 作用

以下操作在严格模式下会触发错误，在非严格模式下则不会：

- 使用废弃的 `with`
- 对未声明的变量进行赋值
- 对变量使用 `delete` 操作
- 重复使用属性名，比如 `{ a: 1, a: 2 }`
- 重复使用参数名，比如 `function f( a, a ) {}`
- 重写不可写的数据属性
- 删除不可配置的数据属性
- 在块语句内部声明函数，比如 `if ( 1 ) { function f() {} }`
- 使用保留字来命名变量
- 使用过时的以 `0` 为前缀的八进制语法；
- 使用 `arguments.callee` 、`arguments.caller`、`anyFunction.caller`、`anyFuntion.arguments`

严格模式与非严格模式的 `this` 的值是有区别的：

- 对于普通函数：
  - 严格模式下的 `this` 的值是 `undefined`
  - 非严格模式下的 `this` 的值是 `window` 对象
- 对于由 `call` 或 `apply` 调用的函数：
  - 严格模式下的 `this` 的值是入参的值
  - 非严格模式下：
    - 若入参的值是 `null` 或 `undefined`，则 `this` 的值就是 `window` 对象
    - 若入参的值是其余类型的原始值，则 `this` 的值就是该原始值的包装对象

## Class 和 module

`class` 语法和模块脚本是默认使用严格模式的。

## 浏览器控制台

浏览器控制台默认不激活严格模式，如果你想在控制台中激活严格模式，则需要搭配使用 `Shift + Enter` 来键入多行代码，并且将 `"use strict"` 放在代码的顶部，这种办法对大部分浏览器都有效，如果不奏效，可以使用下例这种方法：

```js
( function() {    // Shift + Enter
    "use strict"; // Shift + Enter
    const a = 1;  // Shift + Enter
} )();            // 按下Enter以运行
```