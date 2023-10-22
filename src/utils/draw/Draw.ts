import Wave from './Wave';
import Font from './Font';
import Shine from './Shine';
import * as three from 'three';

class Draw {
    private internalDispose;
    private internalResize;

    constructor(canvas: HTMLCanvasElement) {
        /**
         * Base
         */
        const size = { x: canvas.width, y: canvas.height };
        const renderer = new three.WebGLRenderer({ canvas, antialias: true });

        renderer.setSize(size.x, size.y);
        renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));

        const scene = new three.Scene();
        const camera = new three.OrthographicCamera(-size.x / 2, size.x / 2, size.y / 2, -size.y / 2, 0.1, 10);

        /**
         * Wave
         */
        const wave = new Wave(size.x, size.y);

        wave.setPosition(0, 0, -3);
        scene.add(wave.getEntity());

        /**
         * Font
         */
        const font = new Font({
            message: 'Jynxio',
            height: Math.max(size.x, size.y) * 0.1,
            space: Math.max(size.x, size.y) * 0.1 * 0.1,
            thickness: 0.6,
            type: 'outline',
            position: [0, 0, -2],
        });

        scene.add(font.getEntity());

        /**
         * Shine
         */
        const shine = new Shine(100);

        shine.setVisible(false);
        shine.setPosition(0, 0, -1);
        scene.add(shine.getEntity());

        const handleMouseleave = () => shine.setVisible(false);
        // const handleMousedown = () => shine.blink();
        const handleMousemove = (event: MouseEvent) => {
            /**
             *  Step 1 - 计算归一化设备坐标系下的坐标
             *  x = (event.offsetX / size.x) * 2 - 1;
             *  y = -((event.offsetY / size.y) * 2 - 1);
             *
             *  Step 2 - 计算场景坐标
             *  x = x * camera.right; // 已知camera.right等于size.x / 2
             *  y = y * camera.top;   // 已知camera.top等于size.y / 2
             *
             *  Step 3 - 简化计算过程
             *  x = event.offsetX - size.x / 2;
             *  y = size.y / 2 - event.offsetY;
             */
            const x = event.offsetX - size.x / 2;
            const y = size.y / 2 - event.offsetY;

            shine.setPosition(x, y, -1);
            shine.getVisible() || shine.setVisible(true);
        };

        canvas.addEventListener('mouseleave', handleMouseleave);
        // canvas.addEventListener('mousedown', handleMousedown);
        canvas.addEventListener('mousemove', handleMousemove);

        /**
         * Animation
         */
        const clock = new three.Clock();

        renderer.setAnimationLoop(_ => {
            const elapsed_time = clock.getElapsedTime();

            wave.setTime(elapsed_time);
            renderer.render(scene, camera);
        });

        /**
         * Dispose
         */
        this.internalDispose = () => {
            canvas.removeEventListener('mouseleave', handleMouseleave);
            // canvas.removeEventListener('mousedown', handleMousedown);
            canvas.removeEventListener('mousemove', handleMousemove);

            renderer.dispose();
        };

        /**
         * Resize
         */
        this.internalResize = (x: number, y: number) => {
            size.x = x;
            size.y = y;

            renderer.setSize(size.x, size.y);
            renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));

            camera.left = -size.x / 2;
            camera.right = size.x / 2;
            camera.top = size.y / 2;
            camera.bottom = -size.y / 2;
            camera.updateProjectionMatrix();

            wave.setSize(size.x, size.y);
            wave.setResolution(size.x, size.y);

            font.setScale((Math.max(size.x, size.y) * 0.1) / font.getHeight());
        };
    }

    resize(x: number, y: number) {
        this.internalResize(x, y);
    }

    dispose() {
        this.internalDispose();
    }
}

export default Draw;
