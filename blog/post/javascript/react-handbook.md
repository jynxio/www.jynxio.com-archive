---
typora-root-url: ./..\..\image
---

# React 手册

## JSX vs HTML

JSX 不是 HTML，它有很多额外的规则。

### 严格闭合

在 HTML 中，哪怕没有正确的关闭标签，浏览器有时也能正确的解析，这是因为浏览器足够聪明，比如：

```html
<article>
	<p>该标签是泄露的，但是浏览器会识别出来并为它闭合
</article>
```

JSX 的转译算法没有浏览器聪明，它要求我们必须严格的关闭每一个标签，并且像 XML 那样主动关闭单标签：

```jsx
<article>
	<p><img /></p>
</article>
```

### 保留字

JSX 元素属性 `for` 和 `class` 改名为 `htmlFor` 和 `className`，这是因为 JSX 最后会转译为 JavaScript，而 `for` 和 `class` 是 ECMAScript 的保留字。

```jsx
/* 转译前: JSX */
<label class="foo" for="foo" />

/* 转译后: JavaScript */
React.createElement('label', { class: 'foo', for: 'foo' });
```

### 区分标签名大小写

HTML 不区分标签大小写，JSX 则区分。

### 小驼峰式元素属性

HTML 元素的属性名是不区分大小写的，而 JSX 不仅区分大小写甚至还要求用小驼峰命名法来命名，共有 4 个属性需要改名：

| HTML 版            | JSX 版            |
| ------------------ | ----------------- |
| `onclick`          | `onClick`         |
| `autoplay`         | `autoPlay`        |
| `tabindex`         | `tabIndex`        |
| `stroke-dasharray` | `strokeDasharray` |

例外的是，自定义数据属性（`data-*`）和无障碍富互联网应用属性（`aria-*`）则保持连字符命名法。

```jsx
const Jsx = _ => (
	<>
    	<video autoPlay="true" tabindex="0"/>
    	<button onclick="" aria-label="play video" />
    	<svg data-what=""><line strokeDasharray="5, 5" /></svg>
    <>
);
```

### 小驼峰式内联样式属性

DOM 的 `setProperty` API 要求必须使用连字符命名法来描述样式属性，比如：

```javascript
dom.style.setProperty('fontSize', '16px');  // 无效
dom.style.setProperty('font-size', '16px'); // 有效
```

但是 JSX 强制要求必须使用小驼峰来命名内联样式的属性，包括带有供应商前缀的属性（如 `-webkit-font-smoothing`）。

```jsx
<h1 style={{ fontSize: "24px", "WebkitFontSmoothing": "auto" }} />
```

### 自动补全内联样式单位

JSX 会为某些 CSS 属性补齐缺失的单位，这是一个隐晦且危险的特性，你应当总是书写完整的属性值。

```jsx
<p
    style={{
        width: 200,    // -> '200px'
		lineHeight: 20 // -> '20'
    }}
/>
```

### 类型隐式转换

JSX 会对表达式插槽（expression slot）中的内容进行隐式的类型转换，这被称为「Type coercion」。比如 JSX 会把元素属性值都隐式转换为字符串，这是因为 HTML 元素属性的值必须为字符串：

```jsx
<input required={true} /> /* 转换前 */
<input required="true" /> /* 转换后 */
```

> HTML 元素中有 attribute-only 语法，如 `<input required>`，JSX 也实现了该语法，比如 `input required/>` 即是 `<input required={true} />` 的缩写。

### Not indent-meaning

在 JSX 中，行与行之间的空白符和换行符会被忽略，行内的空白符和换行符才会被保留，这叫做「not indent-meaning」。比如对于下述 JSX 而言，在由其生成的 HTML 中，a 与 b 之间没有空格或换行，c 和 d 之间则有一个空格。

```html
<section>
    <span>a</span>
    <span>b</span>
</section>
<section>
    <span>c</span> <span>d</span>
</section>
```

之所以会产生这种现象，是因为 JSX 根本就不是 HTML，而是一种用于快速创建 HTML 元素的语法糖，它们会被转译成 JavaScript 代码来运行，因此行首与行末的空白符、换行符都会被忽略（就像对待 JavaScript 代码一样），不过行内的空白符或换行符则会被转译成文本节点。

> 另外，文本节点的样式会受到 `white-space` 属性的影响，对于默认值（`normal`）而言，连续的空白符会被合并，换行符则会被当作空白符来处理。

## UI 树与状态

组件的状态就是一份用于描述组件状况的数据，然而这份数据却并不存在于组件的内部，而是存在于 React 之中，直至组件构造器被调用的时候，React 才会将属于组件的状态数据派发给组件。

