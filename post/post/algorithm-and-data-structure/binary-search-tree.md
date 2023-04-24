---
typora-root-url: ./..\..\image
---

# 二叉搜索树

## 概述

二叉搜索树是一种特殊的二叉树，其遵循下述规则：

- 左侧子节点的值必须比父节点的值小。
- 右侧子节点的值必须比父节点的值大。
- 树中每个节点的值都是唯一的。

得益于这种特性，我们可以用二叉搜索树来做二分查找。

![满二叉搜索树](/algorithm-and-data-structure/binary-search-tree/binary-search-tree.png)

本文会实现二叉搜索树，并且在实现的过程中，会使用使用数字值来作为二叉搜索树的节点的值，这是因为数字值与数字值之间天然就可以比较大小。

> 如果你可以定义一个规则，来比较其他类型的值与其他类型的值之间的大小，那么你也可以用其他类型的值来作为二叉搜索树的节点的值。
>
> 比如使用字符串来作为节点的值，之所以可以这么做，是因为在 JavaScript 中，字符串与字符串之间会通过隐式的转换为 ASCII 码来比较大小。

## 效率

在理想情况下（即满二叉搜索树时），二叉搜索树的新增、删除、搜索节点的时间复杂度均为 `O(logn)`，具体推理可见后文。

在最坏情况下（即退化成链表时），二叉搜索树的新增、删除、搜索节点的时间复杂度就会变成 `O(n)`，这是显而易见的。

![时间复杂度](/algorithm-and-data-structure/binary-search-tree/time-complexity.png)

`O(logn)` 的推导如下：

```
1.首先，假设满二叉搜索树的节点数为n、高度为h，则n与h满足以下关系：
  n = 2^0 + 2^1 + 2^2 + ... + 2^h

2.等式两边同时乘以2，进一步可得：
  2n = 2^1 + 2^2 + ... + 2^( h+1 )

3.计算2n-n，可得：
  n = ( 2^1 + 2^2 + ... + 2^( h+1 ) ) - ( 2^0 + 2^1 + 2^2 + ... + 2^h )
    = 2^( h+1 ) - 2^0
    = 2^( h+1 ) - 1
  
4.最终，转化可得：
  h = log2( n + 1 ) - 1;

5.对于一棵满二叉搜索树而言，其在最坏情况下的搜索操作的时间频度就等于h+1，即log2( n + 1 )，因此其搜索操作的时间复杂度就等于O(logn)，而新增与删除操作同理。
```

## 实现

我们将会实现一个名为 `BinarySearchTree` 的二叉搜索树的类，它将会拥有下述方法：

| 方法名                          | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `insert( value )`               | 插入一个值为 `value` 的节点，然后返回更新后的树。            |
| `remove( value )`               | 移除一个值为 `value` 的节点，然后返回更新后的树。            |
| `search( value )`               | 搜索一个值为 `value` 的节点，然后返回一个布尔值来代表该节点是否存在。 |
| `inorderTraverse( callback )`   | 中序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `preorderTraverse( callback )`  | 先序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `postorderTraverse( callback )` | 后序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |

### 创建节点类

首先，让我们来创建一个节点的类 `BinarySearchTreeNode`。

```js
class BinarySearchTreeNode {

    constructor ( value ) {

        this.value = value;
        this.left = undefined;
        this.right = undefined;

    }

}
```

### 创建二叉搜索树类

接下来，让我们来创建二叉搜索树的类 `BinarySearchTree`，它目前只有构造器方法，我们会在后续为其继续补充剩余的方法。

```js
class BinarySearchTree {

    constructor () { this.root = undefined }

}
```

### 创建 insert 方法

`insert` 方法的实现思路如下：

1. 首先易知，向二叉搜索树插入的新节点必然会成为它的叶节点。
2. 如果根节点为空，那么就直接把新节点作为根节点。
3. 如果新节点的值小于根节点的值，那么就把新节点插入到根节点的左侧：
   1. 如果根节点的左侧子节点为空，那么就直接把新节点作为根节点的左侧子节点。
   2. 否则，把根节点的左侧子节点当作一棵新的二叉搜索树，然后将新节点插入到这棵新的二叉搜索树中去，即递归调用。
4. 如果新节点的值大于根节点的值，那么就把新节点插入到根节点的右侧：
   1. 如果根节点的右侧子节点为空，那么就直接把新节点作为根节点的右侧子节点。
   2. 否则，把根节点的右侧子节点当作一棵新的二叉搜索树，然后将新节点插入到这棵新的二叉搜索树中去，即递归调用。
5. 如果新节点的值等于根节点的值，那么就抛出错误，因为二叉搜索树中每个节点的值都应该是唯一的。

![insert](/algorithm-and-data-structure/binary-search-tree/insert.png)

