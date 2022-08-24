---
typora-root-url: ..\..
---

# 树

## 概述

树是一种树状的数据结构，它由 n（n > 0）个有限的节点组成，比如族谱、公司职级架构就是典型的树数据结构。

树中的每个元素都叫做节点。其中，没有父节点的节点叫做根节点，根节点位于树的顶部。没有子节点的节点叫做叶节点，叶节点位于每条路径的底部。

我们可以对树进行分层，其中根节点位于第 0 层，根节点的子节点位于第 1 层，以此类推。而树的高度就等于最大层数。

![树](/static/image/markdown/data-structure/tree/tree.png)

## 二叉树

二叉树是树的一种，二叉树中的每个节点最多只有 2 个子节点，其中一个是左侧子节点，另一个是右侧子节点。

![二叉树](/static/image/markdown/data-structure/tree/binary-tree.png)

## 完全二叉树

完全二叉树是二叉树的一种特殊形态，其定义为：对于一个高度为 h 的二叉树，除了第 h 层外，其余各层的节点数都达到了最大值，且第 h 层的所有节点是从左到右连续排列的。

![完全二叉树](/static/image/markdown/data-structure/tree/complete-binary-tree.png)

## 满二叉树

满二叉树是完全二叉树的一种特殊形态，其定义为：每一层的节点数都达到了最大值。

![满二叉树](/static/image/markdown/data-structure/tree/full-binary-tree.png)

## 平衡二叉树

如果一棵二叉树的任意节点的左侧子树和右侧子树的高度差不大于 1，那么我们就称这棵二叉树为平衡二叉树。平衡二叉树是二叉树的一种特殊形态。

## 二叉搜索树

二叉搜索树是二叉树的一种子类，它是一种按照特定规则来放置节点的二叉树，具体来说：左侧子节点的值必须比父节点的值小，右侧子节点的值必须比父节点的值大。下图所示的是一棵满的二叉搜索树。

![满二叉搜索树](/static/image/markdown/data-structure/tree/binary-search-tree.png)

> 本文将会使用数字值来作为二叉搜索树的节点的值，因为数字值与数字值之间天然就可以比较大小。
>
> 如果你可以定义一个规则，来比较其他类型的值与其他类型的值之间的大小，那么你也可以用其他类型的值来作为二叉搜索树的节点的值。比如，如果你使用 JavaScript 来实现二叉搜索树，那么你可以在节点中存储字符串，因为在 JavaScript 中，字符串与字符串之间会隐式的通过转换为 ASCII 码来比较大小。

### 时间复杂度

在理想情况下（即满二叉搜索树时），二叉搜索树的新增、删除、搜索节点的时间复杂度均为 `O(logn)`。

在最坏情况下（即退化成链表时），二叉搜索树的新增、删除、搜索节点的时间复杂度就会变成 `O(n)`。

![两种情况下的时间复杂度](/static/image/markdown/data-structure/tree/binary-search-tree-time-complexity.png)

> `O(logn)` 的推导如下：
>
> 首先，假设满二叉搜索树的节点数为 `n`、高度为 `h`，则 `n` 与 `h` 满足以下关系：
>
> ```
> n = 2^0 + 2^1 + 2^2 + ... + 2^h
> ```
>
> 等式两边同时乘以 `2`，进一步可得：
>
> ```
> 2n = 2^1 + 2^2 + ... + 2^( h+1 )
> ```
>
> 计算 `2n-n`，可得：
>
> ```
> n = ( 2^1 + 2^2 + ... + 2^( h+1 ) ) - ( 2^0 + 2^1 + 2^2 + ... + 2^h )
>   = 2^( h+1 ) - 2^0
>   = 2^( h+1 ) - 1
> ```
>
> 最终，转化可得：
>
> ```
> h = log2( n + 1 ) - 1;
> ```
>
> 对于一棵满二叉搜索树而言，其在最坏情况下的搜索操作的时间频度就等于 `h+1`，即 `log2( n + 1 )`，因此其搜索操作的时间复杂度就等于 `O(logn)`，而新增与删除操作同理。

