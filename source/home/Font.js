import font_100_data from "/static/json/threejs-100.json";
import font_700_data from "/static/json/threejs-700.json";

import { BufferGeometry } from "three";
import { Line } from "three";
import { MeshBasicMaterial } from "three";
import { LineBasicMaterial } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Mesh } from "three";
import { DoubleSide as double_side } from "three";
import { ShapeGeometry } from "three";
import { Box3 } from "three";
import { Vector3 } from "three";
import { Group } from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Float32BufferAttribute } from "three";

export default class Font {

    #type;
    #space;
    #entity;
    #height;
    #message;
    #thickness;

    /**
     * 构造字体。
     * @param { Object } options - 配置。
     * @param { number } options.message - 文本。
     * @param { number } options.height - 字符高度，比如100。
     * @param { number } options.space - 垂直方向上的字符间距，比如10。
     * @param { number } options.thickness - 线宽，比如2。
     * @param { string } options.type - "fillline"或"outline"。
     * @returns { Object } - 实例。
     */
    constructor( { message, height, space, thickness, type } ) {

        this.#type = type;
        this.#space = space;
        this.#height = height;
        this.#message = message;
        this.#thickness = thickness;

        const ThisLine = type === "fillline" ? FillLine : Outline;
        const font_data = type === "fillline" ? font_100_data : font_700_data;

        const font = new FontLoader().parse( JSON.parse( font_data ) );
        const shapes = font.generateShapes( message, height );

        this.#entity = new ThisLine( shapes, message, thickness, space );

    }

    getEntity() {

        return this.#entity;

    }

    getMessage() {

        return this.#message;

    }

    getHeight() {

        return this.#height;

    }

    getSpace() {

        return this.#space;

    }

    getThickness() {

        return this.#thickness;

    }

    getType() {

        return this.#type;

    }

    /**
     * 设置位置。
     * @param { number } x - x坐标。
     * @param { number } y - y坐标。
     * @param { number } z - z坐标。
     */
    setPosition( x, y, z ) {

        this.getEntity().position.set( x, y, z );

    }

    /**
     * 缩放至原始大小的n倍。
     * @param { number } n - 缩放倍数。
     */
    setScale( n ) {

        this.getEntity().scale.set( n, n, n );

    }

}

const thin_outline_material = new LineBasicMaterial( {
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
    vertexColors: true,
} );

/**
 * 构造细线，该线条的宽度恒定为1。
 * @param { Object } path - Path实例。
 * @returns { Object } - Line实例。
 */
function ThinOutline( path ) {

    const divisions = 12;
    const points = path.getPoints( divisions );

    const colors = [];
    const positions = [];

    for ( let i = 0; i < points.length; i++ ) {

        const vector2 = points[ i ];

        colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
        positions.push( vector2.x, vector2.y, 0 );

    }

    const geometry = new BufferGeometry();

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( "position", new Float32BufferAttribute( positions, 3 ) );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const line = new Line( geometry, thin_outline_material );

    return line;

}

const bold_outline_material = new MeshBasicMaterial( {
    vertexColors: true,
    side: double_side, // 必需
} );

/**
 * 构造粗线。
 * @param { Object } path - Path实例。
 * @param { number } thickness - 线宽。
 * @returns { Object } - Mesh实例。
 */
function BoldOutline( path, thickness ) {

    const divisions = 12;
    const points = path.getPoints( divisions );

    const style = SVGLoader.getStrokeStyle( thickness, "rgb(255,255,255)" );
    const geometry = SVGLoader.pointsToStroke( points, style );

    const colors = [];
    let count = geometry.getAttribute( "position" ).count;

    while ( count-- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

    const mesh = new Mesh( geometry, bold_outline_material );

    return mesh;

}

const fillline_material = new MeshBasicMaterial( {
    vertexColors: true,
    side: double_side, // 必需
} );

/**
 * 构造字体的填充线。
 * @param { Array } paths - 由Path实例组成的数组。
 * @returns { Object } - Mesh实例。
 */
function FillLine( paths ) {

    const geometry = new ShapeGeometry( paths );

    const colors = [];
    let count = geometry.getAttribute( "position" ).count;

    while ( count-- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

    const mesh = new Mesh( geometry, fillline_material );

    /* 居中 */
    const offset = new Box3().expandByObject( mesh ).getCenter( new Vector3() );

    geometry.translate( - offset.x, - offset.y, 0 );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return mesh;

}

/**
 * 构造字体的轮廓线。
 * @param { Array } paths - 由Path实例组成的数组。
 * @param { string } message - 文本。
 * @param { number } thickness - 线宽。
 * @param { number } space - 垂直方向上的字符间距。
 * @returns { Object } - Group实例。
 */
function Outline( paths, message, thickness, space ) {

    const group = new Group();
    const ThisLine = thickness === 1 ? ThinOutline : BoldOutline;

    /* 创建线条。 */
    paths.forEach( path => {

        const line = new ThisLine( path, thickness );

        group.add( line );

        if ( ! path.holes ) return;
        if ( ! path.holes.length ) return;

        path.holes.forEach( hole => line.add( new ThisLine( hole, thickness ) ) );

    } );

    /* TODO 清空原间距。 */

    /* 制造垂直间距。 */
    const rows = message.split( "\n" );

    rows.forEach( ( row, index ) => {

        const offset = - index * space;

        const from_index = rows.slice( 0, index ).reduce( ( count, string ) => {

            return count + Array.from( string ).length;

        }, 0 )
        const to_index = from_index + Array.from( row ).length;

        for ( let i = from_index; i < to_index; i++ ) {

            group.children[ i ].translateY( offset );

        }

    } );

    /* 居中。 */
    const offset = new Box3().setFromObject( group ).getCenter( new Vector3() );

    group.children.forEach( line => {

        line.translateX( - offset.x );
        line.translateY( - offset.y );
        line.translateZ( - offset.z );

    } );

    /* 返回 */
    return group;

}