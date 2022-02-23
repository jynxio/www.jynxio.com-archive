# 常用命令

```js
# npm
npm -v                          // 查询版本
npm install --global npm@latest // 升级版本：最新稳定版
npm install --global npm@next   // 升级版本：最新测试版
npm config get [key]
npm config get prefix
npm config get cache
npm config set key=value
npm config set prefix="D:\nodejs\node_global"
npm config set cache="D:\nodejs\node_cache"

# 源
npm config get registry                                   // 查询源
npm config set registry="https://registry.npmmirror.com"  // 换源

# 包
npm install [--global] --save-prod <packagename[@tag|version]> // 下载生产包
npm install [--global] --save-dev <packagename[@tag|version]>  // 下载开发包
npm uninstall [--global] <packagename>                         // 卸载包
npm undate [--global] <packagename>                            // 升级包

# 查看项目依赖
npm [--all] ls

# 查看包
npm view <packagename> [<key>]  // 查看包的字段信息
npm view <packagename> version  // 查看包的最新版本
npm view <packagename> versions // 查看包的所有版本
```



# 更新

​		安装 node.js 时，推荐使用最新的 LTS 的安装包，因为它内置了全局的 npm 。

> 注：我不确定其它版本的 node.js 安装包是否也会内置 npm，所以无论你最终使用了哪个版本的安装包，都最好在安装完成后检查一下是否有 npm 。

​		执行下述命令，可以查询本机的 npm 版本号：

```
npm -v
```

​		执行下述命令，可以查询 npm 的最新版本号：

```
npm view npm version
```

​		执行下述命令，可以将本机的 npm 更新至最新稳定版：

```
npm install -g npm@latest
```

​		执行下述命令，可以将本机的 npm 更新至最新测试版：

```
npm install -g npm@next
```



# 公共包

> 注：
>
> 1. npm 的公共注册表是一个存储所有 JS 包的数据库；
> 2. npm 的公共命名空间记录了所有公共包的名称，且公共命名空间下的每个命名都必须是独一无二的；

​		我们可以创建并发布公共包（public packages）以供他人或自己使用，公共包分为 2 类：

- Unscoped：
  将一个包发布在公共注册表中，这个包的名称将会占据公共命名空间的一个命名，可以通过包名直接下载该包。
  譬如，Babel 6 在全局注册表发布的 2 个包：

  ```
  core-js
  regenerator-runtime
  ```

- Scoped     ：
  将一个或多个包发布在公共注册表中，这一个或多个包只会只会占据公共命名空间的一个名称，这相当于把公共命名空间的一个命名当作一个新的命名空间，这一个或多个包的名称都被记录在新命名空间下，新命名空间就相当于一个域（scoped）。
  将一系列相关的包都发布在同一个名命名空间下，可以凸显这一系列包的联系，也节省了公共命名空间，还避免了与其它公共包发生命名冲突或被恶意抢注命名。
  譬如， Babel 7 将所有的包都发布在一个名为 `babel` 的域下，这些包都具有 `@babel/` 的前缀：

  ```
  @babel/cli
  @babel/core
  @babel/preset-env
  ```



# 私有包

​		私有包仅为付费用户与组织用户提供，本文不介绍。



# 创建 package.json

​		package.json 文件用于描述项目的依赖情况和项目的版本情况。

​		package.json 文件必须包含属性 `name` 和 `version` ：

-  `name`        ：用于描述包名的字符串。只使用小写，只能使用一个词，不能使用空格，可以使用 `-` 和 `_` ；
-  `version` ：用于描述版本的字符串。版本控制必须遵循《语义化版本控制规范》；

```json
{
    "name": "my_package",
    "version": "1.0.0"
}
```

> 注：这两个字段是必需的，但不是强制的，许多的包和项目都没有这两个字段，这不是良好的实践。



​		执行下述命令，将以问卷调查的形式来创建一个 package.json 文件，文件会被保存在当前文件夹内：

```
npm init
```



​		执行下述命令，将创建一个具有默认值的 package.json 文件，默认值提取自当前文件夹的信息，文件被保存在当前文件夹内：

```
npm init --yes
```

```
npm init -y
```



# 安装本地包

​		执行下述命令，将会下载指定的 unscoped 包，并将其存储在当前文件夹下的 node_modules 文件夹内（若没有 node_modules 文件夹，则会自动创建一个）。

