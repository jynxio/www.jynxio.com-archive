# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新

## useState

`useState` 有 2 种调用方式，分别是：

```js
const [ state, setState ] = useState( initial_state );
const [ state, setState ] = useState( _ => initial_state );
```

- 只能在组件的顶部调用 `useState`，不能在其它位置、循环块内、判断块内调用 `useState`。
- 当 `useState` 接收到的入参是一个函数时，这个函数会在首次渲染组件的时候被调用，调用的返回值会被作为 `state` 的值。不过，在以后重新渲染组件的时候，这个函数都不会再被调用。

`setState` 是 `state` 的更新器，它也有 2 种使用方式，分别是：

```js
setState( next_state );
setState( previous_state => next_state );
```

- 所有 `setState` 任务都会按照调用的顺序被放入一个任务队列中，然后依次被执行。
- 调用 `setState` 任务之后，React 就会重新渲染组件，有时候 React 会合并执行多个 `setState` 任务，然后再重新渲染一次组件。
- 如果 `setState` 接收到的入参是一个函数，那么这个函数在被调用的时候，就会接收到一个 `previous_state` 参数，这个参数代表最新的 `state`（在函数调用的时刻）。

