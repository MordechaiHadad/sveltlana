<script lang="ts">
	import type { Context } from './context.js';
	import { getContext } from 'svelte';

	let { class: className = '', children } = $props();

	let context: Context = getContext('popover');

	const toggle = () => {
		context.isExpanded = !context.isExpanded
	};
</script>

<button class={className} onclick={toggle}>
	{@render children()}
</button>
