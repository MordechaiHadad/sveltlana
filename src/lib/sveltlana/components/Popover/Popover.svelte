<script lang="ts">
	import type { IContext } from './context';
	import { twMerge } from 'tailwind-merge';
	import { setContext, type Snippet } from 'svelte';
	import { clickOutside } from '../../actions/clickOutside';

	let {
		closeOnOutsideClick = true,
		class: className = '',
		children
	}: {
		closeOnOutsideClick?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	let context: IContext = $state({
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
	use:clickOutside={{
		callback: () => {
			if (closeOnOutsideClick) close();
		}
	}}
>
	{@render children()}
</div>
