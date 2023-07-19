import style from './Search.module.css';
import checkOs from '@/helpers/checkOs';
import data from '@/temps/configs/detailCatalog.json';
import Fuse from 'fuse.js';
import * as store from '@/stores/search';
import { Portal } from 'solid-js/web';
import { A } from '@solidjs/router';
import { For, Show, batch, createSelector, createSignal, onCleanup, onMount } from 'solid-js';

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
    let sectionRef: HTMLElement | undefined;

    const [getSelectedIndex, setSelectedIndex] = createSignal(-1); // -1 represents that no one has been selected
    const [getList, setList] = createSignal<List>([]);
    const isSelected = createSelector(getSelectedIndex);

    onMount(() => {
        document.addEventListener('pointerdown', handleClose);
        document.addEventListener('keydown', handleShortcut);
        document.addEventListener('keydown', handleSelect);
    });
    onCleanup(() => {
        document.removeEventListener('pointerdown', handleClose);
        document.removeEventListener('keydown', handleShortcut);
        document.removeEventListener('keydown', handleSelect);
    });

    return (
        <Portal mount={document.querySelector('body')!}>
            <Show when={store.getEnabled()}>
                <aside
                    class={style.container}
                    style={{ display: store.getEnabled() ? '' : 'none' }}
                >
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
                                    ref={ref =>
                                        Promise.resolve().then(
                                            () => (ref.focus(), (ref.value = '')),
                                        )
                                    }
                                />
                            </span>
                        </section>
                        <Show when={getList().length}>
                            <hr />
                        </Show>
                        <section class={style.output} ref={sectionRef}>
                            <For each={getList()}>
                                {(item, getIndex) => (
                                    <A
                                        href={`/${item.topicName}/${item.postName}`}
                                        class={style.link}
                                        innerHTML={item.html}
                                        classList={{ [style.selected]: isSelected(getIndex()) }}
                                        onPointerEnter={[handleHover, getIndex]}
                                        onPointerLeave={[handleBlur, getIndex]}
                                        onPointerDown={[handleNavigate, getIndex]}
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

    function handleClose(event: PointerEvent) {
        if (!barRef) return;

        const target = event.target as HTMLElement;
        const isFocus = barRef.contains(target);

        isFocus || store.setEnabled(false);
    }

    function handleNavigate(getIndex: () => number) {
        const link = sectionRef?.children[getIndex()] as HTMLLinkElement | undefined;

        link?.click();
        store.setEnabled(false);
    }

    function handleBlur() {
        setSelectedIndex(-1);
    }

    function handleHover(getIndex: () => number) {
        setSelectedIndex(getIndex());
    }

    function handleSelect(event: KeyboardEvent) {
        if (getList().length === 0) return;

        const key = event.key.toLowerCase();

        if (key !== 'arrowup' && key !== 'arrowdown' && key !== 'enter') return;

        /* Key: arrow up */
        if (key === 'arrowup')
            return void (getSelectedIndex() <= 0
                ? setSelectedIndex(getList().length - 1)
                : setSelectedIndex(prev => prev - 1));

        /* Key: arrow down */
        if (key === 'arrowdown')
            return void setSelectedIndex(prev => (prev + 1) % getList().length);

        /* Key: enter */
        if (getSelectedIndex() === -1) return;

        const link = sectionRef?.children[getSelectedIndex()] as HTMLLinkElement;

        link.click();
        store.setEnabled(false);
    }

    function handleShortcut(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        const isPreKeyDown = checkOs() === 'macOS' ? event.metaKey : event.ctrlKey;
        const enabled =
            key === 'k' && isPreKeyDown
                ? !store.getEnabled() // Ctrl+k or ⌘+k => switch
                : key === 'escape' && store.getEnabled()
                ? false // Escape => close
                : key === '/' && !store.getEnabled()
                ? true // Slash => open
                : store.getEnabled(); // Nothing

        if (enabled === store.getEnabled()) return;

        event.preventDefault();
        batch(() => {
            enabled && setList([]); // 清除历史搜索记录
            store.setEnabled(enabled);
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
