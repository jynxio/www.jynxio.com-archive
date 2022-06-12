---
typora-root-url: ..\..
---

# 队列

## 概述

队列是遵循先进先出（FIFO）原则的有序集合，“先进先出”是指最先入列的数据会最先出列，最后入列的数据会最后出列。

举例来说，队列就像现实生活中的排队，早来的人会排在队伍的前面，后来会排在队伍的后面，队首的人会优先获得服务并离队，队尾的人只能最后获得服务再离队，如果有新人加入，那么新人必须排在队伍的最后，其中队伍代表队列，人代表数据。

## 实现队列

JavaScript 中没有队列这种数据结构，我们将使用对象来实现一个队列。其实我们也可以使用数组来实现队列，不过考虑到基于数组的队列有可能会触发某些遍历操作，而为了获得更好的性能，我们需要避免这种情况，所以我们最终采用了对象。

我们实现的队列将会拥有以下方法和属性：

| 方法名  | 描述                                           |
| ------- | ---------------------------------------------- |
| enqueue | 向队尾添加一个至多个元素，然后返回更新后的队列 |
| dequeue | 从队首移除一个元素，然后返回这个元素           |
| clear   | 清空队列，然后返回更新后的队列                 |
| peek    | 查询位于队首的元素                             |

| 属性名 | 描述           |
| ------ | -------------- |
| size   | 查询元素的数量 |

### 第一步：实现思路

我们会创建一个名为 `Queue` 的类来代表队列，在 `Queue` 的内部，我们会创建一个名为 `#elements` 的内部属性，它是一个普通的 JavaScript 对象，比如 `{}`，我们用它来存储队列中的元素。具体来说，`#elements` 对象使用键值对来存储队列中的元素，其中键是元素的序号字符串，值就是元素。

![#elements内部属性](/static/image/markdown/leetcode/queue/elements-property.png)

如果我们修改了队列，那么我们就需要更新 `#elements`，比如我们从队首移除了 `"John"` 并向队尾依次

### 第一步：创建队列的类

我们会创建一个名为 `Queue` 的类来代表队列这种数据结

```js
class Queue {
    
    #to = 0;
    #from = 0;
    #elements = {};
    
}
```



```js
class Queue {
    
    #to = 0;
    #from = 0;
    #elements = {};
    
    constructor( ... elements ) {
        
        this.size = 0;
        this.enqueue( ... elements );
        
    }
    
    enqueue( ... elements ) {
        
        elements.forEach( ( element, index ) => {
            
            this.#elements[ this.to + index ] = element;
            this.#to ++;
            this.size ++;
            
        } );
        
        return this;
        
    }
    
    dequeue() {
        
        if ( ! this.size ) return;
        
        const element = this.#elements[ this.#from ];
        
		delete this.#elements[ this.#from ];
        this.#from ++;
        this.size --;
        
        return element;
        
    }
    
    clear() {
        
        this.#to = 0;
        this.#from = 0;
        this.size = 0;

        return this.#elements = {};
        
    }
    
    peek() {
        
        return this.#elements[ this.#from ];
        
    }
    
}
```

