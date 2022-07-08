---
typora-root-url: ..\..
---

# JavaScript 对象在 V8 中的实现

## 概述

本文将会描述 V8 引擎是如何实现 JavaScript 对象的。

## 环境

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

## 对象

JavaScript 中的对象和面向对象语言中的对象是不一样的，在 JavaScript 中，对象是一种字典类型的数据结构，比如 `{a: 1}`。其中，对象的键只能使用 `String` 或 `Symbol` 类型的值，对象的值则可以使用任意的数据类型。

> JavaScript 中有 2 个特别的内建 API，分别是 `Map` 和 `WeakMap`，它们都同样是字典类型的数据结构。和 JavaScript 对象不同的是，`Map` 可以使用任意数据类型来作为键，`WeakMap` 只能使用对象来作为键。

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

## 实现

### 总览

首先，V8 引擎会申请一块连续的内存空间来存储 JavaScript 对象的信息，为方便起见，本文会将该内存空间称为 JavaScript 对象容器。

V8 官方将 JavaScript 对象的属性分成两种类型，一种是 named property（命名属性），另一种是 array-indexed property（数组索引属性）。V8 官方将 named property 和 array-indexed property 分别简称为 property 和 element，本文会沿用这种叫法。

对于 element，V8 引擎将它存储在另一个独立的内存空间中。对于 property，V8 引擎的做法则有一些复杂，首先，V8 引擎有可能会将一部分 property 直接存储在 JavaScript 对象容器上，然后将剩余的 property 存储在另一个独立的内存空间中，前者被称为 in-object property，后者被称为 normal property。

JavaScript 对象容器的前 3 个位置存储了 3 个指针，每个指针占 8 个字节（64位系统下）。其中，第一个指针指向 hidden class 的内存空间，第二个指针指向 normal property 的内存空间，第三个指针指向 element 的内存空间。

关于 hidden class，它是 `HiddenClass` 类的实例，而 `HiddenClass` 则是一个由 V8 官方实现的标准的 C++ 类。hidden class 用于存储 JavaScript 对象的内部信息，比如属性的数量，原型的地址等，我们会在后文继续介绍 hidden class。

![hidden class & property & element](/static/image/markdown/javascript/hiddenclass-property-element.png)

### property

在介绍 hidden class 之前，我们需要先了解 property 来作为前置知识。

property 的准确名称是 named property（命名属性），它是指使用除了正整数字符串之外的其他字符串来作为键的属性，比如 `{ a: 1 }` 等。另外，使用 `Symbol` 类型的值来作为键的属性也属属于 named property。下文将会使用 property 来指代 named property。

property 又分为 in-object property 和 normal property。

### in-object property

正如前文所述，V8 引擎“有可能”会将一部分的 property 直接存储在 JavaScript 对象容器上，V8 官方将这些 property 称为 in-object property。为方便起见，我们将 JavaScript 对象容器所能存储的 in-object property 的数量称为 in-object property 的容量。

具体来说，V8 引擎在创建 JavaSript 对象容器的时候，就会预留一些内存空间来用于存储 in-object property，V8 引擎既可能会预留零个 in-object property 的位置，也有可能会预留几十上百个 in-object property 的位置。in-object property 的容量的大小完全取决于你创建 JavaScript 对象的方式，并且这个容量是不可改变的。

其实，我不知道决定 in-object property 的容量的根本因素是什么。不过，实践证明，如果用字面量赋值的方式来创建的 JavaScript 对象的话，那么字面量中的命名属性就都会变成 in-object property，并且命名属性的数量就是 in-object property 的容量。比如，用 

![in-object property和normal property](/static/image/markdown/javascript/inobject-and-normal-property.png)

比如，以字面量赋值的形式来创建具有 3 个命名属性的对象，那么这个对象的 in-object property 容量就是 3，后续增加的命名属性都将会被存储在另一个独立的数据结构中，即作为 normal property 来处理。

```
> node --allow-natives-syntax
> const obj = { a: 1, b: 1, c: 1 };
> %DebugPrint( obj );
> obj.d = 1;
> %DebugPrint( obj );
```

第一次 `%DebugPrint( obj )` 的输出如下，此时，`obj` 的 in-object property 容量为 3，`a`、`b`、`c` 属性都被当作 in-object property 来处理，负责存储 normal property 的 `FixedArray` 的长度为 0，这代表着 obj 中没有任何 normal property。

![in-object property的容量](/static/image/markdown/javascript/in-object-properties-capacity-1.png)

第二次 `%DebugPrint( obj )` 的输出如下，此时，obj 的 in-object property 容量仍然为 3，`a`、`b`、`c` 属性仍然被当作 in-object property 来处理，后续新增的 `d` 属性则被当作 normal property 来处理，负责存储 normal property 的 `PropertyArray` 的长度为 3。

