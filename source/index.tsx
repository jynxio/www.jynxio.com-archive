import "@/style/reset.css";
import "@/style/global.css";
import Post from "@/page/Post";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";
import { inject } from "@vercel/analytics";

inject();

const root = document.getElementById( "root" ) as HTMLElement;
const code = () => (
	<Router>
		<Routes>
			<Route path="/*path" component={ Post }/>
		</Routes>
	</Router>
);

render( code, root );
