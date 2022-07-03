# JavaScript 的对象在 V8 中的实现

## 概述

本文将会描述 V8 引擎是如何实现 JavaScript 的对象的，不过，在正式开始之前，我们需要先了解一下对象是什么。

JavaScript 的对象是指 `Object` 类型的值，它采用键值对来存储数据，比如 `{a: 1}`，显然，它是典型的字典（一种数据结构）。



在开始了解 V8 引擎是如何实现 JavaScript 的 Object 之前，让我们先来了解一下这个 Object。

JavaScript 的 Object 是一个典型的字典，它采用键值对来存储数据，其中 Object 的键只能是 `String` 类型或 `Symbol` 类型的值。具体来说，如果你使用 `Symbol` 类型的值来作为键，那么这个键就是原来那个 `Symbol` 类型的值，如果你使用一个非 `Symbol` 且非 `String` 类型的值来作为键，那么这个键就会被隐式转换为 `String` 类型的值。

Object 是 JavaScript 的基本数据类型之一，本文将会描述 Object 在 V8 引擎中的实现细节。

## 版本

标注当前文章所使用的 V8 引擎的版本。

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





## 参考资料

- [阅读V8（一）：V8底层如何实现JSArray](https://zhuanlan.zhihu.com/p/192468212)
- [（更新）从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
- [从Chrome源码看JS Array的实现](https://zhuanlan.zhihu.com/p/26388217)
- [Fast properties in V8](https://v8.dev/blog/fast-properties)
- [Elements kinds in V8](https://v8.dev/blog/elements-kinds)
- [[V8 Deep Dives] Understanding Array Internals](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)