---
typora-root-url: ..\..
---

# 散列表

## 概述

散列表（Hash table）又称为哈希表，它是指基于散列函数（Hash function）来实现的字典，其实现的大致原理是通过散列函数来将属性键转化为一个唯一的存储地址，然后属性将值存储在这个地址上。

得益于这种实现机制，我们可以直接根据属性键和散列函数来计算出属性值的存储地址，然后一步到位的访问到属性值，所以散列表的访问操作的时间复杂度是 `O(1)`，这正是散列表的优点。

不过有的时候，散列函数也会将多个属性键映射至同一个存储地址，这种现象被称为散列冲突（Collision），后文会详细解释它的成因与解决方案。

## 原理

### 散列表的原理

散列表的原理是通过散列函数来将属性键转化为一个唯一的标识符，然后使用这个标识符来作为属性值存储在另一个数据结构中的地址。当我们需要访问数据时，我们就可以直接根据属性键和散列函数来计算出属性值在存储容器中的地址，然后再从存储容器中获取属性值。

> 散列函数的计算结果被称为散列码（Hash code）。

比如，当我们使用数组来作为散列表的存储容器时，散列函数的作用就是将属性的键转化为一个唯一的数组索引，然后我们就会将这个数组索引作为属性值在数组中的存储地址，并将属性值存储在这个地址上。

如下图所示，这是一个使用 JavaScript 来实现的散列表，它使用了数组来作为存储容器。该散列表拥有 3 个属性，这 3 个属性的键分别是字符串 `a`、`b`、`c`，这 3 个属性的值分别是数字值 `100`、`200`、`300`，散列函数将这 3 个键转化为数字值 `5`、`1`、`9`，然后散列表将这 3 个属性的值分别存储在存储容器的 5 号位置、1 号位置、9 号位置上。

![散列表的原理](/static/image/markdown/data-structure/hash-table/hash-table-principle.png)

> 因为 JavaScript 数组具有自动扩容的特性，所以当我们使用 JavaScript 数组来作为散列表的存储容器时，我们可以轻松的向散列表追加任意数量的属性，而不需要担心存储容器的存储空间不足的问题。而如果我们使用 C++ 数组来作为散列表的存储容器，那么我们就需要在存储容器的容量告急时进行手动扩容，因为 C++ 数组没有实现自动扩容。你可以通过本博客的另一篇文章《V8 Object》来了解 JavaScript 数组的实现原理。

### 散列冲突的原理

散列冲突是指散列函数将多个属性键都映射至了同一个存储地址的现象。散列冲突会导致发生冲突的属性们将它们的属性值都存储在同一个地址上，这会导致散列表丢失数据，因为后定义的属性将会覆盖先定义的属性。如下图所示，因为追加属性的散列码与既有属性的散列码是一样的，所以追加属性的值覆盖了既有属性的值，这导致散列表丢失了既有属性的值。

![散列冲突的原理](/static/image/markdown/data-structure/hash-table/hash-collision.png)

之所以会发生散列冲突，是因为属性键的种类数是无穷的，而存储地址的数量却是有限的，如果散列函数要将无穷个属性键都映射至有限的存储地址上，那么就必然会出现多个属性键对应一个存储地址的现象。具体来说，我们通常会使用字符串来作为属性的键，因为字符串的种类有无数种，所以属性键的种类数也是无穷的，不过由于机器的存储空间是有限的，所以存储地址的数量是有限的。

散列冲突的解决方案有：

- 分离链接
- 线性探查
- 双散列法

本文会介绍与实现前两种方案。

### 分离链接的原理

分离链接的思路是将散列表的存储容器的存储单元都改造成链表，这个链表可以同时存储多个键值对，当有多个属性都要将值存储在同一个存储单元上的时候，存储单元就可以按照先后顺序来将属性的键值对追加到链表的尾部，这样就可以避免既有属性被追加属性所覆盖的问题了。

当我们需要查询属性时，我们需要先根据属性键和散列函数来找到对应的存储单元，然后再通过比对属性键的方式来在这个存储单元上找到目标属性的值。

当我们需要删除属性时，我们就直接把属性从存储它的链表上移除掉。如果移除节点后的链表的节点数为零，那么我们就把这个链表从存储它的数组上移除掉，这一步是可选的。

比如，当我们使用数组来作为散列表的存储容器时，我们可以这样改在这个存储容器，如下图所示。

![分离链接的原理](/static/image/markdown/data-structure/hash-table/separate-chaining.png)

### 线性探查的原理

线性探查的思路是将所有属性的键值对都直接存储在存储容器上，如果追加属性要使用的存储单元已经存储了另一个既有属性的话，那么就把这个追加属性写入到后续第一个空的存储单元上。

当我们需要查询属性时，我们需要先根据属性键和散列函数来找到对应的存储单元，然后通过比对属性键的方式来判断这个存储单元是否存储了目标属性的属性值，如果是，那么就取出这个存储单元上的属性值，如果不是，那么就开始遍历后续的每一个存储单元，直至找到那个存储了目标属性的属性值的存储单元，然后再从这个存储单元上取出属性值。

