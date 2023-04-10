import style from "./Catalogue.module.css";
import { For } from "solid-js";

type ChildNode = { name: string };
type ParentNode = { name: string, children: ChildNode[] };
type Props = { data?: ParentNode[] };

function Catalogue ( props: Props ) {

	return (
		<div class={ style.catalog }>
			<For each={ props.data }>{
				parentNode => (
					<div class={ style.parent }>
						<p class={ style.info }>
							<span class={ style.icon } />
							<span class={ style.name } />
						</p>
						<hr />
						<For each={ firstLevelNode.children }>{
							secondLevelNode => (
								<>
									<p class={ style.node }>{ secondLevelNode.name }</p>
									<data class={ style.data }>{ "2023/03/30 20:54" }</data>
									<hr />
								</>
							)
						}</For>
					</div> )
			}</For>
		</div>
	);

}

export default Catalogue;
