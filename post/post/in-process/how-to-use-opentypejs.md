## Font 对象

该对象拥有下述属性：

| 名称         | 描述                       |
| ------------ | -------------------------- |
| `glyphs`     | 存储 Glyhp 对象的数组      |
| `unitsPerEm` | EM 方格的尺寸（整数值）    |
| `ascender`   | 字符最高点相对于基线的距离 |
| `descender`  | 字符最低点相对于基线的距离 |

> EM 方格：字形盒子，一个用于包裹字形的正方形区域，类似于字帖中的田字格，其是度量字符的尺寸和位置的基础。

## Glyph 对象

| 名称               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `font`             | 指向 Font 对象的指针                                         |
| `name`             | 字符的名称                                                   |
| `unicode`          | 字符的 Unicode（有可能为 `undefined`）                       |
| `unicodes`         | 字符的 Unicode 数组（有可能为 `[]`）                         |
| `index`            | 字符的序号                                                   |
| `advanceWidth`     | 字形的整体宽度                                               |
| `leftSideBearing ` | 字形左侧的空白区域的宽度，即字形左边缘与字形盒子左边缘之间的距离 |
| `xMin`             | 字形的最小 x 坐标（即包裹字形的最小包围盒的最小 x 坐标，EM 方格不是字形的最小包围盒，下同） |
| `yMin`             | 字形的最大 x 坐标                                            |
| `xMax`             | 字形的最小 y 坐标                                            |
| `yMax`             | 字形的最大 y 坐标                                            |
| `path`             | 指向 Path 对象的指针                                         |

## 记住

- `Font.stringToGlyphs(string)`：字符串转 Glyhp 对象，若无则返回 `null`，该方法和连字符有关。
- `Font.charToGlyph(char)`：字符转 Glyphs 对象，若无则返回 `null`。
- `Glyph.toSVG`
- `Glyph.fromSVG`

