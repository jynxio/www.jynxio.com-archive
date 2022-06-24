---
typora-root-url: ..\..
---

# 字典

## 概述

字典是指用键值对来存储数据的数据结构，它又称为映射、符号表、关联数组，JavaScript 的普通对象 `{}` 就是字典。

> 字典不等于散列表，因为散列表只是字典的一种实现方式，而不是字典本身。字典还可以基于树和二维数组来实现，并且散列表不仅可以用来实现字典，还可以用来实现集合。可见，字典这一概念更侧重“外部的形式”，散列表这一概念更侧重“内部的实现”。简而言之，任何一种在形式上使用键值对来存储数据的数据结构都属于字典，而无论该数据结构的内部是通过何种方式来实现的。

## 实现

我们实现的字典将会拥有以下方法和属性。

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| `has( key )`        | 检查字典中是否存在键为 `key` 的键值对，然后返回一个代表其是否存在的布尔值 |
| `get( key )`        | 从字典中获取一个键为 `key` 的键值对的值                      |
| `set( key, value )` | 向字典添加一个键为 `key` 值为 `value` 的键值对（若已存在则修改该键值对），然后返回更新后的字典 |
| `delete( key )`     | 从字典中移除一个键为 `key` 的键值对，然后返回一个代表其是否移除成功的布尔值 |
| `toArray()`         | 按照键值对的插入顺序来将键值对以 `[key, value]` 的格式存入一个数组，然后返回这个数组 |
| `clear()`           | 清空字典，然后返回更新后的字典                               |

| 属性名 | 描述         |
| ------ | ------------ |
| `size` | 键值对的数量 |

在这里，我们选择使用双向链表 `DoublyLinkedList` 来存储字典中的键值对，`DoublyLinkedList` 是一个已经实现好的双向链表的类，你可以通过本博客的另一篇文章《链表》来了解它。

具体来说，我们会使用 2 个 `DoublyLinkedList` 来实现一个字典，其中一个用于存储键，另一个用于存储值，最后通过节点的序号来将两个双向链表关联在一起。

![双链表结构](/static/image/markdown/leetcode/dictionary/double-linked-list-structure.png)

不过，这样实现的字典的性能不高，比如它的 `has`、`get`、`set`、`delete`、`toArray` 方法的时间复杂度都是 `O(n)`，并且它也需要占用比较多的内存空间。

最后，它的实现代码如下。

```js
class Dictionary {

    #key_table;
    #value_table;

    /**
     * @returns { Object } - Dictionary实例。
     */
    constructor () {

        this.#key_table = new DoublyLinkedList();
        this.#value_table = new DoublyLinkedList();

    }

    /**
     * 检查字典中是否存在键为key的键值对，然后返回一个代表其是否存在的布尔值。
     * @param { * } element - 键。
     * @returns { boolean } - 若该集合中存在键为key的键值对，则返回true，否则返回false。
     */
    has ( key ) {

        return this.#key_table.getNodeByData( key ).success;

    }

    /**
     * 从字典中获取一个键为key的键值对的值。
     * @param { * } key - 键。
     * @returns { * } - 键对应的值。
     */
    get ( key ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( ! has_key ) return;

        return this.#value_table.getNodeByIndex( index ).data.data;

    }

    /**
     * 向字典添加一个键为key值为value的键值对（若已存在则修改该键值对），然后返回更新后的字典。
     * @param { * } key - 键。
     * @param { * } value - 值。
     * @returns { Object } - 更新后的字典。
     */
    set ( key, value ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( has_key ) {

            this.#value_table.getNodeByIndex( index ).data.data = value;

            return this;

        }

        this.#key_table.push( key );
        this.#value_table.push( value );

        return this;

    }

    /**
     * 从字典中移除一个键为key的键值对，然后返回一个代表其是否移除成功的布尔值。
     * @param { * } key - 键。
     * @returns { boolean } - 若移除成功，则返回true，否则返回false。
     */
    delete ( key ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( ! has_key ) return false;

        this.#key_table.remove( index );
        this.#value_table.remove( index );

        return true;

    }

    /**
     * 按照键值对的插入顺序来将键值对以[key, value]的格式存入一个数组，然后返回这个数组。
     * @returns { Array } - 以[key, value]的格式来存储字典键值对的数组。
     */
    toArray () {

        const key_array = this.#key_table.toArray().data;
        const value_array = this.#value_table.toArray().data;

        return key_array.map( ( key, index ) => [ key, value_array[ index ] ] );

    }

    /**
     * 清空字典，然后返回更新后的字典。
     * @returns { Object } - 更新后的字典。
     */
    clear () {

        this.#key_table.clear();
        this.#value_table.clear();

        return this;

    }

    get size () {

        return this.#key_table.size;

    }

}
```

## Map API

JavaScript 中有 2 种内建的字典，一种是普通对象 `{}`，另一种是 `Map`，其中 `Map` 来源于 ECMAScript 2015，它是一种比普通对象更强大的字典，比如可以使用任意数据类型作为键，可以按照键值对的插入顺序来迭代，拥有更高的增删性能等，如果你想进一步了解 `Map`，那么你可以阅读 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 。

另外，JavaScript 还实现了一种特别的字典，名为 `WeakMap`，你可以通过 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 来了解它。

> V8 团队在 [这篇文章](https://v8.dev/blog/hash-code) 中表示 `Set`、`Map`、`WeakSet`、`WeakMap` 的底层都使用了散列表，但是 `Map` 的 [ECMAScript 规范](https://tc39.es/ecma262/#sec-map-objects) 却表示 `Map` 的多种方法都是通过遍历来实现的，比如 `Map.prototype.get` 方法的实现逻辑就是通过遍历每个键来找到相应的值，规范原文如下。
>
> ```
> 1. Let M be the this value.
> 2. Perform ? RequireInternalSlot(M, [[MapData]]).
> 3. Let entries be the List that is M.[[MapData]].
> 4. For each Record { [[Key]], [[Value]] } p of entries, do
> a. If p.[[Key]] is not empty and SameValueZero(p.[[Key]], key) is true, return p.[[Value]].
> 5. Return undefined.
> ```
>
> 另外，`Map.prototype.has`、`Map.prototype.set`、`Map.prototype.delete` 等方法也是使用遍历来实现的。那么，`Map` 等 API 究竟是如何实现的呢？

