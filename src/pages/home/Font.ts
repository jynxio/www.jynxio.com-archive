import firacode500Data from '@/assets/fonts/firacode-500.json';

import { BufferGeometry } from 'three';
import { Line } from 'three';
import { MeshBasicMaterial } from 'three';
import { LineBasicMaterial } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Mesh } from 'three';
import { DoubleSide } from 'three';
import { ShapeGeometry } from 'three';
import { Box3 } from 'three';
import { Vector3 } from 'three';
import { Group } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { Float32BufferAttribute } from 'three';

class Font {
    #type;
    #scale;
    #space;
    #entity;
    #height;
    #message;
    #position;
    #thickness;

    /**
     * 构造器
     * @param options 配置
     * @param options.message - 文本。
     * @param options.height - 字符高度，比如100。
     * @param options.space - 垂直方向上的字符间距，比如10。
     * @param options.thickness - 线宽，比如2。
     * @param options.type - "fillline"或"outline"。
     * @param options.position - 实例的位置。
     */
    constructor({
        message,
        height,
        space,
        thickness,
        type,
        position,
    }: {
        message: string;
        height: number;
        space: number;
        thickness: number;
        type: 'fillline' | 'outline';
        position: [number, number, number];
    }) {
        this.#scale = 1;
        this.#type = type;
        this.#space = space;
        this.#height = height;
        this.#message = message;
        this.#position = position;
        this.#thickness = thickness;

        const createLine = type === 'fillline' ? createFillline : createOutline;
        const font = new FontLoader().parse(firacode500Data);
        const shapes = font.generateShapes(message, height);

        this.#entity = createLine(shapes, message, thickness, space);
        this.#entity.position.set(...position);
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

    getPosition() {
        return this.#position;
    }

    getScale() {
        return this.#scale;
    }

    /**
     * 设置位置
     * @param x x坐标
     * @param y y坐标
     * @param z z坐标
     */
    setPosition(x: number, y: number, z: number) {
        this.#position = [x, y, z];
        this.getEntity().position.set(x, y, z);
    }

    /**
     * 缩放至原始大小的n倍
     * @param n 缩放倍数
     */
    setScale(n: number) {
        this.#scale = n;
        this.getEntity().scale.set(n, n, n);
    }
}

const createThinOutlineMaterial = new LineBasicMaterial({
    linewidth: 1,
    linecap: 'round',
    linejoin: 'round',
    vertexColors: true,
});

/**
 * 创建细线（其宽度恒定为1）
 * @param path Path实例
 * @returns Line实例
 */
function createThinOutline(path) {
    const divisions = 12;
    const points = path.getPoints(divisions);

    const colors = [];
    const positions = [];

    for (let i = 0; i < points.length; i++) {
        const vector2 = points[i];

        colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
        positions.push(vector2.x, vector2.y, 0);
    }

    const geometry = new BufferGeometry();

    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const line = new Line(geometry, createThinOutlineMaterial);

    return line;
}

const boldOutlineMaterial = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }); // DoubleSide是必需的

/**
 * 创建粗线
 * @param path Path实例。
 * @param thickness 线宽。
 * @returns Mesh实例。
 */
function createBoldOutline(path, thickness: number) {
    const divisions = 12;
    const points = path.getPoints(divisions);

    const style = SVGLoader.getStrokeStyle(thickness, 'rgb(255,255,255)');
    const geometry = SVGLoader.pointsToStroke(points, style);

    const colors = [];
    let count = geometry.getAttribute('position').count;

    while (count--) colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);

    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const mesh = new Mesh(geometry, boldOutlineMaterial);

    return mesh;
}

const filllineMaterial = new MeshBasicMaterial({
    vertexColors: true,
    side: DoubleSide, // 必需
});

/**
 * 构造字体的填充线
 * @param paths 由Path实例组成的数组
 * @returns Mesh实例
 */
function createFillline(paths) {
    const geometry = new ShapeGeometry(paths);

    const colors = [];
    let count = geometry.getAttribute('position').count;

    while (count--) colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);

    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const mesh = new Mesh(geometry, filllineMaterial);

    // 居中
    const offset = new Box3().expandByObject(mesh).getCenter(new Vector3());

    geometry.translate(-offset.x, -offset.y, 0);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return mesh;
}

/**
 * 构造字体的轮廓线
 * @param paths 由Path实例组成的数组
 * @param message 文本
 * @param thickness 线宽
 * @param space 垂直方向上的字符间距
 * @returns Group实例
 */
function createOutline(paths, message: string, thickness: number, space: number) {
    const group = new Group();
    const createLine = thickness === 1 ? createThinOutline : createBoldOutline;

    /* 创建线条。 */
    paths.forEach(path => {
        const line = createLine(path, thickness);

        group.add(line);

        if (!path.holes) return;
        if (!path.holes.length) return;

        path.holes.forEach(hole => line.add(createLine(hole, thickness)));
    });

    /* TODO 清空原间距。 */

    /* 制造垂直间距。 */
    const rows = message.split('\n');

    rows.forEach((row, index) => {
        const offset = -index * space;

        const from_index = rows.slice(0, index).reduce((count, string) => {
            return count + Array.from(string).length;
        }, 0);
        const to_index = from_index + Array.from(row).length;

        for (let i = from_index; i < to_index; i++) {
            group.children[i].translateY(offset);
        }
    });

    /* 居中。 */
    const offset = new Box3().setFromObject(group).getCenter(new Vector3());

    group.children.forEach(line => {
        line.translateX(-offset.x);
        line.translateY(-offset.y);
        line.translateZ(-offset.z);
    });

    /* 返回 */
    return group;
}

export default Font;
