const content = `
<style>
.container {
	position: relative;
}

.collapse-button {
	position: sticky;
	bottom: 0;
}

.copy-button {
	position: absolute;
	top: 0;
	right: 0;
}
</style>
<div class="container">
	<section class="panel">
	    <slot name="panel"></slot>
	</section>
	<section class="collapse-button">
	    <slot name="collapse-button"></slot>
	</section>
	<section class="copy-button">
		<slot name="copy-button"></slot>
	</section>
</div>
`;
const template = document.createElement( "template" );

template.innerHTML = content;

class jynxPre extends HTMLElement {

	constructor () {

		super();

		const fragmrnt = template.content.cloneNode( true );

		this.setAttribute( "class", "collapsed" );
		this.attachShadow( { mode: "closed" } ).appendChild( fragmrnt );

		const panel = this.querySelector( "[slot='panel']" ) as HTMLElement;
		const copyButton = this.querySelector( "[slot='copy-button']" ) as HTMLElement;
		const collapseButton = this.querySelector( "[slot='collapse-button']" ) as HTMLElement;

		const maxHeight = Number.parseInt( getComputedStyle( panel! ).getPropertyValue( "max-block-size" ), 10 ); // Integer
		const offsetHeight = panel!.offsetHeight;                                                                 // Integer

		/* Copy button */
		copyButton.setAttribute( "class", "idle" );   // "idle" | "pending" | "resolved" | "rejected"
		copyButton.addEventListener( "click", () => {

			if ( copyButton.getAttribute( "class" ) !== "idle" ) return;

			const unicodes = this.getAttribute( "data-code" )!.split( "," );
			const characters = unicodes.map( unicode => String.fromCodePoint( Number( unicode ) ) );
			const data = characters.join( "" );

			copyButton.setAttribute( "class", "pending" );
			navigator.clipboard.writeText( data )
				.then( () => copyButton.setAttribute( "class", "resolved" ) )
				.catch( () => copyButton.setAttribute( "class", "rejected" ) )
				.finally( () => setTimeout( () => copyButton.setAttribute( "class", "idle" ), 1000 ) );

		} );

		/* Collapse button */
		if ( offsetHeight < maxHeight ) {

			collapseButton.style.setProperty( "display", "none", "important" );

			return;

		}

		let top: number;

		const collapsed = "collapsed";
		const expanded = "expanded";

		collapseButton.addEventListener( "click", () => {

			const currentClassName = this.getAttribute( "class" );
			const nextClassName = currentClassName === collapsed ? expanded : collapsed;

			this.setAttribute( "class", nextClassName );

			nextClassName === "expanded"
				? ( top = this.getBoundingClientRect().top )
				: document.documentElement.scrollTo( { top: this.offsetTop - top, left: 0, behavior: "instant" } );

		} );

	}

}

customElements.define( "jynx-pre", jynxPre );
