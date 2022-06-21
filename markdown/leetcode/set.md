---
typora-root-url: ..\..
---

# 集合

## 概述

集合是一种存储唯一值的数据结构，在数学上，一个包含数字 `1`、`2`、`3` 的集合是这样表示的 `{ 1, 2, 3 }`，另外，不包含任何元素的集合被称为空集，空集是这样表示的 `{}`。

幸运的是，JavaScript 已经实现了集合这一数据结构，在 JavaScript 中，创建集合的 API 就叫做 `Set`，它是 ECMAScript 2015 的特性，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 来了解它的使用方法。另外，JavaScript 还实现了一种特别的集合，名为 `WeakSet`，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 来了解它。

不过，在使用 JavaScript 自带的 `Set` API 之前，我们会先从头开始来实现一个集合，并命名为 `MySet`。

## 实现集合

我们将会实现一个名为 `MySet` 的集合，它将会拥有以下方法和属性。

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| `has( element )`    | 检查集合中是否存在 `element` 元素，然后返回一个代表其是否存在的布尔值 |
| `add( element )`    | 向集合添加一个 `element` 元素，然后返回更新后的集合          |
| `delete( element )` | 从集合中移除一个 `element` 元素，然后返回这个被移除的元素    |
| `toArray()`         | 按照元素的插入顺序来将元素存入一个数组，然后返回这个数组     |
| `clear()`           | 清空集合，然后返回更新后的集合                               |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 元素的数量 |

在开始实现 `MySet` 之前，我们需要选择一种基础的数据结构来存储集合中的元素，比如数组 `[]` 或对象 `{}` 。如果我们选用对象来存储集合中的元素，那么我们不仅可以轻松的实现出 `has`、`add`、`delete` 这 3 个方法，而且这 3 个方法的时间复杂度都将会是 `O(1)`，不过