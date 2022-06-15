---
typora-root-url: ..\..
---

# 链表

## 概述

### 数组

在介绍链表之前，我们需要先了解一下数组。数组是一种非常方便的数据结构，我们可以通过 `[]` 语法来快速的访问数组中的元素，不过数组有 2 个明显的缺点：

- 数组的长度是固定的，如果我们需要变长的数组，那么问题就会变得棘手。
- 数组的增删成本很高，如果我们需要增加或移除数组的元素，那么我们就需要重排后续所有元素的位置。

幸运的是，在 JavaScript 中似乎不存在这 2 个问题，因为 JavaScript 中的数组是变长的，我们可以在不声明数组长度的情况下就创建数组，并任意的增加数组的长度，另外 JavaScript 也提供了 `Array.prototype.splice`  来帮助我们轻松的增删元素，而无需关注增删元素的实现细节。

不过，JavaScript 中的类型数组还是定长的，并且从 JavaScript 引擎的角度来看，所有的数组也都是定长的。另外 `Array.prototype.splice` 只是简化了增删操作，而没有优化增删操作，从 JavaScript 引擎的角度来看，增加或移除数组的元素仍然需要重排后续所有元素的位置。

### 链表

链表是有序的元素集合，它是一种形如火车的数据结构。具体来说，火车由一个车头和零至多节车厢组成，车头可以通过其尾部的钩子来连接第一节车厢，车厢可以装载货物并用其尾部的钩子来连接下一节车厢，其中火车就代表链表，车头就代表链表的 `head`，车厢就代表链表的节点，车厢上的货物就代表节点的数据，车厢尾部的钩子就代表节点的指针，这个指针用来指向下一个节点。

![链表的结构](/static/image/markdown/leetcode/linked-list/linked-list-structure.png)

链表的好处是可以任意的扩展长度，并且增删元素时无需重排后续元素的位置。不过链表的缺点是不能像数组那样直接访问任何位置的元素，如果想要访问链表中的某个元素，就必须从链表的第一个节点开始搜索，直至找到目标元素。

## 实现链表

我们实现的链表将会有以下方法和属性：

| 方法名          | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| getNodeByIndex  | 获取序号为指定序号的节点                                     |
| getNodeByValue  | 获取第一个值为指定值的节点                                   |
| getIndexByValue | 获取第一个值为指定值的节点的序号                             |
| remove          | 移除序号为指定序号的节点，然后返回这个被移除的节点           |
| insert          | 从指定序号的位置开始插入一至多个值为指定值的节点，然后返回更新后的链表 |
| toArray         | 根据节点的顺序来将节点的值转换为数组，然后返回这个数组       |
| clear           | 清空链表，然后返回更新后的链表                               |

| 属性名 | 描述       |
| ------ | ---------- |
| size   | 节点的数量 |

### getNodeByIndex

定义：获取序号为 `index` 的节点

> 注意：节点的序号是从零起算的，`head` 所指向的节点的序号为零，下同。

语法：

```js
getNodeByIndex( index );
```

参数：

- `index`：`{ number }`，节点的序号

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表节点
- 若操作失败，则返回 `{ success: false }` 对象

### getNodeByValue

定义：获取第一个值为 `value` 的节点

语法：

```js
getNodeByValue( value );
```

参数：

- `value`：`{ * }`，节点的值

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表节点
- 若操作失败，则返回 `{ success: false }` 对象

### getIndexByValue

定义：获取第一个值为 `value` 的节点的序号

语法：

```js
getIndexByValue( value );
```

参数：

- `value`：`{ * }`，节点的值

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表序号
- 若操作失败，则返回 `{ success: false }` 对象

### remove

定义：移除序号为 `index` 的节点，然后返回这个被移除的节点

语法：

```js
remove( index );
```

参数：

- `index`：`{ number }`，节点的序号

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表被移除的节点
- 若操作失败，则返回 `{ success: false }` 对象

### insert

定义：从 `index` 的位置开始插入一至多个节点，节点的值分别为 `value_1`、`...`、`value_n`，然后返回更新后的链表

语法：

```js
insert( index, value_1, ..., value_n );
```

参数：

- `index`：`{ number }`，节点的序号，该方法将会从此位置开始插入新的节点，原本位于该位置的节点会被向后移动
- `value_1`：新插入的第一个节点的值
- `value_n`：新插入的第 n 个节点的值

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表更新后的链表
- 若操作失败，则返回 `{ success: false }` 对象

### toArray

定义：根据节点的顺序来将节点的值转换为数组，然后返回这个数组

语法：

```js
toArray();
```

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表值数组
- 若操作失败，则返回 `{ success: false }` 对象

### clear

定义：清空链表，然后返回更新后的链表

语法：

```js
clear();
```

返回：

- 若操作成功，则返回 `{ success, value }` 对象，其中 `success` 值为 `true`，`value` 代表更新后的链表
- 若操作失败，则返回 `{ success: false }` 对象

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

