import style from "./index.css?raw";

const content = `
<style>${ style }</style>
<pre>
	<slot></slot>
</pre>
<button class="expand">
	<span>显示更多</span>
	<span>显示更少</span>
</button>
`.trim();
const template = document.createElement( "template" );

template.innerHTML = content;

class JynxPre extends HTMLElement {

	constructor () {

		super();

		const fragment = template.content.cloneNode( true ) as DocumentFragment;
		const button = fragment.querySelector( "button" );

		button!.addEventListener( "click", event => {

			const button = event.currentTarget as HTMLElement;
			const className = button.getAttribute( "class" );

			button.setAttribute( "class", className === "expand" ? "collapse" : "expand" );

		} );

		this.attachShadow( { mode: "closed" } ).appendChild( fragment );

	}

}

customElements.define( "jynx-pre", JynxPre );
