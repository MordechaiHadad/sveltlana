<!-- DEPRECATED: This component is deprecated and should not be used. -->

<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import type { Direction } from './types.js';

	export let direction: Direction = 'row';

	const context: Writable<context> = getContext('carousel');

	const updateContext = (node: HTMLElement) => {
		context.update((ctx) => ({
			...ctx,
			length: node.children.length,
			currentItem: node.children[0] as HTMLElement,
			direction
		}));
	};
</script>

<div
	class={twMerge(
		'flex snap-both snap-mandatory snap-start overflow-hidden',
		direction === 'row' ? 'flex-row' : 'flex-col',
		$$props.class
	)}
	data-carousel-content
	use:updateContext
>
	<slot />
</div>
