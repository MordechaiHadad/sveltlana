<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { scroll } from './functions.js';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';

	const dispatch = createEventDispatcher();

	export let type: 'prev' | 'next';

	const context: Writable<context> = getContext('carousel');
</script>

<button
	class={twMerge(
		`z-50 absolute top-1/2 -translate-y-1/2 ${type === 'prev' ? '-left-12' : '-right-12'}`,
		$$props.class
	)}
	data-carousel-arrow
	on:click={(event) => {
		dispatch('click');
		const parentElement = event.currentTarget.parentElement;
		if (parentElement) scroll(type, context);
	}}
>
	<slot />
</button>
