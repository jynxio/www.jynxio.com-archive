# Babel 7

## 简介

Babel 是一个 JS 编译器，它可以将使用了 ES6+ 特性的代码转译为可以在 ES5 环境中运行的代码。

> 注：本文将 ES6 及 ES6 之后的所有年度 ES 版本统称为 ES6+ 。

本文只介绍 Babel7 的转译功能，转译功能包括 3 部分：

- 转译语法：比如将 `箭头函数` 、 `class` 、 `async` 等新语法转译为 ES5 支持的旧语法。
- 转译接口：比如如果目标运行时不支持 `Promise` ，就将脚本中的 `Promise` 转译成目标运行时支持的语法和 API 。
- 填补接口：比如如果目标运行时不支持 `Promise` ，就像目标运行时补充 `Promise` ，这将会改变目标运行时的全局环境（比如 `window` 对象和原型链 ）。

> 巴别塔（ Tower of Babel ）：《圣经·旧约·创世纪》第 11 章记载，当时的人类联合起来兴建一座可以通天的塔，上帝为了阻止人类的计划，便打乱了人类的语言，使人类不能知晓彼此的意思，通天塔的计划便因此失败。
>
> 1. And the whole earth was of one language, and of one speech.
>
>    那时候，整个大地都使用同一种语言。
>
> 2. And it came to pass, as they journeyed from the east, that they found a plain in the land of Shinar, and they dwelt there.
>
>    一群来自东方的人迁移并定居在了 Shinar 的平原上。
>
> 3. And they said one to another, Go to, let us make brick, and burn them throughly. And they had brick for stone, and slime had they for morter.
>
>    然后他们说，让我们联合起来，烧纸砖块，并用泥浆将砖块砌在一起。
>
> 4. And they said, Go to, let us build us a city and a tower, whose top may reach unto heaven; and let us make us a name, lest we be scattered abroad upon the face of the whole earth.，
>
>    我们要建造一座城来让我们团聚在一起，还要建造一座通天之塔来让我们名扬天下。
>
> 5. And the LORD came down to see the city and the tower, which the children of men builded.
>
>    上帝来到人间看见了人类正在建造的东西。
>
> 6. And the LORD said, Behold, the people is one, and they have all one language; and this they begin to do: and now nothing will be restrained from them, which they have imagined to do.
>
>    他惊叹人类能够团结一心的建设如此浩荡的工程，他担心世上再无困难可以难倒他们。
>
> 7. Go to, let us go down, and there confound their language, that they may not understand one another's speech.
>
>    于是上帝便打乱了人类的语言，让他们无法理解彼此的意思。
>
> 8. So the LORD scattered them abroad from thence upon the face of all the earth: and they left off to build the city.
>
>    人类无法团结在一起，渐渐的，人类便分散到了世界各地，建城造塔的计划也因此告终了。
>
> 9. Therefore is the name of it called Babel; because the LORD did there confound the language of all the earth: and from thence did the LORD scatter them abroad upon the face of all the earth.
>
>    后来，那个地方被称为 Babel ，意指上帝在那里打乱了人类的语言，瓦解了人类的团结。
>
> 摘自《圣经·旧约·创世纪》的第 11 章的第 1 ~ 9 段。



## 版本

Babel 是一个以 @babel/core 为核心的工具集，每当 @babel/core 发布新版本时，整个工具集的所有包都会跟随升级至相同的版本号，即使它们的代码可能一行都没有改变。因此 Babel 的版本号即是 @babel/core 的版本号。

从 Babel 7 开始，所有的包都被放置在一个名为 `babel` 的域下，比如 @babel/cli 、 @babel/core 。而之前的每个包都在 npm 全局注册表中占用一个名称，比如 babel-cli 、 babel-core 。

本节在于厘清，因为许多文章将 Babel 6 和 7 混为一谈了。



## 最佳实践

### 适用于项目

该方案的特点：

- 默认的目标运行时是 ES5 ，如果你确定目标运行时的版本，请修改 `targets` 为你的目标运行时，这有助于减小包的体积。
- 按需转译语法，目标运行时不支持的语法会被降级成目标运行时支持的语法。
- 使用语法辅助函数模块。
- 按需填补接口，在全局环境中填补目标运行时所不支持的且被脚本使用到了的 ES6+ API 。