当我们需要删除属性时，我们需要先找到目标属性的存储单元，然后清空这个存储单元。清空的存储单元越多，存储容器的孔洞就越多，散列表的查询效率和空间利用率就越低，前者是因为散列表会浪费更多的时间在检查孔洞上。对于孔洞问题，我们有两种解决方案：

1. 每次清空存储单元之后，都立即将后续的有必要前移的存储单元向前移动，来填充孔。
2. 每次清空存储单元之后，都累计孔洞的数量，当孔洞的数量达到一定程度后，就整理一下存储容器。

> 存储容器的孔洞分为两种类型，一种是天生的孔洞，另一种是由于清空存储单元而产生的孔洞，上述第二个方案中提到的“累计孔洞的数量”是指“累计由于清空存储单元而产生的孔洞的数量”。
>
> 另外，你可以通过本文章的第一张图像来理解为什么存储容器会有天生的孔洞。

![线性探查的原理](/static/image/markdown/data-structure/hash-table/linear-probing.png)

## 实现

### 选择存储容器

JavaScript 对象本身就是字典数据结构，如果我们使用 JavaScript 对象来作为散列表的存储容器的话，那么就等同于使用字典来实现散列表，这将会失去练习的意义。

为了深刻理解散列表是如何实现的，我们需要尽可能的像使用 C++ 一样来使用 JavaScript，更具体来说，我们会使用定长的 JavaScript 数组来存储散列表的数据，并且为其实现扩容和收缩机制，来让我们的散列表可以在必要的时候自动扩容或收缩。

### 选择散列函数

散列函数是散列表的核心，一个好的散列函数应当尽可能少的触发散列冲突，且具有高效的执行速度。因为每次对散列表进行增删改查的时候都需要执行散列函数，因此如果散列函数太过于复杂以致于其执行速度低下的话，那么就会直接拖慢每次增删改查的效率。

