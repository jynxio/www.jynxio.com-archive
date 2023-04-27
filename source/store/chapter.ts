import { createSignal } from "solid-js";

type H1Node = { name: string, uuid: string };

const [ get, set ] = createSignal<H1Node[]>();

export { get, set };
