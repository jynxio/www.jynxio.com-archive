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

## 数字分隔符

数字分隔符是 ECMAScript 2021 的语法糖特性，该特性允许我们为数值字面量添加下划线，这可以增强数值的可读性。

```js
1_000_000_000_000 === 1000000000000;          // true
1_000_000_000_000n === 1000000000000n;        // true
0b1010_0001_1000_0101 === 0b1010000110000101; // true
0xa0_b0_c0 === 0xa0b0c0;                      // true
```

由于该特性在移动端的 [支持度](https://caniuse.com/?search=numeric%20separator) 不详，因此请总是为其应用 babel。最后，你可以通过 [这篇文章](https://github.com/tc39/proposal-numeric-separator)  来了解更多细节。

## 不精确的小数



JavaScript 使用二进制来存储数字，虽然二进制可以准确的表示所有整数，但不能准确的表示所有小数，比如 `0.5` 的二进制值是 `0.1` ，但是 `0.1` 的二进制值是 `0.000110011001100...` ，这是一个循环节为 1100 的无限循环小数。

IEEE 754 使用 64 位的二进制来表示一个数值，其中 52 位用于存储整数， 11 位用于存储小数， 1 位用于存储符号，当遇到无限小数的二进制值时， IEEE 754 会进行四舍五入，这就是 JavaScript 无法准确表示某些小数的原因，这具体会带来什么影响呢？比如：

```js
0.1 + 0.2 === 0.3; // false
```

它的成因是：

```js
0.1.toFixed( 20 );           // 0.10000000000000000555
0.2.toFixed( 20 );           // 0.20000000000000001110
0.3.toFixed( 20 );           // 0.29999999999999998890
( 0.1 + 0.2 ).toFixed( 20 ); // 0.30000000000000004441
```

解决方案是：若两个数的差值的绝对值小于某个阈值，则认为这两个数是相等的，通常我们取 `Number.EPSILON`（机器精度）来作为这个阈值。下例是一个鉴定两数是否相等的函数：

```js
function numbersCloseEnoughToEqual( v_1, v_2 ) {
	return Math.abs( v_1 - v_2 ) < Number.EPSILON;
}

numbersCloseEnoughToEqual( 0.1 + 0.2, 0.3 ); // true
```

`Number.EPSILON` 的值是 `2^-52` ，这是它的 polyfill：

```js
if ( !Number.EPSILON ) Number.EPSILON = Math.pow( 2, -52 );
```

## 进制

JavaScript 默认使用十进制，此外它还支持二进制、八进制、十六进制和其他进制，我们需要为数字值添加特殊的前缀标识才能激活这些进制，二进制的前缀是 `0b`，八进制的前缀是`0o`，十六进制的前缀是`0x`。此外，八进制还有一种淘汰了的以 `0` 为前缀的写法，严格模式禁止该写法。

```js
0b10; // 二进制
0xf0; // 十六进制

0o70; // 八进制
070;  // 淘汰的八进制写法
```

若你想用其他的进制，则需使用 `Number.prototype.toString( [ radix ] )` 方法，该方法可以将数字转换为指定进制的数字字符串，其中 `radix` 属于 `[2, 36]` 且缺省值为 `10`。比如这是一个三进制的例子：

```js
3..toString( 3 ); // "10"
```

## 字面量与原型方法

数字字面量可以直接调用 `Number.prototype` 上的方法：

- 若字面量带有小数点，比如 `0.1`，则可以直接调用原型方法，比如 `0.1.toString()`
- 若字面量是指数，比如 `2e5`，则可以直接调用原型方法，比如 `2e5.toString()`
- 若字面量是整数，比如 `1`，则遵循下述格式才能调用原型方法：
  - `1..toString()`
  - `1.0.toString()`
  - `( 1 ).toString()`
  - `1 .toString()`

