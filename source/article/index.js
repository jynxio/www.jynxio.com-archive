import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/article/index.css";

/**
 * 若页面的尺寸足够容纳aside，则显示aside，否则隐藏aside。
 */
globalThis.addEventListener( "load", _ => {

    const aside = document.querySelector( "aside" );
    const { width: aside_width, height: aside_height } = aside.getBoundingClientRect();

    displayOrHiddenAside();
    aside.style.visibility = "visible";
    globalThis.addEventListener( "resize", _ => displayOrHiddenAside() );

    function displayOrHiddenAside() {

        /* 页面的尺寸 */
        const viewport_width = globalThis.innerWidth;
        const viewport_height = globalThis.innerHeight;

        /* 计算页面的尺寸是否足以容纳aside */
        const article_width = Math.min( viewport_width, viewport_height ); // 100vmin，因为page.css规定了article的width是100vmin。

        const is_width_enough = ( viewport_width - article_width ) / 2 >= aside_width;
        const is_height_enough = viewport_height >= aside_height;

        /* 显示/隐藏 */
        aside.hidden = ( is_width_enough && is_height_enough ) ? false : true;

    }

} );

/**
 * 禁止页面刷新后自动滚动至历史位置
 */
history.scrollRestoration && ( history.scrollRestoration = "manual" );