```
npm install <packagename>
```



​		执行下述命令，将会下载指定的 scoped 包，并将其存储在当前文件夹下的 node_modules 文件夹内（若没有 node_modules 文件夹，则会自动创建一个）。

```
npm install <@scopename/packagename>
```



​		执行下述命令，将会根据本地文件夹下的 package.json 文件的信息，来下载所有的指定包（包括 unscoped 包和 scoped 包） ，并将其存储到当前文件夹下的 node_modules 文件夹内（若没有 node_modules 文件夹，则会自动创建一个）。

```
npm install
```

> 注：
>
> 对于 `npm install packagename` 和 `npm install @scepename/packagename` ：
>
> 1. 如果当前文件夹下，没有 package.json 文件，则会下载最新版的指定包；
> 2. 如果当前文件夹下，存在 package.json 文件，且 package.json 文件没有声明指定包，则会下载最新版的指定包；
> 3. 如果当前文件夹下，存在 package.json 文件，且 package.json 文件声明了指定包，则会根据声明信息来下载满足某条件（见《包的更新规则》）的最新版的指定包；
>
> 对于 `npm install` ：
>
> 1. 如果当前文件夹下，没有 package.json 文件，就不会下载任何包；
> 2. 如果当前文件夹下，存在 package.json 文件，就会根据 package.json 文件的信息来下载所有的指定包，所有指定包的版本满足某条件（见《包的更新规则》）。



​		执行下述命令，将会下载指定版本的指定包（包括 unscoped 包和 scoped 包），并将其存储到当前文件夹下的 node_modules 文件夹内（若没有 node_modules 文件夹，则会自动创建一个）。

```
npm install <packagename@version>
```

```
npm install <@scopename/packagename@version>
```

​		譬如：

```
npm install --save-dev @babel/core@7.0.0
```



# 安装全局包

​		见《 npm install 》



# 更新本地包

​		见《 npm update 》。



# 更新全局包

​		见《 npm update 》。



# 包的更新规则

​		命令 `npm install` 和命令 `npm update` 都可以对包进行更新，不过它们的具体行为有不少差异，详见《安装本地宝》、《安装全局包》、《更新本地包》、《更新全局包》。

​		包的更新行为取决于包在 `package.json` 文件中的声明方式，主要有 3 种声明方式：

- 精确的版本号，如 `1.0.0`
- 脱字符版本号，如 `^1.0.0`
- 波浪号版本号，如 `~1.0.0`

​		若包在 `package.json` 文件中被声明为 `^非零号版本` ，则包的更新行为表现为：在主版本号不变的前提下，更新至最新版；

​		若包在 `package.json` 文件中被声明为 `~非零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版；

​		若包在 `package.json` 文件中被声明为 `零号或非零号版本` ，则包的更新行为表现为：无法更新，版本号锁死；

​		若包在 `package.json` 文件中被声明为 `^零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版；

> 注：
>
> 1. 零号版本代表 `0.y.z` ，非零号版本代表 `>=1.0.0` 。
> 2. 若包未被 `package.json` 文件声明，则包会更新至最新版。



# 源管理

​		执行下述命令，可以查询 npm 的下载源：

```
npm config get registry
```

​		执行下述命令，可以修改 npm 的下载源，此后 npm 将从此新源下载所有包（既包括本地宝，也包括全局宝）：

```
npm config set registry 新源地址
```



​		国内网络环境下，淘宝源的下载速度比官方源（原始源）的更快，下文将描述如何换至淘宝源：

```
> npm config get registry

打印
https://registry.npmjs.org

> npm config set registry https://registry.npm.taobao.org
> npm config get registry

打印
https://registry.npm.taobao.org
```

> 注：淘宝源的更新频率为 10 分钟。



# 文件结构

​		该节使用的所有例子都假定：① 本机使用 Windows 系统；② node.js 被安装至 `D:\nodejs` 文件夹中；③ 在 `E:\web` 文件夹中打开命令行 ；

**prefix：**

​		是指 `node_modules` 文件夹的父文件夹。对于本地环境，它是打开命令行窗口的那个文件夹。对于全局环境，它是 `npm` 的安装文件夹。比如：

