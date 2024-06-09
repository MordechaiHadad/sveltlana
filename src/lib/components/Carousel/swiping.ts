import type { SwipingDirection } from './types.js';

export let startX = 0;
export let startY = 0;
export let endX = 0;
export let endY = 0;
export let isDragging = false;

export const onTouchStart = (event: TouchEvent) => {
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
};

export const onTouchMove = (event: TouchEvent) => {
	endX = event.touches[0].clientX;
	endY = event.touches[0].clientY;
};

export const onTouchEnd = (event: TouchEvent) => {
	event.currentTarget?.dispatchEvent(
		new CustomEvent('swipe', { detail: { startX, startY, endX, endY } })
	);
};

export const onMouseDown = (event: MouseEvent) => {
	startX = event.clientX;
	startY = event.clientY;
	isDragging = true;
};

export const onMouseMove = (event: MouseEvent) => {
	if (isDragging) {
		endX = event.clientX;
		endY = event.clientY;
	}
};

export const onMouseUp = (event: MouseEvent) => {
	if (isDragging) {
		isDragging = false;
		event.currentTarget?.dispatchEvent(
			new CustomEvent('swipe', { detail: { startX, startY, endX, endY } })
		);
		startX = 0;
		startY = 0;
		endX = 0;
		endY = 0;
	}
};

export const detectSwipingDirection = (
	startX: number,
	startY: number,
	endX: number,
	endY: number
): SwipingDirection => {
	if (endX === 0 || endY === 0) return 'none';

	const deltaX = endX - startX;
	const deltaY = endY - startY;

	if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
		if (deltaX > 0) return 'right';
		else return 'left';
	} else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 60) {
		if (deltaY > 0) return 'down';
		else return 'up';
	}

	return 'none';
};
