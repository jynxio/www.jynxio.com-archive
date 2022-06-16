---
typora-root-url: ..\..
---

# 链表

## 数组

在介绍链表之前，我们需要先了解一下数组。数组是一种非常方便的数据结构，我们可以通过 `[]` 语法来快速的访问数组中的元素，不过数组有 2 个明显的缺点：

- 数组的长度是固定的，如果我们需要变长的数组，那么问题就会变得棘手。
- 数组的增删成本很高，如果我们需要增加或移除数组的元素，那么我们就需要重排后续所有元素的位置。

幸运的是，在 JavaScript 中似乎不存在这 2 个问题，因为 JavaScript 中的数组是变长的，我们可以在不声明数组长度的情况下就创建数组，并任意的增加数组的长度，另外 JavaScript 也提供了 `Array.prototype.splice`  来帮助我们轻松的增删元素，而无需关注增删元素的实现细节。

不过，JavaScript 中的类型数组还是定长的，并且从 JavaScript 引擎的角度来看，所有的数组也都是定长的。另外 `Array.prototype.splice` 只是简化了增删操作，而没有优化增删操作，从 JavaScript 引擎的角度来看，增加或移除数组的元素仍然需要重排后续所有元素的位置。

## 链表

链表是节点的集合，节点是值与指针的集合，其中指针用于指向其它的节点，比如前一个节点或后一个节点。链表有许多种形式，本文将会介绍单向链表、双向链表、循环链表、有序链表。

相比于数组，链表的好处是其在增删元素时不需要重排后续元素的位置，并且链表可以任意的扩展自身的长度，链表的坏处是其不能直接访问目标位置的节点，如果链表想要访问某个节点，就必须从起点开始向后遍历，直至找到目标节点。

## 单向链表

单向链表的特点是它只能沿着一个方向来遍历节点，具体来说，单向链表只能沿着从头到尾的方向来遍历节点。

单向链表就像一列火车，火车由一个车头和零至多节车厢组成，车头可以通过其尾部的钩子来连接第一节车厢，车厢可以装载货物并用其尾部的钩子来连接下一节车厢。这列火车就代表单向链表，其中车头代表链表的 `head`，车厢代表链表的节点，车厢上的货物代表节点的数据，车厢尾部的钩子代表节点的指针，这个指针用来指向下一个节点。

![链表的结构](/static/image/markdown/leetcode/linked-list/singly-linked-list-structure.png)

## 双向链表

双向链表的特点是它既能沿着从头到尾的方向来遍历节点，也能沿着从尾到头的方向来遍历节点，这是因为双向链表的节点同时具有指针 `next` 和指针 `prev`，其中前者用于指向后一个节点，后者用于指向前一个节点。

另外，我们还为这个双向链表添加了一个 `tail` 指针，它用来指向链表中的最后一个节点，当我们需要查找链表上的某个节点时，如果目标节点的序号大于 `size / 2`，那么我们就应该从尾部开始朝着头部方向去查找，否则我们就应该从头部开始朝着尾部方向去查找，这样可以减少遍历的次数。

> 注意：你可以自由的决定是否为你的双向链表添加 `tail` 指针，因为 `tail` 指针不是双向链表的必需品。另外，其实你也可以给你的单向链表添加 `tail` 指针。

![双向链表的结构](/static/image/markdown/leetcode/linked-list/doubly-linked-list-structure.png)

## 循环链表

循环链表的特点是其尾节点的指针会指向头节点。循环链表既可以基于单向链表来实现，也可以基于双向链表来实现。

![循环链表的结构](/static/image/markdown/leetcode/linked-list/circular-linked-list-structure.png)

## 有序链表

有序链表的特点是其节点是按照顺序来排列的，具体来说，有序链表的节点们会根据自身的值与某种排序规律来进行排列，比如下图就是一个有序链表，这个链表中的节点是按照 `data` 值从小到大的顺序来排列的。

![有序链表的结构](/static/image/markdown/leetcode/linked-list/ordered-linked-list-structure.png)

因为有序链表的节点们是有序的，所以插入一个新节点之前，我们需要遍历并比较链表上的旧节点，来找到那个符合规律的位置，最后再把新节点插入到这个位置上，所以有序链表的插入操作的时间复杂度是 `O(n)`。

![有序链表插入新节点](/static/image/markdown/leetcode/linked-list/ordered-linked-list-insert-node.png)

不过有序链表可以快速的移除最值节点，因为只需要移除头节点或尾节点即可，因此有序链表适用于那些需要频繁存取最小值且不怎么需要存取中间值的场景。

