<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { Context } from './context';
	import { twMerge } from 'tailwind-merge';

	type ChildrenSnippet = Snippet<[{ isExpanded: boolean }]>;

	let { class: className = '', children }: {
		class?: string;
		children: ChildrenSnippet;
	} = $props();

	let context: Context = $state({
		isExpanded: false
	});

	setContext('accordion', context);
</script>

<div class={twMerge('flex flex-col', className)}>
	{@render children({ isExpanded: context.isExpanded })}
</div>
