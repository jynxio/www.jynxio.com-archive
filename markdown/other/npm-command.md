# NPM 命令

## npm

npm 是 node 运行时的包管理工具，用于发布、查询、安装、卸载、更新包。npm 命令具有本地模式和全局模式，默认使用本地模式，若需激活全局模式，则需主动使用 `-g` 或 `--global`。

## npm init

### 描述

以问卷调查的形式来询问并创建 `package.json` 文件，该文件将存储在命令的执行目录下。若使用 `--yes` 参数，则会略过询问环节，直接创建一个具有默认值的 `package.json` 文件，这些默认值为：

| 字段名      | 字段值                             |
| ----------- | ---------------------------------- |
| name        | 当前文件夹的名字                   |
| version     | `"1.0.0"`                          |
| description | `""` 或 `README.md` 文件的首行内容 |
| main        | `"index.js"`                       |
| scripts     |                                    |
| keywords    | `[]`                               |
| author      | `""`                               |
| license     | `"ISC"`                            |

### 语法

```
npm init [ --yes | -y ]
```



## npm install

### 描述

`npm install xxx` 将下载指定的包（同时也会下载该包的依赖包）。`npm install` 将基于 `package.json` 或 `yarn.lock` 或 `npm-shrinkwrap.json` 来下载包，当这 3 个文件同时存在时，只有优先级最高的文件会发挥作用，它们的优先级为：`npm-shrinkwrap.json` > `package.json` > `yarn.lock`。

### 语法

```
npm install
npm install <packagename>
npm install <packagename@tag>
npm install <packagename@version>
```

### 参数

以下参数可以自由的组合使用。

| 参数              | 简写 | 描述                                                         |
| ----------------- | ---- | ------------------------------------------------------------ |
| `--global`        | `-g` | 激活全局模式，当该参数会使 `--no-save` 无效。                |
| `--save-prod`     | `-P` | 将下载的包定义为生产包，属于 `dependencies`                  |
| `--save-dev`      | `-D` | 将下载的包定义为开发包，属于 `devDependencies`               |
| `--save-optional` | `-O` | 将下载的包定义为可选包，属于 `optionalDependencies`          |
| `--save-exact`    | `-E` | 使用精确的版本号，而非脱字符版本号（默认）                   |
| `--no-save`       |      | 执行该命令后，不更新 `package.json`、`package-lock.json`、`npm-shrinkwrap.json` |

建议：请不要使用 `--save`，原因如下：

1. `npm install --save- x` 与 `npm install --save-prod x` 的作用是一样的，`--save-prod` 的优点是其与 `--save-dev` 更对仗。
2. `npm install` 和 `npm uninstall` 都有 `--save` 参数，但是它们的意义却是不相同的，前者表示“自动更新相关包的信息，并将该包标记为 dependencies”，而后者表示“自动更新相关包的信息”。
3. 请忘掉 `npm install` 和 `npm uninstall` 都拥有 `--save` 参数这件事吧，只需要记住它们都拥有 `--no-save` 参数就好了，这样子它们的行为就会更加统一：它们在默认情况下都会更新相关包的信息，使用了 `--no-save` 后它们都不会更新相关包的信息。

### 范例

```
# 下载生产包，然后更新package.json的dependencies字段
npm install --save-prod <packagename>

# 下载生产包，不更新package.json的dependencies字段
npm install --save-prod --no-save <packagename>

# 下载生产包，然后更新package.json的dependencies字段，并使用精确的版本号
npm install --save-prod --save-exact <packagename>

# 下载指定版本的生产包，然后更新package.json的dependencies字段
npm install --save-prod  @babel/core@7.0.0

# 下载指定标签的生产包，然后更新package.json的dependencies字段
npm install --save-prod @babel/core@latest

# 下载开发包，然后更新package.json的devDependencies字段
npm install --save-dev <packagename>

# 下载可选包，然后更新package.json的optionalDependencies字段
npm install --save-optional <packagename>
```



## npm uninstall

### 描述

删除指定的包（同时也会删除它的依赖包），然后更新 `package.json`、`package-lock.json`、`npm-shrinkwrap.json` 文件。

### 语法

```
npm uninstall <packagename>
```

### 参数

| 参数        | 简写 | 描述                                                         |
| ----------- | ---- | ------------------------------------------------------------ |
| `--global`  | `-g` | 激活全局模式，当该参数会使 `--no-save` 无效。                |
| `--save`    | `-S` | 更新`package.json`、`package-lock.json`、`npm-shrinkwrap.json`（默认启用） |
| `--no-save` |      | 不更新`package.json`、`package-lock.json`、`npm-shrinkwrap.json` |



## npm update

### 描述

基于《版本符号与更新规则》来更新所有的包或指定的包，同时它也会补齐缺失的包。

### 语法

```
npm update
npm update <packagename>
```



## npm ls

### 描述

打印所有的包的信息，该命令的别名是 `npm list`。

### 语法

```
npm ls
```

### 参数

| 参数     | 描述                                                   |
| -------- | ------------------------------------------------------ |
| `--all`  | 不仅打印所有的包的信息，还会打印这些包的依赖包的信息。 |
| `--json` | 基于 json 格式来打印信息。                             |



## npm view

### 描述

打印指定的包的信息。

### 语法

```
npm view <packagename>
```

### 参数

| 参数     | 描述                       |
| -------- | -------------------------- |
| `--json` | 基于 json 格式来打印信息。 |

### 范例

```
# 打印包的信息
npm view @babel/core

# 打印包的最新版本号
npm view @babel/core version

# 打印包的所有版本号
npm view @babel/core versions

# 打印包的生产依赖
npm view @babel/core dependencies
```