> 在使用之前，请将依赖包更新至彼时的最新版，并修改 `@babel/preset-env` 的 `corejs` 参数和 `@babel/plugin-transform-runtime` 的 `version` 参数。

`babel.config.json` 内容如下：

```json
{
    "presets": [[
        "@babel/preset-env",
        {
            "targets": {},
            "useBuiltIns": "usage",
            "corejs": "3.20.1"
        }
    ]],
    "plugins": [[
        "@babel/plugin-transform-runtime",
        {
            "helpers": true,
            "corejs": false,
            "regenerator": false,
            "version": "^7.16.5"
        }
    ]]
}
```

对应的 `package.json` 内容如下：

```json
{
    "devDependencies": {
        "@babel/cli": "^7.16.0",
        "@babel/core": "^7.16.5",
        "@babel/plugin-transform-runtime": "^7.16.5",
        "@babel/preset-env": "^7.16.5"
    },
    "dependencies": {
        "core-js": "^3.20.1",
        "regenerator-runtime": "^0.13.9",
	      "@babel/runtime": "^7.16.5"
    }
}
```

### 适用于项目与库

该方案的特点：

- 默认的目标运行时是 ES5 ，如果你确定目标运行时的版本，请修改 `targets` 为你的目标运行时，这有助于减小包的体积。
- 按需转译语法，目标运行时不支持的语法会被降级成目标运行时支持的语法。
- 使用语法辅助函数模块。
- 按需转译接口，脚本中所有与 ES6+ API 相关的代码都会被转译成由 ES5 的语法和 API 组成的代码。
- 使用接口辅助函数模块。

> 在使用之前，请将依赖包更新至彼时的最新版，并修改 `@babel/plugin-transform-runtime` 的 `version` 参数。

`babel.config.json` 内容如下：

```json
{
    "presets": [[
        "@babel/preset-env",
        {
            "targets": {}
            "useBuiltIns": false
        }
    ]],
    "plugins": [[
        "@babel/plugin-transform-runtime",
        {
            "helpers": true,
            "corejs": 3,
            "regenerator": true,
            "version": "^7.16.5"
        }
    ]]
}
```

对应的 `package.json` 内容如下：

```json
{
    "devDependencies": {
        "@babel/cli": "^7.16.0",
        "@babel/core": "^7.16.5",
        "@babel/plugin-transform-runtime": "^7.16.5",
        "@babel/preset-env": "^7.16.5"
    },
    "dependencies": {
        "@babel/runtime-corejs3": "^7.16.5"
    }
}
```



## 如何转译语法

是指将脚本中的所有语法都转译成目标运行时所支持的语法，分为 2 种情况：

- 完全转译：将脚本中出现的所有 ES6+ 语法都转译为 ES5 语法。
- 按需转译：根据目标运行时的情况，将脚本中不受支持的语法转译为受支持的语法，目标运行时不一定是 ES5 环境。

### 完全转译

将脚本中出现的所有 ES6+ 语法都转译为 ES5 语法。

`@babel/preset-env` 存储了将所有的 ES6+ 语法转译为 ES5 语法的转换规则，我们将借助它来实现完全转译，示例代码是《完全转译》。步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [["@babel/preset-env"]]
   }
   ```

3. 创建待转译的文件 `a.js` ，它使用了箭头函数，我们希望将箭头函数转译为普通函数， `a.js` 的内容如下：

   ```js
   const f = _ => console.log( 1 );
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译成功， `b.js` 是转译的结果，它的内容如下：

   ```js
   "use strict";
   
   var f = function f(_) {
     return console.log(1);
   };
   ```

### 按需转译

根据目标运行时的情况，将脚本中不受支持的语法转译为受支持的语法，目标运行时不一定是 ES5 环境。

`@babel/preset-env` 的 `targets` 参数用于描述目标运行时的情况，Babel 就会自动识别出脚本中的哪些语法是不受目标运行时支持的，然后将这些语法转译为目标运行时所支持的语法。

