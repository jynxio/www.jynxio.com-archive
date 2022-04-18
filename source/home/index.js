import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/home/font.css";
import "/style/home/index.css";

import Wave from "./Wave";
import FontLine from "./FontLine";
import Scroll from "./Scroll";
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

/* Font line: 需补充resize响应 */
const font_message = "JYN\nXIO";
const font_height = Math.min( window.innerHeight, window.innerWidth ) * 0.1;
const font_space = font_height * 0.1;
const font_line = new FontLine( font_message, font_height, font_space );

font_line.setPosition( 0, 0, - 1 );
scene.add( font_line.get() );

/* Scroll */
const scroll_length = Math.min( window.innerHeight, window.innerWidth ) * 0.075;
const scroll = new Scroll( scroll_length );

scroll.setPosition( 0, - size[ 1 ] / 2 + scroll_length, - 1 ); // TODO: resize
scene.add( scroll.get() );

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

    font_line.setScale( Math.min( ...size ) * 0.1 / font_height );

} );
