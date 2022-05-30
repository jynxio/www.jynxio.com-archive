import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/article/index.css";

const aside = document.querySelector( "aside" );
let aside_width;
let aside_height;

window.addEventListener( "load", _ => {

    const { width, height } = aside.getBoundingClientRect();

    aside_width = width;
    aside_height = height;

    canYouDisplayAside();
    aside.style.visibility = "visible";
    window.addEventListener( "resize", _ => canYouDisplayAside() );

} );

/**
 * 若页面的尺寸足够容纳aside，则显示aside，否则隐藏aside。
 */
function canYouDisplayAside() {

    /* 页面的尺寸 */
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    /* 计算页面的尺寸是否足以容纳aside */
    const article_width = Math.min( viewport_width, viewport_height ); // 100vmin，因为page.css规定了article的width是100vmin。

    const is_width_enough = ( viewport_width - article_width ) / 2 >= aside_width;
    const is_height_enough = viewport_height >= aside_height;

    /* 显示/隐藏 */
    aside.style.display = is_width_enough && is_height_enough ? "block" : "none";

}

/**
 * 禁止页面刷新后自动滚动至历史位置
 */
history.scrollRestoration && ( history.scrollRestoration = "manual" );
