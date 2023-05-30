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

## reactive()



## nextTick()

注册一个函数，该函数将会在下一次的 DOM 更新完成之后再被执行。

```ts
function nextTick(callback?: () => void): Promise<void>
```

为什么会有这个 API？因为 vue 不会在状态更新后立即更新 DOM，而是会把一段时间内的「状态更新任务」都收集到一个队列中去，然后在下一次的 DOM 更新前再处理队列中的所有任务，并计算出一个最终的状态值，接着再计算出最终的 DOM，最后再更新 DOM。

> 这个行为似乎和 react 的 batching 是一模一样的，关于 batching 更多细节，请见 [react 手册](https://www.jynxio.com/javascript/react-handbook) 或 [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)。

其有两种使用风格：

```js
const count = ref(0);

async function handleClick () {
    count.value ++;
    console.log("DOM has not been updated yet")
    
    // 回调函数风格
    nextTick(() => console.log("DOM has been updated now"));

    // async/await风格
    await nextTick();
    console.log("DOM has been updated now")
}
```

## 同样的 Object，同样的 Proxy

对于 `reactive()` 和 `shallowReactive()`，如果入参相同，那么返回的 Proxy 实例也会相同。

```js
const raw = {};
const deepProxy = reactive(raw);
const shallowProxy = shallowReactive(raw);

deepProxy === proxy(raw);                       // true
deepProxy === reactive(deepProxy);              // true

shallowProxy === shallowReactive(raw);          // true
shallowProxy === shallowReactive(shallowProxy); // true
```

`ref` 和 `shallowRef` 也有类似的行为。

```js
const raw = {};
const deepProxy = ref(raw);
const shallowProxy = shallowReactive(raw);

deepProxy.value === ref(raw).value;                   // true
deepProxy.value === ref(deepProxy).value;             // true

shallowProxy.value === shallowRef(raw).value;          // true
shallowProxy.value === shallowRef(shallowProxy).value; // true
```

