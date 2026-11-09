<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { Context } from './context.js';

	type Props = {
		class?: string;
		threshold?: number;
		children?: any;
		thresholdReachedClass?: string;
	};

	let { class: className = '', threshold = 0.2, children, thresholdReachedClass }: Props = $props();

	let { startX, isDragging, preventNextClick } = $state({
		startX: 0,
		isDragging: false,
		preventNextClick: false // Flag to prevent the next click event
	});
	let pointerId = -1;

	let context: Context = $state({
		swipingDirection: 'none',
		swipeDistance: 0,
		containerWidth: 0,
		thresholdMet: () => Math.abs(context.swipeDistance) >= context.containerWidth * threshold,
		resetSwipe: () => {
			context.swipeDistance = 0;
			context.swipingDirection = 'none';
		}
	});

	let container: HTMLElement;

	let isThresholdReached = $derived(
		Math.abs(context.swipeDistance) >= context.containerWidth * threshold
	);

	const handlePointerDown = (event: PointerEvent) => {
		if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
		pointerId = event.pointerId;
		startX = event.clientX;
		isDragging = true;
		preventNextClick = false;
		container.setPointerCapture(event.pointerId);
	};

	const handlePointerEnd = (event: PointerEvent) => {
		if (!isDragging || event.pointerId !== pointerId) return;
		pointerId = -1;
		isDragging = false;
		if (event.type === 'pointercancel') preventNextClick = false;

		// Mark that swiping has ended but keep the distance
		context.swipingDirection = 'none';

		// Always reset after a short delay - SwipableAction will have time to check the state
		setTimeout(() => {
			context.resetSwipe();
		}, 100);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!isDragging || event.pointerId !== pointerId) return;
		const diff = event.clientX - startX;
		if (event.pointerType !== 'touch' && Math.abs(diff) > 10) {
			preventNextClick = true;
		}

		context.swipingDirection = diff > 0 ? 'right' : diff < 0 ? 'left' : 'none';
		const maxSwipe = context.containerWidth * 0.8;
		context.swipeDistance = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
	};

	onMount(() => {
		const captureClickListener = (event: MouseEvent) => {
			if (preventNextClick) {
				event.stopImmediatePropagation();
				event.preventDefault();
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
	bind:clientWidth={context.containerWidth}
	role="presentation"
	style:touch-action="pan-y"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerEnd}
	onpointercancel={handlePointerEnd}
>
	{@render children()}
</div>
