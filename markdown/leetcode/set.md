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

在实现 `MySet` 之前，我们还需要考虑应当使用哪一种数据结构来存储集合中的元素，本文最终选择了双向链表 `DoublyLinkedList` 来存储集合中的元素。`DoublyLinkedList` 是已经实现好的双向链表的类，你可以通过本博客的另一篇文章《链表》来了解它。

> 本文之所以没有选择 JavaScript 中的 `[]` 或 `{}` 来存储集合中的元素，是因为用它们来实现集合时都会碰到一些棘手的难题。

`MySet` 的实现代码如下。

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

