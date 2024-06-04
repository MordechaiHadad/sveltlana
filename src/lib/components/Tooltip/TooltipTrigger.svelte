<script lang="ts">
	import { getContext } from 'svelte';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';

	let context: Writable<context> = getContext('tooltip');
	export let tabindex = 0;

	const update = (bool: boolean) => {
		context.update((value) => {
			value.isHovered = bool;
			return value;
		});
	};
</script>

<button
	class={$$props.class}
	{tabindex}
	on:mouseover={() => update(true)}
	on:focus={() => update(true)}
	on:mouseleave={() => update(false)}
	on:blur={() => update(false)}
	on:focusin={() => update(true)}
	on:focusout={() => update(false)}
>
	<slot />
</button>
