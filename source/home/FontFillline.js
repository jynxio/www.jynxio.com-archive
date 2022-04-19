import data from "/static/json/cover-100.json";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Mesh } from "three";
import { DoubleSide as double_side } from "three";
import { MeshBasicMaterial } from "three";
import { ShapeGeometry } from "three";
import { Box3 } from "three";
import { Vector3 } from "three";
import { Float32BufferAttribute } from "three";

const material = new MeshBasicMaterial( {
    vertexColors: true,
    side: double_side, // 必需
} );

export default class FontFillline {

    /**
     * 构造字符轮廓线。
     * @param { string } message - 字符串。
     * @param { number } height - 字符的高度，比如100。
     * @param { number } space - 字符的间距（垂直方向），比如10。
     * @returns { Object } - Mesh实例，代表字符串的填充线。
     */
    constructor( message, height, space ) {

        this._message = message;
        this._height = height;
        this._space = space;

        /* 创建填充线。 */
        const font = new FontLoader().parse( JSON.parse( data ) );
        const shapes = font.generateShapes( message, height );
        const geometry = new ShapeGeometry( shapes );
        const mesh = new Mesh( geometry, material );

        const colors = [];
        let count = geometry.getAttribute( "position" ).count;

        while ( count-- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

        geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );

        /* 居中 */
        const box3 = new Box3().expandByObject( mesh );
        const offset = box3.getCenter( new Vector3() );

        geometry.translate( - offset.x, - offset.y, 0 );
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        this._font = mesh;

    }

    /**
     * 获取实例。
     * @returns { Object } - Group实例。
     */
    get() {

        return this._font;

    }

    /**
     * 获取文本。
     * @returns { string } - 文本。
     */
    getMessage() {

        return this._message;

    }

    /**
     * 获取字符的高度。
     * @returns { number } - 字符的高度。
     */
    getHeight() {

        return this._height;

    }

    /**
     * 获取字符的间距（垂直方向）。
     * @returns { number } - 字符的间距（垂直方向）。
     */
    getSpace() {

        return this._space;

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