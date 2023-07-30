---
typora-root-url: ./..\..\image
---

# 二叉堆

## 概述

二叉堆是一种特殊的完全二叉树，其分为最小堆和最大堆。其中，最小堆的定义是：父节点的值必须不大于子节点的值，而最大堆的定义是：父节点的值必须不小于子节点的值。

![最小堆和最大堆](/algorithm-and-data-structure/binary-heap/minheap-and-maxheap.png)

## 实现

我们将会实现 3 个类，分别是 `BaseHeap`、`MinHeap`、`MaxHeap`，其中 `BaseHeap` 是 `MinHeap` 和 `MaxHeap` 的父类。

之所以要这么做，是因为 `MinHeap` 的实现过程几乎和 `MaxHeap` 的实现过程一模一样，唯一的区别只在于，两者在数值比较上的做法完全相反。你只要浏览一下后文的实现代码，就会立即明白我的意思。

我们实现的 `MinHeap` 和 `MaxHeap` 将会拥有下述方法，并且我们会把这些公共方法提取到 `BaseHeap` 中去。

| 方法名            | 描述                                             |
| ----------------- | ------------------------------------------------ |
| `getCount()`      | 获取堆的节点的数量。                             |
| `getTree()`       | 获取完全二叉树格式的堆，以便于查看堆的内容。     |
| `shift()`         | 移除堆的第一个节点（极值节点），然后返回堆本身。 |
| `insert( value )` | 向堆插入一个值，然后返回堆本身。                 |

另外，`MinHeap` 和 `MaxHeap` 各自都会拥有一个独属于自己的方法。对于 `MinHeap` 来说，这个方法是：

| 方法名       | 描述             |
| ------------ | ---------------- |
| `getMinimum` | 获取堆的最小值。 |

对于 `MaxHeap` 来说，这个方法是：

| 方法名       | 描述             |
| ------------ | ---------------- |
| `getMaximum` | 获取堆的最大值。 |

### 存储容器

在真正开始实现二叉堆之前，我们需要选择一种数据结构来存储二叉堆的数据。

