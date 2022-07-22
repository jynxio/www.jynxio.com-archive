# Number

## 概述

Number 是 JavaScript 中唯一的数值类型，它是基于 IEEE-754 标准的双精度 64 位二进制格式的值，其中，52 位用于存储整数，11 位用于存储小数，1 位用于存储符号。

JavaScript 中没有整数数值类型，所有整数都是用 Number 这种浮点数数值类型来表示的。

除了常规的数值外，JavaScript 还定义了两个特殊的数值，分别是 `Infinity` 和 `NaN`，前者表示无穷，后者表示计算错误。

## 极值

`Number.MAX_VALUE` 属性是 JavaScript 所能存储的最大的数值，约为 `1.798e+308`，任何超过该值的数值都会被转换为 `Infinity`。`Number.MIN_VALUE` 属性是 JavaScript 所能存储的最小的正数值，约为 `5e-324`，任何小于该值的正数值都会被转换为 `0`。

`Number.MAX_SAFE_INTEGER` 属性是 JavaScript 所能安全存储的最小整数，值为 `- ( 2^53-1 )`，即 `-9007199254740991`。`Number.MAX_SAFE_INTEGER` 属性是 JavaScript 所能安全存储的最大整数，值为 `( 2^53-1 )`，即 `9007199254740991`。所以 JavaScript 的整数值的安全存储范围就是 `[ - ( 2^53 - 1 ), ( 2^53 - 1 ) ]`。如果两个整数值超出了安全存储的范围，那么 JavaScript 就无法准确的区分这两个整数值了，这便是“安全存储”的含义，这种缺陷来自于 IEEE-754。

```js
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2; // true
```

`Number.isSafeInteger( value )` 可以用来判断入参是否是一个安全的整数值，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) 来了解更多。

## NaN

NaN 是 JavaScript 的一个特殊值，它是 Not a Number 的缩写，它代表计算错误。具体来说，如果 JavaScript 执行了一个错误的数学运算表达式，它不会像 C++ 等语言一样抛出一个错误，而是直接返回 `NaN`，来表示发生了计算错误。

```js
1 / {}; // NaN
```

因为 `NaN` 代表计算错误，所以任何含有 `NaN` 的数学运算表达式也必然会返回 `NaN`。唯一的例外是 `NaN ** 0` 的值为 `1`，因为 JavaScript 规定任何值的零次方都等于一。

```js
NaN + 10; // NaN
NaN ** 0; // 1
```

`NaN` 是 JavaScript 中唯一一个自己不等于自己的值。

```js
NaN == NaN; // false
NaN === NaN; // false
```

`NaN` 是英文 not a number 的缩写，它代表计算错误。当数学运算不正确时，表达式便会返回该值，若数学表达式内有 `NaN`，则该表达式的返回值必然是 `NaN`，唯一的例外是：`NaN ** 0` 为 `1`。

`NaN` 是 JavaScript 中唯一一个自己不等于自己的值，如果我们想要检测 `NaN`，我们就需要使用 `Number.isNaN( value )` 方法。

```js
NaN ==  NaN; // false
NaN === NaN; // false

Number.isNaN( NaN ); // true
```

> `Number.isNaN` 方法源自于 ECMAScript 2015，它用来替代此前的 `globalThis.isNaN` 方法。因为当入参为 `NaN`、`undefined`、非空且非数字字符串、函数、普通对象的时候，`globalThis.isNaN` 方法都会返回 `true`，所以请不要再使用 `globalThis.isNaN`。
>
> 如果运行时中缺少 `Number.isNaN`，那么你可以使用这个 Polyfill：
>
> ```js
> if ( ! Number.isNaN ) {
>     
>     Number.isNaN = function( v ) { return v !== v };
>     
> }
> ```

## Infinity

`Infinity` 是 JavaScript 的一个特殊值，它代表无穷大，如果数值超过 JavaScript 的存储极限，那么这个数值就会被就近的舍入为 `Number.MAX_VALUE` 或 `Infinity`。

```js
Number.MAX_VALUE + Math.pow( 2, 969 ); // Number.MAX_VALUE
Number.MAX_VALUE + Math.pow( 2, 970 ); // Infinity
```

另外，`-Infinity` 代表无穷小，它不是一个值，而是一个数学运算表达式，它代表 `( -1 ) * Infinity`。

## 零

在 JavaScript 中，`0`、`+0`、`-0` 三者是相等的。不过，如无必要，请勿使用 `+0`和 `-0`，一是为了某些性能优化，二是为了代码的简洁。比如，如果我们使用 `-0` 来作为 JavaScript 对象的键，那么 V8 引擎就有可能会永远降低 JavaScript 对象的性能，具体原因请查看本博客的另一篇文章《V8 Object》。

小数点前的零是可以省略的，比如 `.1` 等价于 `0.1`。是否这样做取决于我们的编程风格。

## 进制

