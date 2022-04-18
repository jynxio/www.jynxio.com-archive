import vertex_shader from "./shader-scroll/vertex.glsl";
import fragment_shader from "./shader-scroll/fragment.glsl";

import { Line } from "three";
import { BufferGeometry } from "three";
import { Vector2 } from "three";
import { LineBasicMaterial } from "three";
import { Float32BufferAttribute } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Mesh } from "three";
import { MeshBasicMaterial } from "three";
import { DoubleSide as double_side } from "three";
import { RawShaderMaterial } from "three";
import { PlaneGeometry } from "three";
import { Group } from "three";

export default class Scroll {

    /**
     * 构造线段。
     * @param { number } length - 线段的长度，比如100。
     * @param { number } thickness - 线段的宽度，比如1.
     * @returns { Object } - 线段实例。
     */
    constructor( length, thickness ) {

        const flare = new Flare( length * 1, length * 1 );

        const MyLine = thickness === 1 ? MyThinLine : MyBoldLine;
        const line = MyLine( length, thickness );

        const group = new Group();

        group.add( flare, line );

        this._scroll = group;

    }

    /**
     * 获取实例。
     * @returns { Object } - Group实例。
     */
    get() {

        return this._scroll;

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

/**
 * 构造细线条。
 * @param { number } length - 线段的长度，比如100。
 * @param { number } thickness - 线段的宽度，其宽度恒定为1。
 * @returns { Object } - Line实例。
 */
function MyThinLine( length, thickness ) {

    const positions = [
        0,   length / 2, 0,
        0, - length / 2, 0
    ];
    const colors = [
        Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
        Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
    ];
    const geometry = new BufferGeometry();

    geometry.setAttribute( "position", new Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new LineBasicMaterial( {
        linewidth: 1,
        vertexColors: true,
        linecap: "square"
    } );
    const line = new Line( geometry, material );

    return line;

}

/**
 * 构造粗线条。
 * @param { number } length - 线段的长度，比如100.
 * @param { number } thickness - 线段的宽度，比如1。
 * @returns { Object } - Mesh实例。
 */
function MyBoldLine( length, thickness ) {

    const points = [
        new Vector2( 0,   length / 2 ),
        new Vector2( 0, - length / 2 ),
    ];
    const material = new MeshBasicMaterial( { side: double_side, vertexColors: true } );
    const style = SVGLoader.getStrokeStyle( 2, "rgb(255,255,255)" );
    const geometry = SVGLoader.pointsToStroke( points, style );

    const colors = [];
    let count = geometry.getAttribute( "position" ).count;

    while ( count-- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

    geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

    const line = new Mesh( geometry, material );

    return line;

}

function Flare( width, height ) {

    const material = new RawShaderMaterial( {
        wireframe: false,
        transparent: true,
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader,
    } );
    const geometry = new PlaneGeometry( 1, 1, 1, 1 );
    const mesh = new Mesh( geometry, material );

    mesh.scale.set( width, height, 1 );

    return mesh;

}
