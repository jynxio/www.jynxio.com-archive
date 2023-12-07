import style from './Post.module.css';
import registryJynxioCodeblock from '@/web-components/registryJynxioCodeblock';
import { useParams } from '@solidjs/router';
import { createComputed, createResource, createSignal, Switch, Match, For, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';

registryJynxioCodeblock();

// 网络请求的逻辑：
// 如果没有发起网路请求，那么就标记为idle状态；如果发起了网络请求，且发起后的100ms内还没有敲定，
// 那么就标记为pending状态；如果发起后的5000ms内还没有敲定，那么就标记为rejected状态；如果网络
// 请求成功了，那么就标记为resolved状态；如果网络请求失败了，那么就标记为rejected状态；如果点击
// 了新的文章，那么就会发起新的网络请求；

// TODO 如果对某篇文章的网络请求失败了，那么应该设计一个机关，让用户可以重新请求该文章，比如点击空白处即可重新请求。

function Post() {
	let controller = new AbortController();
	let handleDelay: NodeJS.Timeout;
	let handleTimeout: NodeJS.Timeout;

	const DELAY_TIME = 100;
	const TIMEOUT_TIME = 5000;

	const [getState, setState] = createSignal<'idle' | 'pending' | 'resolved' | 'rejected'>('idle');
	const [getArticle] = createResource(
		() => useParams().path,
		async path => {
			const [topicName, postName] = path.split('/');

			controller.abort();
			controller = new AbortController();
			clearTimeout(handleDelay);
			clearTimeout(handleTimeout);

			if (!topicName || !postName) return { htmlString: '', topicList: [] };

			handleDelay = setTimeout(() => getArticle.state === 'refreshing' && setState('pending'), DELAY_TIME);
			handleTimeout = setTimeout(() => getArticle.state === 'refreshing' && controller.abort(), TIMEOUT_TIME);

			const [htmlString, topicList] = await Promise.all([
				(async (): Promise<string> => {
					// 请求文章资源
					const url = `${import.meta.env.BASE_URL}blog/post/${topicName}/${postName}.html`;
					const res = await fetch(url, { signal: controller.signal });

					return res.ok ? await res.text() : Promise.reject(new Error('Not Found or Timeout'));
				})(),
				(async (): Promise<{ text: string; uuid: string }[]> => {
					// 请求目录资源
					const url = `${import.meta.env.BASE_URL}blog/topic/${topicName}/${postName}.json`;
					const res = await fetch(url, { signal: controller.signal });

					return res.ok ? await res.json() : Promise.reject(new Error('Not Found or Timeout'));
				})(),
			]);

			return { htmlString, topicList };
		},
		{ initialValue: { htmlString: '', topicList: [] } },
	);

	createComputed(() => {
		if (getArticle.state === 'ready' && getArticle().htmlString === '') {
			setState('idle');

			clearTimeout(handleDelay);
			clearTimeout(handleTimeout);
		} else if (getArticle.state === 'ready' && getArticle().htmlString !== '') {
			setState('resolved');

			clearTimeout(handleDelay);
			clearTimeout(handleTimeout);
		} else if (getArticle.state === 'errored') {
			setState('rejected');

			clearTimeout(handleDelay);
			clearTimeout(handleTimeout);
		}
	});

	return (
		// FIXME Loader和其它组件是互斥的，我希望能够把它该进程Loader组件与其它组件是并存的，这样当加载新文章的时候，loading动画就可以覆盖旧页面，这样看起来似乎更酷
		<div class={style.container}>
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
					<Article data={getArticle().htmlString} />
					<Topic data={getArticle().topicList} />
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

function Article(props: { data: string }) {
	let ref: HTMLDivElement | undefined;

	createEffect(() => props.data && ref?.scrollTo(0, 0));

	return (
		<div class={style.article} ref={ref}>
			<article innerHTML={props.data} />
		</div>
	);
}

function Topic(props: { data: { text: string; uuid: string }[] }) {
	return (
		<Portal mount={document.querySelector('body')!}>
			<aside class={style.topic}>
				<ul>
					<For each={props.data}>
						{topic => (
							<li onClick={[handleClick, topic.uuid]}>
								<span title={topic.text}>{topic.text}</span>
							</li>
						)}
					</For>
				</ul>
			</aside>
		</Portal>
	);

	function handleClick(uuid: string) {
		document.querySelector('.' + style.article)!.scrollTo({
			top: document.getElementById(uuid)!.offsetTop - 16,
			left: 0,
			behavior: 'smooth',
		});
	}
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
