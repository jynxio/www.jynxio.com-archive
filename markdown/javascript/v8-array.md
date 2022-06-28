# V8 数组

## 翻译

> 本文会描述 V8 数组的实现，不过本文首先会假设 V8 运行在 64 位的系统上，并且 V8 的版本为 8.9。

## 参考

- [Fast properties in V8 - V8 (30/08/2017)](https://v8.dev/blog/fast-properties)

- [Elements kinds in V8 - V8 (12/09/2017)](https://v8.dev/blog/elements-kinds)

- [阅读V8（一）：V8底层如何实现JSArray (28/05/2020)](https://zhuanlan.zhihu.com/p/192468212)

- [Understanding Map Internals - Andrey Pechkurov (27/08/2020)](https://itnext.io/v8-deep-dives-understanding-map-internals-45eb94a183df)

- [Understanding Array Internals - Andrey Pechkurov (16/05/2021)](https://itnext.io/v8-deep-dives-understanding-array-internals-5b17d7a28ecc)

- [探究 JS V8 引擎下的“数组”底层实现 - 掘金 (17/09/2019)](https://juejin.cn/post/6844903943638794248)

- 

  