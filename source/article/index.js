import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/article/index.css";

/**
 * 目录
 */
globalThis.addEventListener( "load", _ => {

    const aside = document.querySelector( "aside" );

    /* 显隐目录 */
    const { width: aside_width, height: aside_height } = aside.getBoundingClientRect();

    displayOrHiddenAside();

    aside.style.visibility = "visible";

    globalThis.addEventListener( "resize", _ => displayOrHiddenAside() );

    function displayOrHiddenAside() {

        /* 页面的尺寸 */
        const viewport_width = globalThis.innerWidth;
        const viewport_height = globalThis.innerHeight;

        /* 计算页面的尺寸是否足以容纳aside */
        const article_width = Math.min( viewport_width, viewport_height ); // 100vmin，因为page.css规定了article的width是100vmin
        const is_width_enough = ( viewport_width - article_width ) / 2 >= aside_width;
        const is_height_enough = viewport_height >= aside_height;

        /* 显示/隐藏 */
        aside.hidden = ( is_width_enough && is_height_enough ) ? false : true;

    }

    /* 目录滚动 */
    aside.addEventListener( "click", event => {

        const node = event.target;
        const name = node.nodeName.toLowerCase();

        if ( name !== "p" ) return;

        const id = node.getAttribute( "data-target-id" );
        const option = [ true, { behavior: "smooth", block: "start", inline: "center" } ];

        if ( ! id ) {

            document.getElementsByTagName( "header" )[ 0 ].scrollIntoView( ... option );

            return;

        }

        document.getElementById( id ).scrollIntoView( ... option );

    } );

} );
