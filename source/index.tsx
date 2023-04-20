import "@/style/global/reset.css";
import "@/style/global/variable.css";
import "@/style/global/base.css";

import Home from "@/page/Home";
import Post from "@/page/Post";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";

const root = document.getElementById( "root" ) as HTMLElement;
const code = () => (
	<Router>
		<Routes>
			<Route path="/home" component={ Home }/>
			<Route path="/post" component={ Post }/>
		</Routes>
	</Router>
);

render( code, root );
