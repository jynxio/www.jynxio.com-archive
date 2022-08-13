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

## useRef

`useRef` 返回一个普通的对象，该对象只有一个 `current` 属性，`current` 属性的值就是 `initial_value`。这个普通的对象会在组件的整个生命周期内持续存在。

```js
const reference = useRef( initial_value );
```

> `useRef` 是 `useState` 的语法糖，因为 React 官方说我们可以认为 `useRef` 是这么实现的：
>
> ```js
> function useRef ( initial_value ) {
>     
>     const [ reference, setReference ] = useState( { current: initial_value } );
>     
>     return reference;
>     
> }
> ```

### 存储数据

因为 `useRef` 所返回的普通对象（`reference`）将会在组件的整个生命周期内持续存在，所以我们可以在 `reference` 上存储历史数据，另外，开发者们通常都在 `reference` 的 `current` 属性上存储数据。

下例使用 `reference` 来存储定时函数的 id，以方便随时取消定时函数。

```react
function Clock () {
    
    const reference = useRef();
    
    function handleStartClick () {
        
        reference.current = setInterval( _ => console.log( "running..." ), 500 );
        
    }
    
    function handleStopClick () {
        
        if ( ! reference.current ) return;
        
        clearInterval( reference.current );
        
    }
    
    return (
    	<>
            <button onClick={ handleStartClick }>start</button>
            <button onClick={ handleStopClick }>stop</button>
        </>
    );
    
}
```

### 获取 DOM

`useRef` 的另一个用处是获取 DOM 元素，如下所示。

```react
function Component () {
    
    const reference = useRef();
    
    return <div ref={ reference }></div>;
    
}
```

在 `reference` 创建之初，其 `current` 属性的值为 `undefined`，直至 React 创建了真实的 `div` 元素之后，React 就会将 `div` 元素链接至 `current` 属性。另外，如果 React 卸载了 `div` 元素，那么 React 就会将 `current` 属性赋值为 `null`。

## Custom Hook

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

## Ref Callback

JSX 元素的 `ref` 属性可以接收一个函数，我们把这个函数称为 ref callback，其语法如下所示。

```react
function Component () {
    
    const refCallback = element => console.log( element );
    
    return <div ref={ refCallback }></div>
    
}
```

当 React 创建 `div` 元素时，React 就会调用 `refCallback`，并向其传入 `div` 元素作为入参。当 React 卸载 `div` 元素时，React 就会调用 `refCallback`，并向其传入 `null` 作为入参。

另外，如果 React 重新渲染了 `Component` 组件，那么 React 就会创建一个新的 `div` 元素来替代旧的 `div` 元素，这意味着会触发两次 `refCallback`，第一次触发是因为卸载旧的 `div` 元素，第二次触发是因为创建新的 `div` 元素。

## forwardRef

React 不允许通过下述方式来在 `Parent` 组件中获取 `Son` 组件的 DOM，因为 React 认为这是一种不安全的编程范式。

```react
function Parent () {
    
    const reference = useRef();
    
    return <Son ref={ reference }/>;
    
}
```

不过，React 提供了另一种途径来获取 `Son` 组件的 DOM，那就是通过 `forwardRef` API 来将 `Parent` 组件的 `reference` 转发给 `Son` 组件，然后再获取 `Son` 组件的 DOM，具体操作如下。

```react
Son = forwardRef( Son );

function Parent () {
    
    const reference = useRef();
    
    return <Son ref={ reference } />
    
}

function Son ( properties, reference ) {
    
    return <div ref={ reference }></div>
    
}
```

> 其实，所有组件一直都可以接收到 2 个参数，第一个是 `properties`，第二个是 `reference`。
>
> ```react
> function Component ( properties, reference ) {
>     
>     console.log( properties ); // {}
>     console.log( reference );  // {}
>     
>     return <div></div>
>     
> }
> ```
>
> 只是在默认情况下，所有组件的第二个参数都总是为空对象 `{}`，这是因为 React 故意不将上游的 `reference` 数据转发给组件。仅当开发者通过 `Component = forwardRef( Component )` 这种方式来“改造”了组件之后，React 才会将上游的 `reference` 数据转发给组件。
>
> 所以我们可以把 `forwardRef` 当作一个开关，这个开关可以将组件从默认状态切换至非默认状态。

## useImperativeHandle

`useImperativeHandle` 需要搭配 `forwardRef` 一起来使用，