1. 本地环境的 `prefix` 就是 `E:\web` ；
2. 全局环境的 `prefix` 就是 `D:\nodejs\node_modules\npm` ；

**root：**

​		是指 `node_modules` 文件夹。

**executables：**

​		是指存储可执行程序的文件夹，比如：

- 本地环境的 `executables` 就是 `E:\web\node_modules\.bin` ；
- 全局环境的 `executables` 就是 `D:\nodejs\node_modules\npm\bin`



# npm-shrinkwrap.json

​		该文件由命令 `npm shrinkwrap` 创建，它等同于 `package-lock.json` ，不同处是它可以被包含在发布的包中。

​		等待完善 https://docs.npmjs.com/cli/v7/configuring-npm/npm-shrinkwrap-json



# package.json

​		等待完善 https://docs.npmjs.com/cli/v7/configuring-npm/package-json



# package-lock.json

​		等待完善 https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json



# React

​		创建 React 工程的流程（复制自旧笔记，期待将来完全更新它）：

1. 进入工程文件夹
2.  `npx create-react-app firstReactApp` 
3.  `cd firstReactApp` 
4.  `npm start` 开始使用
5.  `npm run build` 打包



# 所有命令

- [√] ：你将会用到该命令，你学习了该命令
- [×]  ：你不会用到该命令，你未学习该命令
- [~]  ：你将会用到该命令，你未学习该命令
- [?]   ：完全未知



## [√] npm

​		npm 是 node.js 运行时的包管理工具，用于发布、查询、安装、卸载、更新包。

​		npm 命令有 2 种模式：本地模式、全局模式。npm 命令会默认使用本地模式，若想使用全局模式，则需要使用 `-g` 或 `--global` 。



## [√] npm init

**描述：**

​		执行该命令将以问卷调查的形式来创建一个 package.json 文件，若该命令具有 `--yes` 后缀，则会直接创建一个具有默认值得 package.json 得文件。

**语法：**

```
npm init [--yes | -y]
```

​		package.json 的默认值如下：

- `name`                ：当前文件夹的名字
- `version`         ：`"1.0.0"`
- `description`：`""` 或 README.md 文件的第一行的内容
- `main`                ：`"index.js"`
- `scripts`         ：
- `keywords`       ：`[]`
- `author`           ：`""`
- `license`         ：`"ISC"`



## [√] npm install

**描述：**

​		下载指定包，并下载指定包的依赖包。假如当前目录下存在 `npm-shrinkwrap.json` 或 `package.json` 或 `yarn.lock` 中的任意一个文件时，该命令将按照文件的描述信息来执行下载任务。

​		当这 3 个文件同时存在时，只有一个文件会发挥作用，它们的优先级如下：

1.  `npm-shrinkwrap.json` 
2.  `package.json` 
3.  `yarn.lock` 

**语法：**

```
npm install
npm install <packagename>
npm install <packagename@tag>
npm install <packagename@version>
```

**`npm install` ：**

​		根据 `package.json` 文件来下载包，并将包存储至当前文件夹下的 `node_modules` 文件夹内。

**`npm install <packagename>` ：**

​		下载指定包。

**`npm install <packagename@tag>` ：**

​		下载指定标签的指定包。

**`npm install <packagename@version>` ：**

​		下载指定版本的指定包。

**参数：**

​		以下参数可以组合使用。

| 参数名            | 简写 | 描述                                                         |
| ----------------- | ---- | ------------------------------------------------------------ |
| `--global`        | `-g` | 在全局环境下执行命令（该参数与 `--no-save` 组合使用时， `--no-save` 会被忽略） |
| `--save-prod`     | `-P` | 下载的包将作为生产包，对应 `dependencies`                    |
| `--save-dev`      | `-D` | 下载的包将作为开发包，对应 `devDependencies`                 |
| `--save-optional` | `-O` | 下载的包将作为可选包，对应 `optionalDependencies`            |
| `--save-exact`    | `-E` | 使用精确的版本号（如 `1.0.0` ），而非脱字符版本号（如 `^1.0.0` ） |
| `--no-save`       |      | 不会更新 `package.json` 、 `package-lock.json` 、 `npm-shrinkwrap.json` |

