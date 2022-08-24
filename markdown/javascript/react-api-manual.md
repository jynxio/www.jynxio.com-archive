---
typora-root-url: ..\..
---

# React API 手册

## 概述

此文用于记录 React API，并遵循下列准则：

- 直白易懂
- 总是最新
- 专属于我

## useState

`useState` 用于声明、存储、更新组件的内部状态，其语法如下：

```js
/* 语法一 */
const [ state, setState ] = useState( initial_state );

/* 语法二 */
const [ state, setState ] = useState( function createInitialState () { return initial_state } );
```

在每一次调用组件构造器的期间，`useState` 函数都会被执行。而 `useState` 函数会返回一个代表组件当前状态的值（`state`），和一个用于更新状态的函数（`setState`）。

不过，`useState` 函数在组件挂载和更新时的行为是有区别的：

- 挂载时：`useState` 函数会根据入参的类型来决定返回值：

  - 如果入参是一个函数，那么 React 就会立即调用这个函数，并用该函数的返回值来作为自己的第一个返回值。

  - 否则，React 就会直接用入参来作为自己的第一个返回值。

- 更新时：`useState` 函数会忽略入参，并通过特殊手段来计算出一个值，然后再用这个值来作为自己的第一个返回值，关于“特殊手段”，详见下文。

> “挂载”代表 React 首次调用组件构造器，“更新”代表 React 非首次调用组件构造器。
>
> 因为传入 `useState` 的入参只会在挂载阶段被使用，所以我把传入 `useState` 的函数入参命名为 `createInitialState`，以表明该函数仅用于生成组件的初始状态。

### setState

`setState` 用于更新状态、更新组件，其语法如下：

```js
/* 语法一 */
setState( next_state );

/* 语法二 */
setState( function createNextState ( previous_state ) { return next_state } );
```

调用 `setState` 之后，`setState` 的入参就会被推入状态的任务队列，并创建一个异步的任务（宏/微任务）来更新组件。在更新组件的期间，`useState` 函数就会通过处理状态的任务队列，来计算出状态的值，然后返回这个值。

### 更新原理

比如，触发 `click` 事件之后，`handleClick` 函数会多次调用 `setA` 和 `setB`，它们的入参会被依次推入各自的任务队列中去。另外，`setA` 和 `setB` 也触发了组件的更新（异步的）。

![状态的任务队列](/static/image/markdown/javascript/react-api-manual/setstate-queue-create.png)

更新组件时，`useState` 函数会依次处理任务队列中的任务，然后计算出状态的值，然后返回这个值。

![计算状态值](/static/image/markdown/javascript/react-api-manual/setstate-queue-calculate.png)

> 我们多次调用了 `setState` 函数，但是 React 只更新了一次组件，React 把这种批处理 `setState` 函数的特性成为 batching。

#### 无效更新

无论 `setState` 的入参是一个函数，还是一个非函数的值，只要 `Object.is( previous_state, next_state )` 返回 `true`，那么该 `setState` 就不会触发组件的更新。

不过，哪怕 `setState` 不会触发更新，这个 `setState` 的入参也会被推入状态的任务队列。

## useEffect

`useEffect` 用于执行带有副作用的操作，其语法如下：

```js
useEffect(
    function effect () { return function clean () {} },
    dependency_array
);
```

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

## Error Boundary

error boundary 是指定义了 `getDerivedStateFromError` 或 `componentDidCatch` 方法的 class 组件。

如果 error boundary 组件的后代组件发生了崩溃，那么崩溃信息就会传递给 error boundary 组件，这时你可以用 `componentDidCatch` 方法来打印崩溃信息，用 `getDerivedStateFromError` 方法来渲染降级 UI。

### getDerivedStateFromError

error boundary 组件的 `static` 方法，该方法会在渲染阶段被调用，该方法接收 1 个入参 `error`，代表后代组件所抛出的错误，该方法的返回值会更新 error boundary 组件的 `state`。

```js
function getDerivedStateFromError ( error ) {

    return new_state;

}
```

### componentDidCatch

error boundary 组件的方法，该方法会在提交阶段被调用，该方法接收 2 个入参 `error` 和 `info`，`error` 代表后代组件所抛出的错误，`information` 是一个带有 `componentStack` 属性的对象，`componentStack` 属性是一个字符串，该字符串记录了抛出错误的后代组件的栈信息。

```js
function componentDidCatch ( error, information ) {

    postErrorToService( information.componentStack );

}
```

> 开发环境下，被 `componentDidCatch` 捕获的错误会冒泡至浏览器根对象 `window`。生产环境下，则不会冒泡。

### 示例

```react
class ErrorBoundary extends React.Component {

    constructor ( properties ) {

        super( properties );
        this.state = { hasError: false };

    }

    static getDerivedStateFromError ( error ) {

        /* 更新state，以渲染降级UI。 */
        return { hasError: true };

    }

    componentDidCatch ( error, information ) {

        /* 反馈错误信息给服务器。 */
        postErrorToService( information.componentStack ); 

    }

    render () {

        return this.state.hasError ? <div>降级UI</div> : this.props.children;

    }
    
}
```

## write something about key

When you give a component state, you might think the state “lives” inside the component. But the state is actually held inside React. React associates each piece of state it’s holding with the correct component by where that component sits in the UI tree.

> Remember that it’s the position in the UI tree—not in the JSX markup

Also, when you render a different component in the same position, it resets the state of its entire subtree.

> When the child `div` was removed from the DOM, the whole tree below it (including the `Counter` and its state) was destroyed as well.
>
> UI tree 不等于 DOM tree 吧？那么 UI tree 是什么呢？好像是因为：⬇️
>
> State is not kept in JSX tags. It’s associated with the tree position in which you put that JSX.

React preserves a component’s state for as long as it’s being rendered at its position in the UI tree.If it gets removed, or a different component gets rendered at the same position, React discards its state.

> In detail, React destroys state when it removes a component from the tree.

Notice how the moment you stop rendering the second counter, its state disappears completely. That’s because when React removes a component, it destroys its state.

When you tick “Render the second counter,” a second `Counter` and its state are initialized from scratch (`score = 0`) and added to the DOM.

You can use keys to make React distinguish between any components. By default, React uses order within the parent (“first counter”, “second counter”) to discern between components. But keys let you tell React that this is not just a *first* counter, or a *second* counter, but a specific counter—for example, *Taylor’s* counter.

Specifying a `key` tells React to use the `key` itself as part of the position, instead of their order within the parent. 

> Remember that keys are not globally unique. They only specify the position *within the parent*.