# V8 Object

## 概述

`Object` 是 JavaScript 的基本数据类型之一，本文将会描述 `Object` 在 V8 中的实现细节。

TODO

## 调试

V8 引擎



在正式开始介绍 `Object` 的实现细节之前，我想先向你介绍一个有用的 node.js 特性，我们将会使用这个特性来观察 JavaScript 的值的内部信息，这有助于我们了解 V8 是如何实现 `Object` 的。

具体来说，让我们在 node.js 运行时（比如 terminal）中键入 `node --allow-natives-syntax` 命令，

```
node --allow-natices-syntax       // your input
Welcome to Node.js v16.13.1.      // system's output
Type ".help" for more information // system's output
> %DebugPrint( { a: 1 } );        // your input
some information...               // system's output
some information...               // system's output
some information...               // system's output
{ a: 1 }                          // system's output
```