## AVL 树

AVL 树（Adelson-Velskii-Landi Tree）是计算机科学中最早被发明的自平衡二叉搜索树。

> 自平衡二叉搜索树是一种会自动保持平衡的二叉搜索树，具体来说，每当新增或删除节点之后，自平衡二叉搜索树都会检查自身是否仍然平衡，如果不平衡了，那么它就会通过平衡操作来使自己变回平衡状态。

相对于二叉搜索树，AVL 树的新增、删除、搜索操作在平均和最坏情况下的时间复杂度都是 `O(logn)`，因为 AVL 树的任意节点的左子树和右子树的高度差都不会超过 1，这意味着 AVL 树总会保持一种比较接近满二叉树的状态。

### 平衡因子

AVL 树在每次新增和移除节点之后，都要检查每个节点是否处于平衡状态，而平衡因子（Balance Factor）就是量化平衡状态的指标。

平衡因子的定义非常简单，它就等于节点左子树的高度减去右子树的高度（或相反）。如果 AVL 树中任意一个节点的平衡因子的绝对值大于了 `1`，那么就意味着该节点的左子树和右子树的高度差超过了 `1`，此时就要进行平衡操作来使其该节点回归平衡状态。

下图展示了一棵二叉树的各个节点的高度（`h`）和平衡因子（`bc`）。

![AVL树的平衡因子](/static/image/markdown/data-structure/tree/avl-tree-balance-factor.png)

### 平衡操作

当 AVL 树新增或移除一个节点之后，如果某些节点变得不平衡了，那么我们就需要“自下向上”对以这些节点作为根节点的子树进行平衡操作，来使这些子树统统回归到平衡状态。而这个平衡操作就是旋转，旋转的具体含义就是改变树的形态，来使其变得平衡。

> 当我们对子树进行了旋转之后，子树便回归了平衡状态，但是子树的形态也必然会发生改变，这就会影响到子树的祖先节点，因为子树的祖先节点有可能会因此变得不平衡。因此在旋转了子树之后，我们还要向上检查祖先节点的平衡因子，并对那些不平衡的祖先节点进行旋转。
>
> 如果在某一次新增或移除操作之后，AVL 树中有多个节点都变得不平衡了，那么我们就要自下向上的来旋转这些节点。因为如果我们自上而下的旋转这些节点，那么出于上述原因，当我们处理到下面的节点时，我们还是要自下而上的再检查和旋转一遍的，与其如此倒不如一开始就自下而上的处理罢。

如下图所示，当我们向一棵平衡二叉搜索树插入 `70` 节点后，树中的 `40` 节点和 `80` 节点就会变得不平衡，此时我们就要：

1. 旋转蓝框内的树。
2. 检查以 `30` 节点为根节点的树是否平衡：
   1. 如果不平衡，那么就旋转这棵树。
   2. 如果平衡，那么就跳转到下一步。
3. 旋转黄框内的树。

![AVL树的平衡操作](/static/image/markdown/data-structure/tree/avl-tree-rotation-example.png)

AVL 树的旋转分为 4 种类型：左旋、右旋、左旋再右旋、右旋再左旋。

### 左旋

当树呈现右-右形态时，我们就需要使用左旋。其中，右-右形态是指：树的平衡因子为 `-2`，且右侧子节点的平衡因子为 `0` 或 `-1`。而左旋的具体操作是：

1. 右侧子节点替代根节点，成为新的根节点。
2. 新根节点的左侧子节点转移给旧根节点，成为旧根节点的右侧子节点。
3. 旧根节点成为新根节点的左侧子节点。

![左旋](/static/image/markdown/data-structure/tree/avl-tree-rotate-left.png)

### 右旋

当树呈现左-左形态时，我们就需要使用右旋。其中，左-左形态是指：树的平衡因子为 `2`，且左侧子节点的平衡因子为 `0` 或 `1`。而右旋的具体操作是：

