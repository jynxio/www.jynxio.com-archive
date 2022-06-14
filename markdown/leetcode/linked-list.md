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

| 方法名                      | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `insert( index, elements )` | 向链表的 `index` 位置插入零至多个新元素，然后返回更新后的链表 |
| `removeElement( element )`  | 从链表中移除第一个 `element` 元素，然后返回更新后的链表      |
| `removeIndex( index )`      | 从链表中移除 `index` 位置的元素，然后返回更新后的链表        |
| `getElement( index )`       | 查询链表中 `index` 位置的元素                                |
| `getIndex( element )`       | 查询链表中第一个 `element` 元素的位置                        |
| `clear()`                   | 清空链表，然后返回清空后的链表                               |

| 属性名 | 描述           |
| ------ | -------------- |
| size   | 查询元素的数量 |

### 第一步：创建基础组件

```js
class Node {
    
	constructor( element ) {
        
        this.value = element;
        this.next = undefined;
        
    }
    
}

class LinkedList {
    
    #elements = {};
	#head = undefined;
    
    constructor( ... elements ) {
        
        this.size = 0;
        
        insert( 0, ... elements );
        
    }
    
    getNode( index ) {

        if ( index < 0 || index >= this.size ) return;
        
        let node = this.#head;
        
        for ( let i = 0; i < index; i++ ) node = node.next;
        
        return node;
        
    }
    
    getElement( index ) {
        
		return this.getNode( index )?.value;
        
    }
    
    getIndex( element ) {
        
        if ( ! this.size ) return - 1;
        
        let node = this.#head;
        
		for ( let i = 0; i < this.size; i++ ) {
            
            if ( node.value === element ) return i;
            
            node = node.next;
            
        }
        
        return - 1;
        
    }
    
    insert( index, ... elements ) {
        
        if ( ! elements.length ) return this;
        
        const nodes = elements
        	.map( element => new Node( element ) )                        // 创建节点
        	.reducer( ( previous, current ) => previous.next = current ); // 连接节点
        
        if ( ! this.size ) this.#head = nodes[ 0 ];
        else this.getNode( index ).next = nodes[ 0 ]; 
        
        this.size += nodes.length;
        
        return this;
        
    }
    
    removeElement() {}
    
    removeIndex() {}
    
    clear() {}
    
}
```

