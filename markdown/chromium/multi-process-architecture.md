---
typora-root-url: ..\..
---

# 多进程架构

## 术语

### CPU

CPU 是 Center Processing Unit 的简写，汉译为中央处理器。CPU 是计算机的大脑，一个 CPU 内核就像图中的一个工作人员，它会一个一个的处理手头上的任务。过去的 CPU 普遍只有一个芯片，现在的 CPU 普遍拥有多个芯片。

![CPU](/static/image/markdown/chromium/multi-process-architecture/cpu.png)

### GPU

GPU 是 Graphics Processing Unit 的简写，汉译为图形处理器。GPU 特点是擅长并发的处理简单的任务。

![GPU](/static/image/markdown/chromium/multi-process-architecture/gpu.png)

计算机或手机上的应用程序是由 CPU 与 GPU 来驱动的，不过应用程序通常都需要借助操作系统所提供的机制来调用 CPU 和 GPU，这样就形成了“三层结构”，底层是硬件（包括 CPU、GPU 和其它），中间层是操作系统，顶层是应用程序。

![三层结构](/static/image/markdown/chromium/multi-process-architecture/three-layers.png)

### Process & Thread

Process 是进程，进程是应用程序的执行程序。Thread 是线程，线程存在于进程的内部，它负责执行进程的任务，一个进程可以拥有一个或多个线程。

![进程和线程](/static/image/markdown/chromium/multi-process-architecture/process-and-thread.png)

启动应用程序时，操作系统就会为其创建进程来保证其的运行，进程又可能会创建自己的线程来帮助自己的工作（可选的）。操作系统在创建进程的时候就会为进程分配一块内存，应用程序的所有数据都会保存在这块内存上，当应用程序关闭的时候，操作系统就会关闭相应的进程和完全回收这些进程所占用的内存，无论进程的内部是否发生了内存泄漏。

![操作系统为应用程序创建进程和分配内存来供其保存数据](/static/image/markdown/chromium/multi-process-architecture/process-using-memory.png)

对于使用多个进程的应用程序而言，每个进程都会分配得到自己专属的内存，如果这些进程之间需要通信，那么就需要使用“进程间通信”（IPC）来实现。

![进程之间通过IPC来通信](/static/image/markdown/chromium/multi-process-architecture/process-communicating-over-ipc.png)

另外，同一个进程内的所有线程都可以读写这个进程的内存，这意味着线程之间可以共享数据。并且，因为不同的进程之间是相互隔绝的，所以即使某个进程发生了故障，这个故障的进程也不会影响到其它的进程，其他的进程仍然会正常运行，但是如果进程内的任意一个线程发生了错误，那么这整个进程都会崩溃。

## 浏览器架构

### 单进程架构

单进程架构是指应用程序只使用一个进程，这意味着应用程序的所有功能模块都会运行在同一个进程之中，在 2006 年前后的浏览器都采用了这种架构。

## 问题

2006 年前后的浏览器的状态类似于过去的单用户/多任务的操作系统，在此类操作系统中，一旦某个应用程序发生了故障，就会导致整个操作系统发生崩溃，而那时的浏览器也与此类似，只要某个页面或浏览器插件发生故障，就会导致整个浏览器发生崩溃。

现代的操作系统更加健壮，因为它们将应用程序放入到相互隔离的独立进程中，一个应用程序的崩溃通常不会损害到其它应用程序或操作系统，并且每个用户对其它用户数据的访问受到限制。

## 架构概述

我们为浏览器的 tab 使用单独的进程，以保护浏览器

