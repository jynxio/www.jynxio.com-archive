---
typora-root-url: ..\..
---

# 多进程架构

## 术语

### CPU

CPU 是 Center Processing Unit 的简写，汉译为中央处理器。CPU 是计算机的大脑，一个 CPU 内核就像图中的一个工作人员，它会一个一个的处理手头上的任务。过去的 CPU 普遍只有一个芯片，现在的 CPU 普遍拥有多个芯片。

![CPU](/static/image/markdown/chrome/multi-process-architecture/cpu.png)

### GPU

GPU 是 Graphics Processing Unit 的简写，汉译为图形处理器。GPU 特点是擅长并发的处理简单的任务。

![GPU](/static/image/markdown/chrome/multi-process-architecture/gpu.png)

计算机或手机上的应用程序是由 CPU 与 GPU 来驱动的，不过应用程序通常都需要借助操作系统所提供的机制来调用 CPU 和 GPU，这样就形成了“三层结构”，底层是硬件（包括 CPU、GPU 和其它），中间层是操作系统，顶层是应用程序。

![三层结构](/static/image/markdown/chrome/multi-process-architecture/three-layers.png)

### Process & Thread

Process 是进程，进程是应用程序的执行程序。Thread 是线程，线程存在于进程的内部，它负责执行进程的任务，一个进程可以拥有一个或多个线程。

![进程和线程](/static/image/markdown/chrome/multi-process-architecture/process-and-thread.png)

启动应用程序时，操作系统就会为其创建进程来保证其的运行，进程又可能会创建自己的线程来帮助自己的工作（可选的）。操作系统在创建进程的时候就会为进程分配一块内存，应用程序的所有数据都会保存在这块内存上，当应用程序关闭的时候，操作系统就会关闭相应的进程和完全回收这些进程所占用的内存，无论进程的内部是否发生了内存泄漏。

![操作系统为应用程序创建进程和分配内存来供其保存数据](/static/image/markdown/chrome/multi-process-architecture/process-using-memory.png)

对于使用多个进程的应用程序而言，每个进程都会分配得到自己专属的内存，如果这些进程之间需要通信，那么就需要使用“进程间通信”（IPC）来实现。

![进程之间通过IPC来通信](/static/image/markdown/chrome/multi-process-architecture/process-communicating-over-ipc.png)

另外，同一个进程内的所有线程都可以读写这个进程的内存，这意味着线程之间可以共享数据。并且，因为不同的进程之间是相互隔绝的，所以即使某个进程发生了故障，这个故障的进程也不会影响到其它的进程，其他的进程仍然会正常运行，但是如果进程内的任意一个线程发生了错误，那么这整个进程都会崩溃。

## 单进程架构

单进程架构是指应用程序只使用一个进程的架构，这意味着应用程序的所有功能模块都会运行在一个进程中，在 2006 年前后的浏览器都采用了这种架构。下图是某种假设的单进程架构，单进程架构也当然可以设计成其它样子。

![某种假设的单进程架构](/static/image/markdown/chrome/multi-process-architecture/single-process-architecture.png)

不过采用单进程架构的浏览器都有不稳定、不流畅的缺点。

关于不稳定，那时的浏览器需要借助插件来实现视频和游戏等功能，由于插件的质量良莠不齐容易崩溃，就导致浏览器也容易崩溃。并且当 JavaScript 非常复杂时也容易引起渲染引擎的崩溃，进而导致浏览器崩溃，这是单进程架构的浏览器不稳定的原因。

关于不流畅，如果某些 tab 会发生内存泄漏，那么随着浏览器运行的时间越来越长、打开过的 tab 越来越多，内存泄漏就会越来越多，内存占用也会越拉越多，浏览器也可能会变得越来越慢，这是单进程架构的浏览器不流畅的原因。

## 多进程架构

多进程架构是指应用程序使用多个进程的架构，多进程架构可以设计成许多种不同的样子，不过本章只介绍 Chrome 的多进程架构，下图是 2018 年时 Chrome 的架构。

![2018年Chrome的多进程架构](/static/image/markdown/chrome/multi-process-architecture/chrome-multi-process-architecture.png)

| 进程             | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| Browser Process  | 控制浏览器的界面，比如地址栏、书签、前进和后退按钮。处理一些隐形的任务，比如网络请求、文件访问。管理其它的进程。 |
| Renderer Process | 渲染 tab 的内容，比如解析页面资源然后渲染出网页，其内运行着 Blink 和 V8。为了防止恶意代码利用浏览器漏洞来攻击操作系统，该进程被运行在沙箱中。通常，每个 tab 都会创建一个渲染进程。 |
| Plugin Process   | 控制浏览器的插件，每个运行的插件都会创建一个插件进程。       |
| GPU Process      | 处理 GPU 任务，比如绘制浏览器的 UI 界面的位图和 tab 内容的位图。 |
| ...              | 还有其他进程，比如扩展进程、代理进程、实用程序进程等等。     |

