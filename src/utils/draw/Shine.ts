import vertexShader from './shader-shine/vertex.glsl?raw';
import fragmentShader from './shader-shine/fragment.glsl?raw';
import * as three from 'three';

class Shine {
    private entity;

    /**
     * 构造器
     * @param size 尺寸
     */
    constructor(size: number) {
        const material = new three.RawShaderMaterial({
            wireframe: false,
            transparent: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        const geometry = new three.PlaneGeometry(size, size, 1, 1);
        const mesh = new three.Mesh(geometry, material);

        this.entity = mesh;
    }

    getEntity() {
        return this.entity;
    }

    setPosition(x: number, y: number, z: number) {
        this.getEntity().position.set(x, y, z);
    }

    setVisible(visible: boolean) {
        this.getEntity().visible = visible;
    }

    blink() {
        let startTime = performance.now();
        const duration = 1200; // ms
        const magnitude = 0.5; // 变化的幅度

        const self = this;

        requestAnimationFrame(function loop() {
            const elapsedTime = performance.now() - startTime;

            if (elapsedTime >= duration) return;

            requestAnimationFrame(loop);

            const strength = easeOutElastic(elapsedTime / duration) * magnitude;

            self.getEntity().scale.setY(1 - strength);
        });
    }
}

function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export default Shine;
