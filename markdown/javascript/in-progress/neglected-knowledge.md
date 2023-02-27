## queryLocalFonts

`globalThis.queryLocalFonts` 可以异步获取所有本地字体数据，包括字体名与字形数据。如果你想在 WebGL 上下文中绘制字体，那么这个 API 就非常有用，因为它可以帮助你直接使用本地字体数据，而无需再下载庞大的字体文件。

不过，该 API 目前仅在 Chromium 中可用。