![in-object property的容量](/static/image/markdown/javascript/in-object-properties-capacity-2.png)

> 我不知道 V8 引擎究竟是根据什么来决定 in-object property 容量的，上述例子只是一个个例。

另外，in-object property 的访问速度要比 normal property 和 element 的访问速度更快，因为如果 V8 引擎想要找到某个 in-object property，那么 V8 引擎可以直接在 JavaScript 对象容器上找到，而如果 V8 引擎想要找到某个 normal property 或 element，那么 V8 引擎需要先在 JavaScript 对象容器上找到存储 normal property 或 element 的地址，然后再在这个地址中继续寻找目标属性。

最后，试想一下，如果我们经常采用字面量赋值的方式来创建仅仅拥有几个命名属性的小型对象，那么这些小型对象的属性访问效率将会很高，因为这些小型对象的命名属性都被当作 in-object property 来处理了，这正是 V8 引擎设计 in-object property 的原因。

#### normal property

normal property 是指存储在独立的数据结构中的 property，即非 in-object property 的 property。

V8 引擎会使用数组或字典中的其中一种来存储 normal property。具体来说，V8 引擎要么会使用 `FixedArray` 和 `PropertyArray` 等类来存储 normal property，要么会使用 `NameDictionary` 等类来存储 normal property。其中 `FixedArray` 和 `PropertyArray` 是由 V8 引擎自己实现的数组，`NameDictionary` 是由 V8 引擎自己实现的字典，并且该字典是基于散列表来实现的。

如果 V8 引擎使用 `FixedArray` 或 `PropertyArray` 等数组数据结构来存储 normal property，那么 V8 官方就会将这些 normal property 称呼为 fast property，如果 V8 引擎使用 `NameDictionary` 等字典数据结构来存储 normal property，那么 V8 官方就会将这些 normal property 称呼为 slow property 或 dictionary property。因为数组的数据访问速度比字典的数据访问速度更快，所以 V8 官方将前者称呼为 fast property，并将后者称呼为 slow property。

> V8 引擎可以通过索引来直接访问数组中的数据，但是如果 V8 想要访问字典（基于散列表）中的数据，那么 V8 引擎就需要先通过哈希计算来算出目标数据的地址，然后再根据这个地址来访问到目标数据。所以数组的数据访问速度比字典的数据访问速度更快。
>
> 具体来说，使用散列表来实现字典的大致原理是通过哈希函数来将字典的键转换为一个唯一的内存地址，然后将相应的值存储在该地址中，如果需要访问字典的某个属性，那么就要通过哈希函数来计算出该属性的键所对应的内存地址，然后在这个地址中找到相应的值。因为要进行哈希计算，所以字典（基于散列表）的数据访问速度没有数组的数据访问速度快。

