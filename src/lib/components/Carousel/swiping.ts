import type { SwipingDirection } from './types.js';

export let startX = 0;
export let startY = 0;
export let endX = 0;
export let endY = 0;
export let isDragging = false;

export const swipe = (node: HTMLElement) => {
	node.addEventListener('touchstart', onTouchStart);
	node.addEventListener('touchmove', onTouchMove);
	node.addEventListener('touchend', onTouchEnd);
	node.addEventListener('mouseup', onMouseUp);
	node.addEventListener('mousedown', onMouseDown);
	node.addEventListener('mousemove', onMouseMove);
	node.addEventListener('mouseleave', onMouseLeave);

	return {
		destroy() {
			node.removeEventListener('touchstart', onTouchStart);
			node.removeEventListener('touchmove', onTouchMove);
			node.removeEventListener('touchend', onTouchEnd);
			node.removeEventListener('mouseup', onMouseUp);
			node.removeEventListener('mousedown', onMouseDown);
			node.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mouseleave', onMouseLeave);
		}
	};
};

export const onTouchStart = (event: TouchEvent) => {
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
};

export const onTouchMove = (event: TouchEvent) => {
	event.preventDefault();
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
	if (!isDragging) return;
	isDragging = false;
	event.currentTarget?.dispatchEvent(
		new CustomEvent('swipe', { detail: { startX, startY, endX, endY } })
	);
	startX = 0;
	startY = 0;
	endX = 0;
	endY = 0;
};

export const onMouseLeave = (event: MouseEvent) => {
	onMouseUp(event);
};

/**
 * Detects the direction of a swipe based on the start and end coordinates.
 *
 * @param {number} startX - The starting X coordinate of the swipe.
 * @param {number} startY - The starting Y coordinate of the swipe.
 * @param {number} endX - The ending X coordinate of the swipe.
 * @param {number} endY - The ending Y coordinate of the swipe.
 * @returns {SwipingDirection} The direction of the swipe. Can be 'none', 'right', 'left', 'down', or 'up'.
 */
export const detectSwipingDirection = (
	startX: number,
	startY: number,
	endX: number,
	endY: number
): SwipingDirection => {
	if (endX === 0 || endY === 0) return 'none';

	const deltaX = endX - startX;
	const deltaY = endY - startY;

	if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
		if (deltaX > 0) return 'right';
		else return 'left';
	} else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 80) {
		if (deltaY > 0) return 'down';
		else return 'up';
	}

	return 'none';
};
