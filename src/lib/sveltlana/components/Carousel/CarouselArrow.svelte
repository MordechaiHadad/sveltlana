<!-- DEPRECATED: This component is deprecated and should not be used. -->

<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { scroll } from './functions.js';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { IContext } from './context';
	import { twMerge } from 'tailwind-merge';

	const dispatch = createEventDispatcher();

	export let type: 'prev' | 'next';

	const context: Writable<context> = getContext('carousel');
</script>

<button
	class={twMerge(
		`z-50 size-fit`,
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
