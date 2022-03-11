const sidebar = document.getElementById( "sidebar" );
const sidebar_homebutton = sidebar.getElementsByClassName( "home-button" )[ 0 ];
const sidebar_catalogcontent = sidebar.getElementsByClassName( "catalog-content" )[ 0 ];

const topbar = document.getElementById( "topbar" );

const {
    width: sidebar_homebutton_width,
    height: sidebar_homebutton_height,
} = sidebar_homebutton.getBoundingClientRect();

const {
    width: sidebar_catalogcontent_width,
    height: sidebar_catalogcontent_height,
} = sidebar_catalogcontent.getBoundingClientRect();

switchBar();

window.addEventListener( "resize", _ => switchBar() );

/**
 * 若页面的宽度与高度足矣容纳边栏，则显示边栏，否则显示顶栏。
 */
function switchBar() {

    /* 计算页面的宽高是否足以容纳边栏 */
    const viewport_width = innerWidth;
    const viewport_height = innerHeight;

    const article_width = Math.min( viewport_width, viewport_height ); // 100vmin

    const is_wide_enough = ( viewport_width - article_width ) / 2 >= Math.max( sidebar_homebutton_width, sidebar_catalogcontent_width );
    const is_tall_enough = viewport_height >= Math.max( sidebar_homebutton_height, sidebar_catalogcontent_height );

    /* 显示边栏 */
    if ( is_wide_enough && is_tall_enough ) {

        sidebar.style.display = "";
        sidebar.style.visibility = "visible";

        topbar.style.display = "none";

        return;

    }

    /* 显示顶栏 */
    sidebar.style.display = "none";
    sidebar.style.visibility = "hidden";

    topbar.style.display = "block";

}
