precision mediump float;

varying vec2 vUv;
varying float vTime;
varying vec2 vResolution;

vec4 warp( vec2 uv, float time ) {

    vec2 pixelStep = vec2( 1.0 ) / vResolution;
    vec2 pixelIndex = floor( uv / pixelStep ); // 0, 1, 2, 3, ...
    vec2 pixelIndex4 = mod( pixelIndex, 4.0 ); // 0, 1, 2, 3, 0, 1, 2, 3, ..., 0, 1, 2, 3
    mat4 pattern = mat4(
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    );
    vec4 row = vec4( // 取y行
        step( 0.0, 0.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 0.5 ) * step( 0.0, 1.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 1.5 ) * step( 0.0, 2.5 - pixelIndex4.y ),
        step( 0.0, pixelIndex4.y - 2.5 )
    );
    vec4 col = vec4( // 取x列
        step( 0.0, 0.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 0.5 ) * step( 0.0, 1.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 1.5 ) * step( 0.0, 2.5 - pixelIndex4.x ),
        step( 0.0, pixelIndex4.x - 2.5 )
    );
    float strength = length( col * pattern * row );

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

    return vec4( mixedColor * strength, 1.0 );

}

void main() {

    gl_FragColor = warp( vUv, vTime );

}
