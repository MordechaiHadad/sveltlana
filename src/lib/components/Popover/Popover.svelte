<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
    import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { setContext } from 'svelte';

    let context: Writable<context> = writable({
        isExpanded: false
    });

	setContext('popover', context);
</script>

<div class={twMerge("relative inline-block", $$props.class)} tabindex="-1">
    <slot />
</div>