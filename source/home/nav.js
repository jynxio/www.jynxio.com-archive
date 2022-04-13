const nav = document.querySelector( "nav" );
const nav_line_first = nav.querySelector( "span:first-child" );
const nav_line_last = nav.querySelector( "span:last-child" );
const catalog = document.querySelector( "#catalog" );

let click = false;

nav.addEventListener( "click", _ => {

    click = ! click;
    click ? open() : close();

} );

function open() {

    nav_line_first.style.transform = "rotate( -45deg )";
    nav_line_last.style.transform = "rotate( 45deg )";

    // catalog.style.opacity = "1";
    catalog.style.transform = "translateX( 0 )";

}

function close() {

    nav_line_first.style.transform = "translateY( calc( -3 * var( --thickness ) ) )";
    nav_line_last.style.transform = "translateY( calc( 3 * var( --thickness ) ) )";

    // catalog.style.opacity = "0";
    catalog.style.transform = "translateX( -100% )";

}
