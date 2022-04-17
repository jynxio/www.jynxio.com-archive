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

const COLOR_PINK = 0xea3373;
const COLOR_GREEN = 0x377e7f;
const COLOR_PURPLE = 0x5d72f6;

const font = new FontLoader().parse( JSON.parse( data ) );
const material = new LineBasicMaterial( {
    vertexColors: true,
    side: double_side,
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
} );

/**
 * 构造线条。
 * @param { Object } path - Path实例。
 * @param { Object } material - LineBasicMaterial实例。
 * @returns { Object } - Line实例。
 */
function MyLine( path, material ) {

    const divisions = 12;
    const points = path.getPoints( divisions );
    const colors = [];
    const color_pink = new Color( COLOR_PINK );
    const color_green = new Color( COLOR_GREEN );
    const color_purple = new Color( COLOR_PURPLE );

    for ( let i = 0; i < points.length; i++ ) {

        // TODO
        const strength = i / ( points.length - 1 );
        const color = new Color().lerpColors( color_purple, color_pink, strength );

        colors.push( color.r, color.g, color.b );

    }

    const geometry = new BufferGeometry().setFromPoints( points );

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

    const line = new Line( geometry, material );

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
        const shapes = font.generateShapes( message, height );

        shapes.forEach( shape => {

            const line = new MyLine( shape, material );

            lines.add( line );

            if ( ! shape.holes ) return;
            if ( ! shape.holes.length ) return;

            shape.holes.forEach( hole => line.add( new MyLine( hole, material ) ) );

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

}
