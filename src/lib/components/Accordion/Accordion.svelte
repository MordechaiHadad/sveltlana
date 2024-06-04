<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { context } from './context.ts';
	
	let context: Writable<context> = writable({
		isExpanded: false,
	});

	setContext('accordion', context);

	const toggle = () => {
		context.update(value => ({ isExpanded: !value.isExpanded }));
	};
</script>

<button
	on:click={toggle}
	class="accordion {$$props.class}"
>
    <slot />
</button>

<style>
	.accordion {
		display: flex;
		flex-direction: column;
	}
</style>
