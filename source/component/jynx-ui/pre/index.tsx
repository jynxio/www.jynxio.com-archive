import style from "./index.css?raw";

const content = `
<style>${ style }</style>
<div class="code">
	<slot name="code"></slot>
</div>
<div class="expand">
	<slot name="expand"></slot>
</div>
<div class="collapse">
	<slot name="collapse"></slot>
</div>
`.trim();
const template = document.createElement( "template" );

template.innerHTML = content;

class JynxPre extends HTMLElement {

	constructor () {

		super();

		this.attachShadow( { mode: "closed" } ).appendChild( template.content.cloneNode( true ) );

	}

}

customElements.define( "jynx-pre", JynxPre );
