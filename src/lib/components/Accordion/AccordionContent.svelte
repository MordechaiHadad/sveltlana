<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';

	let context: Writable<context> = getContext('accordion');
	export let transition = slide;
</script>

{#if $context.isExpanded}
	<div transition:transition>
		<slot />
	</div>
{/if}