特别的是，React 并没有直接将状态数据和组件绑定在一起，而是将状态数据和 UI 树关联在一起，更具体的说，React 将状态数据和位置、种类、`key` 值绑定在了一起。

1. 如果 React 在 UI 树上的 `p` 位置新增了一个种类为 `t` 且 `key` 值为 `k` 的组件，那么 React 就会新建一份状态数据，并将这份状态数据和 `p`、`t`、`k` 关联在一起。
2. 如果 React 移除了 UI 树上 `p` 位置的组件，那么 React 就会销毁掉与 `p` 位置所对应的状态数据。
3. 如果 React 更新了 UI 树上 `p` 位置的组件的种类 `t`，那么就相当于先执行步骤 2 再执行步骤 1。
4. 如果 React 更新了 UI 树上 `p` 位置的组件的 `key` 值 `k`，那么就相当于先执行步骤 2 再执行步骤 1。

得益于步骤 4，我们可以通过更新组件的 `key` 属性来重置组件。

> 创建组件时，如果我们为组件的 `key` 属性指定了一个值，那么组件的 `key` 属性就会使用这个指定值。否则，组件的 `key` 属性就会使用默认值，这个默认值是组件在父组件中的序号，比如 `first`、`second` 等。
>
> 另外，如果移除了一个组件，那么该组件的后代组件也都会被移除，所以被移除的组件的后代组件也都会执行步骤 2。

### UI 树

UI 树类似于 DOM 树，DOM 树描述了每个节点的位置关系，而 UI 树则描述了每个 react element 的位置关系。React 通过 JSX 来构建 UI 树，并通过 UI 树来更新 DOM 树。

![UI 树](/javascript/react-handbook/ui-tree.png)

## StrictMode

`StrictMode` 译为“严格模式”，它是 React 中的一个用于探测潜在问题的特性，我们通过 `<React.StrictMode>` 标签来使用这个特性。

### 启用

被包含在 `<React.StrictMode>` 标签内的代码将会启用严格模式，我们可以对任意代码启用严格模式：

```jsx
function Component () {
    
    return (
    	<>
            <div>不启用严格模式</div>
            <React.StrictMode>
                <div>启用严格模式</div>
            </React.StrictMode>
        </>
    );
    
}
```

### 作用

`<React.StrictMode>` 仅在开发环境下生效，在生产环境下不会生效，并且该标签就像 `<React.Fragment>` 标签一样，不会渲染任何可见的 UI。其作用具体如下：

1. 检测组件是否是纯函数。
2. 检测组件是否使用了过时的方法。

关于第一点：在开发环境下，当挂载组件时，React 会连续调用两次组件构造器，并最后只使用其中一次调用的结果。当更新组件时，React 会连续调用两次组件的更新器（即 `setState` 函数），并最后只使用其中一次调用的结果。React 通过这种方式来检测组件是否是纯函数。

另外，从 React 18 开始，在开发环境下，每当组件挂载之后，React 都会立即卸载和重新挂载组件，并在最后使用第一次挂载时的状态。React 之所以这么做，是为了给未来的某个新特性做准备。

## useState

`useState` 用于声明、存储、更新组件的内部状态，其语法如下：

```jsx
/* 语法一 */
const [ state, setState ] = useState( initial_state );

/* 语法二 */
const [ state, setState ] = useState( function createInitialState () { return initial_state } );
```

因为第二种语法可以动态的创建状态的初始值，所以 React 官方把第二种语法称为“惰性初始化（lazy initialize）”，把 `createInitialState` 称为“惰性初始化器（lazy initializer）”。

### setState

`setState` 用于更新状态、更新组件，其语法如下：

```jsx
/* 语法一 */
setState( next_state );

/* 语法二 */
setState( function createNextState ( previous_state ) { return next_state } );
```

调用 `setState` 之后，`setState` 的入参就会被推入状态的任务队列，并创建一个异步的任务（宏/微任务）来更新组件。在更新组件的期间，`useState` 函数就会通过处理状态的任务队列，来计算出状态的值，然后返回这个值。

### 原理

在每一次调用组件构造器的期间，`useState` 函数都会被执行，而 `useState` 函数会返回一个代表组件当前状态的值（`state`），和一个用于更新状态的函数（`setState`）。

不过，`useState` 函数在组件挂载时和更新时的行为是有区别的：

- 挂载时：`useState` 函数会根据入参的类型来决定返回值：
  - 如果入参是一个函数，那么 React 就会立即调用这个函数，并用该函数的返回值来作为自己的第一个返回值。
  - 否则，React 就会直接用入参来作为自己的第一个返回值。
- 更新时：`useState` 函数会忽略入参，并通过特殊手段来计算出一个值，然后再用这个值来作为自己的第一个返回值，关于“特殊手段”，详见 batching。

