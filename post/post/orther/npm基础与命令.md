# NPM 常识与手册

## 命令手册

```
npm ci            // 下载包（根据package-lock.json）
npm install       // 下载包（根据package.json）
npm update        // 更新所有包
npm docs eslint   // 打开包的主页
npm deprecate     // 将包标志为弃用
npm dedupe        // 精简模块树
```

```
npm install --save-dev  eslint        // 安装开发环境包
npm install --save-prod eslint        // 安装生产环境包
npm install --save-prod eslint@latest // 安装最新版的包
npm install --save-prod eslint@8.0.0  // 安装8.0.0的包
npm install --save-optional eslint    // 安装可选包
npm update    eslint                  // 升级包
npm uninstall eslint                  // 卸载包
```

```
npm bin    // 打印.bin文件夹的地址
npm root   // 打印node_modules文件夹的地址
npm prefix // 打印node_modules的父文件夹的地址
```

```
npm view eslint version      // 查看包的最新版本
npm view eslint versions     // 查看包的所有版本
npm view eslint dependencies // 查看包的生产依赖
```

```
# 操纵配置文件（.npmrc文件）
npm config get property                                   //
npm config set property=value                             //
npm config delete property                                //                  
npm config edit                                           // 以文本格式打开配置文件
npm config get registry                                   // 查询下载源
npm config set registry="https://registry.npmmirror.com"  // 换至镜像源
npm config set registry="https://registry.npmjs.org"      // 换至官方源
```

```
# 操纵package.json（不会更改node_modules）
npm pkg get version         // 查询
npm pkg set version="1.0.0" // 设置
npm pkg delete version      // 删除
```

## 公共包和私有包

公共包（public packages）是发布在 npm 公共注册表的包，每个公共包的名称都必须是唯一的。公共包可以分为 `Unscoped` 和 `Scoped`。

`Unscoped` 表示直接将包发布在公共注册表中，该包将会占用公共命名空间的一个名称名额，我们可以直接通过该包的名称来下载它，譬如 `core-js`。

`Scoped` 表示将一至多个包都发布在公共注册表中，但是它们一起占用公共命名空间的一个名称名额，这相当于在公共命名空间中创建一个更小的命名空间，并将这些包收纳在这个更小的命名空间中，而这个更小的命名空间就相当于一个域，即 scoped。将一系列相关的包都发布在同一个域下有助于凸显它们之间的关联，同时也节省了公共命名空间，还减少了与其他公共包发生命名冲突或被恶意抢注命名的概率。譬如 Babel7 将所有的包都发布在了一个名为 `babel` 的域下，这些包都具有 `@babel/` 的前缀，比如 `@babel/cli`、`@babel/core`、`@babel/preset-env`。

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

## 包的更新策略

包的更新行为取决于包在 `package.json` 文件中的声明方式，主要有 3 种声明方式：

- 精确的版本号，如 `1.0.0`
- 脱字符版本号，如 `^1.0.0`
- 波浪号版本号，如 `~1.0.0`

若包在 `package.json` 文件中被声明为 `^非零号版本` ，则包的更新行为表现为：在主版本号不变的前提下，更新至最新版。

若包在 `package.json` 文件中被声明为 `~非零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版。

若包在 `package.json` 文件中被声明为 `零号或非零号版本` ，则包的更新行为表现为：无法更新，版本号锁死。

若包在 `package.json` 文件中被声明为 `^零号版本` ，则包的更新行为表现为：在主版本号和次版本号都不变的前提下，更新至最新版。

> 注：零号版本是指 `0.y.z` ，非零号版本是指 `>=1.0.0` 。

## 语意化版本规范

版本号的格式为 `x.y.z` ，其中 `x` 是主版本号、 `y` 是次版本号、 `z` 是修订号。当软件正式发布时，版本号应从 `1.0.0` 开始，对于 `1.0.0` 及以上的版本，版本控制的规则如下：

-  `x` ：对公共 API 进行了任何不能向下兼容的修改后，递增主版本号，归零次版本号和修订号；
-  `y` ：对公共 API 进行了向下兼容的新增、修改、弃用后，或对内部代码进行了大量改进后，递增次版本号，归零修订号；
-  `z` ：进行了向下兼容的错误（ bug ）修正后，递增修订号；

当软件处于初始开发阶段时，版本号应从 `0.1.0` 开始，零号版本意味着一切都可能随时改变，下一个次版本不一定会兼容上一个次版本，不过应当确保在次版本号相同的所有软件中，修订号更高的软件总能向下兼容修订号更低的软件。对于零号版本，版本控制的规则如下：

- 首次发行，版本号为 `0.1.0` ；
- 后续每次发行，递增次版本号；

当该软件会对外暴露 API 时，才能使用该规范来定义版本（因为需要根据 API 的变化状况来修订版本）。更多细节，请见 [Semantic Versioning 2.0.0](https://semver.org)。


