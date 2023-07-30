## ref()

创建一个可变且深层的响应式状态，其结构为 `{ value }`。

如果该响应式状态发生了更新，那么在 JSX 中任何使用了该响应式状态的运算表达式都会被重新执行。如果我们想更新响应式状态，那么就修改它的 `value` 属性的内容。

```js
const state = ref( value );
```

之所以要把 `ref()` 的返回值设计成 `{ value }` 结构，是因为原始数据类型必须被改造成复杂数据类型之后才能成为响应式状态。

## 混乱的解包规则

自动解包是指：ref 实例会直接被默认当作 ref.value 来处理。vue 的自动解包规则很混乱，请总是遵循最佳实践。

### 最佳实践

- 不要在 ref 实例或 reactive 实例的内部嵌入另一个 ref 实例或 reactive 实例；
- 不要在 `ref()` 或 `reactive()` 调用中传入 ref 实例或 reactive 实例；
- 在 template 中，对被直接调用的 ref 实例使用自动解包；
- 在 template 中，对被以属性访问模式所调用的 ref 实例使用手动解包；

### 解包规则

1. 在 template 中的 ref 实例，有些会被自动解包，有些则不会；
2. 在 `ref()` 内使用的 ref 实例，如果是直接使用，或者是被包裹在 `{}` 内使用，那么就会被解包；如果是被包裹在非 `{}` 内使用（比如数组、Map 等），那么就不会被解包；
3. 在 `reactive()` 内使用的 `ref` 实例，如果被包裹在 `{}` 内使用，那么就会被解包；如果被包裹在非 `{}` 内使用（比如数组、Map 等），那么就不会被解包；

```vue
<script setup>
import { ref } from "vue";

/* 示例2、示例3 */
ref( ref( 0 ) ).value                   // 0（自动解包了）
ref( { count: ref( 0 ) } ).value.count; // 0（自动解包了）
reactive( { value: ref( 0 ) } ).value;  // 0（自动解包了）

ref( [ ref( 1 ) ] ).value[ 0 ].value;   // 1（未自动解包）
reactive( [ ref( 1 ) ] )[ 0 ].value;    // 1（未自动解包）

const refState = ref( 0 );
refState.value = ref( 1 ); // refState: 

const reactiveState = ref( { value: 0 } );
reactiveState.value = ref( 1 ); // reactiveState: Proxy(Object) {}

/* 示例1 */
const age = ref( 18 );
const josh = { age };
</script>

<template>
	<p>{{ age }}      => 18</p>
	<p>{{ josh.age }} => 18</p>

	<p>{{ age.value }}      => undefined</p>
	<p>{{ josh.age.value }} => 18</p>

	<p>{{ age + 1 }}      => 19</p>
	<p>{{ josh.age + 1 }} => [object Object]1</p>

	<p>{{ age.value + 1 }}      => NaN</p>
	<p>{{ josh.age.value + 1 }} => 19</p>
</template>
```

> `josh.age` 和 `josh.age.value` 都是合法操作，这会诱导用户写出 `josh.age + 1` 这种非法操作。

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

## watch

watch 会自动的深层次的监听 `reactive` 实例，但只会浅层的监听 `ref` 实例（即只会监听 `ref` 实例的 `value` 属性是否发生变化）。

```js
const r1 = ref(0)
const r2 = ref({ count: 0 });
const r3 = reactive({ value: { count: 0 } })

watch(r1, () => console.log('r1'))
watch(r2, () => console.log('r2'))
watch(r3, () => console.log('r3'))

r1.value++;       // 触发监听
r2.value.count++; // 不触发
r3.value.count++; // 触发监听
```

## $emit

它比 `defineEmits` 要更简洁

```vue
<script setup>
// App.vue
import Toggle from './Toggle.vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
    <h1 v-show="visible">Heading</h1>
    <Toggle @fn="visible = !visible" />
</template>
```

```vue
<template>
	<button @click="$emit('fn')">Toggle</button>
</template>
```



## 响应式状态是如何办到的

## 吐槽

`v-bind` 的语法糖是 `:`，`v-on` 的语法糖是 `@`，然后 `:` 和 `@` 组合在一起之后的语法糖是 `v-model`，这个命名有点混乱！

如果 `watch` 的第一个参数是 ref 实例，那么第二个函数参数的入参就是 ref 实例的解包，如果第一个参数是 reactive 实例，那么第二个函数参数的入参就是 reactive 实例本身，这不统一。

```js
const countRef = ref(0)
const countRea = reactive(0)

watch(countRef, value => {
	value; // countRef.value
})
watch(countRea, value => {
    value; // countRea
})
```

我不喜欢把 JavaScript 写在字符串里，可是 Vue 的 template 到处都是这些东西！

事实上，emit 特性还不错！比 React 和 Solid 的「传递函数给后代组件来实现双向通信」要更舒适。

下例中，如果 3 个 input 的 value 存在于 checkedNames 数组中，那么 input 就会显示为勾选，同时切换 input 的勾选状态也会将其 value 值添加进 checkedNames 数组中或从 checkedNames 数组中移除。这确实挺便利... 但是如果 Vue 不告诉你它的 v-model 可以做这件事情，你就根本猜不到，如果 Vue 的特性都是类似于这样的话，那么就意味着「如果你想要越多的便利，那么就要记住越多的繁文缛节」。

```vue
<script setup>
const checkedNames = ref([ 'Jack', 'John' ])
const pickedName = ref('One')
</script>

<template>
    <div>
        <h2>Mutiple Checkbox</h2>
        <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
        <label for="jack">Add/remove 'Jack' in checkedNames</label>
        <input type="checkbox" id="john" value="John" v-model="checkedNames" />
        <label for="john">Add/remove 'John' in checkedNames</label>
        <input type="checkbox" id="josh" value="Josh" v-model="checkedNames" />
        <label for="josh">Add/remove 'Josh' in checkedNames</label>
        
        <h2>Radio</h2>
        <input type="radio" id="one" value="One" v-model="pickedName" />
        <label for="one">Toggle pickedName's value to 'One'</label>
        <input type="radio" id="two" value="Two" v-model="pickedName" />
        <label fpr="two">Toggle pickedName's value to 'Two'</label>
    </div>
</template>
```

奇怪的语法糖：从 Vue 3 开始，用户可以用烤串命名法来调用一个组件，哪怕该组件在导入时使用了大驼峰命名法，这样子做的可读性确实更好，可是... 风格也很分裂。可见 [该官方示例](https://vuejs.org/examples/#svg) 或下述示例代码：

```vue
<script setup>
import MyName from "./MyName.vue";
</script>

<template>
<MyName />
<myName />
<my-name />
<My-name />
<my-Name />
<My-Name />
</template>
```

