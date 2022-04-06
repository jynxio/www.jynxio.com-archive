---
typora-root-url: ../../../blob 
---

# 数据类型与标准内置对象

## 数据类型

[ECMAScript](https://tc39.es/ecma262/) 规定了 8 种基本的数据类型，其中有 7 种是 **原始类型**，1 种是 **引用类型**。在这里，我们将对他们进行大体的介绍，在下一章中，我们将详细讨论它们。

下表罗列了所有的原始类型。

| 原始类型  | 示例                |
| --------- | ------------------- |
| Number    | `1`                 |
| String    | `""`                |
| Boolean   | `true`              |
| Null      | `null`              |
| Undefined | `undefined`         |
| Symbol    | `Symbol( "" )`      |
| BigInt    | `9007199254740991n` |

引用类型只有一种，那就是 `Object` 。

## 标准内置对象

> Excerpted from [**MDN Web Docs**](https://developer.mozilla.org/).

JavaScript 中有许多 **标准内置对象**，比如 **可索引的集合对象** 有：

- 基本对象
- 数字和日期对象
- 可索引的集合对象
  - `Array`
  - `Int8Array`
  - `Unit8Array`
  - ......
- ......

### Array

JavaScript 的 `Array` 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。下列任务列表罗列的 `Array.prototype.at` 方法在 PC 浏览器中的兼容性情况。

- [x] Chrome
- [x] Edge
- [x] FireFox
- [ ] Internet Explore
- [x] Opera
- [x] Safari

#### Array.prototype.splice

The `splice()` method changes the contents of an array by removing or replacing existing elements and/or adding new elements [in place](https://en.wikipedia.org/wiki/In-place_algorithm). To access part of an array without modifying it, see [slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).

##### Syntax

```js
splice( start );
splice( start, deleteCount );
splice( start, deleteCount, item1 );
splice( start, deleteCount, item1, item2, itemN );
```

###### Parameters

1. `start`

   The index at which to start changing the array.

   If greater than the length of the array, `start` will be set to the length of the array. In this case, no element will be deleted but the method will behave as an adding function, adding as many elements as items provided.

   If negative, it will begin that many elements from the end of the array. (In this case, the origin `-1`, meaning `-n` is the index of the `n`th last element, and is therefore equivalent to the index of `array.length - n`.) If `start` is `negative infinity`, it will begin from index `0`.

2. `deleteCount`(**Optional**)

   An integer indicating the number of elements in the array to remove from `start`.

   If `deleteCount` is omitted, or if its value is equal to or larger than `array.length - start` (that is, if it is equal to or greater than the number of elements left in the array, starting at `start`), then all the elements from `start` to the end of the array will be deleted. However, it must not be omitted if there is any `item1` parameter.

   If `deleteCount` is `0` or negative, no elements are removed. In this case, you should specify at least one new element (see below).

   1. 2.1
   2. 2.2
   3. 2.3
      1. 2.3.1
      2. 2.3.2
      3. 2.3.3

3. `item1, item2, ...`(**Optional**)

   The elements to add to the array, beginning from `start`.

   If you do not specify any elements, `splice()` will only remove elements from the array.

###### Return value

An array containing the deleted elements.

If only one element is removed, an array of one element is returned.

If no elements are removed, an empty array is returned.

##### Example

```js
/* 插入新元素"b" */
const array = [ "a", "c", "d" ];
const removed = array.splice( 1, 0, "b" )

console.log( removed ); // output: []
console.log( array );   // output: [ "a", "b", "c", "d" ]
```

![example](/static/image/example.png)

> Image from [simpledesktops](http://simpledesktops.com/).
