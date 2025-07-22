<!-- DEPRECATED: This component is deprecated and should not be used. -->

<script lang="ts">
	import { createEventDispatcher, setContext, Snippet } from 'svelte';
	import type { IContext } from './context';
	import { twMerge } from 'tailwind-merge';
	import { autoplay, scroll } from './functions';
	import { detectSwipingDirection, swipe } from './swiping';
	import type { Direction } from './types';

	type Props = {
		direction?: Direction;
		autoplayEnabled?: boolean;
		autoplayInterval?: number;
		currentSlide?: number;
		class?: string;
		onscroll?: (event: { event: WheelEvent; context: IContext }) => void;
		children?: Snippet;
	};

	let {
		direction = 'column',
		autoplayEnabled = false,
		autoplayInterval = 5000,
		currentSlide = $bindable(0),
		onscroll,
		class: className = '',
		children
	}: Props = $props();

	let context: IContext = $state({
		direction,
		currentSlide: 0,
		length: 0
	});

	setContext('carousel', context);

	$effect(() => {
		currentSlide = context.currentSlide;
	});

	const updateContext = (node: HTMLElement) => {
		context.carousel = node;
		return;
	};

	const handleSwipe = (event: CustomEvent) => {
		const swipeDirection = detectSwipingDirection(
			event.detail.startX,
			event.detail.startY,
			event.detail.endX,
			event.detail.endY
		);

		if (
			swipeDirection === 'none' ||
			(context.direction === 'column' &&
				(swipeDirection === 'left' || swipeDirection === 'right')) ||
			(context.direction === 'row' && (swipeDirection === 'up' || swipeDirection === 'down'))
		)
			return;

		let dir: 'prev' | 'next' = 'prev';

		if (swipeDirection === 'right') dir = 'prev';
		else if (swipeDirection === 'left') dir = 'next';
		else if (swipeDirection === 'up') dir = 'next';
		else if (swipeDirection === 'down') dir = 'prev';

		scroll(dir, context);
	};

	const handleAutoplay = () => {
		scroll('next', context);
	};
</script>

<div
	class={twMerge('relative select-none', className)}
	use:autoplay={{ enabled: autoplayEnabled, interval: autoplayInterval }}
	use:updateContext
	use:swipe
	onwheel={(event) => {
		onscroll({ event, context });
	}}
>
	{@render children()}
</div>
