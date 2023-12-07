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
			<div class={style.background}>
				<div>
					<ScrollSvg />
				</div>
			</div>
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

function ScrollSvg() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0.00 0.00 512.00 512.00">
			<path
				fill="currentColor"
				d="
  M 363.05 505.60
  C 324.48 511.70 278.86 505.66 248.69 478.70
  Q 228.07 460.28 217.62 434.67
  Q 215.10 428.49 211.52 415.63
  Q 179.39 300.07 147.67 184.39
  Q 144.02 171.10 142.96 164.97
  C 134.76 117.64 153.85 72.05 191.64 43.14
  C 226.82 16.23 271.57 2.80 315.51 4.40
  C 350.32 5.67 386.16 20.32 409.04 46.26
  Q 422.66 61.70 431.32 82.64
  Q 434.14 89.48 437.55 101.63
  C 457.32 172.10 480.73 259.09 496.01 313.24
  C 500.64 329.66 505.45 344.45 507.29 359.37
  C 512.43 401.18 494.49 439.29 461.59 465.07
  C 442.88 479.74 423.07 488.95 400.85 496.52
  Q 392.29 499.44 382.42 501.66
  Q 369.56 504.56 363.05 505.60
  Z
  M 178.63 103.92
  Q 166.66 130.36 171.70 159.22
  Q 173.36 168.70 177.84 184.98
  C 198.12 258.76 218.68 332.46 238.83 406.28
  Q 242.66 420.32 247.20 429.81
  Q 260.40 457.39 287.89 469.70
  C 306.77 478.14 329.77 479.87 350.24 477.67
  C 389.47 473.46 428.10 459.12 455.79 431.06
  C 468.70 417.99 477.52 398.83 478.49 380.99
  C 479.31 365.89 477.44 354.85 473.08 339.09
  Q 441.45 224.57 409.84 110.03
  Q 406.51 97.95 403.40 91.13
  Q 383.57 47.67 336.76 36.39
  C 321.74 32.77 305.52 32.56 290.01 34.10
  Q 285.98 34.50 281.04 35.56
  C 273.62 37.15 265.47 38.81 258.94 40.82
  C 226.75 50.76 193.04 72.07 178.63 103.92
  Z"
			/>
			<path
				fill="currentColor"
				d="
  M 32.64 57.61
  Q 29.16 64.50 26.00 71.96
  C 24.00 76.69 21.17 79.29 16.29 80.00
  Q 13.02 80.47 10.11 78.53
  C 2.83 73.67 4.51 66.98 7.71 59.72
  Q 13.24 47.17 21.27 36.04
  C 28.59 25.89 42.36 19.27 54.25 24.66
  C 68.62 31.17 76.66 49.04 82.88 63.06
  C 86.61 71.45 81.07 80.51 71.55 78.99
  C 66.95 78.26 65.07 75.40 63.02 71.07
  Q 59.76 64.18 56.34 57.21
  A 0.58 0.58 0.0 0 0 55.24 57.46
  L 55.26 279.69
  Q 55.26 280.74 55.81 281.63
  Q 56.83 283.31 57.62 281.38
  Q 60.51 274.34 63.36 267.29
  C 69.01 253.30 88.65 261.69 83.45 274.75
  C 77.73 289.10 68.07 310.26 52.33 315.95
  Q 46.43 318.09 40.06 316.78
  C 28.12 314.33 19.87 303.84 14.23 293.54
  C 10.49 286.70 2.80 274.20 5.69 267.47
  C 8.27 261.44 15.03 258.81 20.80 262.12
  C 24.09 264.01 24.99 266.45 26.53 269.80
  Q 29.43 276.11 32.32 282.39
  A 0.65 0.64 65.4 0 0 33.17 282.71
  Q 33.97 282.34 33.96 281.25
  Q 33.60 170.37 33.81 57.90
  A 0.62 0.62 0.0 0 0 32.64 57.61
  Z"
			/>
			<rect
				fill="currentColor"
				x="-16.94"
				y="-50.81"
				transform="translate(296.37,156.85) rotate(-15.6)"
				width="33.88"
				height="101.62"
				rx="16.42"
			/>
		</svg>
	);
}

export default Post;
