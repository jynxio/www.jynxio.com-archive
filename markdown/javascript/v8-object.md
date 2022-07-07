---
typora-root-url: ..\..
---

# JavaScript 对象在 V8 中的实现

## 概述

本文将会描述 V8 引擎是如何实现 JavaScript 对象的。

## 对象

JavaScript 中的对象和面向对象语言中的对象是不一样的，在 JavaScript 中，对象是一种字典类型的数据结构，比如 `{a: 1}`。其中，对象的键只能使用 `String` 或 `Symbol` 类型的值，对象的值则可以使用任意的数据类型。

> 在 JavaScript 中有 2 个特别的内建对象，分别是 `Map` 和 `WeakMap`，它们都同样是字典类型的数据结构，其中，`Map` 可以使用任意数据类型来作为键，`WeakMap` 则只能使用对象来作为键。

另外，如果我们遍历对象的属性，那么就会先按照索引值的升序顺序来输出对象的数组索引属性，然后再按照属性创建的先后顺序来输出其他属性，这是根据 ECMAScript 规范的要求来设计的。

```js
const obj = {};

obj[ "2" ] = "";
obj[ "1" ] = "";
obj[ "0" ] = "";
obj[ "a" ] = "";
obj[ "b" ] = "";
obj[ "c" ] = "";

for ( let key in obj ) console.log( key );
// 0 1 2 a b c
```



## 版本

本文采用了 16.13.1 版本的 Node.js 来作为测试环境，该版本的 Node.js 所使用的 V8 的版本是  9.4.146.24。

## 调试

在 V8 引擎中，有一些内建的函数可以帮助开发者进行 debug，其中有一个名为 `%DebugPrint` 的函数可以帮助开发者观察 JavaScript 值的内部信息。不过，在使用 `%DebugPrint` 之类的内建函数之前，我们必须先执行 `--allow-natives-syntax` 命令。

具体来说，在 Node 运行时中，我们可以通过如下做法来调用 `%DebugPrint` 函数，并让其打印字面量 `{a: 1}` 的内部信息。

```
node --allow-natices-syntax       // input
Welcome to Node.js v16.13.1.      // output
Type ".help" for more information // output
> %DebugPrint( { a: 1 } );        // input
internal information...           // output
internal information...           // output
internal information...           // output
{ a: 1 }                          // output
```

> 我们不仅可以在 Node 运行时中使用 V8 引擎的内建函数，也能在 Chromium 中使用这些内建函数，因为这些运行时都使用了 V8 引擎。

## 实现

JavaScript 对象拥有两类属性，一类是命名属性（named properties），一类是数组索引属性（array-indexed properties）。不过 V8 官方将命名属性简称为 properties，将数组索引属性简称为 elements，本文会沿用 V8 官方的叫法，因为这种叫法更加简洁。

V8 引擎是使用 C++ 来编写的，同时还使用到了 JavaScript 和汇编，不过在 C++ 中，并没有一种像 JavaScript 对象一样的 API，所以 V8 团队需要亲自实现 JavaScript 对象。

具体来说，V8 引擎会创建一个定长数组来存储 JavaScript 对象，为方便起见，本文会将该数组称为 JavaScript 对象数组。不过 V8 引擎并不会直接将 properties 和 elements 直接存储在这个 JavaScript 对象数组上，而是将它们分别存储在另外两个独立的数据结构中，然后令 JavaScript 对象数组的第二个元素指向存储 properties 的数据结构，令 JavaScript 对象数组的第三个元素指向存储 elements 的数据结构，正如下图所示。

![Properties和Elements](/static/image/markdown/javascript/properties-and-elements.png)

下文将会详细描述 V8 引擎是如何存储 properties 和 elements 的。

### properties

properties 的准确名称是 named properties，译为命名属性，是指使用除了正整数字符串之外的其他字符串来作为键的属性，比如 `{ a: 1 }` 等，另外，使用 `Symbol` 类型的值来作为键的属性也属于 properties。

#### in-object properties

首先，V8 引擎在创建 JavaScript 对象数组的时候，就会在该数组上预留一些空间来存储 properties，而这些被直接存储在 JavaScript 对象数组上的 properties 就被称为 in-object properties。

JavaScript 对象数组的 in-object properties 容量取决于你创建 JavaScript 对象的方式，并且这个容量是不可改变的。而超出容量的 properties 将会被存储在另一个独立的数据结构中，这个数据结构的内存地址将会被存储在 JavaScript 对象数组的第二个元素上。V8 将这些存储在独立的数据结构中的 properties 称为 normal properties。

![In-object properties](/static/image/markdown/javascript/in-object-and-normal-properties.png)

比如，以字面量赋值的形式来创建具有 3 个命名属性的对象，那么这个对象的 in-object properties 容量就是 3，后续增加的命名属性都将会被存储在另一个独立的数据结构中，即作为 normal properties 来处理。