JavaScript 默认使用十进制来表示数值，此外它还支持二进制、八进制、十六进制和其他自定义的进制。如果我们想要使用二进制、八进制、十六进制的数值，那么我们就需要为数值添加特殊的前缀标识，具体来说：

- 二进制：`0b`
- 八进制：`0o`
- 十六进制：`0x`

另外，如果你用 `0` 来作为数值的前缀，那么这个数值将被当作八进制数值，这是一种淘汰了的八进制表示法，严格模式禁止这种写法。

```js
0b11; // 二进制
0o77; // 八进制
0xff; // 十六进制
077;  // 八进制（淘汰）
```

如果你想使用其它的进制，那么你可以使用 `Number.prototype.toString( radix )` 方法来将一个数值转换为指定进制的数值字符串，不过你还需要手工编写一个可以按照指定进制来解析数值字符串的方法，因为 JavaScript 不提供相关的内建方法。下例将十进制的数值 `3` 转换为了三进制的数值字符串 `"10"`。

```js
3..toString( 3 ); // "10"
```

> `radix` 参数是一个属于 `[ 2, 36 ]` 的整数。

## 科学计数法

JavaScript 的科学计数法的格式是：`底数 + e或E + 指数`。比如：

```js
2.5e5;  // 250000
2.5e+5; // 250000
2.5e-5; // 0.000025
2.5E+5; // 250000
2.5E-5; // 0.000025
```

## 数字分隔符

数字分隔符是 ECMAScript 2021 的语法糖特性，该特性允许我们为数值字面量添加下划线，这可以增强数值的可读性。

```js
1_000_000_000_000 === 1000000000000;          // true
1_000_000_000_000n === 1000000000000n;        // true
0b1010_0001_1000_0101 === 0b1010000110000101; // true
0xa0_b0_c0 === 0xa0b0c0;                      // true
```

由于该特性在移动端的 [支持度](https://caniuse.com/?search=numeric%20separator) 不详，因此请总是为其应用 babel。最后，你可以通过 [这篇文章](https://github.com/tc39/proposal-numeric-separator)  来了解更多细节。

## 字面量与原型方法

如果数值字面量想要调用 `Number.prototype` 上的方法，那么它需要遵循下述规则：

- 若字面量带有小数点，比如 `0.1`，则可以直接调用原型方法，比如 `0.1.toString()`
- 若字面量是指数，比如 `2e5`，则可以直接调用原型方法，比如 `2e5.toString()`
- 若字面量是整数，比如 `1`，则需满足下述格式后，才能调用原型方法：
  - `1..toString()`
  - `1.0.toString()`
  - `( 1 ).toString()`
  - `1 .toString()`

## 不精确的小数

### 概述

当我们使用 JavaScript 这门语言来操纵数值的时候，会遇到一些反常的现象，引发这些现象的根本原因是：JavaScript 无法精确的存储某些小数。

```js
/* 反常的现象 */
0.1 + 0.2 === 0.3; // false
```

### 原因

前文提到，JavaScript 使用二进制来存储数值，在理论上，二进制可以精确的存储所有整数，但是却不能精确的存储所有小数。比如，`0.5` 的二进制值为 `0.1`，`0.1` 的二进制值为 `0.000110011001100...`，这是一个循环节为 1100 的无限循环小数。

由于 JavaScript 只能使用有限的位数（11 位）来存储数值的小数部分，所以当它遇到类似于 `0.1` 这样的小数时，就会对其进行舍入，所以 JavaScript 中的 `0.1` 并不等于数学上的 `0.1`。这便是 JavaScript 无法精确存储某些小数的根本原因。

我们可以通过 `String.prototype.toFixed` 方法来查看小数的真实值，观察下述代码，你就会明白概述中的反常现象的成因了。

```js
0.1.toFixed( 20 ); // 0.10000000000000000555
0.2.toFixed( 20 ); // 0.20000000000000001110
0.3.toFixed( 20 ); // 0.29999999999999998890

( 0.1 + 0.2 ).toFixed( 20 ); // 0.30000000000000004441
```

### 解决

一个好用的解决方案是，如果两个数值的差值的小于某个阈值，那么我们就可以认为这两个数值时相等的，通常我们会取机器精度（`Number.EPSILON`）来作为这个阈值。下例就是实现：

```js
function numbersCloseEnoughToEqual( value_1, value_2 ) {
    
    return Math.abs( value_1 - value_2 ) < Number.EPSILON;
    
}
```

这个解决方案可以完美的解决我们在概述中遇到的反常现象。

```js
numbersCloseEnoughToEqual( 0.1 + 0.2, 0.3 ); // true
```

> `Number.EPSILON` 是 ECMAScript 2015 的特性，它的值是 `2^-52`。如果运行时缺少了 `Number.EPSILON`，那么你可以使用这个 Polyfill：
>
> ```js
> if ( !Number.EPSILON ) Number.EPSILON = Math.pow( 2, -52 );
> ```