比如，如果脚本使用了箭头函数和数值分隔符这 2 种语法，且目标环境是 chrome 60 的话， Babel 就只会转译数值分隔符语法，而不会转译箭头函数语法，因为 chrome 从 45 版本开始就支持了箭头函数语法，从 75 版本开始才支持数值分隔符语法。示例代码是《按需转译》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": "chrome 60"
           }
       ]]
   }
   ```

3. 创建待转译的文件 `a.js` ，它使用了箭头函数语法和数值分隔符语法， `a.js` 的内容如下：

   ```js
   const f = _ => console.log( 1_000_000 );
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译成功， `b.js` 是转译的结果，它的内容如下：

   ```js
   "use strict";
   
   const f = _ => console.log(1000000);
   ```

   果然，数值分隔符语法被转译了，而箭头函数语法被保留了。

### 语法辅助函数

某些语法的转译结果是很简洁的，比如箭头函数：

```js
// 转译前
const p = _ => {};
// 转译后
const p = function(_) {};
```

但是另一些语法的转译结果则可能很复杂，比如 `class` 语法：

```js
// 转译前
class A {}
// 转译后
"use strict";
function _defineProperties() { /* 省略 */ }
function _createClass() { /* 省略 */ }
function _classCallCheck() { /* 省略 */ }
var A = _createClass(function A() { _classCallCheck(this, A); });
```

这是因为 Babel 需要编写较多的代码才能模拟出 `class` 语法的功能，另外 Babel 还将模拟代码中可复用的部分抽象成了函数，比如上例中的 `_defineProperties` 、 `_createClass` 、 `_classCallCheck` ，这些函数被称为「语法辅助函数」，它们会被写在转译结果文件的头部。将可复用的模拟代码抽象成语法辅助函数，可以减轻转译结果文件的体积，比如如果一个脚本使用了 10 次 `class` 语法，转译后的模拟代码中也只会有 1 个 `_defineProperties` 、 1 个 `_createClass` 、 1 个 `_classCallCheck` 。

直接写在转译结果文件中的语法辅助函数被称为「内联语法辅助函数」。

如果一个项目有 10 个模块，且每个模块都使用了 `class` 语法，那么该项目在转译后就会产生 10 个相同的 `_defineProperties` 、 `_createClass` 、 `_classCallCheck` 。只要激活 `@babel/plugin-transform-runtime` 的 `helpers` 特性，就可以避免产生这些冗余代码，它的大致原理是： Babel 将每个语法辅助函数都编写成独立的模块，称为「语法辅助函数模块」，所有语法辅助函数模块都被存储在 `@babel/runtime` （或它的加强包）中，激活 `@babel/plugin-transform-runtime` 的 `helpers` 特性后， Babel 在转译语法时就会使用语法辅助函数模块来替换内联语法辅助函数，这样项目中的所有脚本都会共用同一套语法辅助函数模块，自然而然的打包后的 bundle 文件也就不会产生上述冗余代码了。

