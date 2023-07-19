import style from './Post.module.css';
import { useParams } from '@solidjs/router';
import { createEffect, createResource } from 'solid-js';

function Post() {
    const params = useParams();
    const getUrl = () => {
        const [topicName, postName] = params.path.split('/');

        if (!topicName || !postName) return; // 当getUrl返回false、null、undefined时，不会触发createResource

        return `${import.meta.env.BASE_URL}blog/post/${topicName}/${postName}.txt`;
    };
    const [getHtml] = createResource(getUrl, async url => {
        const res = await fetch(url);

        return res.ok ? await res.text() : undefined;
    });

    createEffect(() => console.log(getHtml()));

    // TODO
    return <div></div>;
}

function Welcome() {
    return <div class={style.welcome}>:P</div>;
}

function Missing() {
    return <div class={style.missing}>xP</div>;
}

function Content() {}

function Topic() {}

function Loader() {
    return (
        <aside class={style.loading}>
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
