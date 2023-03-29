import "/source/style/global/reset.css";

import App from "./App";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";

const root = document.getElementById( "root" ) as HTMLElement;
const code = () => (
	<Router>
		<Routes>
			<Route path="/" component={ App }/>
		</Routes>
	</Router>
);

render( code, root );
