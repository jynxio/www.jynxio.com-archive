---
typora-root-url: ..\..
---

# 浏览器的事件循环

[这个知乎回答](https://www.zhihu.com/question/434791954/answer/2453356416) 中提到了各种任务在一个帧周期中的优先级！他说道：

这个知乎的回答也出现在另一篇 [掘金文章](https://juejin.cn/post/7087747915950604318) 中。

```
1. 用户事件：最先执行，比如`click`等事件。
2. `js`代码：宏任务和微任务，这段时间里可以执行多个宏任务，但是必须把微任务队列执行完成。宏任务会被浏览器自动调控。比如浏览器如果觉得宏任务执行时间太久，它会将下一个宏任务分配到下一帧中，避免掉帧。
3. 在渲染前执行 `scroll/resize` 等事件回调。
4. 在渲染前执行`requestAnimationFrame`回调。
5. 渲染界面：面试中经常提到的浏览器渲染时`html、css`的计算布局绘制等都是在这里完成。
6. `requestIdleCallback`执行回调：如果前面的那些任务执行完成了，一帧还剩余时间，那么会调用该函数。
```

![任务的优先级](/static/image/markdown/javascript/event-loop/task-order.jpg)

## 参考资料

- [Promise A+ 规范](https://promisesaplus.com/)
- [event loop - WHATWG 规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop)
- [event loop - Philip Roberts](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [event loop - Jake Archibald](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [event loop - Flavio Copes](https://flaviocopes.com/javascript-event-loop/)
- [event loop - 字节跳动](https://juejin.cn/post/6844904165462769678)
- [event loop - 鲨叔](https://juejin.cn/post/6844904147427278861)

