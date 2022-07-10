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

#### in-object property

正如前文所述，V8 引擎“有可能”会将一部分的 property 直接存储在 JavaScript 对象容器上，V8 官方将这些 property 称为 in-object property。为方便起见，我们将 JavaScript 对象容器所能存储的 in-object property 的数量称为 in-object property 的容量。

具体来说，V8 引擎在创建 JavaSript 对象容器的时候，就会预留一些内存空间来用于存储 in-object property，V8 引擎既可能会预留零个 in-object property 的位置，也有可能会预留几十上百个 in-object property 的位置。in-object property 的容量的大小完全取决于你创建 JavaScript 对象的方式，并且这个容量是不可改变的。

其实，我不知道决定 in-object property 的容量的根本因素是什么，不过，实践证明：

- 空 JavaScript 对象的 in-object property 的容量是 4
- 如果用字面量赋值的方式来创建的 JavaScript 对象的话，那么字面量中的命名属性就都会变成 in-object property，并且命名属性的数量就是 in-object property 的容量

对于第二点，比如，如果我们使用字面量 `{ a:1, b:2, c:3 }` 来创建一个 JavaScript 对象，那么这个 JavaScript 对象的 in-object property 就是 `a`、`b`、`c`，它的 in-object property 的容量就是 3，并且后续追加的命名属性都会变成 normal property。你可以在 Node 运行时中依次键入下述命令来验证一下。

```
node --allow-natives-syntax
const obj = { a:1, b:2, c:3 };
%DebugPrint( obj );
obj.d = 4;
%DebugPrint( obj );
```

第一次 `%DebugPrint( obj )` 的输出如下，可见，in-object property 的容量为 3（见 `inobject properties: 3`），normal property 的容量为 0（见 `<FixedArray[0]>`），并且属性 `a`、`b`、`c` 都是 in-object property。

![in-object property的容量](/static/image/markdown/javascript/in-object-properties-capacity-1.png)

第二次 `%DebugPrint( obj )` 的输出如下，可见，in-object property 的容量没有变化，不过追加的 `d` 属性成为了 normal property。

![in-object property的容量](/static/image/markdown/javascript/in-object-properties-capacity-2.png)

最后，in-object property 的访问速度要比 normal property 的更快，因为 V8 引擎在查找命名属性时，会先查找 in-object property，然后再查找 normal property。另外，哪怕 V8 引擎同时在 in-object property 和 normal property 中查找目标属性，in-object property 的访问速度也会更快，这是因为 in-object property 的访问路径更短。

当我们经常采用字面量赋值的方式来创建仅拥有少量命名属性的小型对象时，这些小型对象的属性访问速度都会很快，这是因为这些小型对象的命名属性都被当作 in-object property 来存储了，这正是 V8 官方设计 in-object property 的原因之一。

#### normal property

超出 in-object property 容量的 property 会被存储在另一个独立的内存空间中，这些 property 就被称为 normal property。

V8 引擎会采用数组数据结构或字典数据结构来存储 normal property，为避免混淆，在下文中，我们会把这个数组和字典称为 “数组容器” 和 “字典容器”。其中，V8 引擎所使用的数组容器是 `FixedArray` 实例或 `PropertyArray` 实例，它们是由 V8 引擎实现的数组数据结构。而 V8 引擎所使用的字典容器是 `NameDictionary` 实例，它是 V8 引擎实现的字典数据结构，另外 `NameDictionary` 是基于散列表来实现的。

因为数组容器的访问速度要比字典容器的访问速度更快，所以 V8 引擎会把采用数组容器来存储的 normal property 称为 fast property，并把采用字典容器来存储的 normal property 称为 slow property。

> 对于数组，我们可以通过下标来直接访问到数组的数据，对于基于散列表的字典，我们需要先进行哈希计算，然后才能访问到目标数据，所以数组的访问速度要更快。
>
> 具体来说，使用散列表来实现字典的大致原理是，通过哈希函数来将字典的每个键都尽可能的转换为一个唯一的内存地址，然后将相对应的值存储在这个地址中。如果我们需要访问字典的某个属性，那么我们就需要先用哈希函数来处理这个属性的键，从而得到值的存储地址，然后再去该地址下找到目标值。
>
> 另外，哈希函数的本质是将键映射为地址，因为键的数量是无穷的，地址的数量是有限的，所以难免会发生多个键指向同一地址的情况，这种情况被称为哈希碰撞。虽然我们可以通过线性探测法、链表法等方法来缓解哈希碰撞，但是这也会进一步降低散列表的访问速度。