多进程架构的优点是更加稳定、更加流程、更加安全，缺点是会更占内存。

关于更加稳定，因为某个进程的崩溃不会影响到其它的进程，所以当 tab 或插件发生崩溃时，也不会影响到其它的 tab 或整个浏览器，因此多进程架构的浏览器更不容易崩溃。

关于更加流畅，因为操作系统可以完全回收死亡进程的所有内存，所以只要用户善于清理 tab，哪怕浏览器的运行时间再长，浏览器也不容易累积内存泄漏，因此多进程架构的浏览器会更加流畅。

关于更加安全，渲染进程和插件进程所执行的代码来自于网络和插件开发者，为了避免潜在的恶意代码利用浏览器漏洞来攻击操作系统，浏览器将渲染进程和插件进程放了在 [沙箱](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/design/sandbox.md) 中运行，这得益于操作系统提供了限制进程权限的能力。比如 Chrome 就限制了 tab 对用户本地文件的读写权限。这就是多进程架构的浏览器更安全的原因。另外，只有在某些操作系统中，插件进程才会运行在沙箱中。

关于更占内存，因为进程之间是相互隔离的，所以进程们无法像“同一个进程内的线程可以共享该进程内的数据”那样来向彼此共享数据，这导致了进程们无法复用相同的组件，哪怕一个进程想要使用一个大家都在用的组件，它也只能拷贝并使用这个组件的副本，所以多进程架构的浏览器会占用更多的内存。一个例子是，每个渲染进程都有一个 Blink 和 V8 的副本。

## 服务化架构

为了节省内存，Chrome 至早从 2018 年起就决定逐步迁移至服务化的架构，这种架构的特点是以 service 的形式来运行浏览器的各个功能，以便于根据硬件的性能（如内存大小、CPU 算力）来弹性的控制进程数量。这次架构转型是一个长期的过程，直至 2022 年，Chrome 还处在过渡阶段。

比如当硬件性能较强时，Chrome 就会将每个服务拆分为不同的进程来提供更高的稳定性和流畅性。

![更多的进程](/static/image/markdown/chrome/multi-process-architecture/more-process.png)

比如当硬件性能较弱时，Chrome 就会将多个服务整合到一个进程中来节省内存。

![更少的进程](/static/image/markdown/chrome/multi-process-architecture/less-process.png)

## 站点隔离

站点隔离（Site Isolation）是 Chrome 的一项安全策略，它用于进一步的阻止恶意代码窃取站点数据，比如银行账户信息。它的具体做法是将来自不同站点的页面分隔到不同的渲染进程中去，无论这个页面是一个 tab 还是一个 iframe，这样就可以借助进程之间相互隔离的特性来阻止恶意代码访问其他站点的数据。同时，这也意味着有可能会发生一个 tab 拥有多个渲染进程的情况。

> 如果两个页面的 URL 的协议和域名是相同的，那么就会认为这两个页面来自同一个站点，否则就会触发站点隔离。比如 `https://foo.example.com` 和 `https://foo.example.com:8080` 会被视为来自同一个站点，注意该规则是忽略端口、子域和路径的。

![站点隔离](/static/image/markdown/chrome/multi-process-architecture/site-isolation.png)

另外，站点隔离还会阻止渲染进程接收跨域的数据资源，除非服务器通过 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 明确表示该资源可被跨域访问，你可以通过 [这篇文章](https://developers.google.com//web/updates/2018/07/site-isolation) 来了解该设计的动机。

页面从服务器那拿到的资源可以分为两种类型，一种是数据资源，比如 HTML、XML、JSON 等，另一种是媒体资源，比如图像、JavaScript、CSS 等。其中，页面可以接收任意来源的媒体资源，但只能接收符合同源策略或被 CORS 批准的数据资源。不过，`<img>` 和 `<script>` 可以下载任意来源的数据资源，但是站点隔离会阻止跨域的数据资源进入渲染进程的内存，哪怕完成了网络请求。

```html
<img src="https://your-bank.example/balance.json">
<script src="https://your-bank.example/balance.json"></script>
```

对于 Windows、Mac、Linux、Chrome OS，从 Chrome 67 开始就已经全面启用了站点隔离。对于安卓，仅对内存大于 2GB 且有用户登录行文的页面启用站点隔离。你可以通过 [这篇文章](https://www.chromium.org/Home/chromium-security/site-isolation/) 来了解更详细的情况，另外站点隔离会导致各平台的 Chrome 占用更多的内存，大约是 3%~13%。

## 同一站点
