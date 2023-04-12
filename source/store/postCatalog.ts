import rawData from "$/asset/json/post-catalog-data.json";
import { createSignal, createUniqueId } from "solid-js";

const processedData = processData();
const [ getTopic, setTopic ] = createSignal( "" ); // Full name: getTargetTopicUuid, setTargetTopicUuid
const [ getPost, setPost ] = createSignal( "" );   // Full name: getTargetPostUuid, setTargetPostUuid

function getData () {

	return processedData;

}

function processData () {

	type PostNode = { name: string, path: string, uuid: string };
	type TopicNode = { name: string, path: string, uuid: string, children: PostNode[] };

	const processedData = rawData.map( topicNode => {

		return ( {
			name: topicNode.name,
			path: topicNode.path,
			uuid: createUniqueId(),
			children: topicNode.children.map( postNode => ( {
				name: postNode.name,
				path: postNode.path,
				uuid: createUniqueId(),
			} ) ),
		} ) as TopicNode;

	} );

	return processedData;

}

export { getData, getTopic, setTopic, getPost, setPost };
