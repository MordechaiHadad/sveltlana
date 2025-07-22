<script lang="ts">
	import { getContext, Snippet } from 'svelte';
	import type { IContext } from './context';
	import { debounce, toggle } from './functions';

	let {
		class: className = '',
		children
	}: {
		class?: string;
		children?: Snippet;
	} = $props();

	let context: IContext = getContext('dropdown');
	let debounceState = { isDebouncing: false };

	const handleClick = () => {
		debounce(() => toggle(context), 400, debounceState);
	};

	const handleEnter = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (context.isExpanded && context.currentIndex > -1) return;
			else handleClick();
		}
	};
</script>

<button onclick={handleClick} class={className} onkeydown={handleEnter}>
	{@render children()}
</button>
