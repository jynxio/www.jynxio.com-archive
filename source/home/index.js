import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/home/index.css";

import Wave from "./Wave";
import FontOutline from "./FontOutline";
import FontFillline from "./FontFillline";
import { WebGLRenderer } from "three";
import { OrthographicCamera } from "three";
import { Scene } from "three";
import { Clock } from "three";

/* Base */
const size = { x: window.innerWidth, y: window.innerHeight };
const canvas = document.querySelector( "canvas" );
const renderer = new WebGLRenderer( { canvas, antialias: true } );

renderer.setSize( size.x, size.y );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const scene = new Scene();
const camera = new OrthographicCamera( - size.x / 2, size.x / 2, size.y / 2, - size.y / 2, 0.1, 10 );

/* Wave */
const wave = new Wave( size.x, size.y );

wave.setPosition( 0, 0, - 2 );
scene.add( wave.get() );

/* Font */
const font_jynxio = new FontOutline(
    "JYN\nXIO",
    Math.max( size.x, size.y ) * 0.1,
    Math.max( size.x, size.y ) * 0.1 * 0.1,
    1
);

font_jynxio.setPosition( 0, 0, - 1 );
scene.add( font_jynxio.get() );

const font_scrolldown = new FontFillline(
    "SCROLL DOWN",
    Math.max( size.x, size.y ) * 0.01,
    Math.max( size.x, size.y ) * 0.01 * 0.1,
);

font_scrolldown.setPosition( 0, - size.y / 2 + font_scrolldown.getHeight() * 3, - 1 );
scene.add( font_scrolldown.get() );

/* Animate */
const clock = new Clock();

renderer.setAnimationLoop( _ => {

    const elapsed_time = clock.getElapsedTime();

    wave.setTime( elapsed_time );
    renderer.render( scene, camera );

} );

/* Resize */
window.addEventListener( "resize", _ => {

    size.x = window.innerWidth;
    size.y = window.innerHeight;

    renderer.setSize( size.x, size.y );
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

    camera.left = - size.x / 2;
    camera.right = size.x / 2;
    camera.top = size.y / 2;
    camera.bottom = - size.y / 2;
    camera.updateProjectionMatrix();

    wave.setSize( size.x, size.y );
    wave.setResolution( size.x, size.y );

    font_jynxio.setScale( Math.max( size.x, size.y ) * 0.1 / font_jynxio.getHeight() );

    font_scrolldown.setPosition( 0, - size.y / 2 + font_scrolldown.getHeight() * 3, - 1 );
    font_scrolldown.setScale( Math.max( size.x, size.y ) * 0.01 / font_scrolldown.getHeight() );

} );
