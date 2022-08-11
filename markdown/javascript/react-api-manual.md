# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新

## useState

`useState` 有 2 种调用方式，分别是：

```js
const [ state, setState ] = useState( initial_state );
const [ state, setState ] = useState( function createInitialState () { return initial_state } );
```

`createInitialState` 函数会在组件首次渲染时调用，该函数的返回值会作为 `state` 的初始值。不过，在以后重新渲染组件的时候，`createInitialState` 函数都不会再被调用。

> 渲染组件是指调用组件函数、更新 DOM、更新页面的这一系列过程。

`setState` 是 `state` 的更新器，它也有 2 种使用方式，分别是：

```js
setState( next_state );
setState( function createNextState ( previous_state ) { return next_state } );
```

- 调用一次 `setState` 函数，React 就会创建一个异步任务并准备重新渲染组件，异步任务会更新下一次组件渲染时的 `state`。
- 如果 `next_state` 和 `previous_state` 一样（React 使用 `Object.is` 来进行相等判断），React 就不会重新渲染组件。
- 调用多次 `setState` 函数，React 就会创建多个异步任务，并将这些异步任务放进一个任务队列中去（按照 `setState` 的调用顺序），React 会依次执行这些任务。有时候，React 执行一个任务，就会渲染一次组件，有时候，React 会连续执行多个任务，但只渲染一次组件。

## useEffect

```js
useEffect(
    function effect () { return function clean () {} },
    condition_array
);
```

- `effect` 函数会在组件渲染完成之后再执行。
- `effect` 函数只能返回 `undefined` 或另一个函数（称为 `clean` 函数，即清理器），如果返回了其它值，React 就会抛出错误。
- `clean` 函数是可选的，它会在 `effect` 函数再次执行之前执行，或者在组件卸载后执行。
- `condition_array` 是可选的，它用于决定 `effect` 函数的执行与否，具体规则如下：

```js
// 组件每次渲染之后，effect函数都会被执行
useEffect( _ => {} );

// 组件首次渲染之后，effect函数才会被执行
useEffect( _ => {}, [] );

// 组件每次渲染之后，且a或b发生了变化，effect函数才会被执行
useEffect( _ => {}, [ a, b ] );
```



