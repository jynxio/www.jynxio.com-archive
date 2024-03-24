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

React 的 JSX （无论是属性还是内容）会忽略 `null`、`false`、`true`、`undefined` 值（除非它们被应用于一些特殊的属性，比如 `disabled`、`checked` 属性）而不是给它们设置一个 `""` 空字符串。

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

There are two “Rules of Hooks” that we should learn, in order to make sure we're always using hooks as React expects.

1. Hooks have to be called within the scope of a React application. We can't call them outside of our React components.
2. We have to call our hooks at the **top level of the component.** -> The rule states that we're **not allowed to use the hook conditionally.** We're never supposed to put a hook inside an `if` condition, or a `switch` statement, or a `for` loop, or even inside a callback.

关于第一点，浅层的解释是：Hook 是一个用于“钩入”React 系统的函数，React 要求它必须如此被调用才能实现“钩入”。

关于第二点，浅层的解释是：React 依赖 Hook 的执行顺序，如果把 Hook 放进 if、switch、for 这些块语句里面，就无法保证顺序不被改变。

可是深层的解释是什么？

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

> 受控组件：由 React 管理输入的组件。
>
> TODO：ratio input 也是这个工作流程吗？感觉好像很不一样呢... 整理一下

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

### 表单的聚焦

```jsx
function Input() {
    return <input type="text" ref={dom => dom.focus()} />
}
```

为什么不使用 `autofocus` 属性？因为它仅当“元素在页面加载之初时就存在”这种情况才有效，对于此后动态注入的元素是无效的，而 React 总是动态注入每一个元素，除非使用 SSR。所以在 React 中，就只能使用上述方案。

## 更多表单

除了 input 之外，还有更多表单元素：

- Textareas
- Radio buttons
- Checkboxes
- Selects
- Ranges
- Color pickers

这些原生的表单元素的行为方式是很不一致的，不如 textarea 用文本子节点来作为其内容管理而非 value 属性，select 元素使用 selected 属性来管理它的选中值。

React 修改了这一切，React 中的表单元素的行为是一致的，`value` 属性（对于大多数输入控件）和 `checked`（对于 checkbox 和 radio 按钮）会锁定组件使其成为受控组件，我们必须通过 `onChange` 来更新组件（`onInput` 可以吗？）。

这有一个速查表，告诉你各种表单元素在 React 里的写法：https://courses.joshwcomeau.com/joy-of-react/02-state/11-bonus-cheatsheet。你要自己重复一下里面的每个练习，有一些方案其实你是一知半解的。

> ratio 按钮和 select 表单元素的功能是一样的，用谁？如果要看到所有选项那就是 ratio，否则就是 select 元素（对于语言选项来说很重要，选项很多，但是你不想让他们占很多屏幕空间）。你在这里可以看到所有地缘国家的代码：https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes



## 事件

React 将所有事件都绑定在挂载元素上，比如 `<div id="root" />`。

你从 `<input onChange={event => {}} />` 里拿到的 event 是人工制造的合成事件（synthetic event），不是真正的 DOM 原生的事件对象（你可以从 `event.nativeEvent` 里获取原生的）。

做合成事件一是为了抹平不同浏览器之间的差距，二是提升开发体验（提供了一些原来没有的属性，方便开发），不过总体还是和原生的事件对象比较接近的，从这里看细节：https://react.dev/reference/react-dom/components/common#react-event-object

> 可是没有 `passive`，另外如果你看到一些关于事件的“事件池”之类的说辞，这个特性其实已经被移除掉了，它以前用来稍微提升性能，我记得是因为它太复杂了且容易搞出 bug，和它的收益不成正比所以才被删掉的，对吗？

## 复杂的状态

**But there's a catch:** React state changes have to be *immutable*. When we call `setColors`, we need to provide a *brand new* array. We should never mutate arrays or objects held in state.

React 总是强调「状态应当是不可变的（immutable）」，否则就会引发无尽的隐晦的 bug，这意味着你不能修改你的状态的内部，如果状态是一个对象，那么就不能更改对象的内部，否则就会导致 bug，因为你本次的状态可能是下一个状态的基。

在 JavaScript 中，Assignment（赋值）和 Mutation（变异）的内涵是不一样的，Assignment 指一个变量可以被重新赋值为令一个值，Mutation 指一个值的内部可以发生变异（就像基因突变一样是发生在体内的事情）。

