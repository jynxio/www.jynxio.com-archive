import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/home/index.css";

import Wave from "./Wave";
import Font from "./Font";
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
scene.add( wave.getEntity() );

/* Font */
const font_name = new Font( {
    message: "JYN\nXIO",
    height: Math.max( size.x, size.y ) * 0.1,
    space: Math.max( size.x, size.y ) * 0.1 * 0.1,
    thickness: 1,
    type: "outline",
} );

font_name.setPosition( 0, 0, - 1 );
scene.add( font_name.getEntity() );

const font_scroll = new Font( {
    message: "SCROLL DOWN",
    height: size.y * 0.015,
    space: size.y * 0.015 * 0.1,
    type: "fillline",
} );

font_scroll.setPosition( 0, - size.y / 2 + size.y * 0.05, - 1 );
scene.add( font_scroll.getEntity() );

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

    font_name.setScale( Math.max( size.x, size.y ) * 0.1 / font_name.getHeight() );

    font_scroll.setPosition( 0, - size.y / 2 + size.y * 0.05, - 1 );
    font_scroll.setScale( size.y * 0.015 / font_scroll.getHeight() );
} );