> **禁用 `--save` **：
>
> ​		根据官方文档的描述， `npm install --save x` 和 `npm install --save-prod x` 的作用是完全一样的，基于下述 2 个原因，推荐使用 `--save-prod` ：
>
> ① `--save-prod` 和 `--save-dev` 的格式一致；
>
> ② `npm install` 和 `npm uninstall` 的 `--save` 的意义不相同，前者的意义是 ”自动更新相关文件，并将该包标记为 dependencies “ ，后者的意义是 “自动更新相关文件“ 。
>
> ​		请忘掉 `npm install` 和 `npm uninstall` 拥有 --save 参数，只要记住它们都有 `--no-save` 参数就好，这样它们的行为就会更统一：它们都默认会更新相关文件，除非主动指定了 `--no-save` 参数。



**示例：**

- 执行下述命令会下载一个包，并将该包作为生产包，自动更新 `package.json` 文件的 `dependencies` 字段

  ```
  npm install --save-prod <packagename>
  ```

- 执行下述命令会下载一个包，并将该包作为开发包，自动更新 `package.json` 文件的 `devDependencies` 字段

  ```
  npm install --save-dev <packagename>
  ```

- 执行下述命令会下载一个包，并将该包作为可选包，自动更新 `package.json` 文件的 `optionalDependencies` 字段

  ```
  npm install --save-optional <packagename>
  ```

- 执行下述命令会下载一个包，并将该包作为生产包，自动更新 `package.json` 文件的 `dependencies` 字段

  ```
  npm install --save-prod --save <packagename>
  ```

- 执行下述命令会下载一个包，并将该包作为生产包，不会自动更新 `package.json` 文件的 `dependencies` 字段

  ```
  npm install --save-prod --no-save <packagename>
  ```

- 执行下述命令会下载一个包，并将该包作为生产包，自动更新 `package.json` 文件的 `dependencies` 字段，并使用精确的版本号。

  ```
  npm install --save-prod --save-exact <packagename>
  ```

- 执行下述命令会下载一个指定标签的包，并将该包作为生产包，自动更新 `package.json` 文件的 `dependencies` 字段。如果该包没有该标签，则此操作失败。比如

  ```
  npm install @babel/core@latest
  ```

- 执行下述命令会下载一个指定版本的包，并将该包作为生产包，自动更新 `package.json` 文件的 `dependencies` 字段。如果该包没有该版本，则此操作失败。比如

  ```
  npm install @babel/core@7.0.0
  ```



## [√] npm uninstall

**描述：**

​		删除一个包和该包的所有依赖，这个命令会更新 `package.json` 、 `package-lock.json` 、 `npm-shrinkwrap.json` 。

**语法：**

```
npm uninstall <packagename>
```

**参数：**

| 参数名      | 简称 | 描述                                                         |
| ----------- | ---- | ------------------------------------------------------------ |
| `--global`  | `-g` | 在全局环境下执行命令（该参数与 `--no-save` 组合使用时， `--no-save` 会被忽略） |
| `--save`    | `-S` | 自动更新 `package.json` 、 `package-lock.json` 、 `npm-shrinkwrap.json` ，默认启用 |
| `--no-save` |      | 不会更新 `package.json` 、 `package-lock.json` 、 `npm-shrinkwrap.json` |



## [√] npm update

**描述：**

​		遵照《包的更新规则》来更新所有的包或指定的包，它还会补齐缺失的包。

**语法：**

```
npm update               // 更新所有的包
npm update <packagename> // 更新指定的包
```

**参数：**

-  `--global` ：简写 `-g` ，在全局环境下执行命令。



## [√] npm ls

**描述：**

​		打印所有包的信息。

**语法：**

```
npm ls
```

> 注： `npm list` 是它的别名。

**参数：**

-  `--all` ：不仅仅会打印所有包的信息，还会打印所有包的依赖包。
-  `--json` ：打印格式为 json 文件格式。



## [√] npm view

**描述：**

​		打印包的信息。

**语法：**

```
npm view <packagename> [<key>]
```

**参数：**

-  `--json` 

**示例：**

​		执行下述命令，打印一个包的信息。

```
npm view @babel/core
```

​		执行下述命令，打印一个包的最新版本：

```
npm view @babel/core version
```

​		执行下述命令，打印一个包的所有版本：

```
npm view @babel/core versions
```

​		执行下述命令，打印一个包的生产依赖：

```
npm view @babel/core dependencies
```



