# Babel 7 参考

## @babel/preset-env

在 Babel6 时代，常见的预设有： `babel-preset-es2015` 、 `babel-preset-es2016` 、 `babel-preset-es2017` 、 `babel-preset-state-0` 、 `babel-preset-state-1`、 `babel-preset-state-2`  、 `babel-preset-state-3` 、 `babel-preset-latest` 。其中 `babel-preset-state-x` 是指草案阶段的 ES 语法的转译预设，目前不再更新； `babel-preset-es201x` 是指 `201x` 年新发布的 ES 语法的转译预设，目前不再更新； `babel-preset-latest` 是指 `2015-至今` 的所有 ES 语法的转译预设，目前持续更新；

`@babel/-preset-env` 正是 `babel-preset-latest` 的延续与增强，它不仅仅包含所有语法的转译规则，甚至还可以按需转译语法和按需填补 API 。它在 Babel 6 时代的旧名是 `babel-preset-env` 。

本文只介绍常用的 4 个参数：

### targets

描述：告知 Babel 目标运行时的状态，该参数用于「按需转译语法」和「按需填补接口」。

默认值： `{}` ，目标运行时是 ES5 。

数据类型：`string |Array<string> |{[string]: string}`

示例：

```json
{
    "presets": [[
        "@babel/preset-env",
      { "targets": "> 0.25%, not dead" }
    ]]
}
```

```json
{
    "presets": [[
        "@babel/preset-env",
        { "targets": { "chrome": "58" } }
    ]]
}
```

在 `package.json` 中设置 `browserslist` 字段可以起到和在 `babel.config.json` 中设置 `targets` 字段一样的效果。如果同时使用了 `browserslist` 和 `targets` ， Babel 会采用 `targets` 。 `browserslist` 的示例：

```json
{
    "dependencies": {},
    "devDependencies": {},
  "browserslist": [ "chrome 58" ]
}
```

### useBuiltIns

描述：是否激活「按需填补接口」。

默认值： `false`

取值：

-  `false` ：禁用。
-  `entry` ：启用，引入目标环境缺失的 ES6+ API ，且必须在待处理的脚本中显式书写 `import "core-js/stable"` 和 `import "regenerator-runtime"` 。
-  `usage` ：启用，引入目标环境缺失且被脚本使用到了的 ES6+ API ，且不能在待处理的脚本中书写 `import "core-js/stable"` 和 `import "regenerator-runtime"` 。

### corejs

描述：告知 Babel 项目所依赖的 `core-js` 模块的版本号是多少，仅当 `useBuiltIns` 值为 `"entry"` 或 `"usage"` 时，该参数才生效。

最佳实践：将项目所依赖的 `core-js` 模块的版本号的字符串值作为 `corejs` 参数的值。比如如果 `package.json` 中显示 `"core-js": "^3.20.1"` ，那么就将 `corejs` 参数的值设为 `"3.19.3"` 。

默认值： `"2.0"`

数据类型： `string | {version: string, proposals: boolean}` 。如果想要引入提案阶段的 ES 特性，就需要将 `corejs` 参数设定为特殊值，这时才会用到 `{version: string, proposals: boolean}` 。如果只是想引入稳定的 ES 特性，只使用 `string` 格式就够了。

> 注： Babel 需要先知道 `core-js` 的版本号才知道该如何按需填补接口，因为不同版本的 `core-js` 的内容不尽相同。如果不需要做按需填补接口，自然就不需要知道 `core-js` 的版本号了。这就是 `corejs` 参数的意义。

### modules

描述：设置 Babel 应当使用什么模块语法来导入模块。

默认值： `auto` （此时会采用 commonjs 模块语法，即 `require` 和 `module.exports` ）

取值：选用下述其一

-  `"amd"`
-  `"umd"`
-  `"systemjs"`
-  `"commonjs"`
-  `"cjs"`
-  `"auto"`
-  `"false"` （此时会采用 ES 模块语法，即 `import` 和 `export` ）

## @babel/plugin-transform-runtime

> 注：如果没有使用 `@babel/preset-env` ，该插件将不会生效。

该插件有 3 大作用：

1. 使用「语法辅助函数模块」来替换「内联语法辅助函数」，这有助于减小打包后的体积，该功能默认激活。
2. 对除了 Generator Function API 和 Async Function API 之外的 ES6+ API 执行接口转译，该功能默认禁用。
3. 对 Generator Function API 和 Async Function API 执行接口转译，该功能默认激活。

功能 1 的示例见《Babel 7 原理》的《语法辅助函数》，功能 2 和 3 的示例见《Babel 7 原理》的《如何转译接口》。

### helpers

描述：是否使用「语法辅助函数模块」来替换「内联语法辅助函数」。

默认值： `true`

取值：

1.  `true` ：激活。
2.  `false` ：禁用。

### corejs

描述：是否做接口转译，注意它只转译除了 Generator Function API 和 Async Function API 之外的 ES6+ API 。