## 实现单向链表 TODO

我们实现的链表将会有以下方法和属性：

| 方法名                    | 描述                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `getNodeByIndex( index )` | 获取序号为 `index` 的节点                                    |
| `getNodeByData( data )`   | 获取第一个值为 `data` 的节点                                 |
| `getIndexByData( data )`  | 获取第一个值为 `data` 的节点的序号                           |
| `remove( index )`         | 移除 `index` 号节点，然后返回这个被移除的节点                |
| `insert( index, data )`   | 在 `index` 位置插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `push()`                  | 在链表的末尾插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `unshift()`               | 在链表的头部插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `pop()`                   | 移除链表末尾的节点，然后返回这个被移除的节点                 |
| `shift()`                 | 移除链表头部的节点，然后返回这个被移除的节点                 |
| `toArray()`               | 沿着从头到尾的顺序来将节点的值存入一个数组，然后返回这个数组 |
| `clear()`                 | 清空链表，然后返回更新后的链表                               |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 节点的数量 |

注意事项：

1. 节点的序号是从零起算的，链表的 `head` 所指向的节点就是零号节点。
2. 上述所有方法的返回值都是一个 `{success, data}` 格式的对象，其中 `success` 的值为 `true` 或 `false`，它代表方法是否执行成功，仅当方法执行成功时才会返回有效的 `data` 字段，`data` 则代表该方法执行成功后的真正返回值，比如节点的序号、被移除的节点、更新后的链表等。

### 实现 Node 类

链表的节点是一个拥有 `value` 属性和 `next` 属性的对象，其中 `value` 属性代表节点的值，`next` 属性代表指向下一个节点的指针。为了待会将要实现的 `LinkedList` 类可以轻松的创建节点，因此请让我们先实现一个 `Node` 类，它的实现代码如下：

```js
class Node {

    constructor( value ) {

        this.value = value;
        this.next = undefined;

    }

}
```

### 实现 LinkedList 类

首先，我们先实现 `LinkedList` 类的构造函数。

```js
class LinkedList {
    
    #head = undefined;
    
    constructor( ... values ) {
        
        this.size = 0;
        this.insert( 0, ... values );
        
    }
    
}
```

然后，再来实现 `getNodeByIndex` 方法。

```js
class LinkedList {

    // ...

    getNodeByIndex ( index ) {

        if ( this.size === 0 ) return { success: false };                 // 链表无节点可查
        if ( index < 0 || index >= this.size ) return { success: false }; // index不合理

        let node = this.#head;

        for ( let i = 0; i < index; i ++ ) node = node.next;

        return { success: true, value: node };

    }

}
```

然后，再来实现 `getNodeByValue` 方法。

```js
class LinkedList {

    // ...

    getNodeByValue ( value ) {

        if ( this.size === 0 ) return { success: false }; // 链表无节点可查

        let node = this.#head;

        do {

            if ( node.value === value ) return { success: true, value: node };

        } while ( node = node.next );

        return { success: false };

    }

}
```

然后，再来实现 `getIndexByValue` 方法。

```js
class LinkedList {

    // ...

    getIndexByValue ( value ) {

        let index = 0;
        let node = this.#head;

        do {

            if ( node.value === value ) return { success: true, value: index };

            index ++;

        } while ( node = node.next );

        return { success: false };

    }

}
```

然后，再来实现 `remove` 方法。

```js
class LinkedList {

    // ...

    remove ( index ) {

        const { success: has_target_node, value: target_node } = this.getNodeByIndex( index );

        if ( ! has_target_node ) return { success: false }; // 目标位置无节点可删

        const { success: has_previous_node, value: previous_node } = this.getNodeByIndex( index - 1 );
        const { success: has_next_node, value: next_node } = this.getNodeByIndex( index + 1 );

        if ( has_target_node && has_previous_node && has_next_node ) // 有前有后
            previous_node.next = next_node;
        else if ( has_target_node && has_previous_node )             // 有前无后
            previous_node.next = undefined;
        else if ( has_target_node && has_next_node )                 // 无前有后
            this.#head = next_node;
        else                                                         // 无前无后
            this.#head = undefined;

        this.size --;

        return { success: true, value: target_node };

    }

}
```

然后，再来实现 `insert` 方法。

