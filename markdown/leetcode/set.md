---
typora-root-url: ..\..
---

# 集合

## 概述

集合是一种存储唯一值的数据结构，在数学上，一个包含数字 `1`、`2`、`3` 的集合是这样表示的 `{ 1, 2, 3 }`，另外，不包含任何元素的集合被称为空集，空集是这样表示的 `{}`。在本文中，我们会从头开始来实现一个集合，并命名为 `MySet`。

## 实现

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

集合运算是指“针对集合的运算”，具体来说，集合运算包括并集、交集、差集、子集，它们的定义如图所示。

![集合运算](/static/image/markdown/leetcode/set/set-operation.png)

我们会在 `MySet` 的基础上以纯函数的形式来继续实现这 4 个方法，纯函数是指没有副作用的函数，具体来说，纯函数不会修改调用者与入参，只会生成一个新的结果。

### 并集

```js
class MySet {

	// ...

    /**
     * 返回一个新的MySet实例，它代表调用者和入参的并集，该方法不会改变调用者和入参。
     * @param { Object } another_set - MySet实例。
     * @returns { Object } - 新的MySet实例，它代表调用者和入参的并集。
     */
    merge ( another_set ) {

        const set = new MySet();

        this.toArray().forEach( element => set.add( element ) );
        another_set.toArray().forEach( element => set.add( element ) );

        return set;

    }

}
```

### 交集

```js
class MySet {

    // ...

    /**
     * 返回一个新的MySet实例，它代表调用者和入参的交集，该方法不会改变调用者和入参。
     * @param { Object } another_set - MySet实例。
     * @returns { Object } - 新的MySet实例，它代表调用者和入参的交集。
     */
    intersect ( another_set ) {

        const set = new MySet();

        this.toArray().forEach( element => another_set.has( element ) && set.add( element ) );

        return set;

    }

}
```

### 差集

```js
class MySet {

    // ...

    /**
     * 返回一个新的MySet实例，它代表调用者和入参的差集（其元素只属于调用者且不属于入参），该方法不会改变调用者和入参。
     * @param { Object } another_set - MySet实例。
     * @returns { Object } - 新的MySet实例，它代表调用者和入参的差集。
     */
    differ ( another_set ) {

        const set = new MySet();

        this.toArray().forEach( element => another_set.has( element ) || set.add( element ) );

        return set;

    }

}
```

### 子集

```js
class MySet {

	// ...

    /**
     * 返回一个布尔值，代表调用者是否是入参的子集。
     * @param { Object } another_set - MySet实例。
     * @returns { boolean } - 若调用者是入参的子集，则返回true，否则返回false。
     */
    isSubsetOf ( another_set ) {

        if ( this.size > another_set.size ) return false;

        return this.toArray().every( element => {

            if ( another_set.has( element ) ) return true;

            return false;

        } );

    }

}
```

## Set API

其实，JavaScript 早已在语言层面上实现了集合这一数据结构，对应的 API 就叫做 `Set`，它是来自于 ECMAScript 2015 的特性。比如，我们可以通过 `new Set()` 来创建一个集合、通过 `add` 方法来向集合添加元素、通过 `delete` 方法来从集合中移除元素等等，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 来了解它的使用方法。

`Set` 与 `MySet` 的区别在于前者的性能要快的多，不过前者并未实现集合运算。另外，JavaScript 还实现了一种特别的集合，名为 `WeakSet`，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 来了解它。

## 多重集

集合内的每个元素都是唯一的，不过，在数学中，有一个叫做多重集（multiset，又称袋）的概念，它允许我们向集合中插入已有的元素。多重集可用于统计集合中的元素的出现次数。