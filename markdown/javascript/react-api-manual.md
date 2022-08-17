---
typora-root-url: ..\..
---

# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新

## useState

`useState` 是一种用来控制组件状态的 Hook，它有 2 种调用方式，分别是：

```js
/* 方式一 */
const [ state, setState ] = useState( initial_state );

/* 方式二 */
const [ state, setState ] = useState( function createInitialState () { return initial_state } );
```

对于方式二，`createInitialState` 函数只会在挂载组件时被调用，该函数的返回值会被作为 `state` 的初始值，因为该函数的作用就是为了给 `state` 提供一个初始值。在未来更新组件和卸载组件的时候，该函数都不会再被调用，不过如果重新挂载组件，那么该函数就会被再次调用。

### setState

`setState` 是 `state` 的更新器，它用于更新组件的状态，并命令 React 更新组件。它也有 2 种调用方式，分别是：

```js
/* 方式一 */
setState( next_state );

/* 方式二 */
setState( function createNextState ( previous_state ) { return next_state } );
```

它的运行机制如下：

- 如果调用 `setState` 函数，那么 React 就会异步的更新组件，并且 `next_state` 将会作为组件下一次更新时的新 `state` 值。不过，如果 `next_state` 和 `previous_state` 一样，那么 React 就不会更新组件。
- 如果多次调用 `setState` 函数，那么 React 就会按照 `setState` 的调用顺序，来将更新组件的任务有序的放入一个任务队列中，然后依次出队执行任务队列中的更新任务。有时候，React 执行一个更新任务，就会更新一次 DOM，有时候，React 会连续执行多个更新任务，才更新一次 DOM。

> React 使用 `Object.is` 来执行相等判断。

## useEffect

`useEffect` 用于执行带有副作用的操作，其语法如下：

```js
useEffect(
    function effect () { return function clean () {} },
    dependency_array
);
```

其中：

- `effect` 函数用于装载具有副作用的操作，如果挂载或更新了组件，那么 React 就会执行 `effect` 函数，并且执行时机是在页面更新之后。
- `dependency_array` 数组用于决定是否执行 `effect` 和 `clean` 函数。

### clean

`clean` 是由 `effect` 函数所返回的另一个函数，它用于清除副作用，它的运行机制如下：

- 如果更新了组件，那么 React 就会在页面更新之后、`effect` 函数执行之前，就执行 `clean` 函数，这么做是为了消除上一次调用 `effect` 函数时所产生的副作用，否则组件在多次更新之后，副作用就会累积。
- 如果卸载了组件，那么 React 就会在页面更新之后执行 `clean` 函数，这么做时为了消除死亡节点所遗留的副作用。

> 事实上，`effect` 函数除了可以返回函数之外，还可以返回 `undefined`，所以 `clean` 是可选的。不过，如果 `effect` 函数返回了其他数据类型的值，那么 React 就会报错。

### dependency_array

`dependency_array` 数组用于决定是否执行 `effect` 和 `clean` 函数，具体来说：

```js
/**
 * 方式一：
 * 如果挂载或更新了组件，那么effect函数就会执行。
 * 如果卸载或更新了组件，那么clean 函数就会执行。
 */
useEffect(
    function effect () { return function clean () {} },
);

/**
 * 方式二：
 * 如果挂载了组件，那么effect函数就会执行。
 * 如果卸载了组件，那么clean 函数就会执行。
 */
useEffect(
    function effect () { return function clean () {} },
    [],
);

/**
 * 方式三：
 * 如果挂载了组件，那么effect函数就会执行；如果更新了组件且state发生了变化，那么effect函数就会执行。
 * 如果卸载了组件，那么clean 函数就会执行；如果更新了组件且state发生了变化，那么clean 函数就会执行。
 */
useEffect(
    function effect () { return function clean () {} },
    [ state ],
);
```

> 对于方式三，React 使用 `Object.js` 来比较新旧 `state` 是否发生了变化。

