<script lang="ts">
	import { setContext } from 'svelte';
	import type { IContext } from './context.ts';
	import { twMerge } from 'tailwind-merge';

	let { class: className = '' } = $props();

	let context: IContext = $state({
		isExpanded: false
	});

	setContext('accordion', context);

	const toggle = () => context.isExpanded = !context.isExpanded;
</script>

<button onclick={toggle} class={twMerge('flex flex-col', className)}>
	<slot isExpanded={context.isExpanded} />
</button>
