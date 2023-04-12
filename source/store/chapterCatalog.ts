import { createSignal } from "solid-js";

type H2Node = { name: string, uuid: string };
type H1Node = { name: string, uuid: string, children: H2Node[] };

const [ getData, setData ] = createSignal<H1Node[] | undefined>();
const [ getChapter, setChapter ] = createSignal<string | undefined>();

export { getData, setData, getChapter, setChapter };
