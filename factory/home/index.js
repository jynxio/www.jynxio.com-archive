import * as dom from "./dom";

import vertex_shader from "./vertex.glsl";

import fragment_shader from "./fragment.glsl";

import { WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, RawShaderMaterial, Mesh, Clock } from "three";

/* Renderer */
const renderer = new WebGLRenderer( { canvas: dom.canvas, antialias: window.devicePixelRatio < 2 } );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

/* Camera */
const aspect = window.innerWidth / window.innerHeight;
const camera = new OrthographicCamera( - 1, 1, 1 * aspect, - 1 * aspect, 0.1, 5 );

camera.position.set( 0, 0, 1 );

/* Mesh */
const uniforms = {
    uTime: { value: 0 },
};
const material = new RawShaderMaterial( {
    vertexShader: vertex_shader,
    fragmentShader: fragment_shader,
    uniforms,
} );
const geometry = new PlaneGeometry( 2, 2 * aspect, 128, 128 );
const mesh = new Mesh( geometry, material );

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

    // TODO 需要resize mesh，如果只是用scale，则会导致mesh的网格孔径不统一。

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;

    camera.top = 1 * aspect;
    camera.bottom = - 1 * aspect;
    camera.updateProjectionMatrix();

} );