示例代码时《语法辅助函数》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/plugin-transform-runtime": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       },
       "dependencies": {
           "@babel/runtime": "^7.16.5"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   class A {}
   ```

3. 创建 `babel-no-helpers.config.json` 和 `babel-use-helpers.config.json` 文件，前者表示禁用 `helpers` 特性，后者表示激活 `helpers` 特性，这是为了对比观察使用内联语法辅助函数和使用语法辅助函数模块的区别。

   `babel-no-helpers.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"],
       "plugins": [[
           "@babel/plugin-transform-runtime",
           {
               "helpers": false,
               "corejs": false,
               "regenerator": false,
               "version": "^7.16.5"
           }
       ]]
   }
   ```

   `babel-use-helpers.config.json` 内容如下：

   ```js
   {
       "presets": ["@babel/preset-env"],
       "plugins": [[
           "@babel/plugin-transform-runtime",
           {
               "helpers": true,
               "corejs": false,
               "regenerator": false,
               "version": "^7.16.5"
           }
       ]]
   }
   ```

4. 分别使用 `babel-no-helpers.config.json` 和 `babel-use-helpers.config.json` 来进行语法转译， npm 命令如下：

   ```
   npx babel a.js -o noHelpers.js --config-file ./babel-no-helpers.config.json
   npx babel a.js -o useHelpers.js --config-file ./babel-use-helpers.config.json
   ```

5. 转译成功，获得 `noHelpers.js` 和 `useHelpers.js` 。

   `noHelpers.js` 内容如下：

   ```js
   "use strict";
   
   function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
   
   function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
   
   function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
   
   var A = /*#__PURE__*/_createClass(function A() {
     _classCallCheck(this, A);
   });
   ```

   `useHelpers.js` 内容如下：

   ```js
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
   
   var A = /*#__PURE__*/(0, _createClass2["default"])(function A() {
     (0, _classCallCheck2["default"])(this, A);
   });
   
   ```

   

## 如何填补接口

如果目标运行时不支持某些 API ，就向目标运行时补充这些 API ，这将会改变目标运行时的全局环境和原型链，这分为 2 种情况：

- 完全填补：帮目标运行时补齐所有的 ES6+ API ，哪怕目标运行时已经支持了部分的 ES6+ API 。
- 按需填补：补齐目标运行时缺失的所有 ES6+ API ，或者补齐目标运行时缺失的且被脚本使用到了的 ES6+ API 。

> 如果目标运行时已经支持了 `Promise`   ，再进行「完全填补」的话，人造的 `Promise` 会不会替换掉天生的 `Promise` 呢？
>
> 如果目标运行时缺失了 ES5 的 API ， Babel 能填补吗？换言之 Babel 到底能填补多低级的 API 呢？

另外，如果我们希望可以在不污染全局环境的前提下，就让使用了 ES6+ API 的脚本可以在不支持 ES6+ API 的运行时中正常运行，就需要使用 Babel 提供的「接口转译」特性，详见《如何转换接口》。

### 完全填补

帮目标运行时补齐所有的 ES6+ API ，哪怕目标运行时已经支持了部分的 ES6+ API 。

如果想帮目标运行时补齐所有 ES6+ API ，只需要将 ES6+ API 的 polyfill 文件和你的脚本打包在一起就可以了。

ES6+ 的 polyfill 文件共有 3 种：

- `polyfill.js` 文件
- `@babel/polyfill`
- `core-js` & `regenerator-runtime`

本小节的底部阐述了它们的异同，简而言之如果你想做「完全填补」，只推荐使用 `core-js` & `regenerator-runtime` 。

使用 `polyfill.js` 来做完全填补的示例代码是《polyfilljs》。

使用 `@babel/polyfill` 来做完全填补的示例代码是《@babelpolyfill》。

使用 `core-js` `regenerator-runtime` 来做完全填补的示例代码是《core-js&regenerator-runtime》。本小节只演示此示例，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，它使用了 `Promise` 和 `Promise.resolve` API ，但是 Firefox 27 并不支持它们，我们期望可以补齐 Firefox 27 所缺失的所有 ES6+ API ，以使它可以正常运行 `a.js` ， `a.js` 内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   Promise.resolve( 1 ).then( v => console.log( v ) );
   ```

   > `core-js` 和 `regeneratpr-runtime` 的引入没有先后顺序要求。

3. 执行打包，将 `a.js` 和它所依赖的 `core-js` 还有 `regenerator-runtime` 打包在一起， npm 命令如下：

   ```
   npx webpack ./a.js -o ./b --mode production
   ```

4. 打包成功，获得 `b/main.js` 文件，该文件包含了所有的 ES6+ polyfill 代码以及你的脚本。

5. 创建 `b.html` ，它会引用 `main.js` 文件，在 Firefox 27 中运行 `b.html` ，控制台将会输出 `1` ， polyfill 成功了！

可惜，这样子还不算是真正的「完全填补」，因为如果你的脚本中使用了 `Generator Functio` 或 `Async Function` ，它们还是没法在 Firefox 27 中正常运行。详见下下一节《特别的 Generator Function 和 Async Function》。

