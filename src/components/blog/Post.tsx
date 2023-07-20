import style from './Post.module.css';
import defineJynxPre from '@/web-components/createJyxPre';
import { useParams } from '@solidjs/router';
import { createComputed, createResource, createSignal, Switch, Match } from 'solid-js';

defineJynxPre();

// 如果没有发起网路请求，那么就标记为idle状态；如果发起了网络请求，且发起后的200ms内还没有敲定，
// 那么就标记为pending状态；如果发起后的3000ms内还没有敲定，那么就标记为rejected状态；如果网络
// 请求成功了，那么就标记为resolved状态；如果网络请求失败了，那么就标记为rejected状态；如果点击
// 了新的文章，那么就会发起新的网络请求；

// TODO 如果对某篇文章的网络请求失败了，那么应该设计一个机关，让用户可以重新请求该文章，比如点击空白处即可重新请求。

function Post() {
    let controller = new AbortController();
    let handleDelay: NodeJS.Timeout;
    let handleTimeout: NodeJS.Timeout;

    const DELAY_TIME = 200;
    const TIMEOUT_TIME = 3000;

    const [getState, setState] = createSignal<'idle' | 'pending' | 'resolved' | 'rejected'>('idle');
    const [getHtml] = createResource(
        () => useParams().path,
        async path => {
            const [topicName, postName] = path.split('/');

            controller.abort();
            controller = new AbortController();
            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);

            if (!topicName || !postName) return '';

            handleDelay = setTimeout(() => getHtml.state === 'refreshing' && setState('pending'), DELAY_TIME);
            handleTimeout = setTimeout(() => getHtml.state === 'refreshing' && controller.abort(), TIMEOUT_TIME);

            const url = `${import.meta.env.BASE_URL}blog/post/${topicName}/${postName}.html`;
            const res = await fetch(url, { signal: controller.signal });

            return res.ok ? await res.text() : Promise.reject(new Error('Not Found or Timeout'));
        },
        { initialValue: '' },
    );

    createComputed(() => {
        if (getHtml.state === 'ready' && getHtml() === '') {
            setState('idle');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
        } else if (getHtml.state === 'ready' && getHtml() !== '') {
            setState('resolved');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
        } else if (getHtml.state === 'errored') {
            setState('rejected');

            clearTimeout(handleDelay);
            clearTimeout(handleTimeout);
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
