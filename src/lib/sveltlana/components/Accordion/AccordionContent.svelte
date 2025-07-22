<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { Context } from './context';

	type Props = {
		children: Snippet;
		transition?: (node: Element, params: any) => any;
		class?: string;
	};
	let { children, transition = slide, class: className = '' }: Props = $props();

	let context: Context = getContext('accordion');
</script>

{#if context.isExpanded}
	<div transition:transition={{}} class={className}>
		{@render children()}
	</div>
{/if}
