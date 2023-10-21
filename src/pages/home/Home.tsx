import style from './Home.module.css';
import * as three from 'three';
import Wave from './Wave';
import Font from './Font';
import { onMount } from 'solid-js';

function Home() {
    let divRef: HTMLDivElement | undefined;
    let canvasRef: HTMLCanvasElement | undefined;

    onMount(() => draw(canvasRef!, divRef!));

    return (
        <div class={style.container} ref={divRef}>
            <canvas ref={canvasRef} />
        </div>
    );
}

function draw(canvas: HTMLCanvasElement, container: HTMLElement) {
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

    wave.setPosition(0, 0, -2);
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
        position: [0, 0, -1],
    });

    scene.add(font.getEntity());

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
     * Resize
     */
    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            size.x = Math.round(entry.contentBoxSize[0].inlineSize);
            size.y = Math.round(entry.contentBoxSize[0].blockSize);

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
        }
    });

    observer.observe(container, { box: 'content-box' });
}

export default Home;
