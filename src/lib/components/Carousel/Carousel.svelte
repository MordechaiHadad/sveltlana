<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { context } from './context.js';
	import type { Direction } from '$lib/types.js';
	import { twMerge } from 'tailwind-merge';

	const dispatch = createEventDispatcher();

	export let direction: Direction = 'column';

	let context: Writable<context> = writable({
		direction,
		currentSlide: 0,
		length: 0
	});

	setContext('carousel', context);

	const updateContext = (node: HTMLElement) => {
		context.update((ctx) => ({
			...ctx,
			carousel: node
		}));
	}
</script>

<div
	class={twMerge('relative', $$props.class)}
	use:updateContext
	on:wheel={(event) => {
		dispatch('scroll', {
			event,
			context,
		});
	}}
>
	<slot />
</div>
