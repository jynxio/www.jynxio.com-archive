## 字体库

- [typr.js](https://github.com/photopea/Typr.js)
- [opentype.js](https://github.com/opentypejs/opentype.js)

## 前置知识

- 字体文件格式
- 字体测量学
- 字体渲染：渲染原理、抗锯齿

fontkit: Currently, subsets produce minimal fonts designed for PDF embedding that may not work as standalone files. They have no cmap tables and other essential tables for standalone use. This limitation will be removed in the future.

## fonttools

```python
pyftsubset ./FiraCode-Regular.ttf --output-file=subset.ttf --text-file=subset.txt
```

其中 `subset.txt` 的内容如下：

```
!=>
```

