import "/style/public/reset.css";
// import data from "three/examples/fonts/helvetiker_regular.typeface.json";
import data from "/static/json/jynxio-700.json";
import * as three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import FontOutline from "./FontOutline";

const renderer = new three.WebGLRenderer( { antialias: true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

camera.position.set( 0, - 400, 600 );

const scene = new three.Scene();

scene.background = new three.Color( 0xf0f0f0 );

const loader = new FontLoader();
const font = loader.parse( JSON.parse( data ) );

const color = 0x006699;

const matDark = new three.LineBasicMaterial( {
    color: color,
    side: three.DoubleSide
} );
const matLite = new three.MeshBasicMaterial( {
    color: color,
    transparent: true,
    opacity: 0.4,
    side: three.DoubleSide
} );

const message = "JYNXIO";

const shapes = font.generateShapes( message, 100 );

const geometry = new three.ShapeGeometry( shapes );

geometry.computeBoundingBox();

const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

geometry.translate( xMid, 0, 0 );
// TODO
// TODO
// TODO
// TODO
// TODO http://localhost:8080/test-font.html
// TODO
// TODO
// TODO
const text = new three.Mesh( geometry, matLite );
text.position.z = - 150;
scene.add( text );

const holeShapes = [];

for ( let i = 0; i < shapes.length; i ++ ) {

	const shape = shapes[ i ];

	if ( shape.holes && shape.holes.length > 0 ) {

		for ( let j = 0; j < shape.holes.length; j ++ ) {

			const hole = shape.holes[ j ];
			holeShapes.push( hole );

		}

	}

}
console.log( shapes );
shapes.push.apply( shapes, holeShapes );
// shapes.push( ...holeShapes );

const lineText = new three.Object3D();

for ( let i = 0; i < shapes.length; i ++ ) {

    const shape = shapes[ i ];

    const points = shape.getPoints();
    const geometry = new three.BufferGeometry().setFromPoints( points );

    geometry.translate( xMid, 0, 0 );

    const lineMesh = new three.Line( geometry, matDark );
    lineText.add( lineMesh );

}

/****************************************/
scene.add( new FontOutline( "JYNXIO", 100 ) );
scene.add( new three.Mesh( new three.BoxGeometry(), new three.MeshBasicMaterial( { color: 0xff0000 } ) ) );
/****************************************/

// scene.add( lineText );

const controls = new OrbitControls( camera, renderer.domElement );

controls.target.set( 0, 0, 0 );
controls.update();
controls.addEventListener( 'change', render );
window.addEventListener( 'resize', onWindowResize );

render();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {

    renderer.render( scene, camera );

}
