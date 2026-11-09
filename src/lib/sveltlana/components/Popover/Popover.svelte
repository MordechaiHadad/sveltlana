<script lang="ts">
	import type { Context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { setContext, type Snippet } from 'svelte';

	let {
		closeOnOutsideClick = true,
		open = $bindable(false),
		class: className = '',
		children
	}: {
		closeOnOutsideClick?: boolean;
		open?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	const uid = $props.id();

	const context: Context = {
		uid,
		get isExpanded() {
			return open;
		},
		set isExpanded(value: boolean) {
			open = value;
		},
		get closeOnOutsideClick() {
			return closeOnOutsideClick;
		},
		open: (source?: HTMLElement) => {
			if (source) context.source = source;

			const content = context.content;
			const shouldReopen = content?.isConnected && !content.matches(':popover-open');
			context.isExpanded = true;

			if (shouldReopen) {
				const popover = content as HTMLElement & {
					showPopover(options?: { source: HTMLElement }): void;
				};
				popover.showPopover(context.source ? { source: context.source } : undefined);
			}
		},
		close: () => (context.isExpanded = false)
	};

	setContext('popover', context);
</script>

<div class={twMerge('relative inline-block', className)} tabindex="-1">
	{@render children()}
</div>