## useRef

`useRef` 用于提供一个数据仓库，这个数据仓库会伴随组件的整个生命周期，这意味着开发者可以在数据仓库中存储一些历史数据，另外我们也常常用这个数据仓库来存储 DOM 节点。

具体来说 `useRef` 会返回一个只有 `current` 属性的普通对象，比如 `{ current: initial_value }`，其语法如下：

```js
const reference = useRef( initial_value ); // { current: initial_value }
```

> 我们可以认为 `useRef` 是 `useState` 的语法糖，因为 React 官方说 `useRef` 大概是这么实现的：
>
> ```react
> function useRef ( initial_value ) {
> 
>     const [ reference, setReference ] = useState( { current: initial_value } );
> 
>     return reference;
> 
> }
> ```

## ref property

React 元素具有一个 `ref` 属性，`ref` 属性用于捕获元素节点，它有 2 种调用方式：

```react
/* 方式一 */
<div ref={ { current: undefined } }></div>

/* 方式二 */
<div ref={ element => {} }></div>
```

### 方式一

`ref` 属性可以接收一个 `{ current: * }` 格式的普通对象，此时其运行机制如下：

- React 会在创建了 `div` 元素之后，将 `div` 元素赋值给 `current` 属性。
- React 会在移除了 `div` 元素之后，将 `null` 赋值给 `current` 属性。

> 直至调用了 `ReactDOM.createRoot( dom ).render` 方法之后，React 才会创建 DOM 元素。

如果把 `useRef` 的返回值传递给 `ref` 属性，那么我们就可以持久的存储 DOM 元素了：

```react
function Component () {

    const reference = useRef();

    return <div ref={ reference }></div>

}
```

### 方式二

`ref` 属性也可以接收一个函数，我们把这个函数称为 `refCallback`，此时其运行机制如下：

- React 会在创建了 `div` 元素之后，调用 `refCallback` 函数，并将 `div` 元素作为入参传递给 `refCallback`。
- React 会在移除了 `div` 元素之后，调用 `refCallback` 函数，并将 `null` 作为入参传递给 `refCallback`。

> 如果 React 更新了组件，那么 React 就会创建一个新的 `div` 元素来替代旧的 `div` 元素，这意味着 React 将会调用两次 `refCallback`，第一次调用是因为移除了旧的 `div` 元素，第二次调用时因为创建了新的 `div` 元素。

## Custom Hook

custom hook 是一个用于封装 hook 的函数，并且 React 要求 custom hook 的命名必须以 `use` 开头。

> React 要检查 custom hook 内的 hook 使用是否符合规范，为了方便分辨出哪些函数才是 custom hook，React 便要求 custom hook 的命名必须以 `use` 开头。

### 示例

```react
function Name () {

    const [ name, setName ] = useLocalStorageState( "name", "Jynxio" );

    return <input value={ name } onChange={ event => setName( event.target.value ) } />;

}

function useLocalStorageState ( key, initial_value ) {

    const [ state, setState ] = React.useState(
        JSON.parse( globalThis.localStorage.getItem( key ) ) || initial_value
    );

    React.useEffect( _ => {

        globalThis.localStorage.setItem( key, JSON.stringify( state ) );

        return _ => globalThis.localStorage.removeItem( key );

    }, [ key, state ] );

    return [ state, setState ];

}
```

### 原理

为了减少代码的冗余或增强代码的可读性，我们会把代码从原处提取出来，封装到一个函数中去，custom hook 就是这么一种产物，只不过其内的代码包含了 hook 而已。

所以 custom hook 和普通函数其实没有本质的区别，在组件内调用一个 custom hook 就和调用一个普通函数一样。

不过需要提醒的是，在 custom hook 内，用 `useState` 所创建出来的状态不是跟随 custom hook 的，而是跟随调用 custom hook 的组件的，其他的内建 hook 也同理。之所以会有这种现象，我猜测是因为由 `useState` 所创建出来的状态会自动吸附到组件上。

