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
const size = { x: window.innerWidth, y: window.innerHeight };
const canvas = document.querySelector( "canvas" );
const renderer = new WebGLRenderer( { canvas, antialias: window.devicePixelRatio < 2 } );

renderer.setSize( size.x, size.y );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const scene = new Scene();
const camera = new OrthographicCamera( - size.x / 2, size.x / 2, size.y / 2, - size.y / 2, 0.1, 10 );

/* Wave */
const wave = new Wave( size.x, size.y );

wave.setPosition( 0, 0, - 2 );
scene.add( wave.get() );

/* Font line */
const font_message = "JYN\nXIO";
const font_height = Math.min( size.x, size.y ) * 0.1;
const font_space = font_height * 0.1;
const font_thickness = 1;
const font_line = new FontLine( font_message, font_height, font_space, font_thickness );

font_line.setPosition( 0, 0, - 1 );
scene.add( font_line.get() );

/* Scroll */
const scroll_length = size.y * 0.1;
const scroll = new Scroll( scroll_length );

scroll.setPosition( 0, - size.y / 2 + scroll_length, - 1 );
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

    font_line.setScale( Math.min( size.x, size.y ) * 0.1 / font_height );

    scroll.setScale( size.y * 0.1 / scroll_length );
    scroll.setPosition( 0, - size.y / 2 + size.y * 0.1, - 1 );

} );
