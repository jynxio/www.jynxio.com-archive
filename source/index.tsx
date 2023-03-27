import "/source/styles/reset.css";

import App from "./App";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

render( () => (
	<Router>
		<App/>
	</Router>
), document.getElementById( "solid-app" ) as HTMLDivElement );
