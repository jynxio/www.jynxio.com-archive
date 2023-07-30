# Webpack 5 基础

## 废弃

我已转向 Vite，故该文不再维护。

## 概念

### entry

`entry` 属性用于指定入口文件，默认值是 `./src/index.js` 。

```js
module.exports = {
    entry: "./src/index.js"
}
```

### output

`output` 属性用于指定 bundle 的输出地址及命名，默认值是 `./dist/main.js` ，其他生成文件默认放置在 `./dist` 文件夹中。

```js
const path = require("path");

module.exports = {
    output: {
      	path: path.resolve(__dirname, "dist"),
      	filename: "bundle.js"
    }
};
```

### loader

webpack 自身只能识别 JS 和 JSON 文件，如果想让 webpack 识别其他文件，就需要使用 `loader` 。

```js
const path = require("path");

module.exports = {
		module: {
      	rules: [ {test: /\.txt$/, use: "raw-loader"} ]
    }
};
```

`loader` 有 2 个属性： `test` 和 `use` 。前者用于指定那些文件需要被处理，后者用于指定处理时应使用哪个 loader 。

上例的意思是：当 webpack 碰到 .txt 文件时，在打包它之前，先使用 `raw-loader` 处理一下。

### plugin

`loader` 用于处理某些类型的文件， `plugin` 用于执行更宽泛的任务，比如打包优化、资源管理、注入环境变量。

```js
const html_webpack_plugin = require("html-webpack-plugin");

module.exports = {
    plugins: [ new html_webpack_plugin() ]
};
```

### mode

`mode` 用于指定打包的行为，有 3 种值可选： `"development"` 、 `"production"` 、 `"none"` ，默认值时 `"production"` 。

```js
module.exports = {
    mode: "production"
};
```

### 浏览器兼容性

webpack 支持所有符合 ES5 标准的浏览器（不支持 IE8 及以下版本）。 webpack 的 `import()` 和 `require.ensure()` 需要 `Promise` ，如果目标环境不支持 `Promise` ，那么在使用 `import()` 和 `require.ensure()` 之前需要提前进行 polyfill 。

### 环境

webpack5 要求 Node.js v10.13.0+ 。



## 开发环境

`package.json`

```json

```

`webpack-dev.config.js`

```js

```



## 生产环境

`package.json`

```json

```

`webpack-dev.config.js`

```js

```



## 动态导入

学习 webpack 的 [动态导入](https://webpack.docschina.org/guides/code-splitting/) ，《现代JavaScript教程》中的 [动态导入](https://zh.javascript.info/modules-dynamic-imports) 对你会有额外帮助，也建议学完它的 3 节《模块》的内容。



## 预获取/预加载模块

🔗 https://webpack.docschina.org/guides/code-splitting/



## 缓存

浏览器会使用缓存技术来加快网站的加载速度，这带来的一个问题是，如果我们在部署新版本时不更改资源的名称，浏览器就可能会认为它没有被更新，然后继续使用它的缓存版本，这就会带来一些棘手的问题。

webpack 似乎有一套专业的 [办法](https://webpack.docschina.org/guides/caching/) 来解决它，不过为了省事我暂时先使用浏览器的 「停用缓存」功能。



## 创建 library

从这里开始学。

先看生产环境吧！



## 优化性能

### 优化通用环境的性能

一种方式是使用最新版本的 `webpack` 、 `node.js` 、 `npm` 都有助于提高构建脚本的性能。

另一种方式是让 `loader` 只作用于需要的模块，比如：

```js
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
        ],
    },
};
```

上述配置文件意味着 webpack 会对所有 js 文件都执行 babel ，更改成下述配置文件后，webpack 将只会对 source 目录下的 js 文件执行 babel 。

```js
const path = require("path");

module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: path.resolve(__dirname, "./source"),
            },
        ],
    },
};
```

### 优化开发环境的性能

 `"eval-cheap-module-source-map"` 是大多数情况下的最佳选择，它的构建速度快，且可以生成源码的行映射。

在开发环境下，应该排除一下这些工具，因为它们都只用于生产环境，对开发环境没有意义：

-  `TerserPlugin` 
-  `[fullhash] / [chunkhash] / [contenthash]` 
-  `AggressiveSplittingPlugin` 
-  `AggresiveMergingPlugin` 
-  `ModuleConcatenationPlugin` 

最小化 entry chunk

> 我不懂它，所以没有使用。

```js
module.exports = {
    // ...
    optimization: {
        runtimeChunk: true,
    },
};
```

避免额外的优化步骤

webpack 通过执行额外的算法任务来优化输出结果的体积和加载性能，这些优化适用于小型代码库，但是不适用于大型代码库，因为这些优化在大型代码库中非常耗费性能。

> 我不懂它，所以没有使用。

```js
module.exports = {
  	// ...
  	optimization: {
    	removeAvailableModules: false,
    	removeEmptyChunks: false,
    	splitChunks: false,
    },
};
```

输出结果不携带路径信息

webpack 会在输出的 bundle 中生成路径信息，如果打包的模块有数千个，那么禁用该特性可以减轻垃圾回收的压力，禁用它的方法是：

```js
module.exports = {
    // ...
    output: {
        pathinfo: false
    }
};
```

### 优化生产环境的性能

source map 相当消耗资源，而且会暴露源码的位置，如果要保护代码的安全，就应该在生产环境中禁用它，禁用后还可以提升一些构建的性能。

> 代码经 webpack 打包压缩之后，如果发生了异常，控制台是无法输出正确的代码位置的。 source map 用于解决这个问题，它是一个信息文件，它存储了代码打包前后的位置映射关系，有了它，控制台就可以正确的输出异常发生在原始代码的哪个位置了。



### 模块热更替

> 我不知道怎么使用它。

模块热更替（ HMR - hot module replacement ）是一种局部刷新技术，它的作用是：

- 保留页面的状态，哪怕重新加载过页面，比如保留复选框的选中状态；
- 只更新变更的内容；
- 如果源码的 CSS 或 JS 更新了，页面会立刻更新，其速度相当于在浏览器的调试工具中直接更改样式；
- 提升构建速度，因为只需要重新构建变更过的模块就行了；

> HMR 只适用于开发环境。



## Tree Shaking

它用来剔除无用代码，但我目前没有使用它。

