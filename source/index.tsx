import "@/style/reset.css";
import "@/style/variable.css";
import "@/style/base.css";
import Post from "@/page/Post";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";
import { inject } from "@vercel/analytics";

inject();

const root = document.getElementById( "root" ) as HTMLElement;
const code = () => (
	<Router>
		<Routes>
			<Route path="/*id" component={ Post }/>
		</Routes>
	</Router>
);

render( code, root );