> `polyfill.js` 文件包含了所有的 ES6+ API 的 polyfill ，只要像下面这样将它挂载在你的 html 文件中，就会自动补齐目标运行时的 ES6+ API ：
>
> ```html
> <body>
>     <script src="polyfill.js"></script>
>     <script src="你的脚本"></script>
> </body>
> ```
>
> 哪里下载 `polyfill.js` 文件呢？下载了 `@babel/polyfill` 后，在 `node_modules/@babel/polyfill/dist` 文件夹中就可以找到 `polyfill.js` 和 `polyfill.min.js` 了。
>
> ---
>
> `@babel/polyfill` 和 `polyfill.js` 的功能是一模一样的，只是形态不同，前者是 npm 模块，后者则是独立的 JS 脚本。
>
> 从 Babel 7.4.0 （ 2019.05.19 ）开始，官方就宣布了放弃 `polyfill.js` 和 `@babel/polyfill` ，并推荐使用 `core-js` 和 `regenerator-runtime` 来作为替代。
>
> 不过 Babel 官方还在继续更新 `@babel/polyfill` 。
>
> ---
>
> `core-js` 和 `regenerator-runtime` 组合在一起就是 `@babel/polyfill` ，不过区别是 `@babel/polyfill` 使用的 `core-js` 的主版本号被锁死在了 `2` ，而目前最新的 `core-js` 的主版本号是 `3` 。 
>
> 主版本号为 2 的 `core-js` 只支持全局变量和静态属性，比如 `Promise` 和 `Array.from` ，主版本号为 3 的 `core-js` 额外支持实例属性，比如 `Array.prototype.includes` 。这就是 Babel 官方推荐使用 `core-js` 和 `regenerator-runtime` 来替代 `@babel/polyfill` 和 `polyfill.js` 的原因。
>
> `regenerator-runtime` 用于填补 `Generator Function API` 和 `Async Function API` ， `core-js` 用于填补除了它们之外的其他 ES6+ API ，所以它们要组合在一起使用才能构建出完整的 ES6+ API 环境。
>
> 如果在安装了 `core-js` 和 `regenerator-runtime` 之后再安装 `@babel/polyfill` ，那么 `@babel/polyfill` 内部的 `core-js` 和 `regenerator-runtime` 就会覆盖前者。而且主版本号为 3 的 `core-js` 文件有 `stable` 文件夹，主版本号为 2 的 `core-js` 则没有，如果不小心发生了覆盖安装，就会引发「引用错误」，因为你会在「完全填补」的示例代码中看到，我们需要通过 `import "core-js/stable"` 来使用主版本号为 3 的 `core-js` 。



### 按需填补

如果激活了 `@babel/preset-env` 的 `useBuiltIns` 属性， Babel 就会按需填补目标运行时所需的接口，具体来说就是 Babel 会自动解析 `core-js` 和 `regenerator-runtime` 。

Babel 会自动的从 `core-js` 中筛选出真正需要的接口模块，然后将它们导入到脚本中去。另外，如果目标运行时需要填补 Generator Function API 或 Async Function API ，Babel 就会将 `regenerator-runtime` 导入到脚本中去，否则就不会将 `regenerator-runtime` 导入到脚本中去。

Babel 通过 `@babel/preset-env` 的 `targets` 字段来了解目标运行时的状态，这样才知道目标运行时缺少什么 ES6+ API 。

Babel 通过 `@babel/preset-env` 的 `corejs` 字段来了解项目所依赖的 `core-js` 的版本。因为“知道 `core-js` 里面有什么接口模块”是“从 `core-js` 中筛选出真正需要的接口模块”的前提，而且不同版本的 `core-js` 之间的内容是有区别的，所以如果 Babel 想要知道项目依赖的 `core-js` 里面有什么，就需要知道它的版本号。

最后， Babel 通过 `@babel/preset-env` 的 `useBuiltIns` 字段来确定按需填补的类型：

- `useBuiltIns: false` ：不激活按需填补特性。
- `useBuiltIns: "entry"` ：激活按需填补特性， Babel 会补齐目标运行时所缺失的所有 ES6+ API ，这被称为「entry填补」
- `useBuiltIns: "usage"` ：激活按需填补特性， Babel 会补齐目标运行时所缺失的且被脚本使用到了的 ES6+ API ，这杯称为「usage填补」。

> Babel 不仅仅可以解析 `core-js` 和 `regenerator-runtime` ，也可以解析 `@babel/polyfill`， 因为 `@babel/polyfill` 已经被废弃了，所以不展开介绍。

#### entry填补

Babel 会从 `core-js` 中筛选出目标运行时所缺少的 ES6+ API 的接口模块，然后导入到脚本中去。如果目标运行时还缺少 Generator Function API 或 Async Function API ， Babel 还会将 `regenerator-runtime` 导入脚本。示例代码是《entry》，步骤如下：