## npm config

### 描述

配置 npm，npm 将其配置信息存储为了 `.npmrc` 文件（本地模式与全局模式各有一份独立的配置文件）你可以通过下述命令来查询或修改 npm 的配置文件。

### 语法

```
npm config set key=value [key=value ...]
npm config get [key]
npm config delete key [key ...]
npm config list
npm config edit

npm set key=value [key=value ...]
npm get [key ...]
```

> 注：`config` 可简写为 `c`

### SET

以键值对的形式来修改一个或多个配置参数，value 缺省时，对应的 key 会被设置为空字符串。

```
npm config set key=value [key=value ...]
npm set key=value [key=value ...]
```

> 勿用 `npm config set key value`：该写法已被淘汰，其作用等价于 `npm config set key=value`，只是出于向后兼容的目的而保留。

### GET

查询一个或多个配置参数，然后将查询结果打印至命令行窗口中。当查询零个参数时（即 `npm config get`），其作用等价于 `npm config list`。

```
npm config get [key ...]
npm get [key ...]
```

### LIST

查询所有配置参数，该命令具有可选的参数 `--json`，启用该参数后，该命令将以 JSON 的格式来打印结果。

```
npm config list [--json]
```

### DELETE

删除一个或多个属性。

```
npm config delete key [key ...]
```

### EDIT

以 `.txt` 格式来打开本地或全局的配置文件。

```
npm config edit [--global | -g]
```



## npm docs

### 描述

在浏览器中打开一个或多个包的 npm 主页。

### 语法

```
npm docs packagename
```



## npm dedupe

### 描述

减少模块树中的重复，比如：

情况一：假设当前的模块树的依赖情况如下：

```
a
+-- b <-- depends on c@1.0.x
|   `-- c@1.0.3
`-- d <-- depends on c@~1.0.9
    `-- c@1.0.10
```

执行 `npm dedupe` 后，该模块树将被精简为：

```
a
+-- b
+-- d
`-- c@1.0.10
```

情况二：假设当前的模块树的依赖情况如下：

```
a
+-- b <-- depends on c@1.0.x
+-- c@1.0.3
`-- d <-- depends on c@1.x
    `-- c@1.9.9
```

执行 `npm dedupe` 后，该模块树将被精简为：

```
a
+-- b
+-- d
`-- c@1.0.3
```

### 语法

```
npm dedupe
```

> 注：`dedupe` 可简写为 `ddp`。



## npm bin

### 描述

npm 会将可执行程序安装在 `.bin` 文件下，该命令的作用是打印该 `.bin` 文件夹的地址。

### 语法

```
npm bin [--global | -g]
```

### 范例

执行下述命令，将会输出 `E:\test\node_modules\.bin`。

```
npm bin 
```

执行下述命令，将会输出 `D:\nodejs\node_global`。

```
npm bin --global
```



## npm pkg

### 描述

增删改查 `package.json` 文件，但不会更改 `node_modules` 文件中的内容。

### 语法

```
npm pkg get key
npm pkg set key=value
npm pkg delete key
```

### 范例 - 查询

假设 `package.json` 文件的部分内容如下：

```json
"dependencies": {
	"@babel/runtime": "^7.15.4"
},
"devDependencies": {
	"@babel/core": "^7.15.8"
}
```

执行下述命令来查询 `package.json` 中的某个属性：

```
npm pkg get dependencies // 输出 { "@babel/runtime": "^7.15.4" }
```

```
npm pkg get dependencies.@babel/runtime // 输出 "^7.15.4"
```

### 范例 - 修改

执行下述命令来修改 `package.json` 中的某个属性：

```
npm pkg set name="John"
```

由于 `package.json` 文件中并没有 `name` 字段，因此该命令会立即为其创建一个 `name` 字段，并将 `"John"` 作为其字段的值。

### 范例 - 删除

执行下述命令来删除 `package.json` 中的某个属性：

```
npm pkg delete dependencies
```



## npm prefix

### 描述

打印 `prefix` 文件的地址，`prefix` 文件是 `node_modules` 文件的父文件夹。

### 语法

```
npm prefix [--global | -g]
```



## npm root

### 描述

打印 `root` 文件的地址，`root` 文件即使 `node_modules` 文件。

### 语法

```
npm root [--global | -g]
```



## npm shrinkwrap

### 描述

将 `package-lock.json` 文件替换为 `npm-shrinkwrap.json` 文件。

### 语法

```
npm shrinkwrap
```



## npm start

### 描述

执行预定义的脚本，该脚本被编写在 `package.json` 文件中的 `script` 属性中的 `start` 属性中，比如：

```
"script": {
	"start": "node ./index.js"
}
```

### 语法

```
npm start [-- <args>]
```



## npm stop

### 描述

执行预定义的脚本，该脚本被编写在 `package.json` 文件中的 `script` 属性中的 `stop` 属性中，比如：

```
"script": {
	"stop": "node ./index.js"
}
```

### 语法

```
npm stop [-- <args>]
```



## npm test

### 描述

执行预定义的脚本，该脚本被编写在 `package.json` 文件中的 `script` 属性中的 `test` 属性中，比如：

```
"script": {
	"test": "node ./index.js"
}
```

### 语法

```
npm test [-- <args>]
```



## npm ci

### 描述

类似于 `npm install`，区别在于该命令可以让下载行为严格遵循 `package-lock.json`，以保证在任何地方构建的包都完全一致。



## npm cache

### 描述

操纵包缓存。



## npm deprecate

### 描述

将某个包标志为“弃用”，并向所有试图安装它的人提供一个弃用警告。