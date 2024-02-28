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

> 虽然 `<Jsx className={false} />` 的类名会被忽略，但是 React 会警告并推荐你使用 `<Jsx className={undefined} />` 来达成你的目的。

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

TODO：

如果你纠结于在 `className` 里写多个类名很麻烦，那么用 [clsx](https://www.npmjs.com/package/clsx) 这个库，又小又好用。

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

React 的表单元素很复杂：

- React 表单元素的 `value` 属性等价于 `HTMLInputElement.value`，HTML 表单元素的 `value` 属性只是初始值，React 表单元素的 `defaultValue` 属性才是初始值；
- 如果指定了 `value`，那么就变成受控组件（controlled），否则就是非受控组件（uncontrolled），受控组件的 `HTMLInputElement.value` 会被 React 接管，你无法通过在浏览器界面上操纵表单组件来改变它的 `HTMLInputElement.value`，你只能通过 React 的更新机制来控制。具体原理：你在 `<input>` 里的输入是有效的，你可以通过原生的 `oninput` 事件的 `event.target.value` 获取到新值，但是 React 随后会迅速的恢复为旧值（通常在浏览器绘制之前就撤回好了，所以你会发现受控组件变成只读的了）。
- React 表单组件的 `onChange` 和 `onInput` 是差不多的，HTML 里的它们则很不一样，React 的 `onChange` 表现的和 HTML 的 `onInput` 一样。
- React 表单组件 `defaultValue` 和 `value` 不能共存，前者对应非受控组件，后者对应受控组件，React 会抛出警告；
- React 表单组件有 `value` 而没有 `onChange` 或 `onInput` 是会被警告的，因为这个组件就是只读的，React 觉得这种用法不对；

> 受控组件：由 React 管理输入的组件

暗坑（footgun）：

```jsx
function Form () {
    const [usename, setUsename] = useState();
    
    return <input value={usename} onChange={event => setUsername(event.target.value)} />
}
```

第一次输入之后，终端会抛出错误：A component is changing an uncontrolled input to be controlled.

这是因为 username 从 undefined 切换到了字符串，`value={undefined}` 等价于没绑定 `value` 的非受控组件，输入之后组件就从非受控切换到受控去了。所以请总是为它制定一个内容吧！比如：

```jsx
// 🚫 Incorrect. `username` will flip from `undefined` to a string:
const [username, setUsername] = React.useState();

// ✅ Correct. `username` will always be a string:
const [username, setUsername] = React.useState('');
```

React 社区流行一种非受控组件组成的表单方案，直接用 `FormData` 之类的来管理，听起来不错！

```jsx
function SignupForm() {
  function handleSubmit(event) {
    const formData = new FormData(event.target);
    const { username } = Object.fromEntries(formData);

    // Do something with `username`, like send it
    // to the server.
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">
        Select a username:
      </label>

      <input
        type="text"
        id="username"
        name="username"
      />
    </form>
  );
}
```

缺点很明显，如果有些非表单元素需要依赖表单元素的值，那么就很难做到值的同步了。

```jsx
function SignupForm() {
  function handleSubmit(event) {
    const formData = new FormData(event.target);
    const { username } = Object.fromEntries(formData);

    // Do something with `username`, like send it
    // to the server.
  }

  return (
	<>
        <form onSubmit={handleSubmit}>
      <label htmlFor="username">
        Select a username:
      </label>

      <input
        type="text"
        id="username"
        name="username"
      />
    </form>
      <p>{username}</p> /* ⚠️ 这个不会同步 */
    </>
  );
}
```

做任何和表单输入的页面，都把它们包进 `<form>` 里面去，以获得很多良好的体验，比如在输入框回车就能提交，否则你就要自己给 `input` 绑定 `keydown` 事件，太麻烦了！

```jsx
function Form () {
    const [email, setEmail] = useState('');
    
    /* 🚫 */
    return (
    	<div>
        	<input type="text" value={email} onChange={/* ... */} />
            <button onClick={/* ... */}>submit</button>
        </div>
    );
    
    /* ✅: 甚至不用给button搞click事件！（你要好好学习一下所有表单...） */
    return (
    	<form onSubmit={event => {
			event.preventDefault(); /* 必须的！ */
            request(email); /* 网络请求之类的操作 */
        }}>
        	<input type="text" value={email} onChange={/* ... */} />
            <button>submit</button>
        </form>
    );
}
```

> 你要正式学一下表单！另外，还有客户端验证是什么东西？比如 `<input type="password" requird={true} minLength={8} />` 这些用来做客户端验证？

> 为什么要给 `onSubmit` 套 `event.preventDefault()`？
>
> 在没有 JSON、Fetch、XMLHttpRequest 等之类东西的时代，表单没办法获取数据，而是把用户导航到一个新的网页里去，服务器返回新网页的 HTML 里面也填充了表单想要获取的数据。
>
> form 元素保留了这个特点，你不 `preventDefault` 的话，网页就会被导航到新地方去，比如对于 `<form method="post" action="/search" />` 就会被导航到 `/search` 页面去（这块知识要问一下 gpt，具体的地址是怎么计算的），如果没有 action，那么就会导航回原地址，那就是刷新一下网页！

## 事件

React 将所有事件都绑定在挂载元素上，比如 `<div id="root" />`。

你从 `<input onChange={event => {}} />` 里拿到的 event 是人工制造的合成事件（synthetic event），不是真正的 DOM 原生的事件对象（你可以从 `event.nativeEvent` 里获取原生的）。

做合成事件一是为了抹平不同浏览器之间的差距，二是提升开发体验（提供了一些原来没有的属性，方便开发），不过总体还是和原生的事件对象比较接近的，从这里看细节：https://react.dev/reference/react-dom/components/common#react-event-object

> 可是没有 `passive`，另外如果你看到一些关于事件的“事件池”之类的说辞，这个特性其实已经被移除掉了，它以前用来稍微提升性能，我记得是因为它太复杂了且容易搞出 bug，和它的收益不成正比所以才被删掉的，对吗？
