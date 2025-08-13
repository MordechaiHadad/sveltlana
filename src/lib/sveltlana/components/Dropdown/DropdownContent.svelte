<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { Context } from './context';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import type { Alignment } from '../../types';
	import { getDynamicPosition } from '../../functions';

	let {
		class: className = '',
		children,
		transition = slide
	}: { class?: string; children: Snippet; transition?: typeof slide } = $props();

	let context: Context = getContext('dropdown');
	let position: Alignment = 'bottom';

	const setDynamicPositioning = (node: HTMLElement) => {
		position = getDynamicPosition(node, 'vertical');

		node.classList.remove('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
		node.classList.add(position);
	};
</script>

{#if context.isExpanded}
	<div
		id="dropdown-content"
		class={twMerge('z-50 absolute flex min-w-full flex-col', className)}
		transition:transition
		use:setDynamicPositioning
	>
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
