<script lang="ts">
	import type { Context } from './context';
	import { twMerge } from 'tailwind-merge';
	import { setContext, type Snippet } from 'svelte';

	let {
		closeOnOutsideClick = true,
		class: className = '',
		children
	}: {
		closeOnOutsideClick?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	let context: Context = $state({
		isExpanded: false
	});

	setContext('popover', context);

	const close = () => {
		context.isExpanded = false;
	};
</script>

<div
	class={twMerge('relative inline-block', className)}
	tabindex="-1"
	onfocusout={(event) => {
		if (
			closeOnOutsideClick &&
			context.isExpanded &&
			!event.currentTarget.contains(event.relatedTarget as Node)
		)
			close();
	}}
>
	{@render children()}
</div>