> 其中，“挂载”代表 React 首次调用组件构造器，“更新”代表 React 非首次调用组件构造器。

### batching

如果我们在同步代码中多次调用了 `setState`，那么 React 也只会更新一次组件，官方把这种批处理 `setState` 的特性称为「batching」。

请通过 [这篇博客](https://www.jynxio.com/javascript/batching) 来了解 batching 的具体细节，另外，我还在其中解释了“为什么我会认为 [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates) 对 batching 的描述是有误的”。

### 无效更新

无论 `setState` 的入参是一个函数，还是一个非函数的值，只要 `Object.is( previous_state, next_state )` 返回 `true`，那么该 `setState` 就不会触发组件的更新。

不过，哪怕 `setState` 不会触发更新，这个 `setState` 的入参也会被推入状态的任务队列。

## useReducer

`useReducer` 是 `useState` 的替代品，区别在于 `useReducer` 可以把更新状态的逻辑代码从组件中抽离出来。选择何者？如果更新状态的逻辑代码多/复杂，那么就使用 `useReducer`，否则使用 `useState`。

```jsx
/* 语法一 */
const [ state, dispatch ] = useReducer( reduce, initial_state );

/* 语法二 */
const [ state, dispatch ] = useReducer(
    reduce,
    initial_data,
    function initialize ( initial_data ) { return initial_state },
);

/* reduce */
function reduce ( previous_state, action ) { return next_state }
```

- `state` 是状态值。
- `dispatch` 是用于派发 `action` 的函数（即 `dispatch( action )`）。

对于第二种语法，`initialize` 函数的返回值会作为状态的初始值，而该函数在调用时会接收一个入参，这个入参就是 `useReducer` 的第二个参数。React 官方把这种语法称为“惰性初始化（lazy initialize）”，理由同 `useState` 的惰性初始化。

> 因为 `useReducer` 所返回的 `dispatch` 是 [稳定的、不会改变的](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)（即 `dispatch` 并不会在组件更新时发生改变），所以我们不需要将其添加进 `useEffect` 和 `useCallback` 的 `dependency_array` 中去。

### 范例

```jsx
function Counter ( {
    step = 3,
    initialCount: initial_count = 0,
} ) {

    const [ state, dispatch ] = useReducer( reduce, { count: initial_count } );

    return (
        <>
            <p>{ state.count }</p>
            <button onClick={ handleAddClick }>Add</button>
            <button onClick={ handleSubClick }>Sub</button>
        </>
    );

    function handleAddClick () { dispatch( { type: "INCREMENT", step } ) }
    function handleSubClick () { dispatch( { type: "DECREMENT", step } ) }

}

function reduce ( previous_state, action ) {

    switch ( action.type ) {

        case "INCREMENT":
            return { count: previous_state.count + action.step };

        case "DECREMENT":
            return { count: previous_state.count - action.step };

        default:
            throw new Error( `Unsupported action type: ${ action.type }` );

    }

}
```

### 原理

`useReducer` 的原理和 `useState` 的原理差不多，只不过在 `useReducer` 的任务队列中，排队的是 `action`。另外，你可以认为 `useReducer` 是这么实现的：

```jsx
function useReducer ( reduce, initial_state ) {

    const [ state, setState ] = useState( initial_state );
    const dispatch = action => setState( previous_state => reduce( previous_state, action ) );

    return [ state, dispatch ];

}
```

### 名称起源

虽然 `useReducer` 可以减少组件内的代码，但这并不是它叫 `reducer` 的原因。它之所以叫 `reducer`，是因为它的工作原理和 `Array.prototype.reduce` 一样。

```jsx
[ 1, 2, 3 ].reduce( ( previous, current ) => previous + current ); // 1 + 2 + 3
```

如上所示，`Array.prototype.reduce` 会基于前一次调用的返回值和当前元素的值，来推断出本次调用的返回值，然后继续如此向后处理，直至推断出最终的值。如果我们连续 `dispatch` 了多个 `action`，那么 `useReducer` 就会做相似的事情：

- 通过原始状态值和第一个 `action` 来推断出第一次变化后的状态值。
- 通过第一次变化后的状态值和第二个 `action` 来推断出第二次变化后的状态值。
- ...
- 直至推断出最终的状态值。

## useEffect

`useEffect` 用于执行带有副作用的操作，其语法如下：

```jsx
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

```jsx
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
 * 如果挂载了组件，那么effect函数就会执行；
 * 如果更新了组件，且state变量发生了变化，那么effect函数就会执行。
 * 如果卸载了组件，那么clean 函数就会执行；
 * 如果更新了组件，且state变量发生了变化，那么clean 函数就会执行。
 */
useEffect(
    function effect () { return function clean () {} },
    [ state ],
);
```

其中，React 使用 `Object.js` 来比较新旧 `state` 是否发生了变化。

> 另外，因为 `useReducer` 所返回的 `dispatch` 是 [稳定的、不会改变的](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)，所以哪怕我们在 `effect` 函数中使用了 `dispatch` 函数，我们也不需要将其添加进 `dependency_array`。
>

### React18 的糟糕更新

> 这真是一个十分糟糕的更新，因为这个改动不仅没什么用，还给开发者带来了额外的心智负担，你能想到或理解 `useEffect` 会有如此出人意料的行为吗？

在 React 17 及之前的版本，`effect` 和 `clean` 总是在页面更新之后执行。但是从 React 18 开始，如果 `useEffect` 是由离散的输入事件所触发的（比如点击事件），那么 `effect` 和 `clean` 就会在页面更新之前执行。详见 [New in 18: useEffect fires synchronously when it's the result of a discrete input](https://github.com/reactwg/react-18/discussions/128) 和 [Timing of effects](https://reactjs.org/docs/hooks-reference.html#timing-of-effects)。不过无论如何，`effect` 和 `clean` 都会在 `layout effect` 和 `layout clean` 之后执行。

> “如果 `useEffect` 是由离散的输入事件所触发的”是指“离散的输入事件触发了组件更新，然后组件更新触发了 `useEffect`”。

如下所示，`useEffect` 是由点击事件触发的，而点击事件是离散的输入事件，因此 `effect` 会在页面更新之前执行，这会导致，用户点击了 add 按钮之后，页面会在 1000ms 之后新增一个红色的 `<li>`。假如 `effect` 会在页面更新之后执行，那么用户点击了 add 按钮之后，页面就会立即新增一个黑色的 `<li>`，然后在 1000ms 之后，`<li>` 又变成红色。

```jsx
function App () {

    const [ count, setCount ] = React.useState( 1 );
    const lis = [];

    for ( let i = 0; i < count; i ++ ) {

        lis.push( <li key={ i } id={ i }>{ i }</li> );

    }

    React.useEffect( function effect () {

        sleep();

        document.getElementById( count - 1 ).style.color = "red";

    }, [ count ] );

    return (
        <>
            <button onClick={ _ => setCount( count + 1 ) }>add</button>
            <button onClick={ _ => setCount( count - 1 ) }>sub</button>
            <ul>
                { lis }
            </ul>
        </>
    );

}

function sleep ( time = 1000 ) {

    const wakeup_time = Date.now() + time;

    while ( Date.now() < wakeup_time ) {}

}
```

## useLayoutEffect

`useLayoutEffect` 的用法和 `useEffect` 的完全一样，它们的区别在于：

- `useEffect` 的 `effect` 和 `clean` 函数均在页面更新之后调用。
- `useLayoutEffect` 的 `effect` 和 `clean` 函数均在 DOM 更新之后、页面更新之前被调用。

注意，`useLayoutEffect` 的 `clean` 函数也同样会在 `effect` 函数之前执行。

## useRef

`useRef` 用于提供一个数据仓库，这个数据仓库会伴随组件的整个生命周期，这意味着开发者可以在数据仓库中存储一些历史数据，另外我们也常常用这个数据仓库来存储 DOM 节点。

具体来说 `useRef` 会返回一个只有 `current` 属性的普通对象，比如 `{ current: initial_value }`，其语法如下：

```jsx
const reference = useRef( initial_value ); // { current: initial_value }
```

### 语法糖

我们可以认为 `useRef` 是 `useState` 的语法糖，因为 React 官方说 `useRef` 大概是这么实现的：

```jsx
function useRef ( initial_value ) {

    const [ reference, setReference ] = useState( { current: initial_value } );

    return reference;

}
```

## useContext

`context` 是 `property` 的替代品，它是另一种传递数据的方案，它可用于远距离传输数据和大范围发布数据。

> `property` 是指组件构造器的第一个入参，从父组件中传递下来的数据，都会保存在这个参数中。

### 使用

第一步：创建一个 `CountContext`。

```jsx
const CountContext = createContext( initial_value );
```

第二步：在组件内订阅 `CountContext`，然后该组件会沿着 UI 树，向上寻找距离最近的 `CountContext.Provider`，如果找到了，那么就使用 `CountContext.Provider` 的 `value` 值，否则就使用 `CountContext` 的初始值 `initial_value`。

```jsx
function Counter () {

    const count = useContext( CountContext );

    return <p>{ count }</p>;

}
```

第三步（可选）：在上层组件中，使用 `CountContext.Provider` 来向下层组件发布一个新值。下例中的第一个 `<Counter/>` 将会返回`<p>0</p>`，第二个 `<Counter/>` 将会返回 `<p>1</p>`。

```jsx
function App () {

    return (
        <>
            <Counter/>
            <CountContext.Provider value={ next_value }>
                <Counter/>
            </CountContext.Provider>
        </>
    );

}
```

### 远距离传输数据

想象一下，当曾曾曾祖父组件需要向曾曾曾孙组件传递数据时，如果我们使用 `property` 方案，那么数据就需要从曾曾曾祖父组件开始向下传递，依次流经曾曾祖父组件、曾祖父组件、祖父组件、父组件，最后才能到达曾曾曾孙组件。

当我们使用 `property` 方案时，如果数据传递的路径非常长，那么就会给维护带来不小的麻烦，因为一旦我们需要修改传递的数据，比如更名、新增、移除，我们就需要对传递路径上的每一个环节做修改。

React 官方把这种数据传递路径很长的情况称为“prop drilling（钻探）”。

`context` 可以直接解决这个问题，因为 `context` 可以“一步到位”的向下传递数据。不过，由于 `context` 会隐藏数据的传递路径，所以你需要翻阅更多的代码才能看清数据是如何传递的，这意味着代码的可读性会下降。

### 大范围广播数据

`context` 的另一个好处是可以大范围的广播数据，但这并没有什么好细说的。

## memo

`memo` 是高阶组件，它用于创建组件的 memoized 版本。

> 高阶组件（Higher Order Component）是一种基于 React 的设计模式，它是一个参数和返回值均为组件的函数，用于转换组件。

### 语法

```jsx
/* 语法一 */
const MemoizedComponent = memo( Component );

/* 语法二 */
const MemoizedComponent = memo( Component, areEqual );

function areEqual ( previous_property, current_property ) {}
```

其中：

- `Component` 是原始的自定义组件。
- `MemoizedComponent` 是 `Component` 的 memoized 版本。
- `areEqual` 是可选的函数入参，我们使用它来自定义新旧 `property` 的比较规则，缺省情况下，React 只会浅比较新旧 `property`。

### MemoizedComponent

`MemoizedComponent` 的运行原理大致如下：

- 挂载时：
  - `MemoizedComponent` 缓存自己接收到的 `property`，来作为 `cache_property`。
  - `MemoizedComponent` 以 `cache_property` 为参数，来调用 `Component`。
  - `MemoizedComponent` 缓存 `Component` 的调用结果，来作为 `cache_result`。
  - `MemoizedComponent` 返回 `cache_result`。
- 更新时：
  - 如果 `MemoizedComponent` 自己接收到的 `property` 等于 `cache_property`，那么 `MemoizedComponent` 就会直接返回 `cache_result`。
  - 否则，就重复挂载时的操作。

另外，如果 `Component` 的实现代码中使用了 `useState`、`useReducer`、`useContext`，那么我们可以直接使用这 3 个 hook 来更新 `Component`，这可以无视 `MemoizedComponent` 对新旧 `property` 的检查。我实践发现，如果我使用这些方式来直接更新 `Component`，那么 `Component` 的新返回值会更新 `MemoirzedComponent` 的 `cache_result`。

需要特别注意的是，`MemoizedComponent` 不会缓存所有过往的 `property` 和 `result`，它只会缓存上一次的 `property` 和 `result`。

### areEqual

`areEqual` 是 `memo` 的第二个入参，它是一个函数，用于定义该如何比较新旧 `property` 是否相等，如果它返回 `true`，那么就代表新旧 `property` 相等，如果它返回 `false`，就代表新旧 `property` 不相等。

`areEqual` 是可选的，当它缺省时，`memo` 会通过浅比较，来判断新旧 `property` 是否相等。

> 旧 `property` 是指 `MemoizedComponent` 的 `cache_property`，新 `property` 是指 `MemoizedComponent` 在当前调用时刻所接收到的 `property`。

## useMemo

`useMemo` 用于创建值的 memoized 版本。

### 语法

```jsx
const memoized_value = useMemo( function expensiveCalculate () {}, dependency_array );
```

- `expensiveCalculate` 是一个无参函数，它的返回值会作为 `memoized_value` 的值。
- `dependency_array` 数组用于决定是否执行 `expensiveCalculate` 函数来更新 `memoized_value` 的值。

> 请勿在 `expensiveCalculate` 内执行带有副作用的操作，因为 `expensiveCalculate` 会在组件构造器的调用期间被执行。

### dependency_array

```jsx
/**
 * 方式一：
 * 挂载或更新组件时，
 *   - useMemo会执行expensiveCalculate函数。
 *   - useMemo会缓存expensiveCalculate的返回值，来作为cache。
 *   - useMemo会返回cache。
 */
const memoized_value = useMemo( function expensiveCalculate () {} );

/*
 * 方式二：
 * 挂载组件时：
 *   - useMemo会执行expensiveCalculate函数。
 *   - useMemo会缓存expensiveCalculate的返回值，来作为cache。
 *   - useMemo会返回cache。
 * 更新组件时：
 *   - useMemo会返回cache。
 */
const memoized_value = useMemo( function expensiveCalculate () {}, [] );

/**
 * 方式三：
 * 挂载组件时：
 *   - useMemo会执行expensiveCalculate函数。
 *   - useMemo会缓存expensiveCalculate的返回值，来作为cache。
 *   - useMemo会返回cache。
 * 更新组件时：
 *   - 如果state变量没有改变，那么useMemo就会返回cache。
 *   - 如果state变量发生了改变，那么useMemo就会重复挂载时的步骤。
 */
const memoized_value = useMemo( function expensiveCalculate () {}, [ state ] );
```

通常，`state` 是指 `expensiveCalculate` 中使用到的变量。另外，React 使用 `Object.is` 来比较新旧 `state` 是否发生了变化。

## useCallback

`useCallback` 用于创建函数的 memoized 版本。

### 语法

```jsx
const memoizedCallback = useCallback( function callback () {}, dependency_array );
```

- `memoizedCallback` 函数就是 `callback` 函数。
- `dependency_array` 数组用于决定是否使用当前的 `callback` 来更新 `memoizedCallback`。

> `useCallback( callback, dependency_Array )` 相当于 `useMemo( _ => callback, dependency_array )`。

### dependency_array

```jsx
/**
 * 方式一：
 * 挂载或更新组件时：
 *   - useCallback会缓存callback函数，来作为cache。
 *   - useCallback会返回cache。
 */
const memoizedCallback = useCallback(
    function callback () {},
);

/*
 * 方式二：
 * 挂载组件时：
 *   - useCallback会缓存callback函数，来作为cache。
 *   - useCallback会返回cache。
 * 更新组件时：
 *   - useCallback会返回cache。
 */
const memoizedCallback = useCallback(
    function callback () {},
    [],
);

/**
 * 方式三：
 * 挂载组件时：
 *   - useCallback会缓存callback函数，来作为cache。
 *   - useCallback会返回cache。
 * 更新组件时：
 *   - 如果state变量没有改变，那么useCallback就会返回cache。
 *   - 如果state变量发生了改变，那么useCallback就会重复挂载时的步骤。
 */
const memoizedCallback = useCallback(
    function callback () {},
    [ state ],
);
```

通常，`state` 是指 `callback` 中使用到的变量。另外，React 使用 `Object.is` 来比较新旧 `state` 是否发生了变化。

> 另外，因为 `useReducer` 所返回的 `dispatch` 是 [稳定的、不会改变的](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)，所以哪怕我们在 `callback` 函数中使用了 `dispatch` 函数，我们也不需要将其添加进 `dependency_array`。

### 与 useEffect 一起使用

如果 `useEffect` 的 `dependency_array` 中包含了一个函数，那么你可能就会需要使用 `useCallback` 来创建该函数的 memoized 版本，详见下例。

```jsx
function Counter ( property ) {

    const [ count, setCount ] = useState( 0 );

    /* 挂载时，React会执行effect函数。 */
    /* 更新时，React会执行effect函数 */
    const printCountEverytime =  _ => console.log( count );
    useEffect( _ => printCountEverytime(), [ printCountEverytime ] );

    /* 挂载时，React会执行effect函数。 */
    /* 更新时，如果count变量没有改变，那么React就不会执行effect函数，否则就会执行。 */
    const printCountSometime = useCallback( _ => console.log( count ), [ count ] );
    useEffect( _ => printCountSometime(), [ printCountSometime ] );

}
```

## useImperativeHandle

`React.useImperativeHandle` 需要和 `React.forwardRef` 搭配在一起来使用，因为它的作用是让开发者自由的决定应该暴露什么内容给 `Parent` 组件的 `reference`。

### 语法

```jsx
const Child = React.forwardRef( function Child ( property, reference ) {

    React.useImperativeHandle(
        reference,
        _ => reference_current_value,
    );

} );
```

`React.useImperativeHandle` 接收 2 个入参：

- 第一个参数：组件的第二个参数 `reference`
- 第二个参数：一个无参函数，它的返回值将会作为 `reference` 的 `current` 属性的值。

### 示例

该示例演示了：`Child` 组件仅向 `Parent` 组件暴露 `input` 元素的 `focus` 方法，而不暴露 `input` 元素本身。

```jsx
function Parent () {

    const parent_reference = React.useRef();

    return <Child ref={ parent_reference }/>;

}

const Child = React.forwardRef( function Child ( property, parent_reference ) {

    const child_reference = React.useRef();

    React.useImperativeHandle(
        parent_reference,
        _ => ( { focus: _ => child_reference.current.focus() } ),
    );

    return <input ref={ child_reference }/>;

} );
```

### polyfill

```jsx
const Child = React.forwardRef( function Child ( property, parent_reference ) {

    return <input ref={ refCallback }/>;

    function refCallback ( dom ) {

        parent_reference.current = { focus: _ => dom?.focus() };

    }

} );
```

Kent C. Dodds 说：虽然这是可以运行的，但是它在极少数情况下会产生 bug，所以还是推荐使用 `React.useImperativeHandle`。

## useDebugValue

`React.useDebugValue` 用于给 custom hook 添加标签，当 custom hook 被多个组件多次使用时，你可以通过标签来区分出每一个 custom hook。

另外，你只能通过控制台的 `⚛️Components` 项来看到 custom hook 的标签，如果浏览器没有安装 React Developer Tools 插件，那么控制台就没有 `⚛️Components` 项。

### 语法

```jsx
/* 语法一 */
function useMyHook () {

    React.useDebugValue( tag );

}

/* 语法二 */
function useMyHook () {

    React.useDebugValue( tag, function format ( tag ) { return tag } );

}
```

- 第一个参数：必选的，允许任意数据类型。
  - 如果没有传递第二个参数，那么该参数就会成为 custom hook 的标签。
  - 如果传递了第二个参数，那么该参数就会作为入参传递给第二个参数。
- 第二个参数：可选的，只允许函数或 `undefined`。
  - 如果该参数是 `undefined`，那么就等同于没有传递该参数。
  - 如果该参数是一个函数，那么第一个入参就会作为该函数的入参，该函数的返回值将会作为 custom hook 的标签，且仅当控制台激活时，该函数才会被调用。

### 延迟创建标签

对于产品的用户而言，创建 custom hook 的标签是一种浪费性能的行为，因为产品的用户不需要查看 custom hook 的标签。当 `React.useDebugValue` 的入参 `tag` 需要耗时的计算才能获得时，这种浪费便尤为严重。

为了解决这个问题，React 官方为 `React.useDebugValue` 提供了第二种语法，我个人倾向于在所有情况下都使用这种语法。

### 示例

下例展示了如何创建、查看 custom hook 的标签。

![React.useDebugValue](/javascript/react-handbook/usedebugvalue.png)

```jsx
function App () {

    return (
        <>
            <Counter initial={ 10 } step={ 1 }/>
            <Counter initial={ 20 } step={ 2 }/>
        </>
    );

}

function useCount ( initial, step ) {

    React.useDebugValue( { initial, step }, parameter => parameter );

    const [ count, setCount ] = React.useState( initial );
    const increase = _ => setCount( count + step );

    return [ count, increase ];

}

function Counter ( property ) {

    const { initial, step } = property;
    const [ count, increase ] = useCount( initial, step );

    return <button onClick={ increase }>{ count }</button>;

}
```

## Custom Hook

custom hook 是一个用于封装 hook 的函数，并且 React 要求 custom hook 的命名必须以 `use` 开头。

> React 要检查 custom hook 内的 hook 使用是否符合规范，为了方便分辨出哪些函数才是 custom hook，React 便要求 custom hook 的命名必须以 `use` 开头。

### 示例

```jsx
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

## ref property

React 元素具有一个 `ref` 属性，`ref` 属性用于捕获元素节点，它有 2 种调用方式：

```jsx
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

```jsx
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

## forwardRef

React 不允许通过下述方式来在 `Parent` 组件中获取 `Child` 组件的 DOM，因为 React 认为这是一种不安全的编程范式。

```jsx
function Parent () {
    
    const reference = useRef();
    
    return <Child ref={ reference }/>; // Error
    
}
```

不过，React 提供了另一种途径来获取 `Child` 组件的 DOM，那就是 `React.forwardRef`，详见下文。

### 语法

```jsx
function Parent () {

    const reference = useRef();

    return <Child ref={ reference }/>

}

const Child = React.forwardRef( function Child ( property, reference ) {

    return <div ref={ reference }></div>;

} );
```

### 原理

无论组件是否经过了 `React.forwardRef` 的改造，它们都总是可以接收到第二个参数 `reference`。只不过，如果组件没有经过 `React.forwardRef` 的改造，那么它的第二个参数 `reference` 就总是一个空对象 `{}`。

`React.forwardRef` 就像一个开关，仅当组件经过了它的改造之后，组件的 `reference` 参数才能接收到上游的数据。

```jsx
function Child ( property, reference ) {

    console.log( reference );  // {}

}
```

### polyfill

```jsx
function Parent () {

    const reference = useRef();

    return <Child secret={ reference }/>

}

function Child ( property ) {

    return <div ref={ property.secret }></div>

}
```

## flushSync

`flushSync` 用于让 React 立即更新 DOM，它来自于 `react-dom`。

### 语法

`flushSync` 接收并立即执行一个回调函数，待回调函数执行结束之后，React 就会立即更新 DOM。

```jsx
import { flushSync } from "react-dom";

flushSync( _ => {} );
```

### 示例

`(1)` 会同步的更新组件，并在更新好后立即更新 DOM，所以挂载或卸载 `div` 元素之后，`(2)` 行代码总是可以正确的输出 `div` 元素或 `null`。

```jsx
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

一旦 error boundary 组件的后代组件发生了崩溃，那么这个崩溃就会冒泡至 error boundary 组件，这时 Reacy 就会依次调用 error boundary 组件的 `getDerivedStateFromError`、`render`、`componentDidCatch` 方法。而我们就可以通过操纵 `getDerivedStateFromError` 方法来渲染降级的 UI，用 `componentDidCatch` 方法来向服务器发送崩溃日志。

如果 error boundary 组件的后代组件没有发生崩溃，那么 React 就不会调用 error boundary 的 `getDericedStateFromError` 和 `componentDidCatch` 方法。

### getDerivedStateFromError

`getDerivedStateFromError` 是 error boundary 组件的静态方法，该方法先于 `render` 方法被调用。该方法接收一个入参 `error`，其代表后代组件所抛出的错误，而该方法的返回值会更新 error boundary 组件的 `state`。

如果后代组件没有发生崩溃，React 就不会调用该方法。

```jsx
class ErrorBoundary {

    /*
     * @param { Error } - 后代组件所抛出的错误。
     * @returns { * }   - 该返回值会更新error boundary组件的state。
     */
    static getDerivedStateFromError ( error ) { return new_state }

}
```

### componentDidCatch

`componentDidCatch` 是 error boundary 组件的原型方法，该方法后于 `render` 方法被调用。该方法接收 2 个入参，分别是 `error` 和 `information`，`error` 代表后代组件所抛出的错误，`information` 是一个带有 `componentStack` 属性的普通对象，`componentStack` 属性是一个字符串，该字符串记录了抛出错误的后代组件的栈信息。

如果后代组件没有发生崩溃，React 就不会调用该方法。

```jsx
class ErrorBoundary {

    /*
     * @param { Error }  - 后代组件所抛出的错误。
     * @param { Object } - 抛出错误的后代组件的栈信息。
     */
    componentDidCatch ( error, information ) {}

}
```

> 在开发环境下，被 `componentDidCatch` 方法所捕获的错误会冒泡至浏览器根对象 `window`，而在生产环境下，则不会发生冒泡。

### 示例

```jsx
class ErrorBoundary extends Component {

    constructor ( props ) {

        super( props );
        
        this.state = { error: undefined };

    }

    static getDerivedStateFromError ( error ) {

        /* 更新state。 */
        return { error };

    }

    componentDidCatch ( error, information ) {

        /* 反馈错误。 */
        postErrorToService( error.message );
        postErrorToService( information.componentStack );

    }

    render () {

        if ( ! this.state.error ) this.props.children;

        return <pre>{ this.state.error.message }</pre>;

    }

}

function App () {

    return <ErrorBoundary><Bomb/></ErrorBoundary>;

}

function Bomb () {

    throw new Error( "Bomb!" );

}
```

### react-error-boundary

[react-error-boundary](https://github.com/bvaughn/react-error-boundary#readme) 是一个 `ErrorBoundary` 库，它可以让你免于手动编写 `ErrorBoundary` 类，并且它还提供了一些额外的特性。

```jsx
import { ErrorBoundary } from "react-error-boundary";

function App () {

    const [ key, setKey ] = useState( 0 );
	const handleReset = _ => setKey( key + 1 ); // 重置ErrorBoundary组件。

    return (
    	<ErrorBoundary
            key={ key }
            onReset={ handleReset }
            FallbackComponent={ ErrorFallback }
        >
            <Bomb/>
        </ErrorBoundary>
    );

}

/*
 * ErrorBoundary的fallback函数。
 * @param { Error }    - 冒泡至ErrorBoundary的Error对象。
 * @param { Function } - ErrorBoundary的onReset参数的值。
 * @returns { * }      - 其返回值将会作为ErrorBoundary的getDerivedStateFromError方法的返回值。
 */
function ErrorFallback ( { error, resetErrorBoundary } ) {

    return (
    	<div>
            <pre>{ error.message }</pre>
            <button onClick={ resetErrorBoundary }></button>
        </div>
    );

}

function Bomb () {

    throw new Error( "Bomb!" );

}
```