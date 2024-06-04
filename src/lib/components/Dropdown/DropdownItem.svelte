<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getContext } from 'svelte';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';
	import { toggle } from './functions.js';

	export let autoCloseOnClick = true;

	let context: Writable<context> = getContext('dropdown');

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('select', { context: context });
		if (autoCloseOnClick) toggle(context);
	};

	const onHover = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLElement;
		target.setAttribute('data-active', '');
	};

	const onHoverOut = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLElement;
		target.removeAttribute('data-active');
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
	class={$$props.class}
	on:click={handleClick}
	on:mouseover={onHover}
	on:mouseout={onHoverOut}
	tabindex="-1"
>
	<slot />
</button>
