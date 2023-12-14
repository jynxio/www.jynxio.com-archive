# 媒体查询

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

我们还可以用 `orientation` 来选定窗口比例，

```
@media (orientation: portrait) {
  /* 窗口的高大于宽 */
}

@media (orientation: landscape) {
  /* 窗口的宽大于高 */
}
```

不过 Josh 说它其实不好用，因为没 `min-width`、`max-width` 灵活，混用的时候又会很麻烦。真的吗 🤔️

## 新型的媒体查询

在 iOS 和 Android 的浏览器上，点击一个可交互元素就会使它进入悬停状态，直到点击其他地方为止。查看这个 [示例](https://loud-magnetic-afrovenator.glitch.me/)，上面的元素在桌面端是悬停触发特效，移动端是点击触发特效，下面的元素在桌面端是悬停触发特效，移动端是点击不会出发特效（似乎是因为那个媒体查询识别出了设备，并且让悬停只在正确的设备上存在，因为移动端没有指针，就自然不应该有悬停行为）。如果做到这件事情？⬇️

```
@media (hover: hover) and (pointer: fine) {
  button:hover {
    border: 2px solid green;
  }
}
```

这是一种新型的媒体查询，被称为 [Interaction Media Features](https://drafts.csswg.org/mediaqueries-4/#mf-interaction)。

这有一个表格，描述了不同的设备在 hover 和 pointer 方面上的差异

> pointer: coarse 是指手指在屏幕上的坐标是粗糙的（毕竟指头很粗），不像光标那样是精确的，pointer: fine 就代表精确的。

|                                  | hover | pointer |
| -------------------------------- | ----- | ------- |
| Mouse / Trackpad                 | none  | coarse  |
| Touchscreen (smartphone, tablet) | none  | none    |
| Keyboard (focus navigation)      | none  | fine    |
| Eye-tracking                     | none  | fine    |
| Basic stylus digitizers          | none  | fine    |
| Sip-and-puff switches            | none  | none    |
| Microsoft Kinect / Wii remote    | hover | coarse  |

1. Mouse / Trackpad: 这指的是传统的鼠标或触摸板，通常用于个人电脑或笔记本电脑。用户通过移动鼠标或触摸板上的指针来与界面交互。
2. Touchscreen (smartphone, tablet): 触摸屏设备，如智能手机和平板电脑。用户通过触摸屏幕的方式与设备交互，支持如轻触、滑动等手势。
3. Keyboard (focus navigation): 键盘用于导航和数据输入。通过键盘的方向键、Tab键等实现对界面元素的聚焦和导航，常见于无法使用鼠标或触摸屏的情况。
4. Eye-tracking: 眼动追踪技术，可以追踪用户的眼睛动作，从而理解用户在屏幕上的注视点。这种技术在辅助技术和用户体验研究中非常有用。
5. Basic stylus digitizers: 基础的手写笔数字化设备，用于在触摸屏或专门的绘图板上进行精确的绘图或书写。
6. Sip-and-puff switches: 这是一种辅助技术，主要用于帮助行动不便的人士操作计算机。用户通过吸气或吹气来控制设备。
7. Microsoft Kinect / Wii remote: 这些是游戏控制器，用于体感游戏。Kinect 通过捕捉身体动作来控制游戏，而Wii遥控器则结合了运动传感器和按键来实现交互。

浏览器会自动的识别出你在用哪一种设备来使用浏览器，哪怕你从光标切换到了键盘（指导航，而不是打字），它也能识别出来，并且更新 hover 和 pointer 媒体查询。

`pointer: coarse` 意味着这是一个位置粗糙的指针，我们会因此而遭遇手指怎么点都选不中的情况，Apple 建议最小点击尺寸应该是 44*44px，因此我们要这么写：

```
@media (pointer: coarse) {
	button {
		min-height: 44px;
	}
}
```

如果有很多不一样的按钮，怎么批量设置？用 CSS 变量！

```
/* 仅当媒体查询生效的时候，才会应用此按钮尺寸，否则css变量就会失效，然后按钮会回退至32px */
@media (pointer: coarse) {
	:root {
		--min-height: 44px;
	}
}

.someone {
	min-height: var(--min-height, 32px);
}

.anotherone {
	min-height: var(--min-height, 32px);
}
```



## 逻辑判断

`and` 就相当于 JavaScript 里的 `&&`，`or` 相当于 `||`。

```
@media (max-width: 600px) and (min-width: 800px) {}
@media (max-width: 600px) or (min-width: 800px) {}
```

其实 `or` 有一个平替，那就是 `,`，因为 `,` 意味着创建两个独立的但内容都一样的媒体查询，最终大家的效果都是一样的。

```
@media (max-width: 600px), (min-width: 800px) {
  /* styles */
}

/* 等价于 */
@media (max-width: 600px) {
  /* styles */
}

@media (min-width: 800px) {
  /* Repeated styles */
}
```

## 偏好查询

```
@media (prefers-color-scheme: dark) {
  /* Dark-mode styles here */
}

@media (prefers-reduced-motion: no-preference) { /* 希望不要视觉运动效果 */
  /* Animations here */
}
```

## 断点

我们通过设置尺寸断点来为不同的设备应用不同的布局，我们可以通过 [这里的数据](https://gs.statcounter.com/screen-resolution-stats) 来查看各种分辨率的屏幕的使用频率（软件分辨率），一个适用于现在的结论是：

- 0-550px — Mobile
- 550-1100px — Tablet
- 1100-1500px — Laptop
- 1500+px — Desktop

> 如果用户使用了小窗口的浏览器，嗯...

然后，如果我们采用桌面端优先的写法，应该这样写：

```
/* Default: Desktop monitors, 1501px and up */

@media (max-width: 1500px) {
  /* Laptop */
}

@media (max-width: 1100px) {
  /* Tablets */
}

@media (max-width: 550px) {
  /* Phones */
}
```

或移动端优先的写法，向这样：

```
/* Default: Phones from 0px to 549px */

@media (min-width: 550px) {
  /* Tablets */
}

@media (min-width: 1100px) {
  /* Laptop */
}

@media (min-width: 1500px) {
  /* Desktop */
}
```

# CSS 变量

CSS 变量是创建一个自定义属性，该属性总以 `--` 开头，通过 `var()` 来访问，它仅适用于当前元素和子元素，CSS 变量的值会自动被继承。

[`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) 和[`registerProperty`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/registerProperty_static) 都可以创建自定义属性，前者是 CSS 调用，后者是 JS 调用，后者更强大，因为后者可以真的当成一个 CSS 属性来使用，写进 transition 里面去，两者的兼容性都一样的差（主要是在 FireFox 上，最新版才支持）。

CSS 变量的好处在于我们可以用 JavaScript 来改变它的值：

```
dom.style.setProperty('--font-size', '1rem');
```

css 变量是可以组合的！

```
  body {     
    --pink-hue: 340deg;
    --blue-hue: 275deg;
    --intense: 100% 50%;
    
    --color-primary: hsl(
      var(--pink-hue)
      var(--intense)
    );
    --color-secondary: hsl(
      var(--blue-hue)
      var(--intense)
    );
  }
  
    strong { 
    color: var(--color-primary); 
  }
  a {  
    color: var(--color-secondary);
  }
```



## var

```
var(自定义属性的名字, 默认值)
```

如果自定义属性的值无效，那么就会采用默认值。

```
:root {
  --backup-bg-color: teal;
}

body {
  /* main-bg-color 没有被设置，将使用回退值 backup-bg-color。如果 backup-bg-color 没有被设置，将使用回退值 white。 */
  color: var(--main-bg-color, var(--backup-bg-color, white));
}
```

## calc

四个运算符 `+ - * /`

# 单位

`vw`、`vh`

手机浏览器上的底栏是动态存在的，`vh` 总是代表最大高度，因为 `100vh` 有时候会超出设备的高，一种解决方案是：使用百分比值 `100%`，另一种是：使用 `svh`、`lvh`、`dvh`，分别代表最小视口高度、最大视口高度、动态视口高度。`100dvh` 可以完全替代 `100%`，只不过 `dvh` 的兼容性只有八成以上，所以不妨这么写：

```
.some-element {
  height: 100vh; /* 回退 */
  height: 100dvh;
}
```

另外，桌面端的滚动条是会占据元素的空间的（移动端的则不占据，滚动条总是悬浮在内容之上），无论 box-sizeing 是什么，滚动条都会消耗元素的内容盒的空间，滚动条会被夹在padding box 和border box之间。然后这会导致 section 放不下 div 从而发生滚动：

```html
<section>
	<div></div>
</section>

<style>
    * {
        padding: 0;
    }
    
    section {
        overflow: scroll;
        width: 100vw;
        height: 100vw;
    }
    
    div {
        width: 100vw;
        height: 100vh;
    }
</style>
```

如果你想计算出纵向滚动条的宽度？那么：

```
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
```

`window.innerWidth` 指视口宽度；它不关心滚动条，然而， `documentElement.clientWidth` 指的是文档中的可用空间。

`vmin` 和 `vmax` 代表总是取 `vw` 和 `vh` 之间的最小值和最大值，和 `dvh`、`dvw` 等单位没关系。

## clamp

`clamp()` 是 `width`、`min-width`、`max-width` 的语法糖：

```
clamp(min-width, ideal-width, max-width)
```

另外，还有 `min(v1, v2)` 和 `max(v1, v2)`
