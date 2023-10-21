precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
uniform vec2 uResolution;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vTime;
varying vec2 vResolution;

void main() {

    vUv = uv;
    vTime = uTime;
    vResolution = uResolution;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

}