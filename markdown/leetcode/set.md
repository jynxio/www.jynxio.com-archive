---
typora-root-url: ..\..
---

# 集合

集合是一种存储唯一值的数据结构，在数学上，一个包含数字 `1`、`2`、`3` 的集合是这样表示的 `{ 1, 2, 3 }`，另外，不包含任何元素的集合被称为空集，空集是这样表示的 `{}`。

幸运的是，JavaScript 已经实现了集合这一数据结构，在 JavaScript 中，创建集合的 API 就叫做 `Set`，它是 ECMAScript 2015 的特性，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 来了解它的使用方法。另外，JavaScript 还实现了一种特别的集合，称之为 `WeakSet`，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 来了解它。

不过，本文会先从头开始实现一个集合类，之后再使用 JavaScript 原生的 `Set` API。