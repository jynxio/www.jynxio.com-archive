precision mediump float;

varying vec2 vUv;
varying float vTime;
varying vec2 vCursor;

vec4 myWarping( vec2 uv, float time ) {

    float d = distance( uv, vCursor );
    // float decay = clamp( 0.1 / distance_to_cursor, 0.0, 1.0 );

    uv -= d * 0.1;
    time /= 5.0;

    for ( float i = 1.0; i < 10.0; i++ ) {

        uv.x += 0.6 / i * cos( i * 2.0 * uv.y + time );
        uv.y += 0.6 / i * cos( i * 5.0 * uv.x + time );

    }

    float strength = sin( time - uv.y - uv.x );

    strength = abs( strength );
    strength = clamp( 0.1 / strength, 0.1, 1.1 ) - 0.1;
    strength = floor( strength * 5.0 ) / 5.0;

    // black : 16 , 20 , 25  => 0.063, 0.078, 0.098
    // grey  : 24 , 38 , 53  => 0.094, 0.149, 0.208
    // yellow: 255, 225, 0   => 1.000, 0.882, 0.000
    // purple: 93 , 114, 246 => 0.365, 0.447, 0.965
    // white : 242, 245, 247 => 0.949, 0.961, 0.969

    vec3 color1 = vec3( 0.063, 0.078, 0.098 );
    vec3 color2 = vec3( 0.365, 0.447, 0.965 );
    vec3 mixedColor = mix( color1, color2, strength );

    return vec4( mixedColor, 1.0 );

}

void main() {

    gl_FragColor = myWarping( vUv, vTime );

}
