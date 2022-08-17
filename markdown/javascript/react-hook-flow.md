---
typora-root-url: ..\..
---

# Hook Flow

## 概述

Hook Flow 是指描述所有 Hook 的执行时机的流程。

## 流程图

![hook flow](/static/image/markdown/javascript/react-api-manual/hook-flow.png)

## 深入研究

请在非 React 严格模式下执行下述代码（即不要使用 `<React.StrictMode>` 元素），然后观察控制台的输出。

```react
function App () {

    return <Parent/>;

}

function Parent () {

    printPinkText( "Parent: render start" );

    const [ visible, setVisible ] = useState( _ => {

        printPinkText( "Parent: useState( _ => false ) " );

        return false;

    } );

    useEffect( _ => {

        printPinkText( "Parent: useEffect( _ => {} )" );

        return _ => printPinkText( "Parent: clean useEffect( _ => {} )" );

    } );

    useEffect( _ => {

        printPinkText( "Parent: useEffect( _ => {}, [] )" );

        return _ => printPinkText( "Parent: clean useEffect( _ => {}, [] )" );

    }, [] );

    useEffect( _ => {

        printPinkText( "Parent: useEffect( _ => {}, [ visible ] )" );

        return _ => printPinkText( "Parent: clean useEffect( _ => {}, [ visible ] )" );

    }, [ visible ] );

    const element = (
        <>
            <button onClick={ _ => setVisible( ! visible ) }>reverse</button>
            { visible && <Child/> }
        </>
    );

    printPinkText( "Parent: render end" );

    return element;

}

function Child () {

    printTealText( "Child : render start" );

    const [ count, setCount ] = useState( _ => {

        printTealText( "Child : useState( _ => 0 )" );

        return 0;

    } );

    useEffect( _ => {

        printTealText( "Child : useEffect( _ => {} )" );

        return _ => printTealText( "Child : clean useEffect( _ => {} )" );

    } );

    useEffect( _ => {

        printTealText( "Child : useEffect( _ => {}, [] )" );

        return _ => printTealText( "Child : clean useEffect( _ => {}, [] )" );

    }, [] );

    useEffect( _ => {

        printTealText( "Child : useEffect( _ => {}, [ count ] )" );

        return _ => printTealText( "Child : clean useEffect( _ => {}, [ count ] )" );

    }, [ count ] );

    const element = <button onClick={ _ => setCount( count + 1 ) }>{ count }</button>;

    printTealText( "Child : render end" );

    return element;

}

function printPinkText ( text ) {

    console.log( `%c${ text }`, "color: pink" );

}

function printTealText ( text ) {

    console.log( `%c${ text }`, "color: teal" );

}
```

首次运行时，控制台输出如下：

```
Parent: render start
Parent: useState( _ => false )
Parent: render end
Parent: useEffect( _ => {} )
Parent: useEffect( _ => {}, [] )
Parent: useEffect( _ => {}, [ visible ] )
```

然后，点击 `reverse` 按钮后，控制台输出如下：

```
Parent: render start
Parent: render end
Child : render start
Child : useState( _ => 0 )
Child : render end
Parent: clean useEffect( _ => {} )
Parent: clean useEffect( _ => {}, [ visible ] )
Child : useEffect( _ => {} )
Child : useEffect( _ => {}, [] )
Child : useEffect( _ => {}, [ count ] )
Parent: useEffect( _ => {} )
Parent: useEffect( _ => {}, [ visible ] )
```

> 为什么 `Child: render start` 会出现在 `Parent: render end` 之后？

然后，点击 `0` 按钮后，控制台输出如下：

```
Child : render start
Child : render end
Child : clean useEffect( _ => {} )
Child : clean useEffect( _ => {}, [ count ] )
Child : useEffect( _ => {} )
Child : useEffect( _ => {}, [ count ] )
```

然后，点击 `reverse` 按钮后，控制台输出如下：

```
Parent: render start
Parent: render end
Child : clean useEffect( _ => {} )
Child : clean useEffect( _ => {}, [] )
Child : clean useEffect( _ => {}, [ count ] )
Parent: clean useEffect( _ => {} )
Parent: clean useEffect( _ => {}, [ visible ] )
Parent: useEffect( _ => {} )
Parent: useEffect( _ => {}, [ visible ] )
```

