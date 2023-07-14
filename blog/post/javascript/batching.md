---
typora-root-url: ./..\..\image
---

# Batching

## 概述

本文用于描述 react@latest、vue@latest、solid@latest 的 batching 行为的差异。

## React's batching

请通过阅读下述示例代码来了解 React 的 batching 行为。

请在非 `React.StrictMode` 模式下执行下述代码，然后点击一次按钮。

```jsx
function Component () {
    
    console.log( "before useState" );
    const [ count, setCount ] = useState( 0 );
    console.log( "after useState" );
    
    const handleClick = () => {
        
        console.log( "before first setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after first setCount" );
        
        console.log( "before second setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after second setCount" );
        
        console.log( "before third setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after third setCount" );
        
    };
    
    return <button onClick={ handleClick }>{ count }</button>;
    
}

// 控制台信息的打印顺序：
// # 挂载组件
// > before useState
// > after useState
// 
// # 点击按钮
// > before first setCount
// > 0
// > after first setCount
// > before second setCount
// > after second setCount
// > before third setCount
// > after third setCount
// 
// # 更新组件
// > before useState
// > 1
// > 2
// > after useState
```

综上所述，React 的 batching 的行为逻辑“看起来”是这样的：

1. 在首次调用 `setCount` 时就立即执行状态更新任务以计算出新的状态值，新的状态值“应该”会作为状态更新任务队列的队首，React 会在当前同步代码执行完毕之后的某个时刻去更新组件；
2. 在后续调用 `setCount` 时不会立即执行状态更新任务，而是将状态更新任务推入到任务队列中去；
3. 在更新组件时，执行至 `useState` 的时候，React 会依次处理任务队列中的所有任务，以计算出最终的状态值，接着用最终的状态值更新 DOM；

> 「状态更新任务」是指 `setCount()` 的入参，该入参是一个值或一个函数。

上述结论是一个猜测。

### 官方文章的描述是有误的

React 官方在 [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates) 中阐述了 batching 的行为逻辑，在 React 的描述中的 batching 很整洁，可是却不符合上述示例代码的表现，不符合的地方是：官方文章描述说第一次 `setState` 的入参不会被立即执行，而是被推入到任务队列中去，可是示例代码的反应则是第一次 `setSatet` 的入参会被立即执行。

下文是我所总结的 React 官方对 batching 的行为逻辑的描述：

触发 `click` 事件之后，`handleClick` 函数的内部会多次调用 `setA` 和 `setB`，它们的入参会被依次地推入到各自的任务队列中去，并且无论是 `setA` 还是 `setB` 都会触发组件的异步更新。

![状态的任务队列](/javascript/react-handbook/setstate-queue-create.png)

更新组件时，`useState` 函数会依次处理任务队列中的任务，然后计算出最终的状态值。

![计算状态值](/javascript/react-handbook/setstate-queue-calculate.png)

最后使用最终的状态值来更新 DOM。

## Solid's batching

在 Solid 中，每次调用 `setState` 都会立即计算出新的状态值，接着立即更新 DOM。如果你想多次调用 `setState` 但只更新一次 DOM，那么你需要手动的使用 [batch](https://docs.solidjs.com/references/api-reference/reactive-utilities/batch)。

```jsx
function Component () {
    
    const [ getCount, setCount ] = createSignal( 0 );
    const handleClick = () => {
        
		console.log( "before first setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after first setCount" );
        
        console.log( "before second setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after second setCount" );
        
        console.log( "before third setCount" );
        setCount( prev => console.log( prev ) ?? prev + 1 );
        console.log( "after third setCount" );
        
    };
    
    return <>
    	<button onClick={ handleClick }>{ getCount() }</button>
    	{ console.log( getCount() ) }
    </>;
    
}

// 控制台信息的打印顺序：
// # 挂载组件
// > 0
//
// # 点击按钮 & 更新组件
// > before first setCount
// > 0
// > 1
// > after first setCount
//
// > before second setCount
// > 1
// > 2
// > after second setCount
//
// > before third setCount
// > 2
// > 3
// > after third setCount
```

我更喜欢 Solid，因为它在这里没有魔法，这意味着更少的陷阱。

## Vue's tick

Vue 没有 batching，取而代之的是一个 tick，详见 [这篇文章](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#dom-update-timing)。

简而言之，Vue 不会在开发者更新状态之后就立即同步的更新 DOM，取而代之的是，Vue 会为每一个响应式状态都维护一个独立的关于状态更新的任务队列，然后 Vue 会将一段时间内的对所有响应式状态的更新任务都收集到各自的任务队列中去，然后直到下一次更新时机（tick）到来之时，再直接计算出所有需要更新的响应式状态的最终值，并一次性的更新 DOM。