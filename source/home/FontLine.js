import data from "/static/json/jynxio-700.json";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Group } from "three";
import { BufferGeometry } from "three";
import { Line } from "three";
import { LineBasicMaterial } from "three";
import { DoubleSide as double_side } from "three";
import { Box3 } from "three";
import { Vector3 } from "three";
import { Float32BufferAttribute } from "three";
import { Color } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";

const pure_color = new Color();
const white_color = new Color( 0xf2f5f7 );
const green_color = new Color( 0x377e7f );
const purple_color = new Color( 0x5d72f6 );

const thin_material = new LineBasicMaterial( {
    vertexColors: true,
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
} );
const bold_material = new LineMaterial( {
    linewidth: 3,
    worldUnits: true,
    vertexColors: true,
} );

/**
 * 构造细线条，该线条的宽度恒定为1px。
 * @param { Object } path - Path实例。
 * @returns { Object } - Line实例。
 */
function MyThinLine( path ) {

    const divisions = 12;
    const points = path.getPoints( divisions );

    const colors = [];
    const positions = [];

    for ( let i = 0; i < points.length; i++ ) {

        /* Color */
        const strength = i / ( points.length - 1 ) * 3; // ∈[0, 3]

        if ( strength <= 1 ) {                          // ∈[0, 1]

            pure_color.copy( green_color ).lerp( white_color, strength );

        } else if ( strength >= 2 ) {                   // ∈[2, 3]

            pure_color.copy( purple_color ).lerp( green_color, strength - 2 );

        } else {                                        // ∈(1, 2)

            pure_color.copy( white_color ).lerp( purple_color, strength - 1 );

        }

        colors.push( pure_color.r, pure_color.g, pure_color.b );

        /* Position */
        const vector2 = points[ i ];

        positions.push( vector2.x, vector2.y, 0 );

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
 * 构造粗线条，该线条的join处存在严重瑕疵。
 * @param { Object } path - Path实例。
 * @returns { Object } - Line实例。
 */
function MyBoldLine( path ) {

    const divisions = 12;
    const points = path.getPoints( divisions );

    const colors = [];
    const positions = [];

    for ( let i = 0; i < points.length; i++ ) {

        /* Color */
        const strength = i / ( points.length - 1 ) * 3; // ∈[0, 3]

        if ( strength <= 1 ) {                          // ∈[0, 1]

            pure_color.copy( green_color ).lerp( white_color, strength );

        } else if ( strength >= 2 ) {                   // ∈[2, 3]

            pure_color.copy( purple_color ).lerp( green_color, strength - 2 );

        } else {                                        // ∈(1, 2)

            pure_color.copy( white_color ).lerp( purple_color, strength - 1 );

        }

        colors.push( pure_color.r, pure_color.g, pure_color.b );

        /* Position */
        const vector2 = points[ i ];

        positions.push( vector2.x, vector2.y, 0 );

    }

    const geometry = new LineGeometry();

    geometry.setColors( colors );
    geometry.setPositions( positions );

    const line = new Line2( geometry, bold_material );

    return line;

}

export default class FontLine {

    /**
     * 构造字符轮廓线。
     * @param { string } message - 字符串。
     * @param { number } height - 字符的高度，比如100。
     * @param { number } space - 字符的间距（垂直方向），比如10。
     * @returns { Object } - Group实例，代表字符串的轮廓线。
     */
    constructor( message, height, space ) {

        /* 创建轮廓线。 */
        const lines = new Group();
        const font = new FontLoader().parse( JSON.parse( data ) );
        const shapes = font.generateShapes( message, height );

        shapes.forEach( shape => {

            const line = new MyThinLine( shape );
            // const line = new MyBoldLine( shape );

            lines.add( line );

            if ( ! shape.holes ) return;
            if ( ! shape.holes.length ) return;

            shape.holes.forEach( hole => line.add( new MyThinLine( hole ) ) );
            // shape.holes.forEach( hole => line.add( new MyBoldLine( hole ) ) );

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
     * 获取Group实例。
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

    setScale( value ) {

        this.get().scale.set( value, value, value );

    }

}
