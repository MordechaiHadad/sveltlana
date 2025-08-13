<script lang="ts">
	import { getDynamicPosition } from '../../functions';
	import type { Alignment } from '../../types';
	import { getContext, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { Context } from './context';
	import { slide } from 'svelte/transition';

	let {
		transition = slide,
		class: className = '',
		children
	}: {
		transition?: typeof slide;
		class?: string;
		children: Snippet;
	} = $props();

	let position: Alignment = 'bottom';
	let context: Context = getContext('popover');

	const setDynamicPositioning = (node: HTMLElement) => {
		position = getDynamicPosition(node, 'vertical');

		node.classList.remove('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
		node.classList.add(position);
	};
</script>

{#if context.isExpanded}
	<div class={twMerge('absolute z-50', className)} use:setDynamicPositioning transition:transition>
		{@render children()}
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
