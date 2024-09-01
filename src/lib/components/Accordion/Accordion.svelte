<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { onDestroy, setContext } from 'svelte';
	import type { context } from './context.ts';
	import { twMerge } from 'tailwind-merge';

	let context: Writable<context> = writable({
		isExpanded: false
	});

	setContext('accordion', context);

	const toggle = () => {
		context.update((value) => ({ isExpanded: !value.isExpanded }));
	};

	let isExpanded = false;

	const unsubscribe = context.subscribe((value) => {
		isExpanded = value.isExpanded;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<button on:click={toggle} class={twMerge('flex flex-col', $$props.class)}>
	<slot {isExpanded} />
</button>
