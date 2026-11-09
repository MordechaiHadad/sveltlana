<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { Context } from './context.js';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	let {
		class: className = '',
		children,
		transition = slide
	}: { class?: string; children: Snippet; transition?: typeof slide } = $props();

	let context: Context = getContext('combobox');
	const showPopover = (node: HTMLElement) => {
		const popover = node as HTMLElement & {
			showPopover(options?: { source: HTMLElement }): void;
		};
		popover.showPopover(context.source ? { source: context.source } : undefined);
	};

	const handleToggle = (event: ToggleEvent) => {
		if (event.newState === 'closed' && context.isExpanded) {
			context.isExpanded = false;
			context.onCollapse(false);
		}
	};
</script>

{#if context.isExpanded}
	<div
		id="{context.uid}-content"
		class={twMerge('combobox-content z-50 flex flex-col', className)}
		popover={context.closeOnOutsideClick ? 'auto' : 'manual'}
		style:position-anchor="--combobox-{context.uid}"
		use:showPopover
		ontoggle={handleToggle}
		transition:transition
	>
		{@render children()}
	</div>
{/if}

<style>
	:global(.combobox-content) {
		position: fixed;
		position-area: bottom;
		position-try-fallbacks: flip-block, flip-inline;
		min-width: max-content;
		margin-block-start: 4px;
		margin-inline: 0;
		padding: 0;
		border: 0;
		color: inherit;
		background: transparent;
	}

	@supports (min-width: anchor-size(width)) {
		:global(.combobox-content) {
			min-width: anchor-size(width);
		}
	}
</style>
