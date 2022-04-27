# Number

## 概述

`number` 是基于 IEEE-754 标准的双精度 64 位二进制格式的值，可以安全的存储 `[ -2^53+1, 2^53-1 ]` 范围的值，显然 ECMAScript 中没有整数的数字类型，只有浮点数。除了常规的数字， ECMAScript 还包括一些特殊数值，具体是： `Infinity` 、 `-Infinity` 、 `NaN` 。

## 极值

浮点数的最大值是 `Number.MAX_VALUE` ，约为 `1.798e+308` ，最小值是 `Number.MIN_VALUE` ， 约为 `5e-324` ，注意最小浮点数并不等于 `0` ，而是无限接近于 `0` 。

整数的最大值是 `Number.MAX_SAFE_INTEGER` ，即 `2^53-1` 或 `9007199254740991` ，最小值是 `Number.MIN_SAFE_INTEGER` ，即 `-2^53-1` 或 `-9007199254740991` 。

## NaN

ECMAScript 中还包括一些特殊的数值，分别是： `Infinity` 、 `-Infinity` 、 `NaN` 。

`NaN` 是英文 not a number 的缩写，它代表计算错误。当数学运算不正确时，表达式便会返回该值，若数学表达式内有 `NaN`，则该表达式的返回值必然是 `NaN`，唯一的例外是：`NaN ** 0` 为 `1`。

此外， `NaN` 是 ECMAScript 中唯一一个自己不等于自己的值，比如：

```js
NaN ==  NaN; // false
NaN === NaN; // false
```

`Number.isNaN( value )` 方法可以鉴定 `NaN`，当该方法不可用时，你可以使用下述的 `Polyfill`：

```js
if ( ! Number.isNaN ) Number.isNaN = function( v ) { return v !== v };
```

另外，浏览器运行时也提供了一个名为 `window.isNaN( value )` 的方法来鉴定 `NaN`，但是实际上该 API 并不可靠，因为当入参为`NaN`、`undefined`、`非空非数字字符串`、`函数`、`对象` 时，它都会返回 `true`。

## Infinity

`Infinity` 代表数学中的无穷大 ∞ ，`-Infinity` 代表数学中的无穷小，`-Infinity` 是表达式 `- 1 * Infinity` 的执行结果而不是一个独立的值。当数值超出存储极限后，数值就会被就近的舍入为 `Number.MAX_VALUE` 或 `Infinity` ，比如：

```js
Number.MAX_VALUE + Math.pow( 2, 969 ); // Number.MAX_VALUE
Number.MAX_VALUE + Math.pow( 2, 970 ); // Infinity
```

## 数字分隔符

[Numeric Separators](https://github.com/tc39/proposal-numeric-separator) 是一个用于增强数字可读性的语法糖特性，该特性于 2021 年发布，由于该特性在移动端的支持度不明，所以最好为其应用 babel。

```javascript
1_000_000_000_000;     /* equal to */ 1000000000000;
1_000_000_000_000n;    /* equal to */ 1000000000000n;
0b1010_0001_1000_0101; /* equal to */ 0b1010000110000101;
0xa0_b0_c0;            /* equal to */ 0xa0b0c0;
```

## 小数不精确问题

ECMAScript 使用二进制来存储数字，虽然二进制可以准确的表示所有整数，但不能准确的表示所有小数，比如 `0.5` 的二进制值是 `0.1` ，但是 `0.1` 的二进制值是 `0.000110011001100...` ，这是一个循环节为 1100 的无限循环小数。

IEEE 754 使用 64 位的二进制来表示一个数值，其中 52 位用于存储整数， 11 位用于存储小数， 1 位用于存储符号，当遇到无限小数的二进制值时， IEEE 754 会进行四舍五入，这就是 ECMAScript 无法准确表示某些小数的原因，这具体会带来什么影响呢？比如：

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

