import "@/component/jynx-ui/tree/index";
import directoryData from "@/store/directory";
import { For } from "solid-js";

type Who = [ postTypeIndex: number, postInfoIndex: number ];

function Directory ( props: { who: Who } ) {

	return (
		<For each={ directoryData }>
			{
				firstLevelNode => (
					<>
						<FirstLevel name={ firstLevelNode[ 0 ] } />
						<For each={ firstLevelNode[ 1 ] }>
							{
								secondLevelNode => (
									<>
										<SecondLevel name={ secondLevelNode[ 0 ] } />
									</>
								)
							}
						</For>
					</>
				)
			}
		</For>
	);

	function FirstLevel ( props: { name: string } ) {

		return (
			<div class="first-level">
				<span class="name">{ props.name }</span>
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
				</span>
			</div>
		);

	}

	function SecondLevel ( props: { name: string } ) {

		return (
			<div class="second-level">
				<span class="name">{ props.name }</span>
			</div>
		);

	}

}

export default Directory;
