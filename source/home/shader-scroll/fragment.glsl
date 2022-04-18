precision mediump float;

varying vec2 vUv;

void main() {

    float strength = pow( 0.1 / ( distance( vec2( vUv.y, ( vUv.x - 0.5 ) * 8.0 + 0.5 ), vec2( 0.5 ) ) ), 1.5 );

    gl_FragColor = vec4( strength );

}
