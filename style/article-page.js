/* 定义常量。 */
const sidebar = document.getElementById( "sidebar" );
const sidebar_homebutton = sidebar.getElementsByClassName( "home-button" )[ 0 ];
const sidebar_catalogcontent = sidebar.getElementsByClassName( "catalog-content" )[ 0 ];

const {
    width: sidebar_homebutton_width,
    height: sidebar_homebutton_height,
} = sidebar_homebutton.getBoundingClientRect();

const {
    width: sidebar_catalogcontent_width,
    height: sidebar_catalogcontent_height,
} = sidebar_catalogcontent.getBoundingClientRect();

/* 根据页面宽高来确定该使用sidebar还是bottombar。 */
switchBar();

window.addEventListener( "resize", _ => switchBar() );

function switchBar() {

    const viewport_width = innerWidth;
    const viewport_height = innerHeight;

    const article_width = Math.min( viewport_width, viewport_height ); // 100vmin

    if ( ( viewport_width - article_width ) / 2 < Math.max( sidebar_homebutton_width, sidebar_catalogcontent_width ) ) {

        sidebar.style.display = "none";
        sidebar.style.visibility = "hidden";

        return;

    }

    if ( viewport_height < Math.max( sidebar_homebutton_height, sidebar_catalogcontent_height ) ) {

        sidebar.style.display = "none";
        sidebar.style.visibility = "hidden";

        return;

    }

    sidebar.style.display = "";
    sidebar.style.visibility = "visible";

}
