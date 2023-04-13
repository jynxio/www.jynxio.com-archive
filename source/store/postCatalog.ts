import rawData from "$/asset/json/post-catalog-data.json";
import { createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";

type Uuid = string | undefined;
type RawPostNode = { name: string, path: string };
type RawTopicNode = { name: string, path: string, children: RawPostNode[] };
type PostNode = { name: string, path: string, uuid: string };
type TopicNode = { name: string, path: string, uuid: string, children: PostNode[] };

const processedData = process( rawData );
const [ store, setStore ] = createStore( {
	data: processedData,
	selectedTopicUuid: void 0 as Uuid,
	selectedPostUuid: void 0 as Uuid,
} );

function getData () {

	return store.data;

}

function getPostUrl () {

	const data = store.data;
	const selectedTopicUuid = store.selectedTopicUuid;
	const selectedPostUuid = store.selectedPostUuid;

	const selectedTopic = data.find( topicNode => topicNode.uuid === selectedTopicUuid );

	if ( ! selectedTopic ) return;

	const selectedPost = selectedTopic.children.find( postNode => postNode.uuid === selectedPostUuid );

	if ( ! selectedPost ) return;

	return `./post/${ selectedTopic.path }/${ selectedPost.path }.md`;

}

function getSelectedTopic () {

	return store.selectedTopicUuid;

}

function setSelectedTopic ( uuid: Uuid ) {

	setStore( "selectedTopicUuid", uuid );

}

function getSelectedPost () {

	return store.selectedPostUuid;

}

function setSelectedPost ( uuid: Uuid ) {

	setStore( "selectedPostUuid", uuid );

}

function process ( rawData: RawTopicNode[] ) {

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

export { getData, getPostUrl, getSelectedTopic, setSelectedTopic, getSelectedPost, setSelectedPost };
