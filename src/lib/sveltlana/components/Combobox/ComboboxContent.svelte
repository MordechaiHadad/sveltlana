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
		class={twMerge(
			'combobox-content fixed z-50 flex flex-col [position-area:block-end] [position-try-fallbacks:flip-block,flip-inline] min-w-max supports-[min-width:anchor-size(width)]:min-w-[anchor-size(width)] [margin-block-start:4px] mx-0 p-0 border-0 text-inherit bg-transparent',
			className
		)}
		popover={context.closeOnOutsideClick() ? 'auto' : 'manual'}
		style:position-anchor="--combobox-{context.uid}"
		use:showPopover
		ontoggle={handleToggle}
		transition:transition
	>
		{@render children()}
	</div>
{/if}
