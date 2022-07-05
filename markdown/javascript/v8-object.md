---
typora-root-url: ..\..
---

# JavaScript 对象在 V8 中的实现

## 概述

本文将会描述 V8 引擎实现 JavaScript 对象的原理，其中 JavaScript 对象是指 `Object` 类型的值，它是 JavaScript 的八种基本数据类型之一，它采用键值对来存储数据，比如 `{a: 1}`，显然，它是典型的字典。

另外，JavaScript 对象的键只能使用 `String` 或 `Symbol` 类型的值，如果你使用了一个非 `String` 且非 `Symbol` 类型的值来作为对象的键，那么这个值会先被隐式的转换为 `String` 类型的值，然后再用这个转换后的值来作为键。

> 不过，JavaScript 内建的 `Map` 和 `WeakMap` 允许使用任意类型的值来作为键。

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

JavaScript 对象拥有两类属性，一类是命名属性（Named properties），一类是数组索引属性（Array-indexed properties）。不过 V8 官方将命名属性称为 Properties，将数组索引属性称为 Elements，本文会沿用 V8 官方的叫法，因为这种叫法更加简洁。

V8 主要是用 C++ 来编写的，它会创建一个定长数组来存储 JavaScript 对象，不过 V8 不会将对象的 Properties 和 Elements 直接存储在这个对象上，而是将它们分别存储在另外两个独立的数据结构中，然后令该数组的第二个元素指向存储 Properties 的数据结构，令该数组的第三个元素指向存储 Elements 的数据结构。

![Properties和Elements](/static/image/markdown/javascript/properties-and-elements.png)

其实，V8 也会将一小部分的 Properties 存储在存储 JavaScript 对象的数组上，下文揭示了更多的相关细节。

### Properties

Properties 的准确名称是 Named properties，翻译为命名属性，是指使用除了正整数字符串之外的其他字符串来作为键的属性，比如 `"a"`、`"b"` 等，另外，使用 `Symbol` 类型的值来作为键的属性也 Properties。

V8 会使用一个独立的数组或字典来存储 Properties。另外，存储 JavaScript 对象的数组本身也能存储一部分的 Properties，这些 Properties 被称为 In-object properties。

#### In-object properties

V8 使用数组来存储 JavaScript 对象，这个数组在创建之初就会预留一定的空间来存储 Properties，这些被直接存储在该数组上的 Properties 就被称为 In-object properties。不过，In-object properties 的数量是很有限的，如果我们想要存储的 Properties 的数量超出了 In-object properties 的容限，那么超出的部分就只能存储到另一个独立的数据结构中去，我们将超出的部分称为 Normal properties。显然，相比于 Elements 和 Normal properties，In-object properties 的访问速度要更快的。

如果我们经常使用一些仅仅只有几个命名属性的小型对象，那么这些小型对象的属性访问效率将会很高，因为这些小型对象的命名属性都被 V8 当作 In-object properties 来处理了，这正是 V8 设计 In-object properties 的原因。

#### Normal properties



### Elements

Elements 的准确名称是 Array-indexed properties，翻译为数组索引属性，是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于 Properties 而不是 Elements。

因为数组只使用正整数来作为元素的索引，所以该类属性才被称为数组索引属性，而不是索引属性。

## 参考

- [阅读V8（一）：V8底层如何实现JSArray](https://zhuanlan.zhihu.com/p/192468212)
- [（更新）从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
- [从Chrome源码看JS Array的实现](https://zhuanlan.zhihu.com/p/26388217)
- [Fast properties in V8](https://v8.dev/blog/fast-properties)
- [Elements kinds in V8](https://v8.dev/blog/elements-kinds)
- [[V8 Deep Dives] Understanding Array Internals](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)