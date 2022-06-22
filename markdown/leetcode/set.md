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
| `delete( element )` | 从集合中移除一个 `element` 元素，然后返回一个代表其是否移除成功的布尔值 |
| `toArray()`         | 按照元素的插入顺序来将元素存入一个数组，然后返回这个数组     |
| `clear()`           | 清空集合，然后返回更新后的集合                               |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 元素的数量 |

在实现 `MySet` 之前，我们还需要考虑应当使用哪一种数据结构来存储集合中的元素，比如数组、普通对象（`{}`）、栈、队列、链表等，本文最终选择使用双向链表 `DoublyLinkedList` 来存储集合中的元素，`DoublyLinkedList` 是一个已经实现好的双向链表的类，你可以通过本博客的另一篇文章《链表》来了解它。

> 本文之所以没有选择 JavaScript 中的 `[]` 或 `{}` 来存储集合中的元素，是因为用它们来实现集合时都会碰到一些棘手的问题，比如如果使用数组来存储集合中的元素，那么在删除元素的时候就会需要重排数组的其它元素的序号，如果使用对象来存储集合中的元素，那么就会难以存储除了 `String` 和 `Symbol` 之外的其它数据类型。

使用 `DoublyLinkedList` 的好处之一是它可以显著的简化 `MySet` 的实现逻辑，另一个好处是这个 `MySet` 可以处理 JavaScript 中的所有类型的数据，不仅仅是 `String` 和 `Symbol`，还包括 `Number`、`Boolean`、`Undefined`、`Null`、`BigInt`、`Object`。不过，这个 `MySet` 的 `has`、`add`、`remove`、`toArray` 方法的性能都不高，具体来说，这 4 个方法的时间复杂度都是 `O(n)`。

最后，`MySet` 的实现代码如下。

```js
class MySet {

    #elements;

    /**
     * @returns { Object } - MySet实例。
     */
    constructor () {

        this.#elements = new DoublyLinkedList();

    }

    /**
     * 检查集合中是否存在element元素，然后返回一个代表其是否存在的布尔值。
     * @param { * } element - 待检查的元素。
     * @returns { boolean } - 若该集合中存在element元素，则返回true，否则返回false。
     */
    has ( element ) {

        return this.#elements.getNodeByData( element ).success;

    }

    /**
     * 向集合添加一个element元素，然后返回更新后的集合。
     * @param { * } element - 待添加的元素。
     * @returns { Object } - 更新后的MySet实例。
     */
    add ( element ) {

        const is_has = this.has( element );

        if ( is_has ) return this;

        this.#elements.push( element );

        return this;

    }

    /**
     * 从集合中移除一个element元素，然后返回一个代表其是否移除成功的布尔值。
     * @param { * } element - 待移除的元素。
     * @returns { boolean } - 若该集合中存在element元素，则会移除该元素并返回true代表移除成功，若该集合中不存在element元素，则直接返回fasle代表移除失败
     */
    delete ( element ) {

        const response = this.#elements.getIndexByData( element );

        if ( ! response.success ) return false;

        this.#elements.remove( response.data );

        return true;

    }

    /**
     * 按照元素的插入顺序来将元素存入一个数组，然后返回这个数组。
     * @returns { Array } - 元素数组。
     */
    toArray () {

        return this.#elements.toArray().data;

    }

    /**
     * 清空集合，然后返回更新后的集合。
     * @returns { Object } - 更新后的MySet实例。
     */
    clear () {

        this.#elements.clear();

        return this;

    }

    get size () {

        return this.#elements.size;

    }

}
```

## 实现集合运算

集合运算是指“针对集合的运算”，具体来说，集合运算包括并集、交集、差集、子集。在这里，我们会在 `MySet` 的基础上继续实现这 4 个方法。

![集合运算](/static/image/markdown/leetcode/set/set-operation.png)

### 并集