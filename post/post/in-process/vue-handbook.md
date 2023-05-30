## ref()

创建一个可变且深层的响应式状态，其结构为 `{ value }`。如果该响应式状态发生了更新，那么在 JSX 中任何使用了该响应式状态的运算表达式都会被重新执行。如果我们想更新响应式状态，那么就修改它的 `value` 属性的内容。

```js
const state = ref(value);
```

如果 `value` 是一个引用数据类型，那么 `ref` 就会使用 `reactive` 来处理 `value`。如果该引用数据类型的内部使用了 `ref` 实例，那么该 `ref` 实例就会被解包处理，比如下例中的 `josh` 和 `john` 的结构是一样的。

```js
const age = ref(18);
const josh = ref({ name: "josh", age });
const john = ref({ name: "john", age: 18 });
```

> 对于如何判断状态是否发生了更新，react 使用 `Object.is`，solid 使用 `===`，而 vue 则定义了一套蛮复杂的方法。
>
> 这似乎是因为 vue 是通过「监听」对响应式状态的操作来实现「状态更新与否」的判断的，由于被监听的数据的数据类型五花八门，所以 vue 需要为每一种数据类型都定义一种监听方法，这导致了这套判定机制变得复杂。

## reactive()

## nextTick()

注册一个函数，该函数将会在下一次的 DOM 更新完成之后再被执行。

```ts
function nextTick(callback?: () => void): Promise<void>
```

> 为什么会有这个 API？因为 Vue 不会在开发者更新状态之后就立即同步的更新 DOM，取而代之的是，Vue 会为每一个响应式状态都维护一个独立的关于状态更新的任务队列，然后 Vue 会将一段时间内的对所有响应式状态的更新任务都收集到各自的任务队列中去，然后直到下一次更新时机（tick）到来之时，再直接计算出所有需要更新的响应式状态的最终值，并一次性的更新 DOM。
>

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

