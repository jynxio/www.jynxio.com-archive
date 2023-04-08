import style from "./Directory.module.css";
import { For } from "solid-js";
import { getData, getWho, setWho } from "@/store/directory";

function Directory () {

	return (
		<div class={ style.directory }>
			<For each={ getData() }>{
				( typeNode, getTypeIndex ) => (
					<>
						<div
							class={ `${ style.type } ${ style.node }` }
							classList={ { [ style.selected ]: getTypeIndex() === getWho()[ 0 ] } }
						>
							<span class={ style.name }>{ typeNode.name }</span>
							<span class={ style.icon }>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
							</span>
						</div>
						<div
							class={ `${ style.post } ${ style.group }` }
							classList={ { [ style.selected ]: getTypeIndex() === getWho()[ 0 ] } }
						>
							<For each={ typeNode.children }>{
								( postNode, getPostIndex ) => (
									<div
										class={ `${ style.post } ${ style.node }` }
										classList={ { [ style.selected ]: getPostIndex() === getWho()[ 1 ] } }
									>
										<span class={ style.name }>{ postNode.name }</span>
									</div>
								)
							}</For>
						</div>
					</>
				)
			}</For>
		</div>
	);

}

export default Directory;