```
> node --allow-natives-syntax
> const obj = { a: 1, b: 1, c: 1 };
> %DebugPrint( obj );
> obj.d = 1;
> %DebugPrint( obj );
```

第一次 `%DebugPrint( obj )` 的输出如下，此时，`obj` 的 in-object properties 容量为 3，`a`、`b`、`c` 属性都被当作 in-object properties 来处理，负责存储 normal properties 的 `FixedArray` 的长度为 0，这代表着 obj 中没有任何 normal properties。

![In-object properties的容量](/static/image/markdown/javascript/in-object-properties-capacity-1.png)

第二次 `%DebugPrint( obj )` 的输出如下，此时，obj 的 in-object properties 容量仍然为 3，`a`、`b`、`c` 属性仍然被当作 in-object properties 来处理，后续新增的 `d` 属性则被当作 normal properties 来处理，负责存储 normal properties 的 `PropertyArray` 的长度为 3。

![In-object properties的容量](/static/image/markdown/javascript/in-object-properties-capacity-2.png)

另外，in-object properties 的访问速度要比 normal properties 和 elements 的访问速度更快，因为如果 V8 引擎想要找到某个 in-object properties，那么 V8 引擎可以直接在 JavaScript 对象数组上找到，而如果 V8 引擎想要找到某个 normal properties 或 elements，那么 V8 引擎需要先在 JavaScript 对象数组上找到存储 normal properties 或 elements 的地址，然后再在这个地址中继续寻找目标属性。

最后，试想一下，如果我们经常采用字面量赋值的方式来创建仅仅拥有几个命名属性的小型对象，那么这些小型对象的属性访问效率将会很高，因为这些小型对象的命名属性都被当作 in-object properties 来处理了，这正是 V8 引擎设计 in-object properties 的原因。

#### normal properties

normal properties 是指存储在独立的数据结构中的 properties，即非 in-object properties 的 properties。

V8 引擎会使用数组或字典中的其中一种来存储 normal properties。具体来说，V8 引擎要么会使用 `FixedArray` 和 `PropertyArray` 等类来存储 normal properties，要么会使用 `NameDictionary` 等类来存储 normal properties。其中 `FixedArray` 和 `PropertyArray` 是由 V8 引擎自己实现的数组，`NameDictionary` 是由 V8 引擎自己实现的字典，并且该字典是基于散列表来实现的。

如果 V8 引擎使用 `FixedArray` 或 `PropertyArray` 等数组数据结构来存储 normal properties，那么 V8 官方就会将这些 normal properties 称呼为 fast properties，如果 V8 引擎使用 `NameDictionary` 等字典数据结构来存储 normal properties，那么 V8 官方就会将这些 normal properties 称呼为 slow properties。因为数组的数据访问速度比字典的数据访问速度更快，所以 V8 官方将前者称呼为 fast properties，并将后者称呼为 slow properties。

> V8 引擎可以通过索引来直接访问数组中的数据，但是如果 V8 想要访问字典（基于散列表）中的数据，那么 V8 引擎就需要先通过哈希计算来算出目标数据的地址，然后再根据这个地址来访问到目标数据。所以数组的数据访问速度比字典的数据访问速度更快。
>
> 具体来说，使用散列表来实现字典的大致原理是通过哈希函数来将字典的键转换为一个唯一的内存地址，然后将相应的值存储在该地址中，如果需要访问字典的某个属性，那么就要通过哈希函数来计算出该属性的键所对应的内存地址，然后在这个地址中找到相应的值。因为要进行哈希计算，所以字典（基于散列表）的数据访问速度没有数组的数据访问速度快。

#### HiddenClass

JavaScript 对象数组的第一个元素名为 HiddenClass，HiddenClass 存储了一些关于 JavaScript 对象的信息，比如 JavaScript 对象的属性数量、原型等。

另外，如果 V8 引擎使用 `FixedArray` 来存储 normal properties，那么就会衍生出一个额外的问题，具体来说，在 JavaScript 层面，因为对象是一个字典，所以我们会通过键来访问属性，而在

### elements

Elements 的准确名称是 Array-indexed properties，翻译为数组索引属性，是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于 Properties 而不是 Elements。

因为数组只使用正整数来作为元素的索引，所以该类属性才被称为数组索引属性，而不是索引属性。

## 参考

- [阅读V8（一）：V8底层如何实现JSArray](https://zhuanlan.zhihu.com/p/192468212)
- [（更新）从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
- [从Chrome源码看JS Array的实现](https://zhuanlan.zhihu.com/p/26388217)
- [Fast properties in V8](https://v8.dev/blog/fast-properties)
- [Elements kinds in V8](https://v8.dev/blog/elements-kinds)
- [[V8 Deep Dives] Understanding Array Internals](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)