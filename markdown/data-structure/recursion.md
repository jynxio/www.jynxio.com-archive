# 递归

## 概述

递归函数是一种会调用自身的函数，比如这个 `loop` 函数就是一个递归函数。

```js
function loop () {

    console.log( 1 );

    loop();

}
```

## 基线条件

基线条件是指递归函数停止递归的条件，如果递归函数没有基线条件，那么递归函数就会无限的执行下去。一个无限递归的递归函数容易造成“爆栈”，最终导致程序被杀死，比如上文中的 `loop` 函数就会造成“爆栈”。

```js
loop(); // RangeError: Maximum call stack size exceeded
```

编写递归函数是一项需要经验和灵感的工作，如果你不知道该如何开始编写一个递归函数，那么我建议你先找到递归函数的基线条件，这可以帮助你更快的找到头绪。

> 如果你想了解什么是“爆栈”，那么你可以读读下面这则短文。
>
> JavaScript 引擎在执行一个函数之前，都会创建一个函数执行上下文，并将这个函数执行上下文推入调用栈中，直至函数执行完成之后，调用栈才会弹出该函数执行上下文。
>
> 调用栈只能容纳有限的执行上下文，这是因为执行上下文是需要消耗内存空间的，而调用栈所拥有的内存空间又是有限的。当 JavaScript 引擎执行 `loop()` 时，引擎就会不断的向调用栈推入新创建的函数执行上下文，最终调用栈就会因为超出了承载上限而不得不停止执行，并抛出一个 `RangeError` 错误，这便是爆栈。
>
> 如果你熟悉事件循环，那么你就可以通过一些奇技淫巧来避免“爆栈”，就像下面这个 `loop` 函数，它可以无限的执行下去，而不会爆栈。
>
> ```js
> function loop () {
> 
>     console.log( 1 );
> 
>     setTimeout( loop, 0 );
> 
> }
> ```
>
> 另外，或许你还听说过“尾调用优化”，这是另一种防止爆栈并提升递归性能的手段，不过请忘了它吧，因为除了 Apple 之外的浏览器厂商都拒绝实现该特性。

## 阶乘

### 概念

在数学中，正整数的阶乘是所有小于及等于该数的正整数的积，我们把它表示为 `n!`，另外 `1` 和 `0` 的阶乘都等于 `1`。让我们来举个例子，`5` 的阶乘表示为 `5!`，其值为 `120`，因为：

```
5! = 1 * 2 * 3 * 4 * 5 = 120
```

### 实现

灵感乍现，我一下子找到了 `calculateFactorial` 函数的基线条件，然后顺势编写好了整个函数。

```js
function calculateFactorial( n ) {

    if ( n === 0 || n === 1 ) return 1; // 基线条件

    return n * calculateFactorial( n - 1 );

}
```

## 斐波那契

> 真怀念啊！我记得我的第一个 DOM 程序就是一个汉诺塔动画的网页，她还很兴奋的鼓励了我呢！

#### 概念

斐波那契数列是一个特殊的数列，它的规律是：

- `0号元素 = 0`
- `1号元素 = 1`
- `2号元素 = 1`
- `n号元素 = n-1号元素 + n-2号元素`

#### 实现

这是第二次灵感乍现。

```js
function calculateFibonacci ( n ) {

    /* 基线条件 */
    if ( n === 0 ) return 0;
    if ( n === 1 || n === 2 ) return 1;

    /*  */
    return calculateFibonacci( n - 1 ) + calculateFibonacci( n - 2 );

}
```

#### 优化

这是 `calculateFibonacci` 函数的优化版本，你分别使用旧版与新版的 `calculateFibonacci` 函数来计算 `20` 的斐波那契数，便会发现新版本的计算速度要快的多。

```js
const calculateFibonacci = createFibonacciCalculator();

function createFibonacciCalculator () {

    const cache = [ 0, 1, 1 ];

    return function calculateFibonacci ( n ) {

        if ( cache[ n ] !== undefined ) return cache[ n ]; // 基线条件

        return cache[ n ] = calculateFibonacci( n - 1 ) + calculateFibonacci( n - 2 );

    }

}
```

新版的 `calculateFibonacci` 函数之所以会更快，是因为它缓存了曾经计算过的斐波那契数，从而减少了很多重复的计算。

## 深拷贝

这是一个深拷贝的简单实现，它可以深拷贝普通对象。

```js
function deepClone ( source ) {

    /* 基线条件 */
    if ( typeof source !== "object" ) return source;

    /*  */
    const target = {};
    const keys = Object.keys( source );

    keys.forEach( key => target[ key ] = deepClone( source[ key ] ) );

    return target;

}
```

> 如果你想在生产环境中使用深拷贝，那么请使用 [structuredClone API](https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone)，这是一个由 HTML5 规范定义的深拷贝方法，它已内建于浏览器运行时与 Node.js 运行时中，它的兼容性良好。
>
> `structuredClone` 比 `_.cloneDeep()` 和 `JSON.parse(JSON.stringify())` 更好，你可以从 [这篇文章](https://www.builder.io/blog/structured-clone) 了解到更多。

## 意义

递归函数的意义在于提高函数的可读性，如果你仔细阅读了上述两个例子的代码，你就会发现它们都是自解释的。

不过，如果你期望得到的是高性能的函数，那么你可以尝试把递归函数改造成普通的迭代函数，迭代函数往往会比递归函数更快，这是因为创建额外的函数执行上下文会带来额外的性能负荷。