## [√] npm config

**描述：**

​		管理 npm 的配置。  npm 将配置存储为 `.npmrc` 文件，通过阅读该文件或执行下述命令，就可以观察到配置情况，通过修改该文件或执行下述命令，就可以修改配置。配置文件分为本地环境的配置文件和全局环境的配置文件。

**语法：**

```
npm config set key=value [key=value ...]
npm config get [key ...]
npm config delete key [key ...]
npm config list
npm config edit
npm set key=value [key=value ...]
npm get [key ...]
```

> 注：`config` 可简写为 `c`

**SET：**

​		以键值对的形式来修改一个或多个参数，若省略了 value ，则会将属性设置为空字符串。

```
npm config set key=value [key=value ...]
npm set key=value [key=value ...]
```

> 注： `npm config set key value` 等价于 `npm config set key=value` ，保留前一种写法是为了向下兼容，不建议使用。

**GET：**

​		查询一个或多个参数，并将查询结果输出至命令行窗口。若只查询一个参数，则输出一个结果；若查询多个参数，则输出多个结果，结果将附带 key 为前缀；若查询零个参数，譬如 `npm config get` ，则完全等价于 `npm config list` 。

```
npm config get [key ...]
npm get [key ...]
```

**LIST：**

​		打印所有配置参数，使用 `--json` 来显示 JSON 格式的所有配置参数，使用 `-l` 来显示 JSON 格式的所有默认值的配置参数。

```
npm config list [-l] [--json]
```

**DELETE：**

​		从 `.npmrc` 文件中删除指定的一个或多个属性。

```
npm config delete key [key ...]
```

**EDIT：**

​		以 `.txt` 文件格式的形式来打开本地环境或全局环境的 `.npmrc` 文件。

```
npm config edit [--global | -g]
```



## [√] npm docs

**描述：**

​		在浏览器中打开一个或多个包的使用文档。

**语法：**

```
npm docs packagename
```



## [√] npm dedupe

**描述：**

​		减少模块树中的重复。

**语法：**

```
npm dedupe
```

> 注： `dedupe` 可简写为 `ddp`

**规则：**

