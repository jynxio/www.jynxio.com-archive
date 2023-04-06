interface Props {
	children: string
}

interface HeadingNode {
	level: number;
	text: string;
	children: HeadingNode[];
}

type IntFrom2To6 = 2 | 3 | 4 | 5 | 6;

export type { Props, HeadingNode, IntFrom2To6 };
