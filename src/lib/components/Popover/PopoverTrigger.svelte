<script lang="ts">
	import type { IContext } from './context.js';
	import { getContext } from 'svelte';

	let { class: className = '' } = $props();

	let context: IContext = getContext('popover');

	const toggle = () => {
		context.isExpanded = !context.isExpanded
	};
</script>

<button class={className} onclick={toggle}><slot /></button>