​		 [官方手册](https://docs.npmjs.com/cli/v7/commands/npm-dedupe#configuration) 列举了 2 个例子来阐述 `npm dedupe` 是如何减少模块树中的重复的，但是没有直接给出“如何减少模块树中的重复”的清晰定义。所以，本文也以这 2 个例子来阐述 `npm dedupe` 的用途。

**示例 1 ：**

​		假设，当前模块树的依赖情况如下述所示：

```
a
+-- b <-- depends on c@1.0.x
|   `-- c@1.0.3
`-- d <-- depends on c@~1.0.9
    `-- c@1.0.10
```

​		执行 `npm dedupe` 后，该模块树的依赖会变成下述所示：

```
a
+-- b
+-- d
`-- c@1.0.10
```

**示例 2 ：**

​		假设，当前模块树的依赖情况如下述所示：

```
a
+-- b <-- depends on c@1.0.x
+-- c@1.0.3
`-- d <-- depends on c@1.x
    `-- c@1.9.9
```

​		执行 `npm dedupe` 后，该模块树的依赖会变成下述所示：

```
a
+-- b
+-- d
`-- c@1.0.3
```



## [√] npm bin

**描述：**

​		npm 默认将可执行程序安装在名为 `.bin` 的文件夹内，该命令用于打印 `.bin` 文件夹的地址。若设置了将可执行程序安装至其它文件夹，则该命令将打印该文件夹的地址，该文件夹可以使用任意名字，如第二个示例。

**语法：**

```
npm bin [--global | -g]
```

**参数：**

-  `global` ：全局模式。 全局模式下将打印全局环境的 bin 文件夹。

**示例：**

```
> npm bin

打印
E:\web\note\practice\node_modules\.bin
```

```
> npm --global bin

打印
D:\nodejs\node_global
```



## [√] npm pkg

**描述：**

​		修改 `package.json` 文件（不会改变 `node_modules` ）。

**语法：**

```
npm pkg get key
npm pkg set key=value
npm pkg delete key
```

​		假设一个 `package.json` 文件的内容如下：

```json
{
	"dependencies": {
		"@babel/runtime": "^7.15.4"
    },
	"devDependencies": {
        "@babel/core": "^7.15.8"
    }
}
```

​		执行下述命令，可以查看 `package.json` 文件中的某个键的值：

```
> npm pkg get dependencies

打印：
{
	"@babel/runtime": "^7.15.4"
}
```

```
> npm pkg get dependencies.@babel/runtime

打印：
"^7.15.4"
```

```
> npm pkg get dependencies devDependencies

打印：
{
	"dependencies": {
		"babel/runtime": "^7.15.4"
	},
	"devDependencies": {
		"@babel/core": "&7.15.8"
	}
}
```

​		执行下述命令，可以修改 `package.json` 文件中的某个键：

```
> npm pkg set name="John"
```

> 注： `package.json` 文件中没有 `name` 字段，该命令会立即为其创建一个 `name` 字段，并将 `"John"` 作为字段值。

​		执行下述命令，可以删除 `package.json` 文件中的某个键：

```
> npm ls

打印：
+-- @babel/runtime@7.15.4
`-- @babel/core@7.15.8

> npm pkg delete dependencies
> npm ls

打印：
`-- @babel/core@7.15.8
```

> 注：该命令只会改变 `package.json` ，不会改变 `node_modules` ，因此 `@babel/runtime` 仍然存在于 `node_modules` 文件中。



## [√] npm prefix

**描述：**

​		打印 `prefix` 文件夹（关于 `prefix` 请查《文件结构》）。

**语法：**

```
npm prefix [--global | -g]
```



## [√] npm root

**描述：**

​		打印 `root` 文件夹（关于 `root` 请查《文件结构》）。

**语法：**

```
npm root [--global | -g]
```



## [√] npm shrinkwrap

**描述：**

​		将 `package-lock.json` 文件替换为 `npm-shrinkwrap.json` 文件。

**语法：**

```
npm shrinkwrap
```



## [√] npm start

**描述：**

​		执行一个预定义的脚本，该脚本被编写在 `package.json` 文件中的  `scripts` 属性中的 `start` 属性中，譬如：

```json
{
	"scripts": {
		"start": "..."
	}
}
```

**语法：**

```
npm start [-- <args>]
```



## [√] npm stop

**描述：**

​		执行一个预定义的脚本，该脚本被编写在 `package.json` 文件中的  `scripts` 属性中的 `stop` 属性中，譬如：

```json
{
	"scripts": {
		"stop": "..."
	}
}
```

**语法：**

```
npm stop [-- <args>]
```



## [√] npm test

**描述：**

​		执行一个预定义的脚本，该脚本被编写在 `package.json` 文件中的  `scripts` 属性中的 `test` 属性中，譬如：

```json
{
	"scripts": {
		"test": "..."
	}
}
```

**语法：**

```
npm test [-- <args>]
```



## [~] npx

## [~] npm restart

## [~] npm run-script

## [~] npm set-script

## [~] npm prune

## [~] npm outdated

## [~] npm doctor

## [~] npm ci

​		类似 `npm install` ，使用该命令可以让下载行为严格遵守 package-lock.json，以保证在任何地方构建的包都完全一致。

## [~] npm explain

## [~] npm cache

​		操纵包缓存。

## [~] npm find-dupes

## [~] npm help

## [~] npm help-search

## [~] npm ci

## [?] npm hook

## [×] npm deprecate

​		该命令将某个包标志为弃用状态，并向所有试图安装它的人提供一个弃用警告。

## [×] npm bugs

​		报告包的 bug 。

## [×] npm access

​		对发布的包设置访问级别。

## [×] npm adduser

​		添加注册表的用户账号。

## [×] npm audit

## [×] npm completion

​		Tab 补全（不懂）。

## [×] npm diff

## [×] npm dist-tag

## [×] npm edit

## [×] npm exec

## [×] npm explore

## [×] npm fund

## [×] npm install -ci-test

## [×] npm install-test

## [×] npm link

## [×] npm logout

## [×] npm org

## [×] npm owner

## [×] npm pack

## [×] npm ping

## [×] npm profile

## [×] npm publish

## [×] npm unpublish

## [×]  npm rebuild

## [×] npm repo

## [×] npm search

## [×] npm star

## [×] npm unstar

## [×] npm stars

## [×] npm team

## [×] npm token

## [×] npm version

## [×] npm whoami