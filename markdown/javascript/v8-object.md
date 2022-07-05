# JavaScript 对象在 V8 中的实现

## 概述

本文将会描述 V8 引擎实现 JavaScript 对象的原理，其中 JavaScript 对象是指 `Object` 类型的值，它是 JavaScript 的八种基本数据类型之一，它采用键值对来存储数据，比如 `{a: 1}`，显然，它是典型的字典。

## 版本

本文采用了 16.13.1 版本的 Node.js 来作为测试环境，该版本的 Node.js 所使用的 V8 的版本是  9.4.146.24。

## 调试

在 V8 引擎中，有一些内建的函数可以帮助开发者进行 debug，其中有一个名为 `%DebugPrint` 的函数可以帮助开发者观察 JavaScript 值的内部信息。不过，在使用 `%DebugPrint` 之类的内建函数之前，我们必须先执行 `--allow-natives-syntax` 命令。

具体来说，在 Node 运行时中，我们可以通过如下做法来调用 `%DebugPrint` 函数，并让其打印字面量 `{a: 1}` 的内部信息。

```
node --allow-natices-syntax       // input
Welcome to Node.js v16.13.1.      // output
Type ".help" for more information // output
> %DebugPrint( { a: 1 } );        // input
internal information...           // output
internal information...           // output
internal information...           // output
{ a: 1 }                          // output
```

> 我们不仅可以在 Node 运行时中使用 V8 引擎的内建函数，也能在 Chromium 中使用这些内建函数，因为这些运行时都使用了 V8 引擎。

## 实现

JavaScript 对象拥有两类属性，一类是数组索引属性，另一类是命名属性。数组索引属性是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。命名属性是指使用除了正整数字符串之外的其他字符串来作为键的属性，比如 `"a"`、`"b"` 等，另外，使用 `Symbol` 类型的值来作为键的属性也是命名属性。

需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于命名属性。

> V8 官方将数组索引属性称为 array index property，将命名属性称为 name property。另外，V8 官方更喜欢使用 element 来指代 array index property，不过本文更喜欢使用 array index property，因为这个名称更加贴切。

另外，JavaScript 对象的键只能使用 `String` 或 `Symbol` 类型的值，如果你使用了一个非 `String` 且非 `Symbol` 类型的值来作为对象的键，那么这个值会先被隐式的转换为 `String` 类型的值，然后再用这个转换后的值来作为键。

> 不过，JavaScript 内建的 `Map` 和 `WeakMap` 允许使用任意类型的值来作为键。

V8 引擎使用了不同的方式来实现命名属性和数组索引属性。

### 命名属性的实现

### 数组索引属性的实现

## 参考

- [阅读V8（一）：V8底层如何实现JSArray](https://zhuanlan.zhihu.com/p/192468212)
- [（更新）从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
- [从Chrome源码看JS Array的实现](https://zhuanlan.zhihu.com/p/26388217)
- [Fast properties in V8](https://v8.dev/blog/fast-properties)
- [Elements kinds in V8](https://v8.dev/blog/elements-kinds)
- [[V8 Deep Dives] Understanding Array Internals](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)