<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	let {
		class: className,
		children
	}: {
		class?: string;
		children: Snippet
	} = $props();
</script>

<nav class={twMerge('sticky top-0 z-50 flex h-auto w-full place-content-center', className)}>
	{@render children()}
</nav>
