<script lang="ts">
	import type { Context } from './context';
	import { onClickOutside } from '../../actions/onClickOutside';
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
	use:onClickOutside={{
		callback: () => {
			if (closeOnOutsideClick && context.isExpanded) {
				close();
			}
		}
	}}
>
	{@render children()}
</div>
