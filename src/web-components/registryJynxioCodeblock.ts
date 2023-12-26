const content = `
<style>
.container {
	position: relative;
}

.collapse {
	position: sticky;
	bottom: 0;
}

.copy {
	position: absolute;
    top: 0;
	right: 0;
}
</style>
<div class="container">
	<section class="codeblock">
	    <slot name="codeblock"></slot>
	</section>
	<section class="collapse">
	    <slot name="collapse"></slot>
	</section>
	<section class="copy">
        <slot name="copy"></slot>
	</section>
</div>
`;
const template = document.createElement('template');
template.innerHTML = content;

class JynxioCodeblock extends HTMLElement {
	constructor() {
		super();

		const fragmrnt = template.content.cloneNode(true);
		this.setAttribute('class', 'collapsed');
		this.attachShadow({ mode: 'closed' }).appendChild(fragmrnt);

		const codeblockSlot = this.querySelector("[slot='codeblock']") as HTMLElement;
		const copySlot = this.querySelector("[slot='copy']") as HTMLElement;
		const collapseSlot = this.querySelector("[slot='collapse']") as HTMLElement;
		const maxHeight = Number.parseInt(getComputedStyle(codeblockSlot).getPropertyValue('max-block-size'), 10); // Integer
		const offsetHeight = codeblockSlot.offsetHeight; // Integer

		/**
		 * Copy function
		 */
		let isEnabled = true;
		let handleDelay: NodeJS.Timeout;
		let handleTimeout: NodeJS.Timeout;
		let controller = new AbortController();

		const DELAY_TIME = 100;
		const TIMEOUT_TIME = 5000;

		copySlot.setAttribute('class', 'idle'); // "idle" | "pending" | "resolved" | "rejected"
		copySlot.addEventListener('click', () => {
			if (!isEnabled) return;

			isEnabled = false;

			controller = new AbortController();
			handleDelay = setTimeout(() => copySlot.setAttribute('class', 'pending'), DELAY_TIME);
			handleTimeout = setTimeout(() => controller.abort(), TIMEOUT_TIME);

			fetch(this.getAttribute('data-url') || '', { signal: controller.signal })
				.then(res => res.text())
				.then(text => navigator.clipboard.writeText(text))
				.then(() => copySlot.setAttribute('class', 'resolved'))
				.catch(() => copySlot.setAttribute('class', 'rejected'))
				.finally(() => {
					clearTimeout(handleDelay);
					clearTimeout(handleTimeout);
					setTimeout(() => {
						copySlot.setAttribute('class', 'idle');
						isEnabled = true;
					}, 1000);
				});
		});

		/**
		 * Collapse function
		 */
		if (offsetHeight < maxHeight) {
			collapseSlot.style.setProperty('display', 'none', 'important');

			return;
		}

		let top: number;
		const COLLAPSED = 'collapsed';
		const EXPANDED = 'expanded';

		collapseSlot.addEventListener('click', () => {
			const currentClassName = this.getAttribute('class');
			const nextClassName = currentClassName === COLLAPSED ? EXPANDED : COLLAPSED;

			this.setAttribute('class', nextClassName);
			nextClassName === EXPANDED
				? (top = this.getBoundingClientRect().top)
				: document.documentElement.scrollTo({
						top: this.offsetTop - top,
						left: 0,
						behavior: 'instant',
					});
		});
	}
}

function registryJynxioCodeblock() {
	customElements.define('jynxio-codeblock', JynxioCodeblock);
}

export default registryJynxioCodeblock;
