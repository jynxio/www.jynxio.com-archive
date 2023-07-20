import style from './Post.module.css';
import defineJynxPre from '@/web-components/createJyxPre';
import { useParams } from '@solidjs/router';
import { createComputed, createResource, createSignal, Switch, Match } from 'solid-js';

defineJynxPre();

function Post() {
    let controller: AbortController;
    let handleDelay: NodeJS.Timeout;
    let handleTimeout: NodeJS.Timeout;

    const params = useParams();
    const [getHtml] = createResource(
        () => params.path.split('/'),
        async ([topicName, postName]) => {
            if (!topicName || !postName) return '';

            controller = new AbortController();
            const url = `${import.meta.env.BASE_URL}blog/post/${topicName}/${postName}.html`;
            const res = await fetch(url, { signal: controller.signal });

            return res.ok ? await res.text() : Promise.reject(new Error('404 (Not Found)'));
        },
        { initialValue: '' },
    );
    const [getState, setState] = createSignal<'idle' | 'pending' | 'resolved' | 'rejected'>('idle');

    // FIXME 似乎不应该使用initialValue
    // FIXME 当快速连续点击不同的链接时，getHtml的返回值会出错
    createComputed(() => {
        if (getHtml.state === 'ready' && !getHtml()) {
            setState('idle');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
        } else if (getHtml.state === 'errored') {
            setState('rejected');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
        } else if (getHtml.state === 'ready' && getHtml()) {
            setState('resolved');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
        } else if (getHtml.state === 'refreshing') {
            handleDelay = setTimeout(() => {
                getHtml.state === 'refreshing' && setState('pending');
            }, 200);
            handleTimeout = setTimeout(() => {
                getHtml.state === 'refreshing' && controller.abort();
            }, 3000);
        }
    });

    return (
        <div>
            <Switch>
                <Match when={getState() === 'idle'}>
                    <Welcome />
                </Match>
                <Match when={getState() === 'pending'}>
                    <Loader />
                </Match>
                <Match when={getState() === 'rejected'}>
                    <Missing />
                </Match>
                <Match when={getState() === 'resolved'}>
                    <Content html={getHtml()} />
                    <Topic />
                </Match>
            </Switch>
        </div>
    );
}

function Welcome() {
    return <div class={style.welcome}>:P</div>;
}

function Missing() {
    return <div class={style.missing}>xP</div>;
}

function Content(props: { html: string }) {
    return (
        <div class={style.content}>
            <article class={style.article} innerHTML={props.html} />
        </div>
    );
}

function Topic() {
    return <></>;
}

function Loader() {
    return (
        <aside class={style.loader}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-loader-2"
            >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
        </aside>
    );
}

export default Post;
