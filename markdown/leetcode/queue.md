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

### 第一步：明确实现的思路

我们会创建一个名为 `Queue` 的类来代表队列，在 `Queue` 的内部，我们会创建一个名为 `#elements` 的内部属性，它是一个普通的 JavaScript 对象，比如 `{}`，我们用它来存储队列中的元素。具体来说，`#elements` 对象使用键值对来存储队列中的元素，其中键是元素的序号字符串，值就是元素。

![#elements内部属性](/static/image/markdown/leetcode/queue/elements-property.png)

如果我们修改了队列，那么我们就需要更新 `#elements` 的键值对，在说明如何更新 `#elements` 之前，我们需要先了解一下 `#elements` 是如何存储队列中的元素的。具体来说，我们会先创建 2 个指针，其中一个名为 `#from`，另一个名为 `#to`，指针 `#from` 会指向队首元素在 `#elements` 中的位置，指针 `#to` 会指向队尾元素在 `#elements` 中的位置的 **下一个位置**，就像下图这样。

> 注意：`#from` 和 `#to` 不是 C 语言中的指针，在这个例子中，`#from` 和 `#to` 中存储的值是序号字符串。

![指针#from和#to](/static/image/markdown/leetcode/queue/pointer-from-and-to.png)

这种设计的好处之一是我们可以基于 `#from` 和 `#to` 的值来推算出 `#elements` 中所有的键值对（即队列中所有的元素），另一个好处是我们只需要移动指针的位置（即改变指针的值）即可实现移除和添加元素，而不需要像数组的 `splice` 方法那样重排所有元素的序号。举个例子，如果我们要移除掉队首的 `"John"` 和向队尾添加 `"Jynx"` 和 `"Neo"`，那么我们只需要将 `#from` 和 `#to` 各自向下移动 1 格和 2 格就可以了，就像下图这样。

![使用指针来修改队列](/static/image/markdown/leetcode/queue/change-queue-by-pointer.png)

明确了实现队列的核心思路后，就可以开始实现我们的队列了。

### 第二步：创建队列的类

从这一步开始，我们就要正式开始创建我们的队列了，简明的代码比啰嗦的文字要更加易懂，所以请直接来看代码吧！

首先，创建类的大致结构：

```js
class Queue {
    
    #to = 0;
    #from = 0;
    #elements = {};
    
	constructor( ... elements ) {}
    
    enqueue( ... elements ) {}
    
    dequeue() {}

    clear() {}
    
    peek() {}
    
}
```

然后，实现构造函数：

```js
class Queue {
    
    // ...
    
    constructor( ... elements ) {
        
        this.size = 0;
        this.enqueue( ... elements );
        
    }
    
}
```

然后，实现 `enqueue` 方法：

```js
class Queue {
    
    // ...
    
    enqueue( ... elements ) {
        
        elements.forEach( element => {
            
            this.#elements[ this.#to ] = element;
            this.#to ++;
            this.size ++;
            
        } );
        
        return this;
        
    }
    
}
```

然后，实现 `dequeue` 方法：

```js
class Queue {
    
	// ...
    
    dequeue() {
        
        if ( ! this.size ) return;
        
        const element = this.#elements[ this.#from ];
        
		delete this.#elements[ this.#from ];
        this.#from ++;
        this.size --;
        
        return element;
        
    }
    
}
```

然后，实现 `clear` 方法：

```js
class Queue {
    
    // ...
    
    clear() {
        
        this.#to = 0;
        this.#from = 0;
        this.#elements = {};
        this.size = 0;

        return this.#elements;
        
    }
    
}
```

然后，实现 `peek` 方法：

```js
class Queue {
    
    // ...
    
    peek() {
        
        return this.#elements[ this.#from ];
        
    }
    
}
```

最后，完整的 `Queue` 的实现代码如下：

```js
class Queue {
    
    #elements = {};
    #from = 0;
    #to = 0;
    
    constructor( ... elements ) {
        
        this.size = 0;
        this.enqueue( ... elements );
        
    }
    
    enqueue( ... elements ) {
        
        elements.forEach( element => {
            
            this.#elements[ this.#to ] = element;
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
        this.#elements = {};
        this.size = 0;

        return this.#elements;
        
    }
    
    peek() {
        
        return this.#elements[ this.#from ];
        
    }
    
}
```

## TODO

双端队列

队列的应用