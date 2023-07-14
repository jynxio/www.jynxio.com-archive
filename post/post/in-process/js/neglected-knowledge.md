

# 冷知识

## WebGPU Font

如果你想在 WebGPU 中渲染字体，那么这里有 4 种思路：

- 下载并解析字体文件，然后根据解析结果绘制字体；
- 使用 `globalThis.queryLocalFonts` API 来异步获取本地的所有字体数据（包括字体名与字形），然后根据字形数据（SFNT）来绘制字体；
- 将需要绘制的字体书写在画布上，然后使用该画布贴图来渲染 2d 字体；
- 将需要绘制的字体书写在画布上，然后通过 [potrace](https://potrace.sourceforge.net/) 来矢量化画布位图，最后使用矢量化的结果来绘制 3d 字体；

> `globalThis.queryLocalFonts` API 目前仅可用于在 Chromium。

## Chromium API

Chromium 在持续发布有趣的 API，你可以在 [Fugu API Tracker](https://fugu-tracker.web.app/) 里找到这些信息。

## 函数形参

在 JavaScript 函数中，后面的形参可以直接访问到前面的形参（反之不可），于是我们便可以这样做：

```js
( function ( bool, num = + bool ) {
	bool; // true
    num;  // 1
} )( true );
```

## 定义事件的空间范围

如果把用户事件绑定在 SVG 图形元素上，那么这些用户事件的触发范围便取决于 SVG 图形元素的形状（`<text>` 元素除外），比如：

- 如果把点击事件绑定在心形的 `<path>` 元素上，那么触发范围就是心形；
- 如果把点击事件绑定在弧形的 `<path>` 元素上，那么触发范围就是弧线；
- 如果把点击事件绑定在 `<circle>` 元素上，那么触发范围就是圆形；
- 如果把点击事件绑定在 `<text>` 元素上，那么触发范围就是该文本的矩形包围盒；

```jsx
function Component () {
    return (
    	<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <circle onClick={} />
            <path onClick={} />
            <text onClick={} />
    </svg>
    );
}
```

## 更丝滑的进度提示条

2023 年 5 月，Chromium 宣布推出了新的 API 来实现更加丝滑的进度提示条功能，你可以选择单纯使用 CSS 来实现，或者使用少量 JS 来实现。新的 API 要求 Chrome/Edge 115 以上。

下面是关于该功能的参考链接：

- 如何使用新 API 来实现进度提示条：https://developer.chrome.com/blog/scroll-animation-performance-case-study/
- 关于新 API 的更多细节，以及如何用它来实现进度提示条以外的更多功能：https://developer.chrome.com/articles/scroll-driven-animations/
