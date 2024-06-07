<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';

	const context: Writable<context> = getContext('carousel');

	const updateContext = (node: HTMLElement) => {
		context.update((ctx) => ({
			...ctx,
			length: node.children.length,
			currentItem: node.children[0] as HTMLElement
		}));
	};
</script>

<div
	class={twMerge('flex snap-both snap-mandatory snap-start overflow-hidden', $$props.class)}
	data-carousel-content
	use:updateContext
>
	<slot />
</div>
