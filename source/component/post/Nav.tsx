import style from "./Nav.module.css";
import Search from "./Search";
import Directory from "./Directory";
import Control from "./Control";

function Nav () {

	return (
		<nav class={ style.nav }>
			<section class={ style.search }>
				<Search />
			</section>
			<hr />
			<section class={ style.directory }>
				<Directory />
			</section>
			<hr />
			<section class={ style.control }>
				<Control />
			</section>
		</nav>
	);

}

export default Nav;