1. 左侧子节点替代根节点，成为新的根节点。
2. 新根节点的右侧子节点转移给旧根节点，成为旧根节点的左侧子节点。
3. 旧根节点成为新根节点的右侧子节点。

![右旋](/static/image/markdown/data-structure/tree/avl-tree-rotate-right.png)

### 左旋再右旋

当树呈现左-右形态时，我们就需要先使用左旋，再使用右旋。其中，左-右形态是指：树的平衡因子为 `2`，且左侧子节点的平衡因子为 `-1`。旋转的具体操作是：

1. 对树的左侧子节点进行左旋，来将树转换成左-左形态。
2. 对树进行右旋。

![左旋再右旋](/static/image/markdown/data-structure/tree/avl-tree-rotate-left-right.png)

### 右旋再左旋

当树呈现右-左形态时，我们就需要先使用右旋，再使用左旋。其中，右-左形态是指：树的平衡因子为 `-2`，且右侧子节点的平衡因子为 `1`。旋转的具体操作是：

1. 对树的右侧子节点进行右旋，来将树转换成右-右形态。
2. 对树进行左旋。

![右旋再左旋](/static/image/markdown/data-structure/tree/avl-tree-rotate-right-left.png)

## 红黑树

红黑树也是一种自平衡的二叉搜索树，红黑树的新增和删除性能比 AVL 树更好，AVL 树的搜索性能比红黑树更好。红黑树比 AVL 树要复杂的多，树中的每个节点都需要遵循以下规则：

- 节点是红色或黑色的。
- 根节点是黑色的。
- 所有叶节点都是黑色的，且所有叶节点都是空节点。
- 红色节点不能与红色节点直接连通。
- 从任一节点到其每个叶节点的所有简单路径都包含相同数目的黑色节点。

> 暂未实现红黑树。

## 实现二叉搜索树

我们的二叉搜索树将会拥有以下方法：

| 方法名                          | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `insert( value )`               | 插入一个值为 `value` 的节点，然后返回更新后的树。            |
| `remove( value )`               | 移除一个值为 `value` 的节点，然后返回更新后的树。            |
| `search( value )`               | 搜索一个值为 `value` 的节点，然后返回一个布尔值来代表该节点是否存在。 |
| `inorderTraverse( callback )`   | 中序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `preorderTraverse( callback )`  | 先序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `postorderTraverse( callback )` | 后序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |

### 创建节点类

