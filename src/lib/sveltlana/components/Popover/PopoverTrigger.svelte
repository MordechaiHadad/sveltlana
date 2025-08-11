<script lang="ts">
	import type { IContext } from './context.js';
	import { getContext } from 'svelte';

	let { class: className = '', children } = $props();

	let context: IContext = getContext('popover');

	const toggle = () => {
		context.isExpanded = !context.isExpanded
	};
</script>

<button class={className} onclick={toggle}>
	{@render children()}
</button>
