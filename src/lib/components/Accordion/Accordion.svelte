<script lang="ts">
	import { setContext } from 'svelte';
	import type { Context } from './context.ts';
	import { twMerge } from 'tailwind-merge';

	let { class: className = '' } = $props();

	let context: Context = $state({
		isExpanded: false
	});

	setContext('accordion', context);
</script>

<div class={twMerge('flex flex-col', className)}>
	<slot isExpanded={context.isExpanded} />
</div>
