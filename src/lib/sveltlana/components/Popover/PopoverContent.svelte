<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { Context } from './context.js';
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

	let context: Context = getContext('popover');

	const showPopover = (node: HTMLElement) => {
		const popover = node as HTMLElement & {
			showPopover(options?: { source: HTMLElement }): void;
		};
		popover.showPopover(context.source ? { source: context.source } : undefined);
	};

	const handleToggle = (event: ToggleEvent) => {
		if (event.newState === 'closed' && context.isExpanded) context.isExpanded = false;
	};
</script>

{#if context.isExpanded}
	<div
		id="{context.uid}-content"
		class={twMerge('popover-content z-50', className)}
		popover={context.closeOnOutsideClick ? 'auto' : 'manual'}
		style:position-anchor="--popover-{context.uid}"
		use:showPopover
		ontoggle={handleToggle}
		transition:transition
	>
		{@render children()}
	</div>
{/if}

<style>
	:global(.popover-content) {
		position: fixed;
		position-area: bottom;
		position-try-fallbacks: flip-block, flip-inline;
		margin-block-start: 4px;
		margin-inline: 0;
		padding: 0;
		border: 0;
		color: inherit;
		background: transparent;
	}
</style>
