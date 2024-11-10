<script lang="ts">
	import type { IContext } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { setContext } from 'svelte';
	import { clickOutside } from '$lib/actions/clickOutside.js';

	let { closeOnOutsideClick = true, class: className = '' } = $props();

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
	<slot />
</div>