```javascript
// Assignment
let a = 1;
a = 2;

// Mutation
const jynxio = { age: 18 };
jynxio.age = 19;
```

immutable 就是指状态是完全定死的。

JavaScript 中的复杂数据类型是有变异的能力的，简单数据类型（数字值、字符串等）是不能变异的，它们天生就是 immutable 的，它们只能 assignment。如果简单数据类型可以变异，那就意味着：

```javascript
36 = 37;
console.log(36); // 37
```

> 为什么 React 要求状态是不可变的？我是这么理解的：
>
> ```jsx
> function App() {
>     const [hugeData, setHugeData] = useState({ enabled: true, data: { /* huge guy */ } });
>     
>     return <button onClick={() => setHugeData({ ...hugeData, enabled: !hugeData.enabled })}>update</button>
> }
> ```
>
> 如果你的状态是体积庞大的对象，更新状态时，理想的状态是深度克隆出一个完全全新的对象来作为新的状态，但是这样太占内存和消耗时间了，你不得不要复用旧的体积庞大的对象（但是为了让新旧状态不一样，你必须得把外壳换一换），这时候可能会导致一个组件在很多轮更新中都引用了同一个对象，如果这个对象发生了某些变异，那么就会给你的组件带来不可预料的情况不是吗？所以就强制要求这个作为状态的对象必须是不可变的，这样就不会有这个的弊端的，它用起来就可以个全新的克隆对象一样安全。
>
> 并且在 React 的哲学中，一个状态对应一个 UI（f(state) = ui），如果你改变了状态（哪怕是内部），那么这就是一个新的状态，你要绘制新的 ui，你应该通过驱动组件的更新来生产新的 ui。（阿？这个说法好牵强啊...

在 React 的这个要求的驱动下，哪怕修改原始状态也能让程序跑起来，我们也不要这么做，因为这是一个不好的习惯

```jsx
function handleChange(event) {
    // 不要
    colors[index] = event.target.value;
    setColors([...colors]);
    
    // 而要
    const nextColors = [...colors];
    
    nextColors[index] = event.target.value;
    setColors(nextColors);
}
```

## 动态的 key

key 在一个数组内应该是唯一且不变的。

为什么要用 key？「我们需要为每个 React 元素赋予一个唯一的`key`属性，以便 React 知道在渲染之间触发哪些 DOM 操作。」？？？

key 就是为了避免下面这种情况，因为 JavaScript 操作 DOM 是比较消耗性能的。但是为什么非得要 key 才能对比出差异？

```jsx
// 这种情况下，每次新增item，所有item都会刷新（看控制台就知道了），但是明明那个前面的item是可以不用管的
function App() {
  const [count, setCount] = React.useState(5);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>increase</button>
      {Array.from({ length: count }).map((_, index) => (
        <div key={Math.random()}>{index}</div>
      ))}
    </>
  );
}
```

经常会碰到根本没 key 可用的情况，那就自己搞一些 key 出来，所以动态创建 key 有一些骚操作：

```jsx
function App() {
    const [list, setList] = useState([]);
    
    return (
    	<>
        	<button onClick={() => setList([...list, crypto.randomUUID()])>Increase</button>
        	{list.map(uuid => <span key={uuid}>{uuid}</span>)}
        </>
    );
}
```

如果用遍历时的 index 来做key，那么如果 item 的序号一旦发生改变，那么就会出错，比如：1）导致删除一个，后续所有都需要重新渲染；2）删除第一个结果却是删除最后一个（为什么？？？）

而你很难保证序号不被改变，因为你总会不经意的做一些过滤、倒排、中间插入东西、删除等操作。

另外，静态的被写入数据的键是更安全的，动态的键是不被推荐的（react 官方）。

如果每次遍历都要写入多个元素，那么就用 `<React.Fragment>` 来包裹和在其上绑定键。

You might be tempted to use an item’s index in the array as its key. In fact, that’s what React will use if you don’t specify a `key` at all.

暗坑：下面两个例子，无论点击任何一个元素，都会导致最后一个元素被删除，然后点击元素位置起到之后的所有元素都会被更新，因为在 React 看起来前面的 key 的元素都在，就少了最后一个 key，所以就把最后一个元素删掉了。然后 React 发现 `defaultValue` 或 `value` 的值不同步了，于是就用新蓝图的值来更新 DOM，由于 `defaultValue` 不影响字面上的值，所以它表现的和 `value` 不一样。