本文选用了 djb2 散列函数，它符合上述的两个要求。不过，因为 djb2 是字符串散列函数，它只能处理字符串，因此我们的散列表只能使用字符串类型的值来作为属性的键，你可以通过阅读 [这份资料](http://www.cse.yorku.ca/~oz/hash.html) 来进一步了解 djb2 散列函数。

djb2 散列函数的 JavaScript 版本如下：

```js
/**
 * djb2散列函数。
 * @param { string } string - 字符串。
 * @returns { number } - 散列码。
 */
function djb2( string ) {

    let hash_code = 5381;
    let string_length = Array.from( string ).length;

    for ( let i = 0; i < string_length; i++ ) hash_code = ( hash_code * 33 ) + string.codePointAt( i );

    return hash_code;

}
```

### 解决散列冲突

在这里，我们会选用线性探查来解决散列冲突。之所以没有选择分离链接，是因为分离链接需要使用到链表，而我们从前实现的链表中含有 JavaScript 对象，为了避免使用含有 JavaScript 对象的链表，同时也为了避免花费多余的时间来重新实现一个不含有 JavaScript 对象的链表，所以我们选用了线性探查。

前文提到，线性探查会衍生出关于孔的问题，并提出了两种解决孔的方案，本文选择了方案一，即“在每次清空存储单元之后，都立即将后续的有必要前移的存储单元向前移动，来填充孔”。

### 方法和属性

本文实现的散列表将会拥有以下的方法和属性：

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| `get( key )`        | 从散列表中获取一个键为 `key` 的属性的值。                    |
| `put( key, value )` | 向散列表追加一个属性或修改一个既有属性的属性值，然后返回更新后的散列表。 |
| `remove( key )`     | 从散列表中移除一个键为 `key` 的属性，然后返回一个代表其是否移除成功的布尔值。 |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 属性的数量 |

### 代码

```js
class HashTable {

    #container;   // 存储容器
    #capacity;    // 存储容器的容量
    #consumption; // 存储容器的使用量

    /**
     * HashTable的构造函数。
     * @returns { Object } - HashTable实例。
     */
    constructor() {

        this.#capacity = 64;                               // 初始容量
        this.#container = new Array( this.#capacity * 2 );
        this.#consumption = 0;

    }

    /**
     * djb2散列函数，只用于处理字符串，详见http://www.cse.yorku.ca/~oz/hash.html。
     * @param { string } string - 字符串。
     * @returns { number } - 散列码。
     */
    djb2( string ) {

        let hash_code = 5381;
        let string_length = Array.from( string ).length;

        for ( let i = 0; i < string_length; i++ ) hash_code = ( hash_code * 33 ) + string.codePointAt( i );

        return hash_code;

    }

    /**
     * 获取属性键的存储地址。
     * @param { string } key - 属性键。
     * @returns { number } - 存储地址。
     */
    getKeyIndex( key ) {

        const hash_code = this.djb2( key );
        const key_index = hash_code % this.#capacity * 2;

        return key_index;

    }

    /**
     * 根据属性键来获取属性值。
     * @param { string } key - 属性键。
     * @returns { * } - 属性值。
     */
    get( key ) {

        let key_index = this.getKeyIndex( key );
        let item = this.#container[ key_index ];

        while ( item !== undefined && item !== key ) {

            key_index += 2;

            if ( key_index >= this.#container.length ) key_index = 0;

            item = this.#container[ key_index ];

        }

        if ( item === undefined ) return undefined;

        return this.#container[ key_index + 1 ];

    }

    /**
     * 追加一个新属性或修改既有属性，然后返回更新后的散列表。
     * @param { string } key - 属性键。
     * @param { * } value - 属性值。
     * @returns { Object } - 更新后的散列表。
     */
    put( key, value ) {

        let key_index = this.getKeyIndex( key );
        let item = this.#container[ key_index ];

        while ( item !== undefined && item !== key ) {

            key_index += 2;

            if ( key_index >= this.#container.length ) key_index = 0;

            item = this.#container[ key_index ];

        }

        if ( item === undefined ) {

            this.#container[ key_index ] = key;
            this.#container[ key_index + 1 ] = value;

            this.#consumption ++;

            if ( this.#consumption / this.#capacity > 0.8 ) this.changeCapacity();

            return this;

        }

        this.#container[ key_index + 1 ] = value;

        return this;

    }

    /**
     * 移除一个属性，然后返回一个代表其是否移除成功的布尔值。
     * @param { key } - 属性键。
     * @returns { boolean } - 如果返回值为true，则代表散列表中存在目标属性，并已被移除；
     * 如果返回值为false，则代表散列表中不存在目标属性，该方法就不会对散列表进行任何的修改。
     */
    remove( key ) {

        let key_index = this.getKeyIndex( key );
        let item = this.#container[ key_index ];

        while ( item !== undefined && item !== key ) {

            key_index += 2;

            if ( key_index >= this.#container.length ) key_index = 0;

            item = this.#container[ key_index ];

        }

        if ( item === undefined ) return false;

        delete this.#container[ key_index ];
        delete this.#container[ key_index + 1 ];

        this.#consumption --;

        if ( this.#consumption / this.#capacity < 0.2 ) this.changeCapacity();
        else this.rearrange( key_index );

        return true;

    }

    /**
     * 将散列表的容量调整为使用量的两倍，然后返回更新后的散列表。
     * @returns { Object } - 更新后的散列表。
     */
    changeCapacity() {

        const new_capacity = this.#capacity === 0 ? 2 : this.#consumption * 2;
        const new_container = new Array( new_capacity * 2 );
        const old_container = this.#container;

        this.#capacity = new_capacity;
        this.#container = new_container;

        for ( let i = 0; i < old_container.length; i += 2 ) {

            const key = old_container[ i ];

            if ( key === undefined ) continue;

            const value = old_container[ i + 1 ];

            this.put( key, value );
            this.#consumption --;

        }

        return this;

    }

    /**
     * 从holy_key_index开始，通过重排后续的属性，来移除由remove操作所产生的孔。
     * @param { number } holy_key_index - 属性键的存储地址，且该属性键是孔。
     * @returns { Object } - 更新后的散列表。
     */
    rearrange( holy_key_index ) {

        let next_key_index = holy_key_index + 2;

        if ( next_key_index >= this.#container.length ) next_key_index = 0;

        let next_key = this.#container[ next_key_index ];

        while ( next_key !== undefined ) {

            const right_key_index = this.getKeyIndex( next_key );

            if ( right_key_index <= holy_key_index || right_key_index > next_key_index ) {

                const next_value = this.#container[ next_key_index + 1 ];

                this.#container[ holy_key_index ] = next_key;
                this.#container[ holy_key_index + 1 ] = next_value;

                delete this.#container[ next_key_index ];
                delete this.#container[ next_key_index + 1 ];

                const new_holy_key_index = next_key_index;

                this.rearrange( new_holy_key_index );

                break;

            }

            next_key_index += 2;

            if ( next_key_index >= this.#container.length ) next_key_index = 0;

            next_key = this.#container[ next_key_index ];

        }

        return this;

    }

}
```

## 更好的选择

因为 JavaScript 对象本身就是一个基于散列表和 C++ 数组来实现的字典，如果你想要在 JavaScript 这门语言中使用散列表，那么就请直接使用 JavaScript 对象吧，而不要使用本文实现的 `HashTable`，因为它没有实用价值（只有学习价值）。

另外，ECMAScript 2015 推出的 `Map` 也是一个基于散列表来实现的字典，相比于普通的 JavaScript 对象，`Map` 的增删效率更高，它也是一个很好的选择。

如果你想要知道 JavaScript 对象是如何基于散列表和 C++ 数组来实现的话，那么就请阅读本博客的另一篇文章《V8 Objec》。