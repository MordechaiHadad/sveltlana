<script lang="ts">
	import { getDynamicPosition } from '$lib/functions.js';
	import type { Alignment } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';
	import type { context } from './context.js';
	import { slide } from 'svelte/transition';

	export let transition = slide;

	let position: Alignment = 'bottom';
	let context: Writable<context> = getContext('popover');

	const setDynamicPositioning = (node: HTMLElement) => {
		position = getDynamicPosition(node, 'vertical');

		node.classList.remove('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
		node.classList.add(position);
	};
</script>

{#if $context.isExpanded}
	<div
		class={twMerge('absolute z-50', $$props.class)}
		use:setDynamicPositioning
		transition:transition
	>
		<slot />
	</div>
{/if}

<style>
	.top {
		bottom: 100%;
	}
	.bottom {
		top: 100%;
	}
	.top-left {
		bottom: 100%;
		right: 0;
	}
	.top-right {
		bottom: 100%;
		left: 0;
	}
	.bottom-left {
		top: 100%;
		right: 0;
	}
	.bottom-right {
		top: 100%;
		left: 0;
	}
</style>
