<script lang="ts">
	import { getContext } from 'svelte';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { getDynamicPosition } from '$lib/functions.js';
	import type { Alignment } from '$lib/types.js';
	import { twMerge } from 'tailwind-merge';

	let context: Writable<context> = getContext('dropdown');
	let position: Alignment = 'bottom';
	export let transition = slide;

	const setDynamicPositioning = (node: HTMLElement) => {
		position = getDynamicPosition(node, 'vertical');

		node.classList.remove('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
		node.classList.add(position);
	};
</script>

{#if $context.isExpanded}
	<div
		id="dropdown-content"
		class={twMerge('z-50 absolute flex min-w-full flex-col', $$props.class)}
		transition:transition
		use:setDynamicPositioning
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
