import { JSX } from "solid-js/jsx-runtime";

/* TODO 为() => JSX.Element的入参增加类型解释 */

interface MarkdownProps {
	data: string;
	async?: boolean;
	fallback?: string | JSX.Element;
	elements?: {
		blockquote?: () => JSX.Element,
		br?: () => JSX.Element,
		checkbox?: () => JSX.Element,
		code?: () => JSX.Element,
		codespan?: () => JSX.Element,
		del?: () => JSX.Element,
		em?: () => JSX.Element,
		heading?: () => JSX.Element,
		hr?: () => JSX.Element,
		html?: () => JSX.Element,
		image?: () => JSX.Element,
		link?: () => JSX.Element,
		list?: () => JSX.Element,
		listitem?: () => JSX.Element,
		paragraph?: () => JSX.Element,
		strong?: () => JSX.Element,
		table?: () => JSX.Element,
		tablecell?: () => JSX.Element,
		tablerow?: () => JSX.Element,
		text?: () => JSX.Element,
	};
}

export type { MarkdownProps };
