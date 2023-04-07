import JAVASCRIPT_OPERATORS_URL from "$/post/javascript/operators.md?url";

type PostInfoNode = [ name: string, url: string ];
type PostTypeNode = [ name: string, children: PostInfoNode[] ];

const data: PostTypeNode[] = [
	[ "JavaScript", [
		[ "js-test-1", JAVASCRIPT_OPERATORS_URL ],
		[ "js-test-2", JAVASCRIPT_OPERATORS_URL ],
	] ],
	[ "CSS", [
		[ "css-test-1", JAVASCRIPT_OPERATORS_URL ],
		[ "css-test-2", JAVASCRIPT_OPERATORS_URL ],
	] ],
	[ "Data Structure", [
		[ "ds-test-1", JAVASCRIPT_OPERATORS_URL ],
		[ "ds-test-2", JAVASCRIPT_OPERATORS_URL ],
	] ],
	[ "Browser", [
		[ "bs-test-1", JAVASCRIPT_OPERATORS_URL ],
		[ "bs-test-2", JAVASCRIPT_OPERATORS_URL ],
	] ],
	[ "Others", [
		[ "ot-test-1", JAVASCRIPT_OPERATORS_URL ],
		[ "ot-test-2", JAVASCRIPT_OPERATORS_URL ],
	] ],
];

export default data;
