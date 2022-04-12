import "/style/public/reset.css";
import "/style/public/font.css";
import "/style/home/index.css";

import vertex_shader from "./shader/vertex.glsl";
import fragment_shader from "./shader/fragment.glsl";

import {
    WebGLRenderer,
    Scene,
    OrthographicCamera,
    PlaneGeometry,
    RawShaderMaterial,
    MeshBasicMaterial,
    Mesh,
    Clock,
    Vector2,
} from "three";

/* Renderer */
const canvas = document.querySelector( "canvas" );
const renderer = new WebGLRenderer( { canvas, antialias: window.devicePixelRatio < 2, antialias: false } );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

/* Camera */
const aspect = window.innerWidth / window.innerHeight;
const camera = new OrthographicCamera( - 1 * aspect, 1 * aspect, 1, - 1, 0.1, 5 );

camera.position.set( 0, 0, 1 );

/* Mesh */
const uniforms = {
    uTime: { value: 0 },
    uCursor: { value: new Vector2( 0.5, 0.5 ) },
    uResolution: { value: new Vector2( window.innerWidth, window.innerHeight ) },
};
const material = new RawShaderMaterial( {
    wireframe: false,
    transparent: false,
    vertexShader: vertex_shader,
    fragmentShader: fragment_shader,
    uniforms,
} );
const geometry = new PlaneGeometry( 2, 2, 1, 1 );
const mesh = new Mesh( geometry, material );

mesh.scale.set( 1 * aspect, 1, 1 );

/* Scene */
const scene = new Scene();

scene.add( camera, mesh );

/* Animate */
const clock = new Clock();

renderer.setAnimationLoop( _ => {

    const elapsed_time = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed_time;
    renderer.render( scene, camera );

} );

/* Resize */
window.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - 1 * aspect;
    camera.right = 1 * aspect;
    camera.updateProjectionMatrix();

    mesh.scale.set( 1 * aspect, 1, 1 );
    uniforms.uResolution.value.set( window.innerWidth, window.innerHeight );

} );

window.addEventListener( "mousemove", event => {

    const x = event.clientX / window.innerWidth;
    const y = 1 - event.clientY / window.innerHeight;

    uniforms.uCursor.value.set( x, y );

} );