二叉搜索树的节点拥有 3 个属性，分别是值、左侧子节点的指针、右侧子节点的指针。为了方便创建节点，我们可以先构造一个节点类 `BinarySearchTreeNode`。

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

    constructor () {

        this.root = undefined;

    }

}
```

### 创建插入方法

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

![insert方法](/static/image/markdown/data-structure/tree/binary-search-tree-insert.png)

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

### 创建移除方法

`remove` 方法的实现比 `insert` 方法更难，其实现思路如下：

1. 如果根节点为空，那么就直接结束该方法。
2. 如果待移除节点的值小于根节点的值，那么就把根节点的左侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去移除这个待移除节点，即递归调用。
3. 如果待移除节点的值大于根节点的值，那么就把根节点的右侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去移除这个待移除节点，即递归调用。
4. 如果待移除节点的值等于根节点的值，且：
   1. 如果根节点的左侧子节点和右侧子节点均为空，那么就直接移除根节点。
   2. 如果根节点的左侧子节点不为空，右侧子节点为空，那么就用左侧子节点来替代根节点。
   3. 如果根节点的左侧子节点为空，右侧子节点不为空，那么就用右侧子节点来替代根节点。
   4. 如果根节点的左侧子节点和右侧子节点均不为空，那么就把左侧子节点当作一棵新的二叉搜索树，然后移除这棵二叉搜索树中的最大值节点，并用这个最大值节点来替代根节点。

![remove方法](/static/image/markdown/data-structure/tree/binary-search-tree-remove.png)

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

### 创建搜索方法

`search` 方法是最简单的，其实现思路如下：

1. 如果搜索节点的值小于根节点的值，那么就把根节点的左侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去搜索这个搜索节点。
2. 如果搜索节点的值大于根节点的值，那么就把根节点的右侧子节点当作一棵新的二叉搜索树，然后在这棵新的二叉搜索树中去搜索这个搜索节点。
3. 如果搜索节点的值等于根节点的值，那么就直接返回 `true`。
4. 如果根节点的值为空，那么就直接返回 `false`，这种情况代表着树中不存在待搜索的值。

![search方法](/static/image/markdown/data-structure/tree/binary-search-tree-search.png)

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

### 创建中序遍历方法

中序遍历的遍历顺序如下图所示：

![inorderTraverse方法](/static/image/markdown/data-structure/tree/binary-search-tree-inorder-traverse.png)

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

### 创建前序遍历方法

先序遍历的遍历顺序如下图所示：

![preorderTraverse方法](/static/image/markdown/data-structure/tree/binary-search-tree-preorder-traverse.png)

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

### 创建后序遍历方法

后序遍历的遍历顺序如下图所示：

![postorderTraverse方法](/static/image/markdown/data-structure/tree/binary-search-tree-postorder-traverse.png)

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

## 实现 AVL 树

我们实现的 AVL 树将会拥有和二叉搜索树一样的方法，所以我们可以让 AVL 树继承二叉搜索树。不过，我们需要重写 AVL 树中的 `insert` 和 `remove` 方法，来实现自平衡的特性。

### 创建 AVL 树类

首先，让我们来创建 AVL 树的类 `AdelsonVelskiiLandiTree`，它目前只有构造器方法，我们会在后续为其继续补充剩余的方法。

```js
class AdelsonVelskiiLandiTree extends BinarySearchTree {

    constructor () {

        super();

    }

}
```

### 创建 _balance 方法

我们将平衡操作封装成一个名为 `_balance` 的内部方法，这样我们的 `insert` 方法和 `remove` 方法就可以直接调用该方法来对树进行平衡处理。

`_balance` 方法是 `AdelsonVelskiiLandiTree` 类实现自平衡的关键方法，它的内部包含了：计算节点的高度、计算节点的平衡因子、左旋、右旋、左旋再右旋、右旋再左旋等子方法。

```js
// Note：该实现省略了构造器方法与其他方法。
class AdelsonVelskiiLandiTree extends BinarySearchTree {

