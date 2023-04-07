import style from "./Nav.module.css";
import Search from "./Search";
import Directory from "./Directory";
import Control from "./Control";

function Nav () {

	return (
		<nav class={ style.nav }>
			<section class="search">
				<Search />
			</section>
			<section class="directory">
				<Directory />
			</section>
			<section class="control">
				<Control />
			</section>
		</nav>
	);

}

export default Nav;
