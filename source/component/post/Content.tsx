import * as store from "@/store/postCatalog";
import { createEffect } from "solid-js";

function Content () {

	createEffect( () => {

		console.log( store.getTopic(), store.getPost() );

	} );

	return <div />;

}

export default Content;
