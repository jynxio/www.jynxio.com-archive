import data from "/static/json/jynxio-700.json";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Group } from "three";
import { BufferGeometry } from "three";
import { Line } from "three";
import { LineBasicMaterial } from "three";
import { Box3 } from "three";
import { Vector3 } from "three";
import { Float32BufferAttribute } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Mesh } from "three";
import { MeshBasicMaterial } from "three";
import { DoubleSide as double_side } from "three";

export default class FontLine {

    /**
     * 构造字符轮廓线。
     * @param { string } message - 字符串。
     * @param { number } height - 字符的高度，比如100。
     * @param { number } space - 字符的间距（垂直方向），比如10。
     * @param { number } thickness - 线条的宽度，比如1。
     * @returns { Object } - Group实例，代表字符串的轮廓线。
     */
    constructor( message, height, space, thickness ) {

        /* 创建轮廓线。 */
        const lines = new Group();
        const font = new FontLoader().parse( JSON.parse( data ) );
        const shapes = font.generateShapes( message, height );
        const MyLine = thickness === 1 ? MyThinLine : MyBoldLine;

        shapes.forEach( shape => {

            const line = new MyLine( shape, thickness );

            lines.add( line );

            if ( ! shape.holes ) return;
            if ( ! shape.holes.length ) return;

            shape.holes.forEach( hole => line.add( new MyLine( hole, thickness ) ) );

        } );

        /* TODO：清空原间距。 */

        /* 制造间距（垂直方向）。 */
        const rows = message.split( "\n" );

        rows.forEach( ( row, index ) => {

            const offset = - index * space;

            const from_index = rows.slice( 0, index ).reduce( ( count, string ) => {

                return count + Array.from( string ).length;

            }, 0 )
            const to_index = from_index + Array.from( row ).length;

            for ( let i = from_index; i < to_index; i++ ) {

                lines.children[ i ].translateY( offset );

            }

        } );

        /* 居中。 */
        const offset = new Box3().setFromObject( lines ).getCenter( new Vector3() );

        lines.children.forEach( line => {

            line.translateX( - offset.x );
            line.translateY( - offset.y );
            line.translateZ( - offset.z );

        } );

        this._fontLine = lines;

    }

    /**
     * 获取实例。
     * @returns { Object } - Group实例。
     */
    get() {

        return this._fontLine;

    }

    /**
     * 设置位置。
     * @param { number } x - x坐标。
     * @param { number } y - y坐标。
     * @param { number } z - z坐标。
     */
    setPosition( x, y, z ) {

        this.get().position.set( x, y, z );

    }

    /**
     * 缩放至原始大小的value倍。
     * @param { number } value - 缩放倍数。
     */
    setScale( value ) {

        this.get().scale.set( value, value, value );

    }

}

const thin_material = new LineBasicMaterial( {
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
    vertexColors: true,
} );

const bold_material = new MeshBasicMaterial( {
    side: double_side, // 必需
    vertexColors: true,
} );

/**
 * 构造细线条。
 * @param { Object } path - Path实例。
 * @param { number } thickness - 线条宽度，该线条的宽度恒定为1。
 * @returns { Object } - Line实例。
 */
function MyThinLine( path, thickness ) {

    const divisions = 12;
    const points = path.getPoints( divisions );

    const colors = [];
    const positions = [];

    for ( let i = 0; i < points.length; i++ ) {

        const vector2 = points[ i ];

        positions.push( vector2.x, vector2.y, 0 );
        colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

    }

    const geometry = new BufferGeometry();

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( "position", new Float32BufferAttribute( positions, 3 ) );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const line = new Line( geometry, thin_material );

    return line;

}

/**
 * 构造粗线条。
 * @param { Object } path - Path实例。
 * @param { number } thickness - 线条宽度。
 * @returns { Object } - Line实例。
 */
function MyBoldLine( path, thickness ) {

    const divisions = 12;
    const points = path.getPoints( divisions );
    const style = SVGLoader.getStrokeStyle( thickness, "rgb(255,255,255)" );
    const geometry = SVGLoader.pointsToStroke( points, style );

    const colors = [];
    let count = geometry.getAttribute( "position" ).count;

    while ( count-- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

    const line = new Mesh( geometry, bold_material );

    return line;

}