V8 引擎更加青睐于使用 fast property，并且 V8 引擎还为其做了额外的优化，来进一步提升它的访问性能，比如 [inline caches](https://mrale.ph/blog/2012/06/03/explaining-js-vms-in-js-inline-caches.html)。

虽然 fast property 的访问速度更快，但是在涉及到属性的增加和删除时，slow property 的性能则会更好，这就是 V8 还额外支持 slow property 的原因。另外，inline caches 并不适用于 slow property。

最后，V8 引擎会视情况来决定到底是使用 fast property 还是 slow property，并且也会视情况来决定是否要切换至 fast property 或 slow property。我不清楚其中的规律，不过实践发现，如果我们 `delete` 了对象的某个 in-object property，那么 V8 引擎就会将 fast property 切换为 slow property。

#### hidden class

hidden class 存储了 JavaScript 对象的信息，比如属性的数量、原型的地址等。其中，hidden class 的 bit field 3 字段存储了 JavaScript 对象的属性数量，以及一个指向 descriptor array 的指针。descriptor array 是一个 `FixedArray` 实例，它存储了 normal property 的信息，比如键的名称与值的地址。

![hidden class](/static/image/markdown/javascript/hidden-class.png)

当 V8 引擎使用数组容器来存储 normal property 时，V8 引擎就会将 normal property 的所有值存储在数组容器上，那么 V8 引擎该如何通过属性的键来找到属性的值呢？答案是，如果没有任何提示信息，仅凭属性的键，V8 引擎是无法推断出相对应的值存储在数组容器上的哪个位置的，而 descriptor array 就是这个提示信息。具体来说，descriptor array 存储了 normal property 的键和值的地址，当 V8 引擎需要查找某个 fast property 时，V8 引擎就可以通过查阅 descriptor array 来找到相对应的值的存储地址。显然，如果 V8 引擎要更新 fast property，那么它自然也需要更新 hidden class 和其中的 descriptor array，这是 fast property 的增删速度要比 slow property 的增删速度更慢的另一个原因。

另外，descriptor array 是专为 fast property 服务的，具体来说，当 V8 引擎使用字典容器来存储命名属性时，V8 引擎会直接将命名属性的键和值一一对应的存进这个字典中，这样 V8 引擎就可以直接根据命名属性的键来在这个字典中找到相对应的值了。

另外，descriptor array 不存储 element 的信息，因为 V8 引擎可以直接根据 element 的键来在对应的存储空间中找到相对应的值，我们会在下文详细介绍 element。

### element

element 的准确名称是 array-indexed property（数组索引属性），它是指使用正整数字符串来作为键的属性，比如 `"0"`、`"1"` 等。需要注意的是，`"+0"`、`"-0"`、`"+1"`、`"-1"` 等都不属于正整数字符串，如果你使用它们来作为属性的键，那么这个属性就属于 property 而不是 element。

#### 存储

element 没有类似于 in-object property 的东西，所有的 element 都被直接存储在另一个独立的内存空间中。V8 引擎会采用数组数据结构或字典数据结构来存储 element，其中，V8 引擎所使用的数组容器是 `FixedArray` 实例，V8 引擎所使用的字典容器是 `NumberDictionary`，这是一个由 V8 引擎实现的基于散列表的字典数据结构。

另外，因为 element 属性的键都是数组索引字符串，所以不论 V8 引擎使用数组容器来存储 element，还是使用字典容器来存储 element，V8 引擎都可以直接将 element 属性的键和值一一对应的存储在数组容器或字典容器上。得益于这个特点，V8 引擎可以直接通过 element 的键来在数组容器或字典容器中找到对应的值，而不需要像 fast property 一样依赖 hidden class 的 descriptor array。

和 fast / slow property 相似的是，当 V8 引擎使用数组容器来存储 element 时，element 的访问速度会更快。

#### 稀疏数组

当 V8 引擎使用数组容器来存储 element 时，如果 element 的键不是从 `0` 起算的，或者键与键之间不是连续的，对应的数组容器就会产生空元素，我们把数组中的空元素称为数组的孔，我们把含有孔的数组称为稀疏数组。

比如，我们使用下述代码来创建一个只含有一个 element 属性的 JavaScript 对象，然后通过 `%DebugPrint( obj )` 来打印该对象的内部信息。

```
node --allow-natives-syntax
const obj = { 1:1 };
%DebugPrint( obj );
```

如下图所示，V8 引擎使用一个长度为 19 的 `FixedArray` 实例来存储 element，这个 `FixedArray` 实例的 `0` 号以及 `2~18` 号元素的值都是 `<the_hole>`，这是一个由 V8 引擎定义的特殊值，它代表着该元素为空。

![稀疏数组](/static/image/markdown/javascript/sparse-array.png)

> 你应该会很好奇为什么上图中的 `FixedArray` 实例的长度是 19 而不是 2，具体来说，如果 element 的数量超出了 `FixedArray` 实例的容量（即长度），那么 V8 引擎就需要对 `FixedArray` 实例进行扩容。如果 `FixedArray` 实例的容量总是刚好等于 element 的数量的话，那么每次新增 element 时，V8 引擎都需要扩充 `FixedArray` 实例的容量。然而，这个扩容是一个耗时的行为，为了避免频繁的扩容，V8 引擎会在初始化和扩容 `FixedArray` 实例的时候，就多申请一些额外的存储空间，用来存储新增的 element，这样 V8 引擎就只需要在 `FixedArray` 实例容量不足时再进行扩容就可以了。
>
> 另外，这个扩容的大致原理是，V8 引擎创建一个新的 `FixedArray` 实例，这个新的 `FixedArray` 实例有更大的容量，然后再将旧的 `FixedArray` 实例的数据，和新增的 element 的数据，一起拷贝到新的 `FixedArray` 实例中去。
>
> 不过，V8 引擎有时候也会创建出容量刚好等于 element 数量的 `FixedArray` 实例，比如 `const array = [ 0, 1, 2 ]` 所创建出的 JavaScript 对象会使用 `FixedArray` 实例来存储 element，而这个 `FixedArray` 实例的容量就刚好等于 3。

当 V8 引擎在存储 element 的数组容器上找到 `<the_hole>` 时，V8 引擎就可以立即断定出该 JavaScript 对象上不存在目标属性，然后 V8 引擎就可以开始从该 JavaScript 对象的原型链上继续查找目标属性了。

![<the_hole>的用处](/static/image/markdown/javascript/the-hole-use.png)

#### 种类

当 V8 引擎使用数组容器来存储 element 时，V8 引擎会对这个数组容器进行分类，不同类别的数组容器的性能是不同的，因为 V8 引擎对不同类别的数组容器进行了不同程度的优化。

具体来说，V8 引擎会根据数组容器是否是稀疏的来进行分类，也会根据数组容器的元素的数据类型来进行分类，具体分类如下：

- 如果数组容器是无孔的：
  - 且数组容器中元素都是整数，那么这个数组容器就会被标记为 `PACKED_SMI_ELEMENTS`
  - 且数组容器中的元素
- 如果数组容器是有孔的：

当 V8 引擎使用数组容器来存储 element 时，V8 引擎会根据这个数组容器是否是稀疏的来将其分为 `PACKED` 和 `HOLEY` 两大类，其中 `PACKED` 的数组容器的性能更好，因为 V8 引擎可以对它进行更加积极的优化。

另外，V8 引擎还会根据数组容器的元素的数据类型来对其进行分类，具体来说，如果数组容器的元素只包含整数，那么这个数组容器就会被标记为 `SMI`，其中 `SMI` 是 small integer 的缩写。如果数组容器的元素只包含整数和浮点数，那么这个数组容器就会被标记为 `DOUBLE`。如果数组容器的元素包含整数、浮点数和其他，那么这个数组容器就会被标记为

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