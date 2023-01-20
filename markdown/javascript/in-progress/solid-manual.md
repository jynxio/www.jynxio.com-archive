# Solid API 手册

## createSignal

```react
function Counter () {

    const [ getCount, setCount ] = createSignal( 1 );
    
    return (
    	<button onClick={ _ => setCount( prev => prev + 1 ) }>
            { getCount() }
        </button>
    );

}
```

`getCount` 和 `setCount` 是 `signal` 的 `getter` 和 `setter`。如果调用了 `setter`，那么 solid 就会使用 `===` 来检查 `signal` 的新值和旧值是否相等，仅当不相等时才会触发更新。

当 `signal` 发生了改变之后，solid 就会通过跟踪 `getter` 来决定应该更新哪些组件，具体来说，如果某个组件调用过了 `getter`，那么 solid 就会更新这个组件。值得强调的是，solid 不会通过跟踪 `setter` 来决定应该更新哪些组件。

## createMemo

## createEffect & createRenderEffect

它们有时候 effect 函数会批处理一系列的 signal 更新，有时候则不会批处理...到底是怎么回事呢？

## 合成事件与dispatchEvent的“bug”

## Show

```react
function Toggle () {

    const [ getDisplay, setDisplay ] = createSignal( true );
    
    return (
        <Show when={ getDisplay } fallback={ <p>nothing...</p> }>
            <Info/>
        </Show>
    );

}

function Info () {

    console.log( "1" );

    return <p>some information...</p>

}
```

每当 `getDisplay` 严格等于 `true` 时，solid 就会执行一次 `Info` 构造器来创建所要渲染的组件，所以每次 `getDisplay` 严格等于 `true` 的时候，控制台就会打印一次 `1`。