在 [二叉搜索树](https://www.jynxio.com/article/data-structure/binary-search-tree.html) 一文中，我们使用了 JavaScript 中的普通对象 `{}` 来作为存储数据的容器。虽然二叉堆也是二叉树的一种，但是我们会选用数组来作为存储数据的容器，这是因为数组非常适合用来实现完全二叉树。

如果我们使用数组来存储二叉堆的数据，那么我们就可以获得如下规律：

- 如果一个节点的序号是 `index`，那么其父节点的序号就是 `Math.floor( ( index - 1 ) / 2 )`。
- 如果一个节点的序号是 `index`，那么其左子节点的序号就是 `2 * index + 1`。
- 如果一个节点的序号是 `index`，那么其右子节点的序号就是 `2 * index + 2`。

### 实现 BaseHeap

`BaseHeap` 的实现代码如下所示：

```javascript
class BaseHeap {

    /**
     * 最小堆类和最大堆类的基类，该类仅用于实现最小堆类和最大堆类，你不应该直接使用该类。
     * @param { string } - 比较的模式，仅接受"MinHeap"或"MaxHeap"。
     * @returns { Object } - 基类的实例。
     */
    constructor ( comparative_mode ) {

        if ( comparative_mode !== "MinHeap" && comparative_mode !== "MaxHeap" ) throw new Error( "实例化失败，因为入参不合法。" );

        this._heap = [];
        this._comparativeMode = comparative_mode;

    }

    /**
     * 向堆插入一个值。
     * @param { number } value - 待插入的值。
     * @returns { Object } - 实例本身。
     */
    insert ( value ) {

        this._heap.push( value );
        this._shiftUp( this.getCount() - 1 );

        return this;

    }

    /**
     * 移除堆的第一个节点（即极值节点）。
     * @returns { Object } - 实例本身。
     */
    shift () {

        if ( this.getCount() === 0 ) return this;
        if ( this.getCount() === 1 ) {

            this._heap.length --;

            return this;

        }

        this._swap( 0, this.getCount() - 1 );
        this._heap.length --;
        this._shiftDown( 0 );

        return this;

    }

    /**
     * 获取堆的节点数。
     * @returns { number } - 堆的节点数。
     */
    getCount () {

        return this._heap.length;

    }

    /**
     * 获取堆的极值（即第一个节点的值）。
     * @returns { number } - 对于最小堆而言，是最小值。对于最大堆而言，是最大值。
     */
    _getExtremum () {

        if ( this.getCount() === 0 ) throw new Error( "获取失败：因为该堆为空。" );

        return this._heap[ 0 ];

    }

    /**
     * 获取完全二叉树格式的堆。
     */
    getTree () {

        const core = index => {

            /* 基线条件 */
            if ( index === - 1 ) return;

            const node = {};

            node.value = this._heap[ index ];
            node.leftChild = core( this._getLeftChildIndex( index ) );
            node.rightChild = core( this._getRightChildIndex( index ) );

            return node;

        };

        return core( 0 );

    }

    /**
     * （内部方法）获取父节点的index。
     * @param { number } index - 当前节点的index。
     * @returns { number } - 父节点的index（如果当前节点没有父节点，那么就会返回-1）。
     */
    _getParentIndex ( index ) {

        if ( index >= this.getCount() ) throw new Error( "获取失败：因为入参不合法。" );

        return Math.floor( ( index - 1 ) / 2 );

    }

    /**
     * （内部方法）获取左子节点的index。
     * @param { number } index - 当前节点的index。
     * @returns { number } - 左子节点的index（如果当前节点没有左子节点，那么就会返回-1）。
     */
    _getLeftChildIndex ( index ) {

        if ( index >= this.getCount() ) throw new Error( "获取失败：因为入参不合法。" );

        const left_child_index = index * 2 + 1;

        if ( left_child_index >= this.getCount() ) return - 1;

        return left_child_index;

    }

    /**
     * （内部方法）获取右子节点的index。
     * @param { number } index - 当前节点的index。
     * @returns { number } - 右子节点的index（如果当前节点没有右子节点，那么就会返回-1）。
     */
    _getRightChildIndex ( index ) {

        if ( index >= this.getCount() ) throw new Error( "获取失败：因为入参不合法。" );

        const right_child_index = index * 2 + 2;

        if ( right_child_index >= this.getCount() ) return - 1;

        return right_child_index;

    }

    /**
     * （内部方法）比较第一个值是否不大于第二个值，或第二个值是否不大于第一个值。
     * @param { number } value_1 - 第一个值。
     * @param { number } value_2 - 第二个值。
     * @returns { boolean } - 如果是最小堆的实例调用该方法，那么就会返回value_1 <= value_2的结果。如果是最大堆的实例调用该方法，那么就会返回value_1 >= value_2的结果。
     */
    _compare ( value_1, value_2 ) {

        if ( this._comparativeMode === "MinHeap" ) return value_1 < value_2;
        if ( this._comparativeMode === "MaxHeap" ) return value_1 > value_2;

        throw new Error( "比较失败：因为发生了意外的情况。" );

    }

    /**
     * （内部方法）交换两个节点的值。
     * @param { number } index_1 - 第一个节点的index。
     * @param { number } index_2 - 第二个节点的index。
     */
    _swap ( index_1, index_2 ) {

        if ( index_1 >= this.getCount() ) throw new Error( "交换失败：因为入参不合法。" );
        if ( index_2 >= this.getCount() ) throw new Error( "交换失败：因为入参不合法。" );

        [ this._heap[ index_1 ], this._heap[ index_2 ] ] = [ this._heap[ index_2 ], this._heap[ index_1 ] ];

    }

    /**
     * （内部方法）上移节点，通过向上移动节点来使堆保持正确。
     * @param { number } index - 待上移的节点的index。
     */
    _shiftUp ( index ) {

        const parent_index = this._getParentIndex( index );

        /* 基线条件 */
        if ( parent_index === - 1 ) return;
        if ( ! this._compare( this._heap[ index ], this._heap[ parent_index ] ) ) return;

        this._swap( index, parent_index );
        this._shiftUp( parent_index );

    }

    /**
     * （内部方法）下移节点，通过向下移动节点来使堆保持正确。
     * @param { number } index - 待下移的节点的index。
     */
    _shiftDown( index ) {

        let largest_node_index = index;

        const left_child_index = this._getLeftChildIndex( index );
        const right_child_index = this._getRightChildIndex( index );

        left_child_index !== - 1
        &&
        this._compare( this._heap[ left_child_index ], this._heap[ largest_node_index ] )
        &&
        ( largest_node_index = left_child_index );

        right_child_index !== - 1
        &&
        this._compare( this._heap[ right_child_index ], this._heap[ largest_node_index ] )
        &&
        ( largest_node_index = right_child_index );

        /* 基线条件 */
        if ( largest_node_index === index ) return;

        this._swap( index, largest_node_index );
        this._shiftDown( largest_node_index );

    }

}
```

### 实现 MinHeap

`MinHeap` 的实现代码如下所示：

```javascript
class MinHeap extends BaseHeap {

    /**
     * 最小堆类。
     * @returns { Object } - 最小堆类的实例。
     */
    constructor () {

        super( "MinHeap" );

    }

    /**
     * 获取堆的最小值。
     * @returns { number } - 堆的最小值。
     */
    getMinimum () {

        return this._getExtremum();

    }

}
```

### 实现 MaxHeap

`MaxHeap` 的实现代码如下所示：

```javascript
class MaxHeap extends BaseHeap {

    /**
     * 最大堆类。
     * @returns { Object } - 最大堆的实例。
     */
    constructor () {

        super( "MaxHeap" );

    }

    /**
     * 获取堆的最大值。
     * @returns { number } - 堆的最大值。
     */
    getMaximum () {

        return this._getExtremum();

    }

}
```

## 堆排序算法

堆排序算法是指基于二叉堆数据结构来实现的排序算法，它可以对无序数组进行排序，以生成升序数组或降序数组。堆排序算法的时间复杂度是 `O(nlogn)`。

如果你已经明白了最小堆和最大堆的实现原理，那么你就可以很轻易的想到堆排序算法的实现思路：

1. 将无序数组的所有数字值都依次插入到一个最小堆中去。
2. 不断弹出并记录最小堆的最小值，直至最小堆变空为止。
3. 即可获得升序数组或降序数组。

![堆排序算法](/algorithm-and-data-structure/binary-heap/heap-sort-algorithm.png)

其实现代码如下：

```javascript
/**
 * 堆排序算法，用于对无序数组进行升序排序和降序排序，该算法不会改变原始数据。
 * @param { number[] } data - 无序数组。
 * @returns { Array } - 一个数组，第一个元素是升序排列数组，第二个元素是降序排列数组。
 * @example
 * f( [ 3, 1, 2 ] ); // return [ [ 1, 2, 3 ], [ 3, 2 ,1 ] ]
 */
function heapSort ( data ) {

    /*  */
    const min_heap = new MinHeap;

    data.forEach( number => min_heap.insert( number ) )

    /*  */
    const ascending_order = [];  // 升序排列
    const descending_order = []; // 降序排列

    for ( let i = 0; i < data.length; i ++ ) {

        const minimum = min_heap.getMinimum();

        ascending_order[ i ] = minimum;
        descending_order[ data.length - 1 - i ] = minimum;

        min_heap.shift();

    }

    return [ ascending_order, descending_order ];

}
```

## 动态中位数算法

基于二叉堆，我们可以实现一个有趣且实用的动态中位数算法。

该算法可用于计算动态的无序数组的中位数，该算法的冷启动效率较低，热更新效率较高。具体来说，就是当你第一次获取一个无序数组的中位数时，该操作的时间复杂度为 `O(nlogn)`，而当你向该无序数组新增一个数字值，并再次获取该无序数组的中位数时，该操作的时间复杂度为 `O(logn)`。

### 原理

该算法的原理是：

1. 将无序数组拆分成一个最小堆和一个最大堆。
2. 最小堆的最小值必须不小于最大堆的最大值。
3. 联立最小堆的最小值和最大堆的最大值即可求出中位数。

![动态中位数算法的思想](/algorithm-and-data-structure/binary-heap/dynamic-median-idea.png)

### 实现

如何构造出满足要求的最小堆和最大堆呢？具体实现步骤如下：

1. 使用无序数组的前半部分数字值来创建一个最小堆。
2. 遍历无序数组的后半部分数字值：
   1. 如果某个数字值大于最小堆的最小值，那么就将这个数字值插入到最小堆中去，然后弹出最小堆的堆顶节点。
   2. 如果某个数字值小于或等于最小堆的最小值，那么就跳过这个数字值。
3. 使用无序数组的剩余数字值（指未插入到最小堆中的数字值）来创建一个最小堆。

![动态中位数算法的实现](/algorithm-and-data-structure/binary-heap/dynamic-median-implementation.png)

> 该过程的时间复杂度为 `O(nlong)`，推理如下：已知二叉树的插入操作的时间复杂度是 `O(logn)`，假设无序数组的长度为 `n`，那么第一步的时间复杂度就是 `O(log1 + log2 + ... + logn/2)`，即 `O(logn!)`，由于 `nlong` 是 `logn!` 的同阶函数，所以该步骤的时间复杂度可转换为 `O(nlogn)`。同理，第二步和第三步的时间复杂度都是 `O(nlogn)`，因此整个过程的时间复杂度就是 `O(nlogn)`。

### 插入

如果我们需要向无序数组插入一个新的数字值，并希望求出新的无序数组的中位数的话，那么我们需要这么做：

1. 将新的数字值插入到最小堆或最大堆中去。
2. 调整最小堆和最大堆，使它们的节点数的差值不大于 `1`。
3. 联立最小堆的最小值和最大堆的最大值即可求出新的中位数。

![动态中位数算法的插入原理](/algorithm-and-data-structure/binary-heap/dynamic-median-insert.png)

> 该过程的时间复杂度是 `O(logn)`，推理如下：
>
> 第一步的时间复杂度是 `O(logn)`。第二步可能会引发到一至多次的插入节点和移除堆顶节点操作，其时间复杂度也是 `O(logn)`。第三步的时间复杂度是 `O(1)`。最后，可得整个过程的时间复杂度就是 `O(long)`。

### 编码

该算法的实现代码如下：

```javascript
class DynamicMedian {

    #data;
    #min_heap;
    #max_heap;

    /**
     * 动态中位数的类，用于计算动态无序数组的中位数，该算法不会改变原始数据。
     * @example
     * const f = new F();
     * f.setData( [ 3, 1, 5 ] ); // retutn f   - O(nlogn)
     * f.getMedian();            // return 3   - O(1)
     * f.insertNumber( 4 );      // return f   - O(logn)
     * f.getMedian();            // return 3.5 - O(1)
     */
    constructor () {}

    /**
     * 设置无序数组。
     * @param { number[] } data - 无序数组，即一组无序的数字值，比如[3, 1, 2]。
     * @returns { Object } - 实例本身。
     */
    setData ( data ) {

        if ( data.length === 0 ) throw new Error( "计算失败：因为入参不合法。" );

        this.#data = [ ... data ];
        this.#min_heap = new MinHeap();
        this.#max_heap = new MaxHeap();

        const data_count = this.#data.length;
        const min_heap_count = Math.ceil( data_count / 2 );
        const max_heap_count = data_count - min_heap_count;

        /* 初始化最小堆 */
        for ( let i = 0; i < min_heap_count; i ++ ) this.#min_heap.insert( this.#data[ i ] );

        for ( let i = min_heap_count; i < data_count; i ++ ) {

            const minimum = this.#min_heap.getMinimum();

            if ( minimum >= this.#data[ i ] ) continue;

            this.#min_heap.shift();
            this.#min_heap.insert( this.#data[ i ] );

        }

        /* 初始化最大堆 */
        for ( let i = 0; i < max_heap_count; i ++ ) this.#max_heap.insert( this.#data[ i ] );

        for ( let i = max_heap_count; i < data_count; i ++ ) {

            const maximum = this.#max_heap.getMaximum();

            if ( maximum <= this.#data[ i ] ) continue;

            this.#max_heap.shift();
            this.#max_heap.insert( this.#data[ i ] );

        }

        return this;

    }

    /**
     * 获取无序数组。
     * @returns { number[] } - 无序数组。
     */
    getData () {

        if ( ! this.#data ) throw new Error( "执行失败：因为没有设置无序数组。" );

        return this.#data;

    }

    /**
     * 获取无序数组的中位数。
     * @returns { number } - 无序数组的中位数。
     */
    getMedian () {

        if ( ! this.#data ) throw new Error( "执行失败：因为没有设置无序数组。" );

        /* 如果无序数组有奇数个数字值 */
        if ( this.#data.length % 2 === 1 ) return this.#min_heap.getMinimum();

        /* 如果无序数字有偶数个数字值 */
        return ( this.#min_heap.getMinimum() + this.#max_heap.getMaximum() ) / 2;

    }

    /**
     * 插入一个数字值。
     * @param { number } number - 一个数字值。
     * @returns { Object } - 实例本身。
     */
    insertNumber ( number ) {

        if ( ! this.#data ) throw new Error( "执行失败：因为没有设置无序数组。" );

        this.#data.push( number );

        /* 如果无序数组有奇数个数字值 */
        if ( this.#data.length % 2 === 1 ) {

            if ( number >= this.#max_heap.getMaximum() ) {

                this.#min_heap.insert( number );

                return this;

            }

            this.#max_heap.insert( number );
            this.#min_heap.insert( this.#max_heap.getMaximum() );
            this.#max_heap.shift();

            return this;

        }

        /* 如果无序数字有偶数个数字值 */
        if ( number <= this.#min_heap.getMinimum() ) {

            this.#max_heap.insert( number );

            return this;

        }

        this.#min_heap.insert( number );
        this.#max_heap.insert( this.#min_heap.getMinimum() );
        this.#min_heap.shift();

        return this;

    }

}
```

## 源码

你可以从 [这里](https://github.com/jynxio/data-structure-and-algorithm/blob/main/data-structure/Heap.js) 获取得到 `MinHeap` 和 `MaxHeap` 的完整源码。

你可以从 [这里](https://github.com/jynxio/data-structure-and-algorithm/blob/main/algorithm/heapSort.js) 获取得到 `heapSort` 的完整源码。

你可以从 [这里](https://github.com/jynxio/data-structure-and-algorithm/blob/main/algorithm/DynamicMedian.js) 获取得到 `DynamicMedian` 的完整源码。