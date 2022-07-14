---
typora-root-url: ..\..
---

# 队列

## 概述

本文将会讲述两种队列，一种是普通队列，另一种是双端队列。

## 普通队列

普通队列是遵循先进先出（FIFO）原则的有序集合，“先进先出”是指最先入列的数据会最先出列，最后入列的数据会最后出列。

举例来说，普通队列就像现实生活中的排队，早来的人会排在队伍的前面，后来会排在队伍的后面，队首的人会优先获得服务并离队，队尾的人只能最后获得服务再离队，如果有新人加入，那么新人必须排在队伍的最后，其中队伍代表队列，人代表数据。

## 实现普通队列

JavaScript 中没有普通队列这种数据结构，我们将使用对象来实现一个普通队列。其实我们也可以使用数组来实现普通队列，不过考虑到基于数组的普通队列有可能会触发某些遍历操作，而为了获得更好的性能，我们需要避免这种情况，所以我们最终采用了对象。

我们实现的普通队列将会拥有以下方法和属性：

| 方法名  | 描述                                           |
| ------- | ---------------------------------------------- |
| enqueue | 向队尾添加一个至多个元素，然后返回更新后的队列 |
| dequeue | 从队首移除一个元素，然后返回这个被移除的元素   |
| clear   | 清空队列，然后返回更新后的队列                 |
| peek    | 查询位于队首的元素                             |

| 属性名 | 描述       |
| ------ | ---------- |
| size   | 元素的数量 |

### 第一步：明确实现的思路

我们会创建一个名为 `Queue` 的类来代表队列，在 `Queue` 的内部，我们会创建一个名为 `#elements` 的内部属性，它是一个普通的 JavaScript 对象，比如 `{}`，我们用它来存储普通队列中的元素。具体来说，`#elements` 对象使用键值对来存储普通队列中的元素，其中键是元素的序号字符串，值就是元素。

![#elements内部属性](/static/image/markdown/data-structure/queue/elements-property.png)

如果我们修改了普通队列，那么我们就需要更新 `#elements` 的键值对，在说明如何更新 `#elements` 之前，我们需要先了解一下 `#elements` 是如何存储普通队列中的元素的。具体来说，我们会先创建 2 个指针，其中一个名为 `#from`，另一个名为 `#to`，指针 `#from` 会指向队首元素在 `#elements` 中的位置，指针 `#to` 会指向队尾元素在 `#elements` 中的位置的 **下一个位置**，就像下图这样。

> `#from` 和 `#to` 不是 C 语言中的指针，在这个例子中，`#from` 和 `#to` 中存储的值是序号字符串。

![指针#from和#to](/static/image/markdown/data-structure/queue/pointer-from-and-to.png)

这种设计的好处之一是我们可以基于 `#from` 和 `#to` 的值来推算出 `#elements` 中所有的键值对（即队列中所有的元素），另一个好处是我们只需要移动指针的位置（即改变指针的值）即可实现移除和添加元素，而不需要像数组的 `splice` 方法那样重排所有元素的序号。举个例子，如果我们要移除掉队首的 `"John"` 和向队尾添加 `"Jynx"` 和 `"Neo"`，那么我们只需要将 `#from` 和 `#to` 各自向下移动 1 格和 2 格就可以了，就像下图这样。

![使用指针来修改队列](/static/image/markdown/data-structure/queue/change-queue-by-pointer.png)

明确了实现普通队列的核心思路后，就可以开始实现我们的普通队列了。

### 第二步：创建队列的类

从这一步开始，我们就要正式开始创建我们的普通队列了，简明的代码比啰嗦的文字要更加易懂，所以请直接来看代码吧！

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
            
            this.#elements[ this.#to ++ ] = element;
            this.size ++;
            
        } );
        
        return this;
        
    }
    
    dequeue() {
        
        if ( ! this.size ) return;
        
        const element = this.#elements[ this.#from ];
        
		delete this.#elements[ this.#from ++ ];
        this.size --;
        
        return element;
        
    }
    
    peek() {
        
        return this.#elements[ this.#from ];
        
    }
    
    clear() {
        
        this.#elements = {};
        this.#from = 0;
        this.#to = 0;
        this.size = 0;

        return this.#elements;
        
    }
    
}
```

## 双端队列

双端队列的英文名称是 double ended queue，简称为 deque，它与普通队列的区别是，它的队首和队尾都能移除和添加元素。

## 实现双端队列

双端队列的实现思路与普通队列的实现思路是一样的，不过双端队列还有 3 个额外的方法，分别用于向队首添加元素、从队尾移除元素、查询队尾元素。最终，我们实现的双端队列将会拥有以下方法和属性：

| 方法名      | 描述                                           |
| ----------- | ---------------------------------------------- |
| addFront    | 向队首添加一个至多个元素，然后返回更新后的队列 |
| addBack     | 向队尾添加一个至多个元素，然后返回更新后的队列 |
| removeFront | 从队首移除一个元素，然后返回这个被移除的元素   |
| removeBack  | 从队尾移除一个元素，然后返回这个被移除的元素   |
| peekFront   | 查询位于队首的元素                             |
| peekBack    | 查询位于队尾的元素                             |
| clear       | 清空队列，然后返回更新后的队列                 |

| 属性名 | 描述           |
| ------ | -------------- |
| size   | 查询元素的数量 |

接下来，请看实现代码吧！

```js
class Deque {
    