> 如果想要激活「entry填补」特性，还必须在脚本中显式书写 `import "core-js/stable"` 和 `import "regenerator-runtime/runtime"` 。

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   ```

3. 创建 `babel-chrome-90.config.json` 和 `babel-chrome-95.config.json` ，它们的唯一区别是，前者的目标环境是 chrome 90 ，后者的则是 chrome 95 。

   `babel-chrome-90.config.josn` 内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": "chrome 90",
               "useBuiltIns": "entry",
               "corejs": "3.20.1"
           }
       ]]
   }
   ```

   `babel-chrome-95.config.json` 内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": "chrome 95",
               "useBuiltIns": "entry",
               "corejs": "3.20.1"
           }
       ]]
   }
   ```

4. 分别使用 `babel-chrome-90.config.json` 和 `babel-chrome-95.config.json` 来对 `a.js` 进行转译， npm 命令如下：

   ```
   npx babel a.js -o c90.js --config-file ./babel-chrome-90.config.json
   npx babel a.js -o c95.js --config-file ./babel-chrome-95.config.json
   ```

5. 转译成功，获得 `c90.js` 和 `c95.js` 。

   由于 chrome 90 和 chrome 95 都已经支持了 Generator Function API 和 Async Function API ，所以 `c90.js` 和 `c95.js` 都直接移除了 `import "regenerator-runtime/runtime"` 语句。

   由于 chrome 90 比 chrome 95 缺失更多 ES6+ API ，所以 `c90.js` 会比 `c95.js` 导入更多接口模块。

   `c90.js` 内容如下：

   ```js
   "use strict";
   require("core-js/modules/es.error.cause.js");
   require("core-js/modules/es.aggregate-error.cause.js");
   require("core-js/modules/es.array.at.js");
   require("core-js/modules/es.object.has-own.js");
   require("core-js/modules/es.string.at-alternative.js");
   require("core-js/modules/es.typed-array.at.js");
   require("core-js/modules/web.dom-exception.stack.js");
   require("core-js/modules/web.immediate.js");
   require("core-js/modules/web.structured-clone.js");
   ```

   `c95.js` 内容如下：

   ```js
   "use strict";
   require("core-js/modules/web.dom-exception.stack.js");
   require("core-js/modules/web.immediate.js");
   require("core-js/modules/web.structured-clone.js");
   ```

#### usage填补

Babel 会从 `core-js` 中筛选出目标运行时所缺少的且被脚本使用到了的 ES6+ API 的接口模块，然后导入到脚本中去。如果目标运行时还缺少 Generator Function API 或 Async Function API ，且脚本也刚好使用到了 Generator Function API 或 Async Function API 的话 ， Babel 还会将 `regenerator-runtime` 导入脚本。示例代码是《usage》，步骤如下：

> 不能在脚本中显式书写 `import "core-js/stable"` 和 `import "regenerator-runtime/runtime"` 。
>
> 「usage填补」和「entry填补」的另一个区别是，「usage填补」不需要书写这两条语句就能进行按需填补，如果书写了这两条语句，这两条语句就会被直接保留下来。

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   async function f() {}
   ```

3. 配置转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": "firefox 27",
               "useBuiltIns": "usage",
               "corejs": "3.20.1"
           }
       ]]
   }
   ```

4. 执行 Babel ，npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 执行成功，获得 `b.js` ，内容如下：

   ```js
   "use strict";
   
   require("regenerator-runtime/runtime.js");
   require("core-js/modules/es.object.to-string.js");
   require("core-js/modules/es.promise.js");
   
   function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
   
   function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
   
   function f() {
     return _f.apply(this, arguments);
   }
   
   function _f() {
     _f = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
       return regeneratorRuntime.wrap(function _callee$(_context) {
         while (1) {
           switch (_context.prev = _context.next) {
             case 0:
             case "end":
               return _context.stop();
           }
         }
       }, _callee);
     }));
     return _f.apply(this, arguments);
   }
   ```

   显然，脚本中只引入了目标运行时缺失的且被脚本使用到了的 3 个 ES6+ API ，其中引入 `Promise` 的原因是 Async Function 的返回值是 `Promise` 实例。而且由于目标运行时不支持 `async` 语法，因此 Babel 也对 Async Function 进行了语法转译。

### Generator Function 和 Async Function

相比其他的 ES6+ API ， `Generator Function` 和 `Async Function` 使用了新的语法，比如 `function*` 、 `async` 等等，这些语法是无法在不支持 `Generator Function` 和 `Async Function` 的旧运行时中运行的，因此哪怕你的脚本引入了 `regenerator-runtime` ，最后也会因为旧运行时不支持这些语法而导致脚本抛出异常。

> 建议如果使用了 `regenerator-runtime` ，也要使用 `core-js` 。原因见本小节末。

解决办法是为脚本补充语法转译，本节的示例代码是《generator和async》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```js
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       }
   }
   ```

2. 创建 `a.js` 和 `b.js` ，它们的内容是一致的，并使用了 `Async Function` ，而 Firefox 27 不支持该 API 。 `a.js` 和 `b.js` 都会引入 `core-js` 和 `regenerator-runtime` ，但是只转译 `b.js` 的语法。 `a.js` 和 `b.js` 的内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   async function f() { return 1 }
   f().then( v => console.log( v ) );
   ```

3. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"]
   }
   ```

4. 对 `b.js` 执行语法转译， npm 命令如下：

   ```
   npx babel b.js -o bb.js
   ```

5. 执行打包，将 `a.js` 和 `b.js` 与它们所依赖的 `core-js` 还有 `regenerator-runtime` 打包在一起， npm 命令如下：

   ```
   npx webpack ./a.js  -o ./aa --mode production
   npx webpack ./bb.js -o ./bb --mode production
   ```

6. 打包成功，获得 `aa/main.js` 和 `bb/main.js` 文件，虽然它们都补齐了 `Async Function` 和相关的 API ，但是只有 `bb/main.js` 可以正常运行。

7. 创建 `aa.html` 和 `bb.html` ，用于检验 `aa/main.js` 和 `bb/main.js` ，在 Firefox 27 中运行，结果如下：

   `aa.html` ：抛出异常 `SyntaxError: missing ; before statement` 。

   `bb.html` ：正常运行，控制台输出 `1` 。

果然， 未经语法转译的 `aa/main.js` 无法正常运行并抛出了 `SyntaxError` ，该语法错误的成因是由于 Firefox 27 不支持 `async` 语法， 它将脚本中的 `async` 判定为独立的语句，然后 Firefox 认为脚本中的 `async function` 是错误的，正确的写法应当是 `async; function` 。

> 本节明明是在填补 `Async Function` ，可为什么需要引入 `core-js` 呢？这是因为 `Async Function` 的返回值是一个 `Promise` ，如果不引入 `core-js` ，执行时会抛出 `ReferenceError: Promise is not defined` 异常。
>
> 建议如果使用了 `regenerator-runtime` ，也要使用 `core-js` 。



## 如何转译接口

《如何填补接口》中的方法是通过修改全局环境来实现“让原本不支持 ES6+ API 的运行时支持 ES6+ API ”，大致原理是： `core-js` 模块和 `regenerator-runtime` 模块使用 ES5 的语法和 API 来在全局环境中重新生成 ES6+ API ，然后 Babel 会向你的脚本按需引入 `core-js` 和 `regenerator-runtime` 。

对于普通的项目而言，虽然填补接口会污染全局环境，但这是完全可以接受的。但是对于库而言，则是不可接受的。比如，你开发的库修改了全局环境，依赖你的库的项目也修改了全局环境，如果 2 次修改是不同的，就会导致库或项目无法正常运行。因此，库不能使用填补的方式来 polyfill 接口。

「转译接口」是另一种 polyfill 接口的方法，它会将脚本中与 ES6+ API 相关的代码转译成由 ES5 的语法和 API 组成的代码，这相当于将你的代码“降级”成了 ES5 运行时可以正常运行的代码，并且这种方法不会修改全局环境。如果库需要 polyfill 接口，就应当采用该方法。

> 代码被“降级”后，脚本中会引入一些外部模块，这些模块被称为「接口辅助函数模块」，它类似于「语法辅助函数模块」。

一个不完整的例子是：如果脚本中使用了 `Promise` ， Babel 就会导入相应的接口辅助函数模块（ `promise.js` ），然后将原代码中的 `Promise` 改成 `_promise` 。

```js
// 接口转译之后
const p = Promise;