V8 引擎更青睐于将 normap property 存储在数组中，因为 fast property 的属性访问速度更快，并且 V8 引擎还为其做了额外的优化，来进一步加速它的属性访问速度，比如 [inline caches](https://mrale.ph/blog/2012/06/03/explaining-js-vms-in-js-inline-caches.html)。不过，在增删属性时，fast property 的性能会比 slow property 的性能更差，并且如果 V8 引擎使用了 fast property，那么在增删属性的时候，V8 引擎还需要额外的更新 hidden class。所以 V8 引擎才会支持使用字典来存储 normal property，另外，inline caches 并不适用于 slow property，这是 slow property 的数据访问速度更慢的另一个原因。

总的来说，fast property 访问属性的速度更快，slow property 增删属性的速度更快。另外，V8 引擎会视情况来决定应该使用 fast property 还是 slow property，并且也会视情况来决定是否将 fast property 切换为 slow property，或反之。

> 我不清楚 V8 引擎在什么情况下才会将 fast property 切换为 slow property 或反之，不过，实践发现，如果我们 `delete` 了对象的一个 in-object property，那么 V8 引擎就会将 fast property 切换为 slow property。

#### hidden class

JavaScript 对象容器的第一个元素存储了一些关于 JavaScript 对象自身的信息，比如它的属性数量、指向原型对象的指针等，V8 官方将这个元素称为 hidden class。

hidden class 是 `HiddenClass` 类的实例。`HiddenClass` 是一个类似于面向对象编程语言中的类，它由 V8 引擎实现。hidden class 的 `bit filed 3` 属性存储了 JavaScript 对象的属性数量，以及一个指向 `descriptor array` 的指针。`descriptor array` 是一个 `FixedArray` 实例，它存储了 normal property 的信息，比如键的名称和值的地址。

`descriptor array` 是为 fast property 服务的，具体来说，如果 V8 引擎使用数组来存储 normal property，那么 V8 引擎是无法通过属性的键来推断出该属性的值到底存储在数组的哪个位置的。所以，V8 引擎需要将键的名称和该键所对应的值的地址关联起来，而 V8 引擎具体的做法就是将这些映射信息存储在 `descriptor array` 中。另外，由于 slow property 是使用字典来存储数据的，所以对于 slow property 而言，V8 引擎可以直接根据键名来在储存数据的字典中找到对应的值，所以 slow property 不依赖 `descriptor array`。

另外，`descriptor array` 不存储数组索引属性的信息。

![hidden class](/static/image/markdown/javascript/hidden-class.png)

### element

element 的准确名称是 array-indexed property，翻译为数组索引属性，是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于 property 而不是 element。

不同于 property 的是，element 没有类似于 in-object property 的东西，所有的 element 都会直接存储在另一个独立的数据结构中，并且这个数据结构的地址将会被存储在 JavaScript 对象容器的第三个元素上。

与 property 相似的是，V8 引擎也会使用数组或字典中的其中一种来存储 element，对应的数组是 `FixedArray` 的实例，对应的字典是 `NumberDictionary` 的实例，其中 `NumberDictionary` 也是一个基于散列表来实现的字典。

当 V8 引擎使用数组来存储 element 时，element 的访问效率会更高。另外，因为 element 本身就是用数组索引来作为键的属性，所以对于一个 element 属性，V8 引擎会直接使用这个属性的键来作为这个属性在存储容器中的下标，比如，假设一个 element 属性的键是 `0`，那么这个属性在 `FixedArray` 实例中的下标就是 `0`。

当 V8 引擎使用数组来存储 element 时，如果 element 的键不是从 `0` 起算的，或者键与键之间不是连续的，那么对应的 `FixedArray` 实例就会是有孔的。打个比方，JavaScript 对象 `{ 1:1, 3:3 }` 所对应的 `FixedArray` 实例大概是 `[ , 1, , 3 ]` 这样的，这个数组有 2 个空元素，分别是 `0` 号元素和 `2` 号元素，我们把空元素称为数组的孔，并把有孔的数组称为稀疏数组。

V8 引擎会根据 `FixedArray` 实例是否有孔来标记 element，如果 `FixedArray` 是有孔数组，那么对应的 element 就会被标记为 `HOLEY`，否则就会被标记为 `PACKED`（译为 “满的”）。并且 V8 引擎会使用特殊的值来填补 `FixedArray` 中的孔，而这个特殊的值被称为 `the_hole`。

另外，V8 引擎还会根据 `FixedArray` 实例所存储的值的数据类型来标记对应的 element，比如：

- 如果 `FixedArray` 实例所存储的值都是整数
  - 且这个 `FixedArray` 实例是无孔的，那么对应的标签就是 `PACKED_SMI_ELEMENTS`
  - 且这个 `FixedArray` 实例是有孔的，那么对应的标签就是 `HOLEY_SMI_ELEMENTS`
- 如果 `FixedArray` 实例所存储的值都是整数和浮点数
  - 且这个 `FixedArray` 实例是无孔的，那么对应的标签就是 `PACKED_DOUBLE_ELEMENTS`
  - 且这个 `FixedArray` 实例是有孔的，那么对应的标签就是 `HOLEY_DOUBLE_ELEMENTS`
- 如果 `FixedArray` 实例所存储的值都是整数和浮点数和其他
  - 且这个 `FixedArray` 实例是无孔的，那么对应的标签就是 `PACKED_ELEMENTS`
  - 且这个 `FixedArray` 实例是有孔的，那么对应的标签就是 `HOLEY_ELEMENTS`

> `SMI` 是 `small integer` 的缩写。

V8 引擎为具有不同标签的 element 进行了不同程度的优化，具体来说 `PACKED` 的 element 的效率比 `HOLEY` 的 element 的效率更高，标签语意更具体的 element 的效率比标签语意更模糊的 element 的效率更高。这是因为，`HOLEY` 的 

如果值的数据类型更加具体，那么 V8 就可以进行更细粒度的优化，并且 `PACKED` 的

![element的标签与性能](/static/image/markdown/javascript/element-tag-performance.png)

> 事实上，V8 引擎划分出了了 21 种标签，并且每种标签都有不同程度的优化，详见 [这份源码](https://source.chromium.org/chromium/v8/v8.git/+/ec37390b2ba2b4051f46f153a8cc179ed4656f5d:src/elements-kind.h;l=14)。

另外，element 的标签不是永恒不变的，而是可以进行转化的

## 参考

- [阅读V8（一）：V8底层如何实现JSArray](https://zhuanlan.zhihu.com/p/192468212)
- [（更新）从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
- [从Chrome源码看JS Array的实现](https://zhuanlan.zhihu.com/p/26388217)
- [Fast properties in V8](https://v8.dev/blog/fast-properties)
- [Elements kinds in V8](https://v8.dev/blog/elements-kinds)
- [[V8 Deep Dives] Understanding Array Internals](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)