    /**
     * （内部方法）对树进行平衡处理。
     * @param { Object } root - 树的根节点。
     * @returns { Object } - 处理后的新树的根节点。
     */
    _balance ( root ) {

        const root_balance_factor = calculateBalanceFactor( root );

        /* 树已平衡，无需处理。 */
        if ( root_balance_factor === 0 ) return root;
        if ( root_balance_factor === 1 ) return root;
        if ( root_balance_factor === - 1 ) return root;

        /* 树非平衡，需要处理。 */
        if ( root_balance_factor === 2 ) {

            const left_balance_factor = calculateBalanceFactor( root.left );

            switch ( left_balance_factor ) {

                case 0: return rotateRight( root );       // 处理左-左形态。

                case 1: return rotateRight( root );       // 处理左-左形态。

                case - 1: return rotateLeftRight( root ); // 处理左-右形态。

            }

        }

        if ( root_balance_factor === - 2 ) {

            const right_balance_factor = calculateBalanceFactor( root.right );

            switch ( right_balance_factor ) {

                case 0: return rotateLeft( root );      // 处理右-右形态。

                case 1: return rotateRightLeft( root ); // 处理右-左形态。

                case - 1: return rotateLeft( root );    // 处理右-右形态。

            }

        }

        /**
         * 计算根节点的高度。
         * @param { Object } root - 树的根节点。
         * @returns { number } - 高度。
         */
        function calculateHeight ( root ) {

            if ( root === undefined ) return - 1;

            return Math.max( calculateHeight( root.left ), calculateHeight( root.right ) ) + 1;

        }

        /**
         * 计算根节点的平衡因子（左子树高度-右子树高度）。
         * @param { Object } root - 树的根节点。
         * @returns { number } - 平衡因子。
         */
        function calculateBalanceFactor ( root ) {

            if ( root === undefined ) return;
            if ( root.left === undefined && root.right === undefined ) return 0;
            if ( root.left === undefined ) return - calculateHeight( root.right ) - 1;
            if ( root.right === undefined ) return calculateHeight( root.left ) + 1;

            return calculateHeight( root.left ) - calculateHeight( root.right );

        }

        /**
         * 向左旋转树，用于处理左-左形态的非平衡树。
         * @param { Object } root - 树的根节点。
         * @returns { Object } - 旋转后的新树的根节点。
         */
        function rotateLeft ( root ) {

            const new_root = root.right;

            root.right = new_root.left;
            new_root.left = root;

            return new_root;

        }

        /**
         * 向右旋转树，用于处理右-右形态的非平衡树。
         * @param { Object } root - 树的根节点。
         * @returns { Object } - 旋转后的新树的根节点。
         */
        function rotateRight ( root ) {

            const new_root = root.left;

            root.left = new_root.right;
            new_root.right = root;

            return new_root;

        }

        /**
         * 先向左旋转树的左子树，再向右旋转树，用于处理左-右形态的非平衡树。
         * @param { Object } root - 树的根节点。
         * @returns { Object } - 旋转后的新树的根节点。
         */
        function rotateLeftRight ( root ) {

            root.left = rotateLeft( root.left );

            return rotateRight( root );

        }

        /**
         * 先向右旋转树的右子树，再向左旋转树，用于处理右-左形态的非平衡树。
         * @param { Object } root - 树的根节点。
         * @returns { Object } - 旋转后的新树的根节点。
         */
        function rotateRightLeft ( root ) {

            root.right = rotateRight( root.right );

            return rotateLeft( root );

        }

    }

}
```

### 重写 insert 方法

```js
// Note：该实现省略了构造器方法与其他方法。
class AdelsonVelskiiLandiTree extends BinarySearchTree {

    /**
     * 插入节点，并对树进行平衡处理。
     * @param { number } value - 节点的值。
     * @returns { Object } - 更新后的BinarySearchTree实例。
     */
    insert ( value ) {

        const balance = this._balance;

        this.root = core( this.root, value );

        return this;

        function core ( root, value ) {

            /* 基线条件 */
            if ( root === undefined ) return new BinarySearchTreeNode( value );
            if ( root.value === value ) throw new Error( "This value already exists." );

            /* 递归 */
            if ( root.value > value ) root.left = core( root.left, value );
            if ( root.value < value ) root.right = core( root.right, value );

            /* 平衡化 */
            const balance_root = balance( root );

            /*  */
            return balance_root;

        }

    }

}
```

### 重写 remove 方法

```js
// Note：该实现省略了构造器方法与其他方法。
class AdelsonVelskiiLandiTree extends BinarySearchTree {

    /**
     * 删除节点，并对树进行平衡处理。
     * @param { number } value - 节点的值。
     * @returns { Object } - 更新后的BinarySearchTree实例。
     */
    remove ( value ) {

        const balance = this._balance;

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

                const balance_root = balance( new_root );

                return balance_root;

            }

            /* 递归 */
            if ( root.value > value ) root.left = core( root.left, value );
            if ( root.value < value ) root.right = core( root.right, value );

            const balance_root = balance( root );

            return balance_root;

        }

        function findMaxValue ( root ) {

            if ( root.right === undefined ) return root.value;

            return findMaxValue( root.right );

        }

    }

}
```

## 源码

本文已将实现链表的源码上传至该 [库](https://github.com/jynxio/leetcode-everyday) 的 [Tree.js](https://github.com/jynxio/leetcode-everyday/blob/main/Tree.js) 文件中。