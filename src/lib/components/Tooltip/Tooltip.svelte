<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type { context } from './context.js';
	import { writable, type Writable } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';

	let context: Writable<context> = writable({
		isHovered: false
	});

	setContext('tooltip', context);
</script>

<div class={twMerge('relative inline-block', $$props.class)} tabindex="-1">
	<slot />
</div>

<style>
	.tooltip {
		position: relative;
		display: inline-block;
	}
</style>
