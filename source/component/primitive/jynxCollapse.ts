const content = `
<style>
    section:last-child {
        position: sticky;
        bottom: 0;
    }
</style>
<section>
    <slot name="panel"></slot>
</section>
<section>
    <slot name="button"></slot>
</section>
`;
const template = document.createElement( "template" );

template.innerHTML = content;

class JynxCollapse extends HTMLElement {

	constructor () {

		super();

		const fragmrnt = template.content.cloneNode( true );

		this.setAttribute( "class", "collapsed" );
		this.attachShadow( { mode: "closed" } ).appendChild( fragmrnt );

		const panel = this.querySelector( "[slot='panel']" ) as HTMLElement;
		const button = this.querySelector( "[slot='button']" ) as HTMLElement;

		const maxHeight = Number.parseInt( getComputedStyle( panel! ).getPropertyValue( "max-block-size" ), 10 ); // Integer
		const offsetHeight = panel!.offsetHeight;                                                     // Integer

		if ( offsetHeight < maxHeight ) {

			button.style.setProperty( "display", "none", "important" );

			return;

		}

		let top: number;

		const collapsed = "collapsed";
		const expanded = "expanded";

		button.addEventListener( "click", () => {

			const currentClassName = this.getAttribute( "class" );
			const nextClassName = currentClassName === collapsed ? expanded : collapsed;

			this.setAttribute( "class", nextClassName );

			nextClassName === "expanded"
				? ( top = this.getBoundingClientRect().top )
				: document.documentElement.scrollTo( { top: this.offsetTop - top, left: 0, behavior: "instant" } );

		} );

	}

}

customElements.define( "jynx-collapse", JynxCollapse );
