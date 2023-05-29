## ref()

创建一个可变的深层响应式对象，其结构为 `{ value }`。如果该深层响应式对象发生了更新，那么在 JSX 中任何使用了该深层响应式对象的运算表达式都会被重新执行。只要 `value` 属性值发生了任何修改，那么就会更新该深层响应式对象。

> 对于如何判断状态是否发生了更新，react 使用 `Object.is`，solid 使用 `===`，而 vue 则定义了一套蛮复杂的方法。这似乎是因为 vue 是通过「监听」来实现「状态更新与否」的判断的，而被监听的数据的数据类型五花八门，vue 需要为每一种数据类型都定义一种监听方法。

```js
const state = ref(value);
```

如果 `value` 是一个引用数据类型，那么此时 `ref` 就等同于 `reactive`，如果该引用数据类型内部含有一个 `ref` 实例，那么该 `ref` 实例会被解包，比如下例中 `josh` 和 `john` 的结构是一样的。

```js
const age = ref(18);
const josh = ref({ name: "josh", age });
const john = ref({ name: "john", age: 18 });
```

