<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { scroll } from './functions.js';

	export let pointStyle = '';

	let context = getContext('carousel') as Writable<context>;
	let length = 0;
	let currentSlide = 0;
	let points: { index: number; type: 'big' | 'small' | 'hidden' }[] = [];

	context.subscribe((value) => {
		length = value.length;
		currentSlide = value.currentSlide;
	});
</script>

<div class={twMerge('flex items-center gap-1 overflow-hidden', $$props.class)}>
	{#each { length } as _, i}
		<button
			on:click={() => {
				scroll('prev', context, i);
			}}
		>
			<svg
				class={pointStyle}
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				{...$context.currentSlide === i ? { 'data-active': '' } : {}}
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
			</svg>
		</button>
	{/each}
</div>
