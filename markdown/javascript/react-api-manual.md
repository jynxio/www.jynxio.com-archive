# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新

## useState

### useState 语法

`useState` 有 2 种调用方式，分别是：

```js
const [ state, setState ] = useState( "initial_state" );      // 1
const [ state, setState ] = useState( _ => "initial_state" ); // 2
```

其中，如果 `useState` 接收到的入参是一个函数的话，那么这个函数就只会在组件初始化时被调用，并且该次调用的返回值会被作为 `state` 的值。不过，在以后重新渲染该组件的时候，该函数都不会再被调用。

### setState 语法

其中，`setState` 有 2 种调用方式：

- `setState( new_state )`
- `setState( previous_state => new_state )`

