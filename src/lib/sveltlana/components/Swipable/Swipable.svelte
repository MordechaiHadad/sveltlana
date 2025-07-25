<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { SwipableContext } from './context';

	type Props = {
		class?: string;
		threshold?: number;
		children?: any;
		thresholdReachedClass?: string;
	};

	let { class: className = '', threshold = 0.2, children, thresholdReachedClass }: Props = $props();

	let { startX, isDragging, hasMovedSignificantly, preventNextClick } = $state({
		startX: 0,
		isDragging: false,
		hasMovedSignificantly: false, // Track if movement exceeds a minimum distance
		preventNextClick: false // Flag to prevent the next click event
	});

	let context: SwipableContext = $state({
		swipingDirection: 'none',
		swipeDistance: 0,
		maxSwipe: 0,
		containerWidth: 0,
		thresholdMet: false, // Add a flag to track if threshold was met
		resetSwipe: () => {
			context.swipeDistance = 0;
			context.swipingDirection = 'none';
			context.thresholdMet = false;
		}
	});

	let container: HTMLElement;

	$effect(() => {
		if (container) {
			context.containerWidth = container.clientWidth;
			context.maxSwipe = container.clientWidth * 0.8; // 80% of container width
		}
	});

	let isThresholdReached = $derived(
		Math.abs(context.swipeDistance) >= context.containerWidth * threshold
	);

	// Update thresholdMet flag when threshold status changes
	$effect(() => {
		context.thresholdMet = isThresholdReached;
	});

	const handleTouchStart = (event: TouchEvent) => {
		const touch = event.touches[0];
		startX = touch.clientX;
		isDragging = true;
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (!isDragging) return;
		const touch = event.touches[0];
		const currentX = touch.clientX;
		const diff = currentX - startX;

		context.swipingDirection = diff > 0 ? 'right' : diff < 0 ? 'left' : 'none';
		context.swipeDistance = Math.max(-context.maxSwipe, Math.min(context.maxSwipe, diff));
	};

	const handleTouchEnd = () => {
		if (!isDragging) return;
		isDragging = false;

		// Mark that swiping has ended but keep the distance
		context.swipingDirection = 'none';

		// Always reset after a short delay - SwipableAction will have time to check the state
		setTimeout(() => {
			context.resetSwipe();
		}, 100);
	};

	const handleMouseDown = (event: MouseEvent) => {
		startX = event.clientX;
		isDragging = true;
		hasMovedSignificantly = false;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isDragging) return;
		const currentX = event.clientX;
		const diff = currentX - startX;

		if (Math.abs(diff) > 10) {
			hasMovedSignificantly = true;
			preventNextClick = true;
		}

		context.swipingDirection = diff > 0 ? 'right' : diff < 0 ? 'left' : 'none';
		context.swipeDistance = Math.max(-context.maxSwipe, Math.min(context.maxSwipe, diff));
	};

	const handleMouseUp = () => handleTouchEnd();

	const handleMouseLeave = () => {
		if (isDragging) {
			handleMouseUp();
		}
	};

	onMount(() => {
		const captureClickListener = (e: MouseEvent) => {
			if (preventNextClick) {
				e.stopImmediatePropagation();
				e.preventDefault();
				preventNextClick = false;
			}
		};

		// Use capture phase to intercept events before they reach their targets
		document.addEventListener('click', captureClickListener, true);

		return () => {
			document.removeEventListener('click', captureClickListener, true);
		};
	});

	setContext('swipable', context);
</script>

<div
	class={twMerge(
		'relative overflow-hidden transition-colors duration-300 ease-in-out',
		className,
		isThresholdReached ? thresholdReachedClass : ''
	)}
	bind:this={container}
	role="presentation"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}>
	{@render children()}
</div>