```jsx
function App () {
    const [list, setlist] = useState([]);
    
    return (
    	<>
        	<button onClick={() => setList([...list, Math.random()])}>add</button>
        	{
        		list.map((item, index) => (
        			<input
                        key={index}
                        defaultValue={item} // 💡 唯一的区别
                        onClick={() => setList(list.toSpliced(index, 1))}
                    />
    			))
			}
        </>
    );
}

function App () {
    const [list, setlist] = useState([]);
    
    return (
    	<>
        	<button onClick={() => setList([...list, Math.random()])}>add</button>
        	{
        		list.map((item, index) => (
        			<input
                        key={index}
                        value={item} // 💡 唯一的区别
                        onClick={() => setList(list.toSpliced(index, 1))}
                    />
    			))
			}
        </>
    );
}
```

为什么 key 可以加速渲染？为什么其他的东西又不用 key，这似乎得知道 React 的 diff 算法才能知道原因。

## lift state up

不要把所有状态都提升到顶层，会带来性能问题和巨大的心智负担。

在大部分情况下，其实不应该把父组件的 setter 直接传递给子元素，而是做一些处理后再给子元素，方便子元素直接使用。

```jsx
function Shop() {
    const [list, setList] = useState([]);
    
    return (
    	<>
        	<ul>
            	{list.map(item => <li key={item.uuid}>{item.label}</li>)}
        	</ul>
        	<Form addList/>
        </>
    );
    
    function addList(label) {
        setList([...list, { uuid: crypto.randomUUID(), label }]);
    }
}
```

## component instances

它是什么？它是组件的数据库，它是一个用于存储关于组件的一系列上下文信息的对象，其中就包括组件的状态。

在页面上挂载一个组件会发生两件事情：

- 根据 JSX 来生成相应 DOM 元素并挂载到页面上；
- 创建 component instances 并在其中存储关于组件的一切信息；

当我们调用 `useState()` 的时候，就会 hook into component instance，然后获取和更新 instance。

分清楚组件、组件示例、dom 元素之间的关系。

挂载组件就会创建组件实例，同一个组件函数可以创建出多个相似的组件自然就会创建出多个独立的组件实例，比如下面会创建至少一个关于 App 的组件实例，并在 enabled 为 true 时一下子再创建多 3 个互不相关的 Counter 组件实例，enabled 为 false 时就会永久销毁。

```jsx
function App() {
    const [enabled, setEnabled] = useState(false);
    
    return (
    	<>
        	<button onClick={() => setEnabled(!enabled)}>toggle</button>
        	{ enabled && <Counter /> }
        	{ enabled && <Counter /> }
        	{ enabled && <Counter /> }
        </>
    );
}

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
	);
}

const root = createRoot(document.querySelector('#root'));

root.render(<App/>);
```

另外，只有参与到 `render` 里面的组件才会创建组件实例，否则不会；

```jsx
const App1 = () => <div></div>;
const App2 = () => <div></div>;

const app1 = <App1 />;
const app2 = <App2 />;

root.render(app1);
console.log(app1);
console.log(app2);

// 会打印类似于的东西
{
    type: f App1,
	key: null,
	ref: null,
	props: { initialValue: 10 },
	_owner: null,
	_store: {},
}
```

App1 会创建组件实例，App2 不会，因为后者没有参与 render。

> 怪不得把很多状态提升到根组件上会带来性能障碍，因为你的根组件几乎是不卸载的，然后那些状态数据就会持续存在。

## 状态管理

用 React 做局部状态管理，用工具做全局状态管理（这对于那些用户登陆等信息、主题色是必要的）

应用分为三种：

- 没有太多状态：比如普通博客，有很多局部状态，但是全局状态很少，React 就可以胜任了（Josh 的博客就没有用状态管理工具！直接用 react ）
- 主要是客户端状态：比如一个客户端工具 figma、视频编辑器之类的，它们需要在全局存储很多状态，这时候引入全局状态管理工具吧
- 主要是服务器状态：比如数据分析仪表盘，数据几乎都来自服务器，Redux 之类的就肯定不行了，因为都没有和服务器打交道的功能，react-query、Vercel 的 SWR 之类的会更加合适

