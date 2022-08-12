---
typora-root-url: ..\..
---

# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新

## Hook Flow

![hook flow](/static/image/markdown/javascript/react-api-manual/hook-flow.png)

## useState

`useState` 有 2 种调用方式，分别是：

```js
const [ state, setState ] = useState( initial_state );
const [ state, setState ] = useState( function createInitialState () { return initial_state } );
```

`createInitialState` 函数会在组件首次渲染之前调用，该函数的返回值会作为 `state` 的初始值。不过，在以后重新渲染组件的时候，`createInitialState` 函数都不会再被调用。

> 渲染组件是指调用组件构造器。

`setState` 是 `state` 的更新器，它也有 2 种使用方式，分别是：

```js
setState( next_state );
setState( function createNextState ( previous_state ) { return next_state } );
```

- 调用一次 `setState` 函数，React 就会创建一个异步任务并准备重新渲染组件，异步任务会在下一次组件渲染之前更新 `state`。
- 如果 `next_state` 和 `previous_state` 一样（React 使用 `Object.is` 来进行相等判断），React 就不会重新渲染组件。
- 调用多次 `setState` 函数，React 就会创建多个异步任务，并将这些异步任务放进一个任务队列中去（按照 `setState` 的调用顺序），React 会依次执行这些任务。有时候，React 执行一个任务，就会更新一次 DOM，有时候，React 会连续执行多个任务，但只更新一次 DOM。

## useEffect

```js
useEffect(
    function effect () { return function clean () {} },
    dependency_array
);
```

- 如果挂载或更新了组件，那么 `effect` 函数就会执行，执行时机是页面更新之后。
- `effect` 函数只能返回 `undefined` 或另一个函数（称为 `clean` 函数，即清理器），如果返回了其它值，React 就会抛出错误。
- 如果更新了组件，那么 `clean` 函数就会执行，执行时机是页面更新之后、`effect` 函数执行之前。如果卸载了组件，那么 `clean` 函数也会执行，执行时机是页面更新之后。
- `dependency_array` 是可选的，React 依赖它来决定是否调用 `effect` 函数，具体规则如下：

```js
// 挂载或更新组件之后，effect函数都会执行。
useEffect( _ => {} );

// 挂载组件之后，effect函数才会执行。
useEffect( _ => {}, [] );

// 挂载组件之后，effect函数就会执行。
// 更新组件之后，仅当a或b发生了变化时，effect函数才会执行。
useEffect( _ => {}, [ a, b ] );
```

## Custom Hook

### 概述

custom hook 是一个函数，它和普通函数之间的唯二区别是：

- custom hook 内部用到了 hook，普通函数的内部没有用到 hook。
- custom hook 的命名必须以 `use` 开头，普通函数的命名没有限制。

从 React 的角度来看，custom hook 就是一个普通的函数，因为 React 不会对 custom hook 做特殊的处理，执行一个 custom hook 和执行一个普通函数是没有任何区别的。

custom hook 是一种复用代码的技巧，具体来说，如果多个组件的内部都使用了相同的逻辑，那么我们就可以把这部分重复的逻辑提取到一个独立的函数中去，然后让多个组件直接调用这个函数。如果这个函数的内部用到了 hook，那么这个函数就是 custom hook，否则就是普通函数。

> custom hook 的命名之所以要以 `use` 开头，是因为 React 要通过函数名来判断该函数是否使用了 hook，然后 React 要对使用了 hook 的函数进行检查，检查其 hook 的使用是否符合规范。

在 custom hook 内，用 `useState` API 所创建出来的状态不是跟随 custom hook 的，而是跟随调用 custom hook 的组件的，其他的内建 hook 也同理。为了便于理解，你可以认为下例中的 `Component1` 等价于 `Component2`。

```react
function Component1 () {
    
	const [ state, setState ] = useSomething();
    
    return <div></div>;
    
}

function Component2 () {
    
	const [ state, setState ] = useState();
    
    return <div></div>
    
}

function useSomething () {
    
    return useState();
    
}
```

下面是一个实际应用 custom hook 的例子。

```react
function usePlaying ( reference ) {
    
    const [ state, setState ] = useState( false );
    const reverse = _ => setState( ! state );
    
    useEffect( _ => {
        
        state ? reference.current.play() : reference.current.pause();
        
    } );
    
    return reverse;
    
}

function Player1 () {
    
    const reference = useRef();
    const reverse = usePlaying();
    
    // 此处将会编写一些专属于Player1的代码。
    
    return <video ref={ reference } onClick={ reverse }></video>
    
}

function Player2 () {
    
    const reference = useRef();
    const reverse = usePlaying();
    
    // 此处将会编写一些专属于Player2的代码。
    
    return <video ref={ reference } onClick={ reverse }></video>
    
}
```

