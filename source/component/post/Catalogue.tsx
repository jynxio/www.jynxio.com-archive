import style from "./Catalogue.module.css";
import { For, Show, createSelector, createSignal } from "solid-js";

type ChildNode = { name: string };
type ParentNode = { name: string, children: ChildNode[] };
type Props = { data?: ParentNode[] };

function Catalogue ( props: Props ) {

	const [ getTargetParent, setTargetParent ] = createSignal( - 1 ); // The index of the target parentNode (-1 represents no target parentNode)
	const [ getTargetChild, setTargetChild ] = createSignal( - 1 );   // The index of the target childNode (-1 represents no target childNode)

	const isTargetParent = createSelector( getTargetParent );
	const isTargetChild = createSelector( getTargetChild );

	return (
		<div class={ style.catalog }>
			<For each={ props.data }>{
				( parentNode, getIndex ) => (
					<>
						<div class={ style.parent } classList={ { [ style.selected ]: isTargetParent( getIndex() ) } } onClick={ [ handleParentClick, getIndex() ] }>
							<span class={style.name}>{ parentNode.name }</span>
							<span class={ style.icon }>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
							</span>
						</div>
						<Show when={ isTargetParent( getIndex() ) }>
							<For each={ parentNode.children }>{
								( childNode, getIndex ) => (
									<div class={ style.child } classList={ { [ style.selected ]: isTargetChild( getIndex() ) } } onClick={ [ handleChildClick, getIndex() ] }>
										<span class={style.name}>{ childNode.name }</span>
										<data class={ style.data }>{ "2023/03/30 20:54" }</data>
									</div>
								)
							}</For>
						</Show>
					</>
				)
			}</For>
		</div>
	);

	function handleParentClick ( index: number, event: Event ) {

		if ( getTargetParent() !== index ) {

			setTargetParent( index );
			setTargetChild( 0 );

			return;

		}

		setTargetParent( - 1 );
		setTargetChild( - 1 );

	}

	function handleChildClick ( index: number, event: Event ) {

		setTargetChild( index );

	}

}

export default Catalogue;
