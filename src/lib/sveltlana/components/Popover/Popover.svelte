<script lang="ts">
	import type { Context } from './context.js';
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

	const uid = $props.id();

	let context: Context = $state({
		uid,
		isExpanded: false,
		closeOnOutsideClick: true
	});

	setContext('popover', context);

	$effect(() => {
		context.closeOnOutsideClick = closeOnOutsideClick;
	});
</script>

<div class={twMerge('relative inline-block', className)} tabindex="-1">
	{@render children()}
</div>
