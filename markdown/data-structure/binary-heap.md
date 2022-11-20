---
typora-root-url: ..\..
---

# 二叉堆

## 概述

二叉堆是一种特殊的完全二叉树，其分为最小堆和最大堆。其中，最小堆的定义是：父节点的值必须不大于子节点的值，而最大堆的定义是：父节点的值必须不小于子节点的值。

![最小堆和最大堆](/static/image/markdown/data-structure/binary-heap/minheap-and-maxheap.png)

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

在真正开始实现二叉堆之前，我们需要选择一种数据结构来存储二叉堆的数据。本文将会选择数组来作为数据的存储容器，这是因为数组可以很轻松的实现

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
export class MinHeap extends BaseHeap {

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
export class MaxHeap extends BaseHeap {

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

堆排序算法是指基于二叉堆数据结构来实现的排序算法，它可以对无序数组进行排序，以生成升序数组或降序数组。

如果你已经明白了最小堆和最大堆的实现原理，那么你就可以很轻易的想到堆排序算法的实现思路。

具体来说，我们只要将无序数组的所有数据都依次插入到一个最小堆实例中去，然后不断弹出并存储最小堆实例的最小值，直至最小堆实例变空为止，我们就可以获得一个升序数组了。只要反转这个升序数组，我们就可以获得一个降序数组。

![堆排序算法](/static/image/markdown/data-structure/binary-heap/heap-sort-algorithm.png)

其实现代码如下：

```javascript
/**
 * 堆排序算法，用于对无序数组进行升序排序和降序排序，该算法不会改变原始数据。
 * @param { number[] } data - 无序数组。
 * @returns { Array } - 一个数组，第一个元素是升序排列数组，第二个元素是降序排列数组。
 * @example
 * f( [ 3, 1, 2 ] ); // return [ [ 1, 2, 3 ], [ 3, 2 ,1 ] ]
 */
export default function heapSort ( data ) {

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

## 中位数算法

## 源码