    #elements = {};
    #from = 0;
    #to = 0;
    
    constructor( ... elements ) {
        
        this.size = 0;
        this.addBack( ... elements );
        
    }
    
    addFront( ... elements ) {
        
        elements.forEach( element => {
            
            this.#elements[ -- this.#from ] = element;
            this.size ++;
            
        } );
        
        return this;
        
    }
    
    addBack( ... elements ) {
        
        elements.forEach( element => {
            
            this.#elements[ this.#to ++ ] = element;
            this.size ++;
            
        } );
        
        return this;
        
    }
    
    removeFront() {
        
        if ( ! this.size ) return;
        
        const element = this.#elements[ this.#from ];
        
		delete this.#elements[ this.#from ++ ];
        this.size --;
        
        return element;
        
    }
    
    removeBack() {
        
        if ( ! this.size ) return;
        
        const element = this.#elements[ -- this.#to ];
        
		delete this.#elements[ this.#to ];
        this.size --;
        
        return element;
        
    }
    
    peekFront() {
        
        return this.#elements[ this.#from ];
        
    }
    
    peekBack() {
        
        return this.#elements[ this.#to - 1 ];
        
    }
    
    clear() {
        
        this.#elements = {};
        this.#from = 0;
        this.#to = 0;
        this.size = 0;

        return this.#elements;
        
    }
    
}
```

## 用队列解决问题

### 击鼓传花

击鼓传花（hot potato）的游戏规则是：n 个人围成一圈，大家沿着同一时针方向来传递手绢（从第一个人开始），然后在某个随机的时刻暂停传递，并淘汰掉彼刻的手绢持有者，如此往复直至最后只剩下一个人。

我们可以使用普通队列来模拟击鼓传花这个游戏，具体的实现思路是：我们不断的将队首的元素移动到队尾，直至达到某个随机的次数后，就淘汰掉彼时的队首元素，如此往复直至队列中只剩下一个元素为止。具体的实现代码如下。

```js
function play ( ... elements ) {
    
    const queue = new Queue( ... elements );
    
	while ( queue.size - 1 ) {
        
        let random_num = Math.round( Math.random() * 100 ) + 10;
        
        while ( random_num -- ) {
            
            queue.enqueue( queue.dequeue() );
            
        }
        
        console.log( "淘汰者：", queue.dequeue() );
        
    }
    
    console.log( "胜利者：", queue.peek() );
    
}
```

测试一下这份代码。

```js
play( "John", "Jack", "Camila", "Lina", "Jynx", "Neo", "Eva", "Robin", "Haber", "Caro" );

// 控制台将会打印：
// -> 淘汰者：Robin
// -> 淘汰者：Haber
// -> 淘汰者：Jack
// -> 淘汰者：Caro
// -> 淘汰者：Neo
// -> 淘汰者：John
// -> 淘汰者：Camila
// -> 淘汰者：Jynx
// -> 淘汰者：Lina
// -> 胜利者：Eva
```

### 回文检查器

回文（palindrome）是指正序和反序都相同的字符串，比如 `"madam"`、`"racecar"`、`"人人为我，我为人人"`。检查一个字符串是不是回文的方法有很多，最容易想到的办法就是比较反转后的字符串是否与原字符串相等，此时就可以用栈来解决这个问题，比如：

![使用栈来反转字符串](/static/image/markdown/data-structure/queue/reverse-string-by-stack.png)

> 因为 JavaScript 中的 `String.prototype` 没有 `reverse` 方法，所以我们才需要自己来手动反转字符串，基于栈来进行回文检查的程序的时间复杂度是 `O(n)`。

除了使用栈之外，我们还可以使用双端队列来做回文检查，它的逻辑是：

- 如果入参不是一个字符串，则返回 `false`
- 如果入参是一个字符串，且长度为 `0`，则返回 `false`
- 如果入参是一个字符串，且长度为 `1`，则返回 `true`，因为只有一个字符的字符串肯定是回文
- 如果入参是一个字符串，且长度大于 `1`，那么就使用双端队列来存储每个字符，然后移除队首与队尾的元素，并比较这两个元素是否严格相等，一旦不相等就直接返回 `false`，否则就继续重复这个移除与比较的步骤，直至队列中只剩下 `1` 个或 `0` 个元素，然后就返回 `true`

![使用双端队列来检查回文](/static/image/markdown/data-structure/queue/check-palindrome-by-deque.png)

它的实现代码如下。

```js
function check( string ) {
    
    if ( typeof( string ) !== "string" ) return false;
    
	const elements = Array.from( string );
    
	if ( elements.length === 0 ) return false;
    if ( elements.length === 1 ) return true;
    
    const deque = new Deque( ... elements );
    
    while ( deque.size > 1 ) {
        
        if ( deque.removeFront() === deque.removeBack() ) continue;
        
        return false;
        
    }
    
    return true;
    
}
```

> 基于双端队列的回文检查程序的时间复杂度也是 `O(n)`。

最后，让我们来检查一下这个程序。

```js
check( "madam" );           // true
check( "racecar" );         // true
check( "人人为我，我为人人" ); // true
check( "" );                // false
```

