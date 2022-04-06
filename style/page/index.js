const aside = document.querySelector( "aside" );
const { width: aside_width, height: aside_height } = aside.getBoundingClientRect();

canYouDisplayAside();

window.addEventListener( "resize", _ => canYouDisplayAside() );

/**
 * 若页面的宽度与高度足够容纳aside，则显示aside，否则隐藏aside。
 */
function canYouDisplayAside() {

    /* 计算页面的宽高是否足以容纳边栏 */
    const viewport_width = innerWidth;
    const viewport_height = innerHeight;

    const article_width = Math.min( viewport_width, viewport_height ); // 100vmin，因为page.css规定了article的width是100vmin。

    const is_wide_enough = ( viewport_width - article_width ) / 2 >= aside_width;
    const is_tall_enough = viewport_height >= aside_height;

    aside.style.display = is_wide_enough && is_tall_enough ? "block" : "none";

}
