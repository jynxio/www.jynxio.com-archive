# V8 Object

## 概述

本文将会描述 V8 实现 JavaScript 的 `Object` 的具体方式。

在 JavaScript 中，`Object` 是一种基本的数据类型，不过 C、C++、Java 等语言却没有这种数据类型，而 V8 正是由汇编与 C++ 编写的，所以我们需要了解

`Object` 是 JavaScript 的基本数据类型之一，它是典型的字典数据结构，比如 `{ a: 1 }`。

它是典型的字典，比如 `{a: 1}`。