React (beta)

## propTypes

开发者可以通过一个可选的特性 `propTypes` 来检查组件的 `props`，比如下面这个例子。

```react
function Count( { number, string } ) {
    return (<div>
        The first parameter is:{ number }
        The second parameter is:{ string }
    </div>);
}

/* 添加类型检查 */
Count.propTypes = {
    number: ( props, prop_name, component_name ) => {
    	if ( typeof( props[ prop_name ] ) !== "number"  ) return new Error( "type-error-number" );
	},
    string: ( props, prop_name, component_name ) => {
    	if ( typeof( props[ prop_name ] ) !== "string"  ) return new Error( "type-error-string" );
	},
};
```

当调用该组件时，由 `propTypes` 定义的参数预处理器就会检查参数，如果参数 `number` 和 `string` 没有接收到目标类型的值时，就会抛出预定义的错误。另外如果根本就没有传入任何值给参数（就像下面这个例子），那么参数就会接收到 `undefined`。

在事实上，参数预处理器不会做任何事情，包括检查参数的类型，只是我们通过手写类型检查来增加了这个环节。

```react
export default function App() {
	return (
		<div>
			<Count />
		</div>
	);
}
```

观察上例代码，由于组件 `Count` 的 `number` 和 `string` 参数没有接收到目标类型的值，因此会在控制台中抛出预定义的 Error，然后页面会渲染出 `The first parameter is:` 和 `The second parameter is:` 两行内容。

> 由于 `propTypes` 会增加运行的开销，因此我们并不会在生产环境中使用它们，因为生产环境应该要有最优的性能。

你可以通过 [React - Typechecking With PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) 来查看这个 API 的详细信息。

另外，React 团队开发了一个 [prop-types](https://www.npmjs.com/package/prop-types) 的项目来方便开发者进行类型检查，这比我们自己手写 `propTypes` 来增加类型检查要好多了。