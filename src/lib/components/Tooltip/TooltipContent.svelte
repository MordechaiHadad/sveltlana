<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import type { context } from './context.js';
	import type { Writable } from 'svelte/store';
	import type { Orientation, Position } from '$lib/types.js';
	import { getDynamicPosition } from '$lib/functions.js';
	import { twMerge } from 'tailwind-merge';

	export let position: Position = 'top';
	export let orientation: Orientation = 'horizontal';

	let context: Writable<context> = getContext('tooltip');
	export let transition = fade;

	const simplifyPosition = (position: Position, orientation: Orientation): Position => {
		if (orientation === 'vertical') {
			if (position === 'top-left' || position === 'top-right') return 'top';
			else if (position === 'bottom-left' || position === 'bottom-right') return 'bottom';
		} else if (orientation === 'horizontal') {
			if (position === 'top-left' || position === 'bottom-left') return 'left';
			else if (position === 'top-right' || position === 'bottom-right') return 'right';
		}
		return position;
	};

	const setDynamicPositioning = (node: HTMLElement) => {
		position = getDynamicPosition(node, orientation);

		node.classList.remove('top', 'bottom', 'left', 'right');
		position = simplifyPosition(position, orientation);
		node.classList.add(position);
	};
</script>

{#if $context.isHovered}
	<div
		class={twMerge('absolute z-50', $$props.class)}
		transition:transition
		use:setDynamicPositioning
	>
		<slot />
	</div>
{/if}

<style>
	.top {
		bottom: 100%;
		right: 50%;
		transform: translateX(50%);
	}
	.bottom {
		top: 100%;
		right: 50%;
		transform: translateX(50%);
	}
	.left {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
	.right {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
