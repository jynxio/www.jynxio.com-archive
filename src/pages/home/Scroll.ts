import vertexShader from './shader-scroll/vertex.glsl?raw';
import fragmentShader from './shader-scroll/fragment.glsl?raw';

import { Line } from 'three';
import { BufferGeometry } from 'three';
import { Vector2 } from 'three';
import { LineBasicMaterial } from 'three';
import { Float32BufferAttribute } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Mesh } from 'three';
import { MeshBasicMaterial } from 'three';
import { DoubleSide } from 'three';
import { RawShaderMaterial } from 'three';
import { PlaneGeometry } from 'three';
import { Group } from 'three';

class Scroll {
    private scroll;

    /**
     * 滚动条构造器
     * @param length 滚动条的长度，比如100
     * @param thickness 滚动条的宽度，比如1
     * @returns 滚动条实例
     */
    constructor(length: number, thickness: number) {
        const flare = createFlare(length * 1);
        const createLine = thickness === 1 ? createThinLine : createBoldLine;
        const line = createLine(length, thickness);
        const group = new Group();

        group.add(flare, line);
        this.scroll = group;
    }

    /**
     * 获取内容
     * @returns 内容
     */
    get() {
        return this.scroll;
    }

    /**
     * 设置位置
     * @param x x坐标
     * @param y y坐标
     * @param z z坐标
     */
    setPosition(x: number, y: number, z: number) {
        this.get().position.set(x, y, z);
    }

    /**
     * 设置缩放
     * @param value 缩放倍数
     */
    setScale(value: number) {
        this.get().scale.set(value, value, value);
    }
}

/**
 * 创建细线
 * @param length 线段的长度，比如100
 * @returns 细线
 */
function createThinLine(length: number) {
    const positions = [0, length / 2, 0, 0, -length / 2, 0];
    const colors = [
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5,
        1,
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5,
        1,
    ];
    const geometry = new BufferGeometry();

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new LineBasicMaterial({
        linewidth: 1,
        vertexColors: true,
        linecap: 'square',
    });
    const line = new Line(geometry, material);

    return line;
}

/**
 * 创建粗线
 * @param length 线段的长度，比如100.
 * @param thickness 线段的宽度，比如1
 * @returns 粗线
 */
function createBoldLine(length: number, thickness = 2) {
    const points = [new Vector2(0, length / 2), new Vector2(0, -length / 2)];
    const material = new MeshBasicMaterial({ side: DoubleSide, vertexColors: true });
    const style = SVGLoader.getStrokeStyle(thickness, 'rgb(255,255,255)');
    const geometry = SVGLoader.pointsToStroke(points, style);
    const colors = [];

    let count = geometry.getAttribute('position').count;

    while (count--) colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);

    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const line = new Mesh(geometry, material);

    return line;
}

/**
 * 创建闪光点
 * @param size 尺寸
 * @returns 闪光点
 */
function createFlare(size: number) {
    const material = new RawShaderMaterial({
        wireframe: false,
        transparent: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    const mesh = new Mesh(geometry, material);

    mesh.scale.set(size, size, 1);

    return mesh;
}

export default Scroll;
