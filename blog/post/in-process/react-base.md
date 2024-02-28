React 元素是一个 JavaScript 对象，其内存储了一些信息，比如：

```javascript
{
    type: 'p',
	key: null,
	ref: null,
	props: { className: 'what' }
    _owner: null,
    _store: {},
}
```



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
React.createElement('label', { class: 'foo', for: 'foo' }); // ⚠️
```

### 区分标签名大小写

HTML 不区分标签大小写，JSX 则区分。

### 小驼峰式元素属性

HTML 元素的属性名是不区分大小写的，而 JSX 不仅区分大小写甚至还要求用小驼峰命名法来命名，例外的是自定义数据属性（`data-*`）和无障碍富互联网应用属性（`aria-*`）则保持连字符命名法。

| HTML 版            | JSX 版            |
| ------------------ | ----------------- |
| `onclick`          | `onClick`         |
| `autoplay`         | `autoPlay`        |
| `tabindex`         | `tabIndex`        |
| `stroke-dasharray` | `strokeDasharray` |
| `data-*`           | `data-*`          |
| `aria-*`           | `aria-*`          |

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

### 空格与换行

在 JSX 中，行与行之间的空白符和换行符会被忽略，行内的空白符和换行符才会被保留，这叫做「not indent-meaning」。之所以如此，是因为 JSX 转译时并不会包含这些空白符和换行符。

```jsx
// JSX转译前
<article>
	<p>
        My GitHub is
        { ' ' }
        <a>https://github.com/jynxio</a>
    </p>
</article>

// JSX转译后
React.createElement(
	'article',
	{},
	'My GitHub is'
    ' '
	React.createElement('a', {}, 'https://github.com/jynxio'),
);
```

这是一种特性（或平庸的设计）而不是错误，这是因为空白符和换行符在不同场景下的作用是不同的，比如单词之间的空格、段落之前的缩紧、行内元素之间的空白符会形成空格、Flex 子项之间的空白符会被忽略，用户需要主动控制空白符和换行符的作用。

> Prettier 会在必要时自动添加 `{' '}`。

## 组件

React 组件是以大驼峰命名法来命名的函数，然而该函数却并非构造器，只是普通函数，这违反了我们的编程共识。

## 传参

### 默认值

对于 Function 组件，我们使用解构赋值来定义参数的默认值，对于 Class 组件，则使用 `defaultProps` 静态属性。

### children

`children` 是一个语法糖参数，它会自动收集标签之间的内容（若无内容则为 `undefined`），这有助于美化向组件传递内容的流程，比如：

```jsx
// 😬 属性传值
<Button children="click me" />

// 😌 标签传值
<Button>click me</Button>

function Button ({ children }) {
    return <button>{ children }</button>
}
```

事实上，属性传值和标签传值这两种方式是会发生冲突的，最后标签传值会获胜，比如：

```jsx
// JSX
<p className="what" children="属性传值">标签传值</p>

// JavaScript
React.createElement('p', { className: 'what', children: '属性传值' }, '标签传值');

// React元素
{
    type: 'p',
	key: null,
	ref: null,
	props: { className: 'what', children: '标签传值' }
    _owner: null,
    _store: {},
}
```

### key

`key` 是 React 的“保留字“，它不会被作为参数来抛出给组件函数，在 React 元素视角它就是一个用于标记 React 元素的顶层属性。

```jsx
// JSX
<ContactCard name="jynxio" email="?" key="c82na">
    Here's some text
</ContactCard>

// JavaScript
React.createElement(
  ContactCard,
  {
    key: 'c82na',
    name: 'jynxio',
    email: '?',
  },
  "Here's some text",
);

// React元素
{
  "type": {
    "@t": "Function",
    "data": { "name": "ContactCard", "body": "", "proto": "Function"},
  },
  "key": "c82na",
  "ref": null,
  "props": {
    "name": "jynxio",
    "email": "?",
    "children": "Here's some text"
  },
  "_owner": null,
  "_store": {}
}

//
function ContactCard({ name, email, key }) {
    console.log(key); // undefined
    
    return (
        <>
        	<dt>{ name }</dt>
        	<dd>{ email }</dd>
        </>
    );
}
```

如何在 Fragment 中使用 `key`？这样：`<React.Fragment key="?" />`

`key` 只要在当前数组中是唯一的就好了。

> 为什么使用数组的 `index` 来作为 `key` 会导致性能下降？

### 不能在 jsx 中使用 if 和 for 的原因

```jsx
// JSX
function Friend({ name, isOnline }) {
  return (
    <li className="friend">
      {if (isOnline) {
        <div className="green-dot" />
      }}

      {name}
    </li>
  );
}

// JS
function Friend({ name, isOnline }) {
  return React.createElement(
    'li',
    { className: 'friend' },
    if (isOnline) { // ⚠️
      React.createElement('div', { className: 'green-dot' });
    },
    name
  );
}
```

React 的 JSX （无论是属性还是内容）会忽略 `null`、`false`、`true`、`undefined` 值，除非它们被应用于一些特殊的属性，比如 `disabled`、`checked` 属性，而不是给它们设置一个 `""` 空字符串。

```jsx
<ul>
	<li>true: "{ true }"</li>           // true: ""
    <li>false: "{ false }"</li>         // false: ""
    <li>null: "{ null }"</li>           // null: ""
    <li>undefined: "{ undefined }"</li> // undefined: ""
    <li>NaN: "{ NaN }"</li>             // NaN: "NaN"
    <li>Zero: "{ 0 }"</li>              // Zero: "0"
    <li>Empty string: "{ '' }"</li>     // Empty string: ""
