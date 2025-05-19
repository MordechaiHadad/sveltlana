<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import type { Context } from "./context.js";

	type Props = {
		children: Snippet;
		class?: string;
	};
	let { children, class: className = '' }: Props = $props();
	
	let context: Context = getContext('accordion');

	const toggle = () => context.isExpanded = !context.isExpanded;
</script>

<button class={className} onclick={toggle}>
	{@render children()}
</button>
