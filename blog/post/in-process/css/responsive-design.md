如今，几乎每部手机都配备了“高 DPI”显示屏。 DPI 代表“Dots Per Inch”，指的是像素密度。苹果将其称为“视网膜显示屏”，但 Android 手机也使用了相同的技术。

```
window.devicePixelRatio
```

这个数字是设备上的物理 LED 像素（硬件像素）与我们在 CSS 中使用的“理论”像素（软件像素）之间的比率，在 CSS 中，我们只能访问软件像素。

在我的 iPhone 上，这个号码是 `3` 。这意味着 10px 的长度实际上是 30px 长。每个软件像素实际上对应9个硬件像素：

为了确保我们的页面在移动设备上正确呈现，我们必须将以下元标记添加到 HTML 中：

```
<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>
```

这个标签是苹果公司发明的，作为禁用浏览器所做的一些“优化”的一种方法。 Android 也很快采用了它，并且它正在进入 CSS 规范。

`width=device-width` 指示浏览器设置视口宽度以匹配设备宽度，`initial-scale=1` 表示我们应该从 1 倍变焦开始。

> 此元标记还允许我们通过设置最小/最大比例或完全禁用它来限制用户缩放的能力。
>
> 这在构建某些类型的应用程序时非常有用。例如，如果我们正在构建 Google 地图，我们会希望禁用用户缩放，以便我们可以实现自己的捏合手势。但这是一个逃生口，99.9% 的应用程序不需要也不应该使用。缩放是一项重要的浏览器功能，禁用或限制它将使我们的产品更难以访问。

如果我们需要在各种设备上测试我们的网页，那么请用 [BrowserStack](https://www.browserstack.com/)，不过它有点慢且价格贵，所以如果可以，购买真机会体验更好。

[eruda](https://github.com/liriliri/eruda) 是一个可以在移动端网页上进行 debug 的工具，它开源、免费、支持 Android 和 iOS。

## 媒体查询

```
  .signup-button {
    color: deeppink;
    font-size: 1rem;
  }
  
  @media (max-width: 400px) {
    .signup-button {
      font-size: 2rem;
    }
  }
```

媒体查询实际上很像 JavaScript 中的 if 语句。请注意，该按钮始终具有粉红色文本。媒体查询允许我们将规则合并在一起。

同样重要的是要注意媒体查询不会影响特异性，比如下面的媒体查询会失效（因为被覆盖掉了）：

```
  @media (max-width: 400px) {
    .signup-button {
      font-size: 2rem;
    }
  }
  
  .signup-button {
    color: deeppink;
    font-size: 1rem;
  }
```

它等价于：

```
let signupButtonStyles = {}

if (windowWidth <= 400) {
  signupButtonStyles.fontSize = '2rem';
}

signupButtonStyles.color = 'deeppink';
signupButtonStyles.fontSize = '1rem';
```

> PostCSS 配置一个可嵌套的媒体查询语法以方便你的开发。

```
/* 桌面端优先的写法 */
.signup-button {
  color: deeppink;
  font-size: 1rem;
}

@media (max-width: 400px) {
  .signup-button {
    font-size: 2rem;
  }
}

/* 移动端优先的写法 */
.signup-button {
  color: deeppink;
  font-size: 2rem;
}

@media (min-width: 401px) {
  .signup-button {
    font-size: 1rem;
  }
}
```

使用哪一种风格，取决于你的网站流量更多的来自于谁，并且一旦你采用了某种风格，那么就应该从一始终的采用这种风格。不要同时使用这两种风格，因为小数尺寸（比如 600.5px）是存在的，而且这会让心智模型变得更复杂一些。

```
/* 不要同时使用两种风格，因为小数尺寸（600.5px 是存在的，比如 iframe 经常会这样） */
@media (max-width: 600px) {
    .desktop-button {
      display: none;
    }
  }

  @media (min-width: 601px) {
    .mobile-button {
      display: none;
    }
  }
```