</ul>
```

## Fragment

为什么组件只能返回一个 React 元素？因为：

```jsx
// JSX
function App () {
    return (
    	<dt>GitHub: </dt>
        <dd>github/jynxio</dd>
    );
}

// JavaScript
function App () {
    return (
    	React.createElement('dt', {}, 'GitHub: ')      // ⚠️ 语法错误
        React.createElement('dd', {}, 'github/jynxio') // ⚠️ 语法错误
    );
}
```

`<React.Fragment />` 可以帮你包装他们：

```jsx
// JSX
function App () {
    return (
    	<>
        	<dt>GitHub: </dt>
        	<dd>github/jynxio</dd>
        </>
    );
}

// JavaScript
function App () {
    return (
    	React.Fragment,
        {},
        React.createElement('dt', {}, 'GitHub: '),
        React.createElement('dd', {}, 'github/jynxio'),
    );
}
```

TODO：描述一下

```tsx
// 😌
<ul>{ range(10).map((i: number) => <li key={ i } />) }</ul>

// 😬
<ul>{ Array.from({ length: 10 }).map((i: number) => <li key={ i } />) }</ul>

/*
 * 创建序列，这是lodash.range的简易实现
 * @example
 * f(5);    // [0, 1, 2, 3, 4]
 * f(2, 7); // [2, 3, 4, 5, 6]
 */
function range(start = 0: number, end: number, step = 1: number) {
    const output: number[] = [];
    
    if (end === undefined) {
        end = start;
        start = 0;
    }
    
    for (let i = start; i < end; i += step) output.push(i);
    
    return output;
}
```

## 事件

React 的事件系统会自动卸载侦听器和聚合多个侦听器，这是便利。

另外，在 JSX 中绑定事件要用驼峰命名法，这和 HTML 不一样，如果你写错了那么 React 会提醒你。

React 经常会需要使用箭头函数来装包一下侦听器，你会觉得有很大的额外的性能负荷？别担心，低端设备也能在眨眼间创建数十万个函数。

```jsx
<button onClick={() => {}} />
```

## Hook

A hook is a special type of function that allows us to "hook into" React internals.

it's customary to follow the “x, setX” convention:

```jsx
const [user, setUser] = React.useState();
const [errorMessage, setErrorMessage] = React.useState();
const [flowerBouquet, setFlowerBouquet] = React.useState();
```

## useState

```jsx
const [state, setState] = useState('initialValue');
const [state, setState] = useState(() => 'initialValue'); // initializer function: 仅在首次运行

// 如果需要进行昂贵的计算来获取初始值，那么就用这种initializer function
const [count, setCount] = useState(() => {
  return globalThis.localStorage.getItem('count');
});
```

initializer function 会在组件的每一次调用时被创建，但只在首次调用时才被调用。

更新逻辑：

```jsx
// JSX
function Counter () {
    const [count, setCount] = useState(0);
    
    return <button onClick={() => setCount(count + 1)}>{ count }</button>
}

// JS
function Counter () {
    const [count, setCount] = useState(0);
    
    return React.createElement(
    	'button',
        { onClick: () => setCount(count + 1) },
        count,
    );
}

// JS Object
{
    type: 'button',
    key: null,
    ref: null,
    props: {
        onClick: () => setCount(count + 1),
        children: 0,
    },
    _owner: null,
    _store: { validated: false }
}
```

组件函数的产物是一个朴素的 JavaScript 对象，它是一个被用来描述 UI 的快照。首次调用组件函数时，React 会用根据快照来创建真实的 HTML 元素，后续每次调用 `setCount`，React 都会重新调用组件函数并创建新的快照，然后像“一起来找茬”那样寻找新旧快照的区别，然后只更新差异的部分。

```jsx
// 第一张快照
{
    type: 'button',
    key: null,
    ref: null,
    props: {
        onClick: () => setCount(count + 1),
        children: 0,
    },
    _owner: null,
    _store: { validated: false }
}

// 第二张快照
{
    type: 'button',
    key: null,
    ref: null,
    props: {
        onClick: () => setCount(count + 1),
        children: 1,
    },
    _owner: null,
    _store: { validated: false }
}

// 更新
button.innerText = "1";
```

React 的更新是异步的：

状态的 setter 不会立即更新状态，状态会在当前的同步任务被执行完之后才更新，你要在下一轮组件函数里才能用到更新后的状态值。

为什么这样设计：为了 batch

如果状态更新是异步的，那么 App 会在 3 个 setter 都被调用完之后才更新 1 次（调用一次组件函数，操纵一次 DOM），如果状态更新是同步的，那么 App 会在 setName 调用后立即更新一次（调用一次组件函数，操纵一次 DOM）、然后在 setEmail 调用后再更新一次（调用一次组件函数，操纵一次 DOM），然后在 setNumber 调用后再更新一次（调用一次组件函数，操纵一次 DOM），最后更新了 3 次，并且第一次和第二次快照还是有误的。

```jsx
function App () {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [number, setNumber] = useState();

    return (
    	<dl>
            <dt>Name: </dt><dd>{name}</dd>
            <dt>Email: </dt><dd>{email}</dd>
            <dt>Number: </dt><dd>{number}</dd>
            <button onClick={() => {
				setName('?');
				setEmail('?')
				setNumber('?');
            }}>
                Click
            </button>
        </dl>
    );
}
```

## 表单

`<input value="" />` 的 `value` 属性在 React 和 HTML 中是不同的，HTML 中该属性代表输入框的默认值且是可以更改的，但是在 React 中一旦制定了 `value` 属性就会将输入框的内容锁定为 value 的值，并且它还是只读的。

```jsx
function Input () {
    const [text, setText] = useState(`Here's some text`);
    
    return <input value={text} />; // input的值被锁定为"Here's some text"
}
```

