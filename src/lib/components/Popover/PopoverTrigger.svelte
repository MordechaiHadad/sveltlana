<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { getContext } from 'svelte';
	let context: Writable<context> = getContext('popover');

	const toggle = () => {
		context.update((value) => ({ isExpanded: !value.isExpanded }));
	};
</script>

<button class={$$props.class} on:click={toggle}><slot /></button>
