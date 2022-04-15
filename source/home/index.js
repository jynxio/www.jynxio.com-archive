import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/home/font.css";
import "/style/home/index.css";

import Wave from "./Wave";
import FontOutline from "./FontOutline";
import { WebGLRenderer } from "three";
import { OrthographicCamera } from "three";
import { Scene } from "three";
import { Clock } from "three";

/* Base */
const size = [ window.innerWidth, window.innerHeight ];
const canvas = document.querySelector( "canvas" );
const renderer = new WebGLRenderer( { canvas, antialias: window.devicePixelRatio < 2 } );

renderer.setSize( ... size );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const scene = new Scene();
const camera = new OrthographicCamera( - size[ 0 ] / 2, size[ 0 ] / 2, size[ 1 ] / 2, - size[ 1 ] / 2, 0.1, 10 );

/* Wave */
const wave = new Wave( ... size );

wave.setPosition( 0, 0, - 2 );
scene.add( wave.get() );

/* Font outline */
const font_outline = new FontOutline( "JYN\nXIO", 100 );

font_outline.setPosition( 0, 0, - 1 );
scene.add( font_outline.get() );

/* Animate */
const clock = new Clock();

renderer.setAnimationLoop( _ => {

    const elapsed_time = clock.getElapsedTime();

    wave.setTime( elapsed_time );

    renderer.render( scene, camera );

} );

/* Resize */
window.addEventListener( "resize", _ => {

    const size = [ window.innerWidth, window.innerHeight ];

    renderer.setSize( ... size );
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

    camera.left = - size[ 0 ] / 2;
    camera.right = size[ 0 ] / 2;
    camera.top = size[ 1 ] / 2;
    camera.bottom = - size[ 1 ] / 2;
    camera.updateProjectionMatrix();

    wave.setSize( ... size );
    wave.setResolution( ... size );

} );
