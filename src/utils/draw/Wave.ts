import vertex_shader from './shader-wave/vertex.glsl?raw';
import fragment_shader from './shader-wave/fragment.glsl?raw';

import { Vector2 } from 'three';
import { RawShaderMaterial } from 'three';
import { PlaneGeometry } from 'three';
import { Mesh } from 'three';

class Wave {
	private entity;

	/**
	 * 构造器
	 * @param width 宽度
	 * @param height 高度
	 */
	constructor(width: number, height: number) {
		const uniforms = {
			uTime: { value: 0 },
			uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
		};
		const material = new RawShaderMaterial({
			wireframe: false,
			transparent: false,
			vertexShader: vertex_shader,
			fragmentShader: fragment_shader,
			uniforms,
		});
		const geometry = new PlaneGeometry(1, 1, 1, 1);
		const mesh = new Mesh(geometry, material);

		this.entity = mesh;
		this.setSize(width, height);
	}

	/**
	 * 获取Mesh实例
	 * @returns Mesh实例
	 */
	getEntity() {
		return this.entity;
	}

	/**
	 * 设置尺寸
	 * @param width 水平方向的长度（以像素为单位）
	 * @param height 垂直方向的长度（以像素为单位）
	 */
	setSize(width: number, height: number) {
		this.getEntity().scale.set(width, height, 1);
	}

	/**
	 * 设置位置
	 * @param x x坐标
	 * @param y y坐标
	 * @param z z坐标
	 */
	setPosition(x: number, y: number, z: number) {
		this.getEntity().position.set(x, y, z);
	}

	/**
	 * 设置uniforms的time值
	 * @param time 时间值
	 */
	setTime(time: number) {
		this.getEntity().material.uniforms.uTime.value = time;
	}

	/**
	 * 设置uniforms的resolution值
	 * @param x 水平方向的分辨率
	 * @param y 纵轴方向的分辨率
	 */
	setResolution(x: number, y: number) {
		this.getEntity().material.uniforms.uResolution.value.set(x, y);
	}
}

export default Wave;
