<script lang="ts">
	import type { Context } from './context.js';
	import { getContext, type Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();

	let context: Context = getContext('popover');
	let trigger: HTMLButtonElement;

	const toggle = () => {
		context.source = trigger;
		context.isExpanded = !context.isExpanded;
	};
</script>

<button
	class={className}
	aria-controls="{context.uid}-content"
	aria-expanded={context.isExpanded}
	style:anchor-name="--popover-{context.uid}"
	onclick={toggle}
	bind:this={trigger}
>
	{@render children()}
</button>