> Redux 在搞一个 redux toolkit，它提供一些 react-query 的功能，然后改变了经典的 action 和 reducer 流操作，Josh 不喜欢它（他倒是挺喜欢经典款），因为他觉得虽然经典款样板文件多，但是责任划分很清晰，文件多一点不是大碍。

## useId

根据组件在组件树中的路径来生成一个唯一 id，相比 crypto.randomUUID 等方案，优势有俩：

- 提升性能；
- 客户端和服务端生成一样的 uuid；

> 仅当服务端和客户端的组件树一致时，两者生成的 id 才是一致的。

关于提升性能，下面的 App 组件每次更新的时候，第一组 label/input 的 dom 不会更新，第二组的则会。

```jsx
function App() {
    const uuid1 = useId();
    const uuid2 = crypto.randomUUID();
    
    return (
		<>
        	<label htmlFor={uuid1}>Name: </label>
        	<input id={uuid1} />
        	<label htmlFor={uuid2}>Age: </label>
        	<input id={uuid2} />
        </>
    );
}
```

## ref 属性

JSX 的 ref 属性是一个 escape hatch，它在你在做诸如操纵 canvas 元素的时候非常需要。

```jsx
const ref = useRef();

<canvsa ref={dom => console.log(dom)} />
<canvas ref={ref} />
```

它有 2 种调用方法，传递一个函数，或者传递一个结构为 `{ current }` 的对象。对于函数，每次挂载和更新，都会执行一遍，对于对象，仅在挂载时才会执行一遍赋值，后续更新不会重新赋值，所以用对象更省性能。

不用 `useRef` 也行，反正只要给一个形状为 `{ current }` 的对象就好了。

## side effect

- Making network requests
- Managing timeouts / intervals
- Reading/writing from localStorage
- Listening for global events

React calls all of these things “side effects”，而我们经常需要做这类事，这些「副作用」是跳脱在 React 的管辖范畴之外的，比如 React 从来不管你如何设置文档标题、本地缓存、网络请求之类的事情。

## useState

每次返回的 setter 都是同一个 setter，请查看下面这个例子：

```jsx
let prevSetter;

function App() {
    const [num, setNum] = React.useState(random());

    React.useEffect(() => {
        console.log(prevSetter === setNum); // return true everytime
        return () => (prevSetter = setNum);
    });

    return (
        <>
            <button onClick={() => setNum(random())}>curr setter</button>
            <button onClick={() => prevSetter(random())}>prev setter</button>
            <p>{num}</p>
        </>
    );
}
```

## useEffect

如果 effect 函数里面注册了一个全局事件，并且持有了 setCount，那么不清理掉它的话，这个 App 的组件实例（component instance）就不会被释放掉，因为这个组件实例的一部分（setCount）被全局事件持有了。

```jsx
function App() {
    const [count, setCount] = useState(0);
    
    useEffect(
        () => globalThis.addEventListener('mousemove', () => setCount(random())),
        []
    );
    
    return <div />;
}
```

### 执行时机

cleanup 的执行时机究竟是什么时候？组件的从 dom 卸载之前？整个组件开始更新之前？还是组件的 effect 开始运行之前？测一下！

Josh说是“right before the component unmounts.”

Josh说是：🤔️ 挺清晰的！

- initial render: render -> effect
- subsequent render(s): render -> cleanup -> effect
- unmount: cleanup

这个流程来自 [这一节课](https://courses.joshwcomeau.com/joy-of-react/03-hooks/05.06-cleanup)，这最后的两页图太棒了！我想要使用它们。

### 为什么设计成返回函数的函数

Josh 讲了一个比较有趣的事情，为什么 cleanup 函数要被设计成由 effect 函数来返回，这不是很不清晰吗？原因是：cleanup 函数经常需要使用 effect 函数的内容。

```jsx
useEffect(
    () => {
        const handler = () => { /* ... */ };
        globalThis.addEventListener('click', handler);
        
        return () => globalThis.removeEventListener('click', handler);
    },
    [],
);
```

我以前觉得 Vue 和 Solid 的生命周期函数比 useEffect 清晰多了，然而实际上我其实在很多时候也把他们当成 useEffect 来使用了：

```vue
<script setup>
onMounted(() => {
    const handler = () => { /* ... */ };
    globalThis.addEventListener('click', handler);
    
    onUnmounted(() => globalThis.removeEventListener('click', handler));
});
</script>
```

