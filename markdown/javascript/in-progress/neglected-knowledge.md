## queryLocalFonts

`globalThis.queryLocalFonts` 可以异步获取所有本地字体数据，包括字体名与字形数据（SFNT）。这似乎对 WebGL Fonts 很有帮助，比如我们可以尝试直接根据 SFNT 数据来绘制字体，而无需再下载庞大的字体文件。不过，如何使用 SFNT 数据来绘制字体似乎成为了另一个棘手的问题...

该 API 目前仅在 Chromium 中可用。

## WebGL Font

除了 `queryLocalFonts` 外，还有 2 个办法可以帮助你在无需下载外部字体文件的情况下在 WebGL 中绘制字体。

- 如果你需要绘制 2d 文字，那么你可以将文字写在 `<canvas>` 上，然后在 WebGL 中使用 `<canvas>` 贴图；
- 如果你需要绘制 3d 文字，那么你可以将文字写在 `<canvas>` 上，然后通过 [potrace](https://potrace.sourceforge.net/) 来矢量化画布位图，然后再根据矢量化的结果来绘制 3d 文字。
