import rawData from "@/asset/catalog/data.json";
import { createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";

type Uuid = string | undefined;
type RawPostNode = { alias: string, name: string };
type RawTopicNode = { alias: string, name: string, children: RawPostNode[] };
type PostNode = { alias: string, name: string, uuid: string };
type TopicNode = { alias: string, name: string, uuid: string, children: PostNode[] };

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

	const baseUrl = import.meta.env.BASE_URL;

	return `${ baseUrl }post/post/${ selectedTopic.name }/${ selectedPost.name }`;

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
			alias: topicNode.alias,
			name: topicNode.name,
			uuid: createUniqueId(),
			children: topicNode.children.map( postNode => ( {
				alias: postNode.alias,
				name: postNode.name,
				uuid: createUniqueId(),
			} ) ),
		} ) as TopicNode;

	} );

	return processedData;

}

export { getData, getPostUrl, getSelectedTopic, setSelectedTopic, getSelectedPost, setSelectedPost };
