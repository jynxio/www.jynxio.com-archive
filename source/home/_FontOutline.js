import data from "/static/json/jynxio-700.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Group } from "three";
import { BufferGeometry } from "three";
import { Line } from "three";
import { LineBasicMaterial } from "three";
import { DoubleSide as double_side } from "three";
import { Box3 } from "three";
import { Vector3 } from "three";

const font = new FontLoader().parse( JSON.parse( data ) );
const material = new LineBasicMaterial( {
    color: 0x000000,
    side: double_side,
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
} );

/**
 * 构造字符轮廓线。
 * @param { string } message - 字符。
 * @param { number } height - 单个字符的高度。
 * @returns { Object } - Object3D实例，代表字符的轮廓线。
 */
export default function( message, height ) {

    const outlines = new Group();
    const shapes = font.generateShapes( message, height );

    shapes.forEach( shape => {

        outlines.add( new Outline( shape, material ) );

        if ( ! shape.holes ) return;
        if ( ! shape.holes.length ) return;

        shape.holes.forEach( hole => outlines.add( new Outline( hole, material ) ) )

    } );


    const center = new Box3().setFromObject( outlines ).getCenter( new Vector3() );

    outlines.children.forEach( line => {

        const geometry = line.geometry;

        geometry.translate( - center.x, - center.y, - center.z );
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

    } );

    return outlines;

    function Outline( path, material ) {

        const divisions = 12;
        const points = path.getPoints( divisions );
        const geometry = new BufferGeometry().setFromPoints( points );
        const line = new Line( geometry, material );

        return line;

    }

}
