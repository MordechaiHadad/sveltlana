<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { handlePopoverToggle, type Context } from './context.js';
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
		context.content = node;
		popover.showPopover(context.source ? { source: context.source } : undefined);

		return {
			destroy: () => {
				if (context.content === node) context.content = undefined;
			}
		};
	};

	const handleToggle = (event: ToggleEvent) => handlePopoverToggle(context, event);
</script>

{#if context.isExpanded}
	<div
		id="{context.uid}-content"
		class={twMerge(
			'popover-content fixed z-50 [position-area:block-end] [position-try-fallbacks:flip-block,flip-inline] [margin-block-start:4px] m-0 p-0 border-0 text-inherit bg-transparent',
			className
		)}
		popover={context.closeOnOutsideClick ? 'auto' : 'manual'}
		style:position-anchor="--popover-{context.uid}"
		use:showPopover
		ontoggle={handleToggle}
		transition:transition
	>
		{@render children()}
	</div>
{/if}
