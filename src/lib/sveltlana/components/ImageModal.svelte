<script lang="ts">
	import Modal from './Modal.svelte';
	import { twMerge } from 'tailwind-merge';

	type Props = {
		src: string;
		alt?: string;
		isOpen?: boolean;
		styles?: { container?: string; content?: string; image?: string };
		onClose?: () => void;
	};

	let { src, alt = '', isOpen = false, styles = {}, onClose }: Props = $props();

	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);

	let initialDistance = $state(0);
	let initialScale = $state(0);
	let isDragging = $state(false);
	let lastX = $state(0);
	let lastY = $state(0);

	let imageContainer: HTMLDivElement;
	let imageElement: HTMLImageElement;

	const handleClose = () => {
		isOpen = false;
		if (onClose) onClose();
	};

	const resetZoom = () => {
		scale = 1;
		translateX = 0;
		translateY = 0;
	};

	const getDistance = (touch1: Touch, touch2: Touch): number => {
		const dx = touch1.clientX - touch2.clientX;
		const dy = touch1.clientY - touch2.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};

	function handleTouchStart(event: TouchEvent) {
		if (event.touches.length === 2) {
			initialDistance = getDistance(event.touches[0], event.touches[1]);
			initialScale = scale;
			event.preventDefault();
		} else if (event.touches.length === 1) {
			isDragging = true;
			lastX = event.touches[0].clientX;
			lastY = event.touches[0].clientY;
		}
	}

	const handleTouchMove = (event: TouchEvent) => {
		if (event.touches.length === 2) {
			const currentDistance = getDistance(event.touches[0], event.touches[1]);
			const newScale = Math.max(1, Math.min(4, (currentDistance / initialDistance) * initialScale));

			applyZoom(newScale);
			event.preventDefault();
		} else if (isDragging && scale > 1 && event.touches.length === 1) {
			const deltaX = event.touches[0].clientX - lastX;
			const deltaY = event.touches[0].clientY - lastY;

			lastX = event.touches[0].clientX;
			lastY = event.touches[0].clientY;

			updateTranslation(translateX + deltaX / scale, translateY + deltaY / scale);
			event.preventDefault();
		}
	};

	const applyZoom = (newScale: number) => {
		if (newScale < scale) {
			const normalizedScale = Math.min(4.0, Math.max(1.0, newScale));
			const centeringIntensity = Math.pow((4.0 - normalizedScale) / 3.0, 1.5);

			translateX = translateX * (1 - centeringIntensity * 0.3);
			translateY = translateY * (1 - centeringIntensity * 0.3);

			if (newScale <= 1.05) {
				translateX = 0;
				translateY = 0;
			}
		}

		scale = newScale;

		updateTranslation(translateX, translateY);
	};

	const handleTouchEnd = () => {
		isDragging = false;
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (scale > 1) {
			isDragging = true;
			lastX = event.clientX;
			lastY = event.clientY;
			event.preventDefault();
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isDragging && scale > 1) {
			const deltaX = event.clientX - lastX;
			const deltaY = event.clientY - lastY;

			lastX = event.clientX;
			lastY = event.clientY;

			updateTranslation(translateX + deltaX / scale, translateY + deltaY / scale);
			event.preventDefault();
		}
	};

	const handleMouseUp = () => {
		isDragging = false;
	};

	const updateTranslation = (newX: number, newY: number) => {
		if (!imageElement || !imageContainer) return;

		const containerRect = imageContainer.getBoundingClientRect();
		const imageRect = imageElement.getBoundingClientRect();

		const baseImageWidth = imageRect.width / scale;
		const baseImageHeight = imageRect.height / scale;

		const maxX = Math.max(0, (baseImageWidth - containerRect.width / scale) / 2);
		const maxY = Math.max(0, (baseImageHeight - containerRect.height / scale) / 2);

		translateX = Math.max(-maxX, Math.min(maxX, newX));
		translateY = Math.max(-maxY, Math.min(maxY, newY));
	};

	const handleDoubleClick = () => {
		resetZoom();
	};

	$effect(() => {
		if (!isOpen) resetZoom();
	});

	$effect(() => {
		if (scale <= 1.05) {
			translateX = 0;
			translateY = 0;
		}
	});
</script>

<Modal
	{isOpen}
	styles={{
		container: styles.container,
		content: twMerge('flex items-center justify-center', styles.content)
	}}
>
	<div
		class={twMerge(
			'relative overflow-hidden h-full w-full flex items-center justify-center',
			styles.image
		)}
		bind:this={imageContainer}
	>
		<div
			class="touch-none select-none h-full w-full flex items-center justify-center overflow-hidden"
			style="transform: scale({scale}) translate({translateX}px, {translateY}px); transform-origin: center;"
			role="button"
			tabindex="0"
			aria-label="Zoomable image viewer"
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={handleMouseUp}
			ondblclick={handleDoubleClick}
		>
			<img
				{src}
				{alt}
				bind:this={imageElement}
				class="h-auto w-full object-contain"
				ondragstart={(e) => e.preventDefault()}
			/>
		</div>
		<button
			type="button"
			class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-xl text-white hover:bg-black/50"
			onclick={handleClose}
		>
			×
		</button>
	</div>
</Modal>
