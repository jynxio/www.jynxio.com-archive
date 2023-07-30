---
typora-root-url: ./..\..\image
---

# AVL 树

## 概述

AVL 树（Adelson-Velskii-Landi Tree）是计算机科学中最早被发明的自平衡二叉搜索树，而自平衡树是一种会自动保持平衡的二叉树。具体来说，每当新增或删除节点之后，自平衡二叉搜索树都会检查自身是否仍然处于平衡状态，如果任意节点的左侧子树和右侧子树的高度差不大于 `1`，那么就可以认为自己处于平衡状态，否则自平衡二叉树就需要通过旋转操作来使自己回归到平衡状态。

相较于二叉搜索树，AVL 树的新增、删除、搜索操作在平均和最坏情况下的时间复杂度都是 `O(logn)`，这得益于 AVL 树总是会保持着一种较为接近满二叉树的形态。

> 二叉搜索树是 AVL 树的基础，如果你不了解二叉搜索树，那么你可以通过本博客的另一篇文章《二叉搜索树》来了解它。

## 平衡因子

AVL 树在每次新增和移除节点之后，都要检查每个节点是否处于平衡状态，而平衡因子（Balance Factor）就是一个量化平衡状态的指标，它的定义是：左子树的高度减去右子树的高度（反之亦可）。

如果 AVL 树中某个节点的平衡因子的大于 `1` 了，那么就意味着该节点的左子树和右子树的高度差超过了 `1`，这时就要对 AVL 树进行旋转操作，来使其回归到平衡状态。

下图展示了一棵二叉树的各个节点的高度（`h`）和平衡因子（`bc`）。

![平衡因子](/algorithm-and-data-structure/avl-tree/balance-factor.png)

## 平衡操作

当 AVL 树新增或移除一个节点之后，如果有某些节点变得不平衡了，那么我们就需要从深度最深的不平衡节点开始，自下而上的处理每一个不平衡的节点，直至处理完 AVL 树的根节点。

在 AVL 树中，我们使用旋转来处理不平衡的节点，旋转是指：通过挪移节点的位置，来使树回归到平衡状态。由于新树看起来就像是旧树进行顺/逆时针旋转后的产物，所以我们把这个挪移操作比喻为旋转。

在 AVL 树中，如果某个节点变得不平衡了，那么这个节点一定会呈现出 4 种形态中的一种，这 4 种形态分别是：左-左、右-右、左-右、右-左。而这 4 种形态分别对应 4 种旋转操作，分别是：右旋、左旋、左旋再右旋、右旋再左旋。我们将在后文详细解释这 4 种形态与旋转。

### 原理

让我们举个例子来看看 AVL 树是如何旋转的吧。

下图展示了一棵原本平衡的 AVL 树，当我们插入了 `70` 节点后，树中的 `40` 和 `80` 节点就变得不平衡了，因为它们的平衡因子分别是 `-2` 和 `2`。这时我们就需要旋转该树，具体的操作步骤如下：

1. 旋转蓝框内的树。
2. 检查以 `30` 节点为根节点的树是否平衡：
   1. 如果不平衡，那么就旋转这棵树。
   2. 如果平衡，那么就跳转到下一步。
3. 旋转黄框内的树。

![旋转示例](/algorithm-and-data-structure/avl-tree/rotation-example.png)

当我们对蓝框内的树进行了旋转之后，这棵树就回归平衡状态了。不过由于这棵树的形态发生了改变，所以以这棵树为子节点的树的形态也会发生改变，具体来说，就是以 `30` 节点作为根节点的树的形态会发生改变。

这时我们就需要再检查 `30` 节点的平衡因子，如果 `30` 节点不平衡了，那么我们就需要对其进行旋转，否则就不需要进行旋转。而无论 `30` 节点旋转与否，以 `30` 节点作为根节点的树的形态都已经发生了改变，这就导致了以 `80` 节点作为根节点的树的形态也会发生改变。

这时我们需要继续向上检查 `80` 节点，并在需要时对其进行旋转。因为 `80` 节点是整棵树的根节点，所以我们处理到 `80` 节点就为止了。然而，如果 `80` 节点还有父节点话，那么我们就需要继续向上检查和处理。

很显然，整个处理过程是自下而上的，就像冒泡一样。总结来说，无论 AVL 树中出现了多少个不平衡的节点，AVL 树的平衡处理都是从深度最深的不平衡节点开始进行旋转，然后沿着路径，不断向上检查和旋转，直到处理完根节点为止。

### 左旋

当树呈现右-右形态时，我们就需要对其进行左旋。其中「右-右形态」是指：树的平衡因子为 `-2`，且右侧子节点的平衡因子为 `0` 或 `-1`。

