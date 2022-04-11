#define PI 3.1415926535897932384626433832795

precision mediump float;

varying vec2 vUv;
varying float vTime;
varying vec2 vCursor;

vec4 myWarping( vec2 uv, float time ) {

    time /= 10.0;

    for ( float i = 1.0; i < 7.0; i++ ) {

        uv.x += 0.6 / i * cos( i * 2.0 * uv.y + time );
        uv.y += 0.6 / i * cos( i * 5.0 * uv.x + time );

    }

    float ratio = sin( time - uv.y - uv.x );

    ratio = abs( ratio );
    ratio = clamp( 0.1 / ratio, 0.1, 1.1 ) - 0.1;
    ratio = floor( ratio * 5.0 ) / 5.0; // 颜色分层

    vec3 greenColor = vec3( 0.0, 0.502, 0.502 );
    vec3 purpleColor = vec3( 0.365, 0.447, 0.965 );
    vec3 blackColor = vec3( 0.0, 0.0, 0.0 );
    vec3 mixedColor = purpleColor;

    mixedColor = mix( mixedColor, greenColor, ratio );
    mixedColor = mix( blackColor, mixedColor, ratio );

    return vec4( mixedColor, 1.0 );

}

void main() {

    gl_FragColor = myWarping( vUv, vTime );

}
