---
typora-root-url: ./..\..\image
---

**Flexbox is still relevant,** even with CSS Grid reaching wide browser support. It's a different tool for a different job: CSS Grid works best for two-dimensional layouts, while Flexbox offers more flexibility for working with a single dimension.

Grid 是 Flexbox 的完全替代品，目前仍旧使用 Flexbox 的原因有 2：

- Flexbox 的兼容性更好；
- Flexbox 在单轴控制上更方便；

When we apply `display: flex` to an element, we toggle the "Flexbox" layout algorithm for the element's *children*. The parent element will still use Flow layout.

如果 `display: flex`，那么元素的子元素就会启用 Flexbox 布局，而元素本身仍然会处于其原来的布局系统之中。

「Directions and Alignment」中的关于 Flexbox layout 的各种值的「可互动例子」真是太棒了！这让我开始考虑“我要不要切换到 MDX ？”。

## align-items: baseline
