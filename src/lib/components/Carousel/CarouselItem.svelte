<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';
	import type { context } from './context.js';

	let context: Writable<context> = getContext('carousel');
	let self: HTMLElement;

	onMount(() => {
		if ($context.currentItem === self) $context.currentItem.setAttribute('data-active', '');
	});
</script>

<div
	class={twMerge('flex size-full shrink-0 snap-center items-center', $$props.class)}
	bind:this={self}
>
	<slot />
</div>
