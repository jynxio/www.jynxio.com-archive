# NPM 基础

## 常用命令

```
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
npm config set registry="https://registry.npmjs.org"      // 官方源

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



## 安装与更新

推荐安装 LTS 版本的 node.js 安装包，因为它会内置安装全局的 npm，你也可以通过执行下述命令检查 npm 的版本号，或更新 npm 的版本：

```
npm -v                    // 查看本地npm的版本号
npm view npm version      // 查看npm的最新版本号
npm install -g npm@latest // 将npm更新至最新的稳定版
npm install -g npm@next   // 将npm更新至最新的测试版
```



## 公共包

公共包（public packages）是发布在 npm 公共注册表的包，每个公共包的名称都必须是唯一的。公共包可以分为 `Unscoped` 和 `Scoped`。

`Unscoped` 表示直接将包发布在公共注册表中，该包将会占用公共命名空间的一个名称名额，我们可以直接通过该包的名称来下载它，譬如 `core-js`。

`Scoped` 表示将一至多个包都发布在公共注册表中，但是它们一起占用公共命名空间的一个名称名额，这相当于在公共命名空间中创建一个更小的命名空间，并将这些包收纳在这个更小的命名空间中，而这个更小的命名空间就相当于一个域，即 scoped。将一系列相关的包都发布在同一个域下有助于凸显它们之间的关联，同时也节省了公共命名空间，还减少了与其他公共包发生命名冲突或被恶意抢注命名的概率。譬如 Babel7 将所有的包都发布在了一个名为 `babel` 的域下，这些包都具有 `@babel/` 的前缀，比如 `@babel/cli`、`@babel/core`、`@babel/preset-env`。



## 私有包

私有包仅供付费用户与组织用户使用，本文不介绍它。



## package.json

`package.json` 文件记录了项目的依赖情况，该文件至少包含 `name` 和 `version` 字段。`name` 表示该项目的名称，其只能使用小写，且不能使用空格，不过可以使用 `-` 和 `_`，`version`表示该项目的版本，建议遵循 [Semantic Versioning 2.0.0](https://semver.org/)。

执行下述命令，将以问卷的形式来创建 `package.json` 文件，该文件会被保存在当前文件夹的根目录中。

```
npm init
```

执行下述命令，将创建一个具有默认信息的 `package.json` 文件，默认信息提取自当前文件夹，该文件会被保存在当前文件夹的根目录中。

```
npm init -y
npm init --yes
```



## 安装本地包

执行下述命令来下载指定的包，包将存储在 `node_modules` 文件夹中。

```
npm install <packagename>
npm install <@scopename/packagename>
```

执行下述命令，将会按照 `package.json` 的配置来下载包，包将存储在 `node_modules` 文件夹中。

```
npm install
```

执行下述命令，将会下载指定版本的指定包，包将存储在 `node_modules` 文件夹中。

```
npm install <packagename@version>
npm install <@scopename/packagename@version>
```

比如：

```
npm install --save-dev @babel/core@7.0.0
```



## 版本符号与更新规则

`npm install` 和 `npm update` 都可以更新包，包的更新行为取决于包在 `package.json` 文件中的声明方式，主要有 3 种声明方式：

- 精确的版本号，如 `1.0.0`
- 脱字符版本号，如 `^1.0.0`
- 波浪号版本号，如 `~1.0.0`

若包在 `package.json` 文件中被声明为 `^非零号版本` ，则包的更新行为表现为：在主版本号不变的前提下，更新至最新版。若包在 `package.json` 文件中被声明为 `~非零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版。若包在 `package.json` 文件中被声明为 `零号或非零号版本` ，则包的更新行为表现为：无法更新，版本号锁死。若包在 `package.json` 文件中被声明为 `^零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版；

> 注：零号版本是指 `0.y.z` ，非零号版本是指 `>=1.0.0` 。



## 源管理

执行下述命令来查询 npm 的下载源：

```
npm config get registry
```

执行下述命令来修改 npm 的下载源：

```
npm config set registry="https://registry.npmmirror.com"
```



## 文件结构

假定：

1. 基于 Windows 系统。
2. node.js 安装与 `D：\nodejs` 目录。
3. 在 `E:\web` 中执行命令。

### prefix

指 `node_modules` 文件夹的父文件夹。对于本地环境，它是打开命令行窗口的那个文件夹。对于全局环境，它是 `npm` 的安装文件夹。比如：

- 本地环境的 `prefix` 就是 `E:\web`。
- 全局环境的 `prefix` 就是 `D:\nodejs\node_modules\npm`。

### root

是指 `node_modules` 文件夹。

### executables

是指存储可执行程序的文件夹，比如：

- 本地环境的 `executables` 就是 `E:\web\node_modules\.bin`。
- 全局环境的 `executables` 就是 `D:\nodejs\node_modules\npm\bin`。