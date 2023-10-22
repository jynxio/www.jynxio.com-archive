import style from './Home.module.css';
import Draw from '@/utils/draw';
import { onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function Home() {
    //
    const navigate = useNavigate();

    //
    let divRef: HTMLDivElement | undefined;
    let canvasRef: HTMLCanvasElement | undefined;

    let draw: Draw;
    let observer: ResizeObserver;

    //
    onMount(() => {
        draw = new Draw(canvasRef!);
        observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const x = Math.round(entry.contentBoxSize[0].inlineSize);
                const y = Math.round(entry.contentBoxSize[0].blockSize);

                draw.resize(x, y);
            }
        });
        observer.observe(divRef!, { box: 'content-box' });
    });
    onCleanup(() => {
        observer.disconnect(); // 必须优先调用observer.disconnect（因其内部会调用draw）
        draw.dispose();
    });

    //
    return (
        <div class={style.container} ref={divRef} onClick={() => navigate('/blog')}>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Home;