左旋的具体操作如下：

1. 右侧子节点替代根节点，成为新的根节点。
2. 新根节点的左侧子节点转移给旧根节点，成为旧根节点的右侧子节点。
3. 旧根节点成为新根节点的左侧子节点。

![左旋](/algorithm-and-data-structure/avl-tree/rotation-left.png)

### 右旋

当树呈现左-左形态时，我们就需要对其进行右旋。其中「左-左形态」是指：树的平衡因子为 `2`，且左侧子节点的平衡因子为 `0` 或 `1`。

右旋的具体操作如下：

1. 左侧子节点替代根节点，成为新的根节点。
2. 新根节点的右侧子节点转移给旧根节点，成为旧根节点的左侧子节点。
3. 旧根节点成为新根节点的右侧子节点。

![右旋](/algorithm-and-data-structure/avl-tree/rotation-right.png)

### 左旋再右旋

左-右形态是指：树的平衡因子为 `2`，且左侧子节点的平衡因子为 `-1`。

左旋再右旋用于处理左-右形态的不平衡节点，其具体操作是：

1. 对树的左侧子节点进行左旋，来将树转换成左-左形态。
2. 对树进行右旋。

![左旋再右旋](/algorithm-and-data-structure/avl-tree/rotation-left-right.png)

### 右旋再左旋

左-右形态是指：树的平衡因子为 `-2`，且左侧子节点的平衡因子为 `1`。

右旋再左旋用于处理右-左形态的不平衡节点，其具体操作是：

1. 对树的右侧子节点进行右旋，来将树转换成右-右形态。
2. 对树进行左旋。

![右旋再左旋](/algorithm-and-data-structure/avl-tree/rotation-right-left.png)

## 实现

本文将会实现一个名为 `AdelsonVelskiiLandiTree` 的 AVL 树类，这个类将会拥有和 `BinarySearchTree` 一样的方法。

> `BinarySearchTree` 是本博客的另一篇文章《二叉搜索树》中所实现的二叉搜索树的类。

为了复用代码，`AdelsonVelskiiLandiTree` 将会继承自 `BinarySearchTree`，不过我们需要重写 `AdelsonVelskiiLandiTree` 中的 `insert` 和 `remove` 方法，因为 AVL 树需要在插入和移除节点后，进行自平衡操作。

最后，`AdelsonVelskiiLandiTree` 类所拥有的方法如下：

| 方法名                          | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `insert( value )`               | 插入一个值为 `value` 的节点，然后返回更新后的树。            |
| `remove( value )`               | 移除一个值为 `value` 的节点，然后返回更新后的树。            |
| `search( value )`               | 搜索一个值为 `value` 的节点，然后返回一个布尔值来代表该节点是否存在。 |
| `inorderTraverse( callback )`   | 中序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `preorderTraverse( callback )`  | 先序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |
| `postorderTraverse( callback )` | 后序遍历树，并对每个遍历到的节点执行一次回调函数，回调函数会接收节点的值来作为入参。 |

### 创建类

首先，让我们来创建 `AdelsonVelskiiLandiTree` 的类。

```js
class AdelsonVelskiiLandiTree extends BinarySearchTree {

    constructor () { super() }

}
```

### 创建 _balance 方法

在插入和移除一个节点之后，我们都需要对树进行平衡化处理，那么我们就需要编写一个平衡化处理的方法，`_balance` 就是这个平衡化处理的方法。由于平衡化处理是不需要暴露给外界的，所以 `_balance` 是一个内部方法。

`_balance` 方法的内部包含了许多子函数，这些子函数用于：计算节点高度、计算节点平衡因子、左旋、右旋、左旋再右旋、右旋再左旋。这些子函数是实现平衡化处理的必要套件。

下文便是 `_balance` 方法的实现代码：

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

`AdelsonVelskiiLandiTree` 的 `insert` 方法和 `BinarySearchTree` 的 `insert` 方法几乎是一模一样的，关键的区别在于，前者增加了一行平衡化处理的代码（`const balance_root = balance( root )`）。随着 `core` 递归调用自身，这行代码会自下而上的对树进行平衡化处理。

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

`AdelsonVelskiiLandiTree` 的 `remove` 方法和 `BinarySearchTree` 的 `remove` 方法几乎是一模一样的，关键的区别在于，前者增加了两行平衡化处理的代码，同理，随着 `core` 递归调用自身，这两行代码会自下而上的对树进行平衡化处理。

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

你可以通过该 [库](https://github.com/jynxio/leetcode-everyday) 的 [Tree.js](https://github.com/jynxio/leetcode-everyday/blob/main/Tree.js) 文件，来获取 `AdelsonVelskiiLandiTree` 的完整源码。