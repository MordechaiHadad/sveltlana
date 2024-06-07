<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { context } from './context.js';

	export let length: number;
</script>

<div class="flex items-center gap-1 overflow-hidden">
	{#each { length } as _, i}
		<button
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
			</svg>
		</button>
	{/each}
</div>