默认值： `false`

取值：可取以下其一

1.  `false` ：禁用。
2.  `2` ：激活，使用来自 `@babel/runtime-corejs2` 的接口辅助函数模块。
3.  `3` ：激活，使用来自 `@babel/runtime-corejs3` 的接口辅助函数模块。

### regenerator

描述：是否做接口转译，注意它只转译 Generator Function API 和 Async Function API 。

默认值： `true`

取值：

1.  `true` ：激活。
2.  `false` ：禁用。

> 该功能所需的接口辅助函数模块来自 `@babel/runtime/regenerator` 或 `@babel/runtime-corejs2/regenerator` 或 `@babel/runtime-corejs3/regenerator` ，具体使用哪个则取决于 `corejs` 的取值。

### version

描述： runtime 模块版本号。因为该插件需要根据 runtime 模块的版本号来决定可以在内部使用哪些技巧。

最佳实践：照抄 runtime 模块的值，这样打包后的体积会更小。比如如果 `package.json` 中 `"@babel/runtime-corejs3": "^7.16.5"` ，那么就将 `version` 的值设为 `"^7.16.5"` 。

默认值： `"7.0.0"` 

取值： runtime 模块的版本号的字符串值。

> 此处的「runtime模块」是指 `@babel/runtime` 或 `@babel/runtime-corejs2` 或 `@babel/runtime-corejs3` ，「runtime模块」不是官方术语，这是本节为了简化描述而自拟的术语。

### absoluteRuntime

描述：是否自定义 `@babel/plugin-transform-runtime` 引入 runtime 模块的路径规则。几乎用不到该参数，取默认值就行，因为只要正常的将包安装至 `node_modules` 文件夹中，就不需要自定义包的路径。

默认值： `false`

取值：

1.  `false` ：不需要自定义包的路径。
2.  表示路径的字符串。

## @babel/runtime

该包存储了所有的语法辅助函数模块和 `regenerator-runtime` 模块，前者位于 `helpers` 文件夹内，后者位于 `regenerator` 文件夹内。

> 其实如果安装了 `@babel/preset-env` ， `@babel/runtime` 也会被自动安装上。但如果你要用 `@babel/runtime` 的话，最好还是再手动安装一遍。

## @babel/runtime-corejs2

它是 `@babel/runtime` 的升级版，它不仅仅包含 `@babel/runtime` 的所有内容，还包含 2 号主版本的 `core-js` 。

2 号主版本的 `core-js` 只支持全局变量（如 `Promise` ）和静态属性（如 `Array.from` ），不支持实例属性（如 `Array.prototype.includes` ）。

## @babel/runtime-corejs3

它是 `@babel/runtime` 的升级版，它不仅仅包含 `@babel/runtime` 的所有内容，还包含 3 号主版本的 `core-js` 。

3 号主版本的 `core-js` 不仅支持全局变量（如 `Promise` ）和静态属性（如 `Array.from` ），还支持实例属性（如 `Array.prototype.includes` ）。

## regenerator-runtime

它不是官方包，它用于填补 Generator Function API 和 Async Function API 。该包只有 2 个 JS 文件，第一个 `path.js` 用于获取 `runtime.js` 的绝对路径，第二个 `runtime.js` 用于填补 API 。

由于它只用 1 个 JS 文件来填补 2 个 API ，所以只要需要填补 Generator Function API 或 Async Function API 中的任意一个， Babel 都会导入整个 `regenerator-runtime` 。

## @babel/core

Babel 的核心包，只要使用 Babel 的功能，就需要用到该包。

## @babel/cli

如果想用通过命令行来使用 Babel ，就需要安装该包，以下是一些示例：

```
1.将转译后的代码输出到terminal：
npx babel a.js

2.将转译后的代码写入到文件中：
npx babel a.js -o b.js
npx babel a.js --out-file b.js

3.转译整个文件夹下的所有JS脚本，并将所有转译结果都保存在目标文件夹中：
npx babel input_file_name -d output_file_name
npx babel input_file_name --out-dir output_file_name
```

## babel.config.json

用于控制 Babel 的行为的文件，下述文件都可以控制 Babel 的行为，只要选用其一即可：

- `babel.config.json` ，还支持其他文件扩展名，比如 `.js` 、 `.cjs` 、 `.mjs` 。
- `xxx.babelrc.json` ，还支持其他文件扩展名，比如 `.babelrc` 、 `.js` 、 `.cjs` 、 `.mjs` 。
- `package.json` 的 `"babel"` 字段。

## FF27

[Firefox 27 下载地址](https://ftp.mozilla.org/pub/firefox/releases/27.0.1/)

安装完成后，最好禁用浏览器的自动更新： `选项（左上角） => 高级 => 更新` 。

## 参考资料

- [Babel 7 - 姜瑞涛](https://www.jiangruitao.com/babel/)
- 《Webpack + Babel 入门与实例详解》
