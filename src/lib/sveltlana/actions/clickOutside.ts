export const clickOutside = (
	node: HTMLElement,
	{
		callback,
		allowSwipe = false
	}: { callback: (event: MouseEvent | TouchEvent) => void; allowSwipe?: boolean }
) => {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node)) callback(event);
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		const touchEndX = event.changedTouches[0].clientX;
		const touchEndY = event.changedTouches[0].clientY;

		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;

		if (!node.contains(event.target as Node)) callback(event);

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			// Horizontal swipe
			if (Math.abs(deltaX) > swipeThreshold) {
				callback(event);
			}
		} else {
			// Vertical swipe
			if (Math.abs(deltaY) > swipeThreshold) {
				callback(event);
			}
		}
	};

	let touchStartX = 0;
	let touchStartY = 0;
	const swipeThreshold = 30; // Minimum distance in pixels for a swipe

	document.addEventListener('click', handleClick, true);

	if (allowSwipe) {
		document.addEventListener('touchstart', handleTouchStart, true);
		document.addEventListener('touchend', handleTouchEnd, true);
	}

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);

			if (allowSwipe) {
				document.removeEventListener('touchstart', handleTouchStart, true);
				document.removeEventListener('touchend', handleTouchEnd, true);
			}
		}
	};
};