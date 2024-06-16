<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { context } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { scroll } from './functions.js';
	import {
		detectSwipingDirection,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		onTouchEnd,
		onTouchMove,
		onTouchStart
	} from './swiping.js';
	import type { Direction } from './types.js';

	const dispatch = createEventDispatcher();

	export let direction: Direction = 'column';

	let context: Writable<context> = writable({
		direction,
		currentSlide: 0,
		length: 0
	});

	setContext('carousel', context);

	const updateContext = (node: HTMLElement) => {
		context.update((ctx) => ({
			...ctx,
			carousel: node
		}));
	};

	const handleSwipe = (event: CustomEvent) => {
		const swipeDirection = detectSwipingDirection(
			event.detail.startX,
			event.detail.startY,
			event.detail.endX,
			event.detail.endY
		);
		let dir: 'prev' | 'next' = 'prev';

		if (swipeDirection === 'right') dir = 'prev';
		else if (swipeDirection === 'left') dir = 'next';
		else if (swipeDirection === 'up') dir = 'next';
		else if (swipeDirection === 'down') dir = 'prev';

		if (
			swipeDirection === 'none' ||
			(direction === 'column' && (swipeDirection === 'left' || swipeDirection === 'right')) ||
			(direction === 'row' && (swipeDirection === 'up' || swipeDirection === 'down'))
		)
			return;

		scroll(dir, context);
	};
</script>

<div
	class={twMerge('relative select-none', $$props.class)}
	use:updateContext
	on:touchstart={onTouchStart}
	on:touchmove={onTouchMove}
	on:touchend={onTouchEnd}
	on:mouseup={onMouseUp}
	on:mousedown={onMouseDown}
	on:mousemove={onMouseMove}
	on:swipe={handleSwipe}
	on:wheel={(event) => {
		dispatch('scroll', {
			event,
			context
		});
	}}
>
	<slot />
</div>
