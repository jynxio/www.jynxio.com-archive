import vertex_shader from "./shader/vertex.glsl";
import fragment_shader from "./shader/fragment.glsl";

import { Vector2 } from "three";
import { RawShaderMaterial } from "three";
import { PlaneGeometry } from "three";
import { Mesh } from "three";

export default class Wave {

    /**
     * 构造wave。
     * @param { number } width - 宽度。
     * @param { number } height - 高度。
     * @returns { Object } - Mesh实例。
     */
    constructor( width, height ) {

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new Vector2( window.innerWidth, window.innerHeight ) },
        };
        const material = new RawShaderMaterial( {
            wireframe: false,
            transparent: false,
            vertexShader: vertex_shader,
            fragmentShader: fragment_shader,
            uniforms,
        } );
        const geometry = new PlaneGeometry( 1, 1, 1, 1 );
        const mesh = new Mesh( geometry, material );

        this._mesh = mesh;
        this.setSize( width, height );

    }

    /**
     * 获取Mesh实例。
     * @returns { Object } - Mesh实例。
     */
    getMesh() {

        return this._mesh;

    }

    /**
     * 设置尺寸。
     * @param { number } width - 水平方向的长度（以像素为单位）。
     * @param { number } height - 垂直方向的长度（以像素为单位）。
     */
    setSize( width, height ) {

        this.getMesh().scale.set( width, height, 1 );

    }

    /**
     * 设置位置。
     * @param { number } x - x坐标。
     * @param { number } y - y坐标。
     * @param { number } z - z坐标。
     */
    setPosition( x, y, z ) {

        this.getMesh().position.set( x, y, z );

    }

    /**
     * 设置uniforms的time值。
     * @param { number } time - 时间值。
     */
    setTime( time ) {

        this.getMesh().material.uniforms.uTime.value = time;

    }

    /**
     * 设置uniforms的resolution值。
     * @param { number } x - 水平方向的分辨率。
     * @param { number } y - 纵轴方向的分辨率。
     */
    setResolution( x, y ) {

        this.getMesh().material.uniforms.uResolution.value.set( x, y );

    }

}
