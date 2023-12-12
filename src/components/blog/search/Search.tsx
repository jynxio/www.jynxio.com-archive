import style from './Search.module.css';
import data from '@/temps/configs/detailCatalog.json';
import Fuse from 'fuse.js';
import * as store from '@/stores/search';
import { Portal } from 'solid-js/web';
import { A } from '@solidjs/router';
import { For, Show, batch, createSignal, onCleanup, onMount } from 'solid-js';

/**
 * Type declaration
 */
type Item = { html: string; topicName: string; postName: string };
type List = Item[];

/**
 * Fuzzy search
 */
const fuse = new Fuse(data, {
	includeScore: true,
	includeMatches: true,
	threshold: 0.2,
	minMatchCharLength: 1,
	keys: [['children', 'alias']],
});

function Search() {
	let barRef: HTMLDivElement | undefined;
	let optionRef: HTMLElement | undefined;

	const [getList, setList] = createSignal<List>([]);
	const [getSelectedIndex, setSelectedIndex] = createSignal(-1); // -1 represents that no one has been selected

	onMount(() => {
		document.addEventListener('pointerdown', handleEscape);
		document.addEventListener('keydown', handleShortcut);
		document.addEventListener('keydown', handleSelect);
	});
	onCleanup(() => {
		document.removeEventListener('pointerdown', handleEscape);
		document.removeEventListener('keydown', handleShortcut);
		document.removeEventListener('keydown', handleSelect);
	});

	return (
		<Portal mount={document.querySelector('body')!}>
			<Show when={store.getEnabled()}>
				<aside class={style.container} style={{ display: store.getEnabled() ? '' : 'none' }}>
					<div class={style.bar} ref={barRef}>
						<section class={style.input}>
							<span>
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
									class="lucide lucide-search"
								>
									<circle cx="11" cy="11" r="8" />
									<line x1="21" x2="16.65" y1="21" y2="16.65" />
								</svg>
							</span>
							<span>
								<input
									type="text"
									placeholder=" 搜索"
									onInput={handleInput}
									ref={ref => Promise.resolve().then(() => (ref.focus(), (ref.value = '')))}
								/>
							</span>
						</section>
						<Show when={getList().length}>
							<hr />
						</Show>
						<section class={style.output} ref={optionRef} onPointerDown={handleClick}>
							<For each={getList()}>
								{(item, getIndex) => (
									<A
										href={`/blog/${item.topicName}/${item.postName}`}
										class={style.link}
										innerHTML={item.html}
										onPointerLeave={[handleBlur, getIndex]}
										onPointerEnter={[handleFocus, getIndex]}
									/>
								)}
							</For>
						</section>
					</div>
				</aside>
			</Show>
		</Portal>
	);

	function handleInput(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		const data = fuse.search(target.value);
		const newList: List = createList(data);

		setList(newList);
	}

	function handleEscape(event: PointerEvent) {
		const target = event.target as HTMLElement;
		const isFocus = barRef?.contains(target);

		isFocus || close();
	}

	function handleBlur(_: () => number, event: PointerEvent) {
		const target = event.target as HTMLLinkElement;

		target.blur();
		setSelectedIndex(-1);
	}

	function handleFocus(getIndex: () => number, event: PointerEvent) {
		const target = event.target as HTMLLinkElement;

		target.focus();
		setSelectedIndex(getIndex());
	}

	function handleClick(event: PointerEvent) {
		// Note: 此函数会立即注销掉目标元素，而默认事件（指跳转）发生在此函数之后，因此必须手动调用click。
		//       如果可以，passive是更加可读的选择，可惜JSX中总是无法使用该特性。
		const target = event.target as HTMLElement;

		if (target.tagName.toLowerCase() !== 'a') return;

		target.click();
		target.blur();
		event.preventDefault();
		close();
	}

	function handleSelect(event: KeyboardEvent) {
		if (!store.getEnabled()) return;
		if (getList().length === 0) return;

		const key = event.key.toLowerCase();

		/* Key: arrow up */
		if (key === 'arrowup') {
			const prevIndex = getSelectedIndex();
			const nextIndex = prevIndex <= 0 ? getList().length - 1 : prevIndex - 1;

			setSelectedIndex(nextIndex);
			(optionRef?.children[nextIndex] as HTMLLinkElement)?.focus();
			return;
		}

		/* Key: arrow down */
		if (key === 'arrowdown' || key === 'tab') {
			const prevIndex = getSelectedIndex();
			const nextIndex = (prevIndex + 1) % getList().length;

			event.preventDefault();
			setSelectedIndex(nextIndex);
			(optionRef?.children[nextIndex] as HTMLLinkElement)?.focus();
			return;
		}

		/* Key: enter */
		if (key === 'enter') {
			if (getSelectedIndex() === -1) return;

			(optionRef?.children[getSelectedIndex()] as HTMLLinkElement)?.click();
			close();
		}
	}

	function handleShortcut(event: KeyboardEvent) {
		const key = event.key.toLowerCase();
		const enabled =
			key === '/' && !store.getEnabled()
				? true
				: key === 'escape' && store.getEnabled()
					? false
					: store.getEnabled();

		if (enabled === store.getEnabled()) return;

		event.preventDefault();
		enabled ? store.setEnabled(true) : close();
	}

	function close() {
		batch(() => {
			setList([]);
			setSelectedIndex(-1);
			store.setEnabled(false);
		});
	}
}

function createList(data: any) {
	const list: List = [];

	for (const { item: topic, matches } of data) {
		if (matches === void 0) continue;

		for (const { refIndex, indices } of matches) {
			if (refIndex === void 0) continue;

			const post = topic.children[refIndex];
			const categoryHtml = `<span>${topic.alias}</span>`;
			const postHtmlPrefix = '<span>';
			const postHtmlSuffix = '</span>';

			let postHtmlMiddle = '';
			let from = 0;
			let to = 0;

			for (const index of indices) {
				to = index[0];

				postHtmlMiddle += post.alias.slice(from, to);
				postHtmlMiddle += `<mark>${post.alias.slice(index[0], index[1] + 1)}</mark>`;

				from = index[1] + 1;
			}

			postHtmlMiddle += post.alias.slice(from);

			const postHtml = postHtmlPrefix + postHtmlMiddle + postHtmlSuffix;
			const connectionHtml = '<span> - </span>';
			const html = categoryHtml + connectionHtml + postHtml;

			list.push({ html, topicName: topic.name, postName: post.name });
		}
	}

	return list;
}

export default Search;
