<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { IContext } from './context.js';

	let context: IContext = getContext('accordion');
	export let transition = slide;
</script>

{#if context.isExpanded}
	<div transition:transition>
		<slot />
	</div>
{/if}
