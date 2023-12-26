import style from './Theme.module.css';

function Theme(props: { mode: 'light' | 'dark' }) {
	return (
		<span class={style.theme}>
			<span class={`${style.icon} ${style.sun}`} classList={{ [style.selected]: props.mode === 'light' }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-sun"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			</span>
			<span class={`${style.icon} ${style.moon}`} classList={{ [style.selected]: props.mode === 'dark' }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-moon"
				>
					<path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
				</svg>
			</span>
			<span class={`${style.line} ${style.long}`} />
			<span class={`${style.line} ${style.short}`} />
		</span>
	);
}

export default Theme;
