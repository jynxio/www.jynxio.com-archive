import style from "./Directory.module.css";
import data from "@/store/directory";
import { For } from "solid-js";

function Directory () {

	return (
		<div class={ style.directory }>
			<div class={ style[ "type-node-group" ] }>
				<For each={ data }>{
					typeNode => (
						<>
							<div class={ `${ style[ "type-node" ] } collapsed` }>
								<span class="name">{ typeNode.name }</span>
								<span class={ style.icon }>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
								</span>
							</div>
							<div class="post-node-group">
								<For each={ typeNode.children }>{
									postNode => (
										<div class="post-node">
											<span class="name">{ postNode.name }</span>
										</div>
									)
								}</For>
							</div>
						</>
					)
				}</For>
			</div>
		</div>
	);

}

export default Directory;
