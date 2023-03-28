import "/source/style/global/reset.css";

import App from "./App";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

const root = document.getElementById( "root" ) as HTMLElement;
const code = () => (
	<Router>
		<App/>
	</Router>
);

render( code, root );