```js
class LinkedList {

    // ...

    insert ( index, ... values ) {

        if ( values.length === 0 ) return { success: false };            // 无节点可插
        if ( index < 0 || index > this.size ) return { success: false }; // index不合理

        const nodes = values.map( value => new Node( value ) );
        const last_node = nodes[ nodes.length - 1 ];
        const first_node = nodes[ 0 ];

        nodes.reduce( ( previous_node, current_node ) => previous_node.next = current_node ); // 链接节点为链表

		const { success: has_current_node, value: current_node } = this.getNodeByIndex( index );
        const { success: has_previous_node, value: previous_node } = this.getNodeByIndex( index - 1 );

        if ( has_current_node && has_previous_node ) {

            previous_node.next = first_node;
            last_node.next = current_node;

        } else if ( has_current_node && ! has_previous_node ) {

            this.#head = first_node;

            last_node.next = current_node;

        } else if ( ! has_current_node && has_previous_node ) {

            previous_node.next = first_node;

        } else {

            this.#head = first_node;

        }

        this.size += nodes.length;

        return { success: true, value: this };


    }

}
```

然后，再来实现 `toArray` 方法。

```js
class LinkedList {

    // ...

    toArray () {

		let node = this.#head;
		const result = { success: true, value: [] };

        while ( node ) {

            result.value.push( node.value );
            node = node.next;

        }

		return result;

    }

}
```

最后再实现 `clear` 方法。

```js
class LinkedList {

    // ...

    clear () {

        this.size = 0;
        this.#head = undefined;

        return { success: true, value: this };

    }

}
```

### 完整的实现代码

完整的实现代码如下。

```js
class Node {

    constructor( value ) {

        this.value = value;
        this.next = undefined;

    }

}

class LinkedList {

    #head = undefined;

    constructor( ... values ) {

        this.size = 0;
        this.insert( 0, ... values );

    }

    getNodeByIndex ( index ) {

        if ( this.size === 0 ) return { success: false };                 // 链表无节点可查
        if ( index < 0 || index >= this.size ) return { success: false }; // index不合理

        let node = this.#head;

        for ( let i = 0; i < index; i ++ ) node = node.next;

        return { success: true, value: node };

    }

    getNodeByValue ( value ) {

        if ( this.size === 0 ) return { success: false }; // 链表无节点可查

        let node = this.#head;

        do {

            if ( node.value === value ) return { success: true, value: node };

        } while ( node = node.next );

        return { success: false };

    }

    getIndexByValue ( value ) {

        let index = 0;
        let node = this.#head;

        do {

            if ( node.value === value ) return { success: true, value: index };

            index ++;

        } while ( node = node.next );

        return { success: false };

    }

    remove ( index ) {

        const { success: has_target_node, value: target_node } = this.getNodeByIndex( index );

        if ( ! has_target_node ) return { success: false }; // 目标位置无节点可删

        const { success: has_previous_node, value: previous_node } = this.getNodeByIndex( index - 1 );
        const { success: has_next_node, value: next_node } = this.getNodeByIndex( index + 1 );

        if ( has_target_node && has_previous_node && has_next_node ) // 有前有后
            previous_node.next = next_node;
        else if ( has_target_node && has_previous_node )             // 有前无后
            previous_node.next = undefined;
        else if ( has_target_node && has_next_node )                 // 无前有后
            this.#head = next_node;
        else                                                         // 无前无后
            this.#head = undefined;

        this.size --;

        return { success: true, value: target_node };

    }

    insert ( index, ... values ) {

        if ( values.length === 0 ) return { success: false };            // 无节点可插
        if ( index < 0 || index > this.size ) return { success: false }; // index不合理

        const nodes = values.map( value => new Node( value ) );
        const last_node = nodes[ nodes.length - 1 ];
        const first_node = nodes[ 0 ];

        nodes.reduce( ( previous_node, current_node ) => previous_node.next = current_node ); // 链接节点为链表

		const { success: has_current_node, value: current_node } = this.getNodeByIndex( index );
        const { success: has_previous_node, value: previous_node } = this.getNodeByIndex( index - 1 );

        if ( has_current_node && has_previous_node ) {

            previous_node.next = first_node;
            last_node.next = current_node;

        } else if ( has_current_node && ! has_previous_node ) {

            this.#head = first_node;

            last_node.next = current_node;

        } else if ( ! has_current_node && has_previous_node ) {

            previous_node.next = first_node;

        } else {

            this.#head = first_node;

        }

        this.size += nodes.length;

        return { success: true, value: this };


    }

    toArray () {

		let node = this.#head;
		const result = { success: true, value: [] };

        while ( node ) {

            result.value.push( node.value );
            node = node.next;

        }

		return result;

    }

    clear () {

        this.size = 0;
        this.#head = undefined;

        return { success: true, value: this };

    }

}
```

