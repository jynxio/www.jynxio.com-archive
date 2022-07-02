# V8 Object

## 概述

`Object` 是 JavaScript 的基本数据类型之一，本文将会描述 V8 引擎实现 `Object` 的具体细节。

TODO

## 调试

在 node.js 运行时中，我们可以通过键入 `node --allow-natives-syntax` 命令来激活一个特性，激活该特性后，我们就可以通过键入 `%DebugPrint( x )` 命令来查看 `x` 的内部信息，我们可以通过观察这些内部信息来了解 V8 是如何实现 `x` 的。

现在，让我们在 terminal 中键入如下命令，来看看这项特性是如何使用的。

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

