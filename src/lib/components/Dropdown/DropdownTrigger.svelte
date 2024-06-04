<script lang="ts">
	import { getContext } from 'svelte';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';
	import { debounce, toggle } from './functions.js';

	let context: Writable<context> = getContext('dropdown');
	let debounceState = { isDebouncing: false };

	const handleClick = () => {
		debounce(() => toggle(context), 400, debounceState);
	};

	const handleEnter = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if ($context.isExpanded && $context.currentIndex > -1) return;
			else handleClick();
		}
	};
</script>

<button on:click={handleClick} class={$$props.class} on:keydown={handleEnter}>
	<slot />
</button>