`insert` 方法的实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

    /**
     * 插入节点。
     * @param { number } value - 节点的值。
     * @returns { Object } - 更新后的BinarySearchTree实例。
     */
    insert ( value ) {

        this.root = core( this.root, value );

        return this;

        function core ( root, value ) {

            /* 基线条件 */
            if ( root === undefined ) return new BinarySearchTreeNode( value );
            if ( root.value === value ) throw new Error( "This value already exists." );

            /* 递归 */
            if ( root.value > value ) root.left = core( root.left, value );
            if ( root.value < value ) root.right = core( root.right, value );

            return root;

        }

    }

}
```

### 创建 remove 方法

`remove` 方法的实现比 `insert` 方法更难，其实现思路如下：

1. 如果根节点为空，那么就直接结束该方法。
2. 如果待移除节点的值小于根节点的值，那么就把根节点的左侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去移除这个待移除节点，即递归调用。
3. 如果待移除节点的值大于根节点的值，那么就把根节点的右侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去移除这个待移除节点，即递归调用。
4. 如果待移除节点的值等于根节点的值，且：
   1. 如果根节点的左侧子节点和右侧子节点均为空，那么就直接移除根节点。
   2. 如果根节点的左侧子节点不为空，右侧子节点为空，那么就用左侧子节点来替代根节点。
   3. 如果根节点的左侧子节点为空，右侧子节点不为空，那么就用右侧子节点来替代根节点。
   4. 如果根节点的左侧子节点和右侧子节点均不为空，那么就把左侧子节点当作一棵新的二叉搜索树，然后移除这棵二叉搜索树中的最大值节点，并用这个最大值节点来替代根节点。

![remove](/algorithm-and-data-structure/binary-search-tree/remove.png)

`remove` 方法的实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

    /**
     * 删除节点。
     * @param { number } value - 节点的值。
     * @returns { Object } - 更新后的BinarySearchTree实例。
     */
    remove ( value ) {

        this.root = core( this.root, value );

        return this;

        function core ( root, value ) {

            /* 基线条件 */
            if ( root === undefined ) return;
            if ( root.value === value ) {

                if ( root.left === undefined && root.right === undefined ) return;
                if ( root.left === undefined ) return root.right;
                if ( root.right === undefined ) return root.left;

                const new_root = new BinarySearchTreeNode( findMaxValue( root.left ) );
                const new_left = core( root.left, new_root.value );
                const new_right = root.right;

                new_root.left = new_left;
                new_root.right = new_right;

                return new_root;

            }

            /* 递归 */
            if ( root.value > value ) root.left = core( root.left, value );
            if ( root.value < value ) root.right = core( root.right, value );

            return root;

        }

        function findMaxValue ( root ) {

            if ( root.right === undefined ) return root.value;

            return findMaxValue( root.right );

        }

    }

}
```

### 创建 search 方法

`search` 方法是最简单的，其实现思路如下：

1. 如果搜索节点的值小于根节点的值，那么就把根节点的左侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去搜索这个搜索节点。
2. 如果搜索节点的值大于根节点的值，那么就把根节点的右侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去搜索这个搜索节点。
3. 如果搜索节点的值等于根节点的值，那么就直接返回 `true`。
4. 如果根节点的值为空，那么就直接返回 `false`，这种情况代表着树中不存在待搜索的值。

![search](/algorithm-and-data-structure/binary-search-tree/search.png)

`search` 方法的实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

	/**
     * 搜索节点。
     * @param { number } value - 节点的值。
     * @returns { boolean } - 如果存在值为value的节点，则返回true，否则返回false。
     */
    search ( value ) {

        return core( this.root, value );

        function core ( root, value ) {

            /* 基线条件 */
            if ( root === undefined ) return false;
            if ( root.value === value ) return true;

            /* 递归 */
            if ( root.value > value ) return core( root.left, value );
            if ( root.value < value ) return core( root.right, value );

        }

    }

}
```

### 创建 inorderTraverse 方法

中序遍历的遍历顺序如下图所示：

![inorderTraverse](/algorithm-and-data-structure/binary-search-tree/inorder-traverse.png)

> 显然，中序遍历会按照节点值从小到大的顺序来遍历所有的节点。

`inorderTraverse` 方法的实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

    /**
     * 中序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。
     * @param { Function } - 回调函数。
     */
    inorderTraverse ( callback ) {

        core( this.root );

        function core ( root ) {

            if ( root === undefined ) return;

            core( root.left );
            callback( root.value );
            core( root.right );

        }

    }

}
```

### 创建 preorderTraverse

先序遍历的遍历顺序如下图所示：

![preorderTraverse](/algorithm-and-data-structure/binary-search-tree/preorder-traverse.png)

只需稍稍修改一下中序遍历，就能实现先序遍历了，其实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

    /**
     * 先序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。
     * @param { Function } - 回调函数。
     */
    preorderTraverse ( callback ) {

        core( this.root );

        function core ( root ) {

            if ( root === undefined ) return;

            callback( root.value );
            core( root.left );
            core( root.right );

        }

    }

}
```

### 创建 postorderTraverse

后序遍历的遍历顺序如下图所示：

![postorderTraverse](/algorithm-and-data-structure/binary-search-tree/postorder-traverse.png)

同样的，只需稍稍修改一下中序遍历，就能实现后序遍历了，其实现代码如下：

```js
// Note：该实现省略了构造器方法与其他方法。
class BinarySearchTree {

    /**
     * 后序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。
     * @param { Function } - 回调函数。
     */
    postorderTraverse ( callback ) {

        core( this.root );

        function core ( root ) {

            if ( root === undefined ) return;

            core( root.left );
            core( root.right );
            callback( root.value );

        }

    }

}
```

## 源码

你可以通过该 [库](https://github.com/jynxio/leetcode-everyday) 的 [Tree.js](https://github.com/jynxio/leetcode-everyday/blob/main/Tree.js) 文件，来获取 `BinarySearchTree` 的完整源码。