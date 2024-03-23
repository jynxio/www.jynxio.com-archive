---
typora-root-url: ./..\..\image
---

# JavaScript 中的设计模式

## 模块模式

在 JavaScript 中，ES Modules 就是模块模式。

## 原型模式

JavaScript 的原型链就是原型模式（Prototype Pattern）。

> 你可以在 [这里](https://weizmangal.com/ProtoTree/) 看到 JavaScript 的完整原型链。

## 工厂模式

在 JavaScript 中，工厂模式（Factory Pattern）就是使用普通函数来创建对象（不能使用 `new`）。

```js
const convert = ([k, v]) => { [k]: v };
```

不过，在大多数情况下创建实例会比工厂模式更节省内存。

## 享元模式

享元模式（Flyweight Pattern）：通过共享相似的内容来降低内存占用和计算负荷。

```js
// 💡 树模型是一个拥有几何、颜色、纹理等数据的庞大对象
import TreeModel from 'somewhere';

const createTreeModel = (function factory() {
    const cache = new Map();
    
    return (x, y, treeName) => {
        if (!cache.has(treeName)) {
            const model = new TreeModel(treeName);
            cache.set(treeName, model);
        }
        
        return { x, y, model: cache.get(treeName) };
    };
})();

const treeModels = [];
const treeNames = ['oak', 'elm', 'fir', 'ash'];

for (let i = 0; i < 100000; i++) {
    const x = Math.random() * 1000;
    const y = Math.random() * 1000;
    const i = Math.floor(Math.random() * treeNames.length);
    const treeName = treeNames[i];

    treeModels.push(createTreeModel(x, y, treeName));
}
```

## 中介者模式

中介者模式（Mediator/Middleware Pattern）：使用中介者来管理组件之间的通信以降低组件之间的耦合性，并且由于通信逻辑都被聚合在了一起所以更好维护，缺点则是增加了复杂度。

比如 MVC 框架就使用了中介者模式，其中 C（Controller）是中介者，它负责管理 V（View）和 M（Model）之间的通信。再比如，聊天服务器是网友之间的中介者，塔台是飞机之间的中介者，智能家居的中控系统是智能设备之间的中介者。

![中介者模式](/algorithm-and-data-structure/design-pattern/mediator-pattern.png)

```js
// ⚙️ 组件
class User {
    constructor(name) {
        this.name = name;
        this.uuid = crypto.randomUUID();
        this.chartroom = undefined;
    }

    send(msg, to) {
        this.chatroom.send(msg, this.uuid, to);
    }

    receive(msg) {
        alert(msg);
    }
}

// 🏗 中介者
class Chatroom {
    constructor() {
        this.users = new Map();
    }

    register(user) {
        user.chartroom = this;
        this.users.set(user.uuid, user);
        return this;
    }

    send(msg, from, to) {
        // 💡 此处可插入鉴权、消息格式化、用户状态检测等复杂操作
        const sender = this.users.get(from);
        const newMsg = `message from ${sender.name}: ${msg}`;
        const receivers = to
        	? [this.users.get(to)]                           // 私信
        	: this.users.filter(user => user.uuid !== from); // 群聊

        receivers.forEach(item => item.receive(newMsg));
    }
}

const josh = new User('Josh');
const john = new User('John');
const jynx = new User('Jynx');
const chatroom = new Chatroom();

chatroom.register(josh).register(john).register(jynx);
jynx.send('Hello world!');

// -> (to josh) message from jynx: Hello world!
// -> (to john) message from jynx: Hello world!
```

## 观察者模式

观察者模式（Observer Pattern）：在组件之间建立依赖关系，一旦上游组件更新了，就通知所有下游组件。

比如 Vue 3 的 `computed` 和 Solid 的 `createComputed` 就采用了观察者模式。

```js
class Observable {
    constructor() {
        this.observers = new Set();
    }
    
    subscribe(observer) {
        this.observers.add(observer);
    }
    
    unsubscribe(observer) {
        this.observers.delete(observer);
    }
    
    notify(data) {
        this.observers.forEach(item => item.update(data));
    }
}

class Observer {
    update(date) {}
}

const observable = new Observable();
const observerA = new Observer();
const observerB = new Observer();

observable.subscribe(observerA);
observable.subscribe(observerB);
observable.notify('good news everyone!');
```

## 代理模式

代理模式（Proxy Pattern）：通过给目标安装拦截器来施加更多的控制。在 JavaScript 中，我们可以用 `Object.defineProperty`、`Proxy & Reflect` 来实现代理模式。

比如，我们可以使用代理模式来实现一个简单的类型检查。

```js
const person = new Proxy(
	{ name: 'Jynxio', age: 18 },
    {
        set(target, prop, value, receiver) {
            if (typeof value !== typeof prop) throw 'TypeError';
            Reflect.set(target, prop, value, receiver);
        }
    },
);
```

> 为什么要使用 `Reflect` 而不是直接更新对象的属性？因为这可以避免某些暗坑，请考虑下面这个例子：
>
> ```js
> const parent = new Proxy(
>     {
>         _age: 42,
>         _name: 'parent',
>         get age() { return this._age },
>         get name() { return this._name },
>     },
>     {
>         get(target, prop, receiver) {
>             if (prop === 'age') return target[prop]
>             if (prop === 'name') return Reflect.get(target, prop, receiver);
>         },
>     },
> );
> const child = Object.create(parent);
> 
> child._age = 18;
> child._name = 'child';
> console.log(child.age);  // 🚫 42
> console.log(child.name); // ✅ "child"
> ```
>
> 你可以从 [这里](https://zh.javascript.info/proxy) 了解到更多细节。

## 提供者模式

React 的 Context 和 Vue 的 Provide 就是典型的提供者模式，它被用来解决 prop drilling 问题。

因为 Vue 的 Provide 更简洁，所以此处以 Provide 为例。

```vue
// ✌️ GreatGreatGreatGrandfather.vue
<script setup>
const theme = ref('dark');
const toggle = _ => theme.value = theme.value === 'dark' ? 'light' : 'dark';

provide('theme', { theme: readonly(theme), toggle });
</script>

<template>
    <Child />
</template>

// ✌️ GreatGreatGreatGrandchild.vue
<script setup>
const { theme, toggle } = inject('theme');
</script>

<template>
    <button @click="toggle">{{ theme }}</button>
</template>
```

## 混合模式

混合模式（Mixin Pattern）：通过组合而非继承的方式来让组件们共享 Mixin 对象的方法，从而既实现了复用又避免了来自继承的复杂性，其中 Mixin 对象是共享功能的提供商。

在 JavaScript 中，混合模式就是简单的将一些方法拷贝到另一个对象或对象的原型链中去。比如，浏览器运行时中的 `Window` 和 `Worker` 都从 `WindowOrWorkerGlobalScope` 共享了许多方法，比如 `setTimeout`、`setInterval`、`indexedDB`、`isSecureContext`。

> `WindowOrWorkerGlobalScope` 本身是不可见的，可从 [此处](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API#worker_global_contexts_and_functions) 获得更多细节。

```js
const humanMixin = {
    eat() {},
    walk() {},
    sleep() {},
};
const womanMixin = {
    pregnant() {}
    delivered() {}
};

// 方式一：直接拷贝
Object.assign(womanMixin, humanMixin);

// 方式二：拷贝至原型链（不推荐，因为会造成原型污染）
class Woman {}
Object.assign(Woman.prototype, womanMixin);
```

## 命令模式

命令模式（Command Pattern）：将调用者和接收者之间的交互信号封装命令对象，让调用者和接收者通过命令对象来沟通，以解耦两者之间的联系，并且还易于扩展（比如通过将命令队列化来实现撤销和重做功能，或通过组合命令来实现复杂的功能）。

在命令模式中有 3 个不可或缺的角色，分别是：

- 接收者（Receiver）：被命令对象操纵，并且会给命令对象提供相关的接口；
- 调用者（Invoker）：负责调用和管理命令对象；
- 命令（Command）：用于操纵接受者的指令，通常会持有接收者；

下面是一个用 React 实现的简易编辑器，它具有编辑文本、重做、撤回功能：

```jsx
// Receiver
class TextEditor {
    constructor() {
        this.text = '';
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }
}

// Invoker
class Toolbar {
    constructor() {
        this.undoHistory = [];
        this.redoHistory = [];
    }

    execute(command) {
        command.execute();
        this.redoHistory = [];
        this.undoHistory.push(command);
    }

    undo() {
        if (!this.undoHistory.length) return;

        const command = this.undoHistory.pop();

        command.undo();
        this.redoHistory.push(command);
    }

    redo() {
        if (!this.redoHistory.length) return;

        const command = this.redoHistory.pop();

        command.redo();
        this.undoHistory.push(command);
    }
}

// Command
class WriteCommand {
    constructor(receiver, text) {
        this.text = text;
        this.previousText = '';
        this.receiver = receiver;
    }

    execute() {
        this.previousText = this.receiver.getText();
        this.receiver.setText(this.text);
    }

    undo() {
        this.receiver.setText(this.previousText);
    }

    redo() {
        this.execute();
    }
}

function App() {
    const editor = useMemo(() => new TextEditor(), []);
    const invoker = useMemo(() => new Toolbar(), []);
    const [text, setText] = useState(editor.getText());

    return (
        <>
            <section>
                <button onClick={undo}>撤回</button>
                <button onClick={redo}>前进</button>
            </section>
            <textarea value={text} onChange={write} />
        </>
    );

    function write(event) {
        const newText = event.target.value;
        const writeCommand = new WriteCommand(editor, newText);

        invoker.execute(writeCommand);
        setText(editor.getText());
    }

    function redo() {
        invoker.redo();
        setText(editor.getText());
    }

    function undo() {
        invoker.undo();
        setText(editor.getText());
    }
}
```

## 单例模式

单例模式（Singleton Pattern）：一个类只会创建一个实例，并且提供一个全局的访问接口。单例模式常常被用来创建一个全局共享的状态，并且还可以节省内存，不过缺点就是代码的耦合性会变高，因为全局环境都可以访问和修改这个单例。

对于 Java、C++ 等语言，因为它们必须借助类来创建实例，所以它们需要通过创建一个始终只能返回一个实例的类来实现单例模式。但是 JavaScript 可以直接创建对象，因此在 JavaScript 中实现单例模式非常简单，比如：

```js
let count = 0;
const counter = {
    increase() { return ++count },
    decrease() { return --count }
};
const freezeCounter = Object.freeze(counter);

export default freezeCounter; // just for safe
```