## forwardRef

React 不允许通过下述方式来在 `Parent` 组件中获取 `Child` 组件的 DOM，因为 React 认为这是一种不安全的编程范式。

```react
function Parent () {
    
    const reference = useRef();
    
    return <Child ref={ reference }/>;
    
}
```

不过，React 提供了另一种途径来获取 `Child` 组件的 DOM，那就是通过 `forwardRef` API 来将 `Parent` 组件的 `reference` 转发给 `Child` 组件，然后再获取 `Child` 组件的 DOM。

### 语法

`forwardRef` 就像一个开关，经它改造的组件，将可以接收到第二个参数 `reference`。

```react
Child = forwardRef( Child );

function Parent () {

    const reference = useRef();

    return <Child ref={ reference }/>

}

function Child ( properties, reference ) {

    return <div ref={ reference }></div>;

}
```

### 原理

其实，在经 `forwardRef` 改造之前，组件也可以接收到第二个参数 `reference`，只不过这个参数总是一个空对象 `{}`。

```react
function Child ( properties, reference ) {

    console.log( reference );  // {}

    return <div></div>

}
```

这是因为 React 故意不让组件接收到来自上游的 `reference` 数据，仅当开发者使用 `forwardRef` 改造了组件之后，组件才能接收到来自上游的 `reference` 数据，所以 `forwardRef` 就像一个开关。

> 另外，哪怕没有 `forwardRef`，我们也可以把 `reference` 数据传递给下游组件，只要把 `reference` 数据包裹在 `properties` 中就可以了：
>
> ```react
> function Parent () {
> 
>     const reference = useRef();
> 
>     return <Child secret={ reference }/>
> 
> }
> 
> function Child ( properties ) {
> 
>     return <div ref={ properties.secret }></div>
> 
> }
> ```

## useImperativeHandle

`useImperativeHandle` 需要和 `forwardRef` 搭配在一起来使用，因为它的作用是让开发者自由的决定应该暴露什么内容给 `Parent` 组件的 `reference`。

### 语法

`useImperativeHandle` 函数接收 2 个参数：

1. 第一个是上游组件的 `reference`。
2. 第二个是无参函数，无参函数的返回值将作为 `reference` 的 `current` 属性的值。

```react
useImperativeHandle( parent_reference, _ => parent_reference_current_value );
```

### 示例

```react
Child = forwardRef( Child );

function Parent () {

    const reference = useRef();

    return <Child ref={ reference }/>

}

function Child ( properties, reference ) {

    useImperativeHandle( reference, _ => 1 );

    return <div></div>;

}
```

> 从技术上来说，哪怕没有 `useImperativeHanlde`，我们也可以实现相同的效果，只要使用 ref callback 就可以了。
>
> ```react
> function Child ( properties, reference ) {
>     
>     return <div ref={ _ => reference.current = 1 }></div>;
>     
> }
> ```
>
> 这种实现反而更加简洁。

## flushSync

`flushSync` 用于让 React 立即更新 DOM，它来自于 `react-dom`。

### 语法

`flushSync` 接收并立即执行一个回调函数，待回调函数执行结束之后，React 就会立即更新 DOM。

```js
import { flushSync } from "react-dom";

flushSync( _ => {} );
```

### 示例

`(1)` 会同步的更新组件，并在更新好后立即更新 DOM，所以挂载或卸载 `div` 元素之后，`(2)` 行代码总是可以正确的输出 `div` 元素或 `null`。

```react
function Component () {

    const reference = useRef();
    const [ visible, setVisible ] = useState( false );

    function handleClick () {

        flushSync( _ => setVisible( ! visible ) ); // (1)

        console.log( reference.current );          // (2)

    }

    return (
    	<>
            <button onClick={ handleClick }>reverse</button>
            <div ref={ reference }></div>
        </>
    );

}
```