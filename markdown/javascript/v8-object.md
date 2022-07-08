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

JavaScript 对象拥有两类属性，一类是命名属性（named property），一类是数组索引属性（array-indexed property）。 V8 官方将命名属性简称为 property，将数组索引属性简称为 element，本文会沿用 V8 官方的叫法，因为这种叫法更加简洁。

V8 引擎是使用 C++ 来编写的，同时还使用到了 JavaScript 和汇编，不过在 C++ 中，并没有一种像 JavaScript 对象一样的 API，所以 V8 团队需要亲自实现 JavaScript 对象。

具体来说，V8 引擎会创建一个定长数组来存储 JavaScript 对象，为方便起见，本文会将该数组称为 JavaScript 对象数组。不过 V8 引擎并不会直接将 property 和 element 直接存储在这个 JavaScript 对象数组上，而是将它们分别存储在另外两个独立的数据结构中，然后令 JavaScript 对象数组的第二个元素指向存储 property 的数据结构，令 JavaScript 对象数组的第三个元素指向存储 element 的数据结构，正如下图所示。

![property和element](/static/image/markdown/javascript/property-and-element.png)

下文将会详细描述 V8 引擎是如何存储 property 和 element 的。

### property

property 的准确名称是 named property，译为命名属性，是指使用除了正整数字符串之外的其他字符串来作为键的属性，比如 `{ a: 1 }` 等，另外，使用 `Symbol` 类型的值来作为键的属性也属于 property。

#### in-object property

首先，V8 引擎在创建 JavaScript 对象数组的时候，就会在该数组上预留一些空间来存储 property，而这些被直接存储在 JavaScript 对象数组上的 property 就被称为 in-object property。

JavaScript 对象数组的 in-object property 容量取决于你创建 JavaScript 对象的方式，并且这个容量是不可改变的。而超出容量的 property 将会被存储在另一个独立的数据结构中，这个数据结构的内存地址将会被存储在 JavaScript 对象数组的第二个元素上。V8 将这些存储在独立的数据结构中的 property 称为 normal property。

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

另外，in-object property 的访问速度要比 normal property 和 element 的访问速度更快，因为如果 V8 引擎想要找到某个 in-object property，那么 V8 引擎可以直接在 JavaScript 对象数组上找到，而如果 V8 引擎想要找到某个 normal property 或 element，那么 V8 引擎需要先在 JavaScript 对象数组上找到存储 normal property 或 element 的地址，然后再在这个地址中继续寻找目标属性。

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

JavaScript 对象数组的第一个元素存储了一些关于 JavaScript 对象自身的信息，比如它的属性数量、指向原型对象的指针等，V8 官方将这个元素称为 hidden class。

hidden class 是 `HiddenClass` 类的实例。`HiddenClass` 是一个类似于面向对象编程语言中的类，它由 V8 引擎实现。hidden class 的 `bit filed 3` 属性存储了 JavaScript 对象的属性数量，以及一个指向 `descriptor array` 的指针。`descriptor array` 是一个 `FixedArray` 实例，它存储了 normal property 的信息，比如键的名称和值的地址。

`descriptor array` 是为 fast property 服务的，具体来说，如果 V8 引擎使用数组来存储 normal property，那么 V8 引擎是无法通过属性的键来推断出该属性的值到底存储在数组的哪个位置的。所以，V8 引擎需要将键的名称和该键所对应的值的地址关联起来，而 V8 引擎具体的做法就是将这些映射信息存储在 `descriptor array` 中。另外，由于 slow property 是使用字典来存储数据的，所以对于 slow property 而言，V8 引擎可以直接根据键名来在储存数据的字典中找到对应的值，所以 slow property 不依赖 `descriptor array`。

另外，`descriptor array` 不存储数组索引属性的信息。

![hidden class](/static/image/markdown/javascript/hidden-class.png)

### element

element 的准确名称是 array-indexed property，翻译为数组索引属性，是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于 property 而不是 element。

不同于 property 的是，element 没有类似于 in-object property 的东西，所有的 element 都会直接存储在另一个独立的数据结构中，并且这个数据结构的地址将会被存储在 JavaScript 对象数组的第三个元素上。

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