// 接口转译之前
var _promise = require("@babel/runtime-corejs3/core-js-stable/promise");
var p = _promise;
```



具体的示例代码是《转译接口》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/plugin-transform-runtime": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       },
       "dependencies": {
           "@babel/runtime-corejs3": "^7.16.5"
       }
   }
   ```

2. 配置转译规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"],
       "plugins": [[
           "@babel/plugin-transform-runtime",
           {
               "helpers": false,
               "corejs": 3,
               "regenerator": true,
               "version": "^7.16.5"
           }
       ]]
   }
   ```

   `@babel/preset-env` 是执行接口转译的前提。

    `@babel/plugin-transform-runtime` 是执行接口转译的核心， `"helpers": false` 是指不使用语法辅助函数模块，`"corejs": 3` 是指激活接口转换特性且使用 `@babel/runtime-corejs3` 作为接口转译的原料（只转译除了 Generator Function 和 Async Function 之外的 ES6+ API ）， `"regenerator": true` 是指激活接口转译特性（只转译 Generator Function 和 Async Function ）， `"version": "^7.16.5"` 是指原料的版本号（原料是指 `@babel/runtime` 或 `@babel/runtime-corejs2` 或 `@babel/runtime-corejs3`  ）。参数的含义详见《@babel/plugin-transform-runtime》。

3. 创建 `a.js` ，内容如下：

   ```js
   async function f() {}
   ```

4. 执行接口转译和语法转译， npm 命令如下：

   ```js
   npx babel a.js -o b.js
   ```

   由于脚本使用了 `async` 语法，因此语法转译是必须的。转译接口时顺带转译语法是一个好习惯，并且这也是强制性的，因为你必须使用 `@babel/preset-env` 。

5. 转换成功，得到 `b.js` ，内容如下：

   ```js
   "use strict";
   
   var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
   
   var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
   
   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
   
   function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { _promise["default"].resolve(value).then(_next, _throw); } }
   
   function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new _promise["default"](function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
   
   function f() {
     return _f.apply(this, arguments);
   }
   
   function _f() {
     _f = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
       return _regenerator["default"].wrap(function _callee$(_context) {
         while (1) {
           switch (_context.prev = _context.next) {
             case 0:
             case "end":
               return _context.stop();
           }
         }
       }, _callee);
     }));
     return _f.apply(this, arguments);
   }
   
   ```

   `a.js` 的代码被“降级”至了 ES5 ，导入了接口辅助函数模块（ `regenerator` 和 `promise` 模块 ），插入了内联的语法辅助函数。



## 预设和插件

预设是一套预先设定好的插件组合，最常用的 4 个官方预设是： `@babel/preset-env` 、 `@babel/preset-flow` 、 `@babel/preset-react` 、 `@babel/preset-typescript` 。

插件是控制 Babel 行为的 JS 程序，比如插件 `@babel/plugin-transform-arrow-functions` 可以将箭头函数转换为普通函数。使用插件可以在更细的粒度上控制 Babel 的行为，最常用的官方插件是 `@babel/plugin-transform-runtime` 。

如果 Babel 使用了多个预设，预设的执行顺序是：沿着预设数组从后向前。

如果 Babel 使用了多个插件，插件的执行顺序是：沿着插件数组从前向后。

如果 Babel 同时使用了插件和预设， Babel 会先执行插件，后执行预设。



## @babel/preset-env

> 在 Babel6 时代，常见的预设有： `babel-preset-es2015` 、 `babel-preset-es2016` 、 `babel-preset-es2017` 、 `babel-preset-state-0` 、 `babel-preset-state-1`、 `babel-preset-state-2`  、 `babel-preset-state-3` 、 `babel-preset-latest` 。其中 `babel-preset-state-x` 是指草案阶段的 ES 语法的转译预设，目前不再更新； `babel-preset-es201x` 是指 `201x` 年新发布的 ES 语法的转译预设，目前不再更新； `babel-preset-latest` 是指 `2015-至今` 的所有 ES 语法的转译预设，目前持续更新；
>
> `@babel/-preset-env` 正是 `babel-preset-latest` 的延续与增强，它不仅仅包含所有语法的转译规则，甚至还可以按需转译语法和按需填补 API 。它在 Babel 6 时代的旧名是 `babel-preset-env` 。

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

功能 1 的示例见《语法辅助函数》，功能 2 和 3 的示例见《如何转译接口》。

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