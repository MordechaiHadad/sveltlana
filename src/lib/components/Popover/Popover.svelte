<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { setContext } from 'svelte';
	import { clickOutside } from '$lib/functions.js';

	export let closeOnOutsideClick = true;

	let context: Writable<context> = writable({
		isExpanded: false
	});

	setContext('popover', context);

	const close = () => {
		context.update((value) => ({ isExpanded: false }));
	};
</script>

<div
	class={twMerge('relative inline-block', $$props.class)}
	tabindex="-1"
	use:clickOutside={() => {
		if (closeOnOutsideClick) close();
	}}
>
	<slot />
</div>
