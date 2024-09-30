export const resizeObserver = (
	node: HTMLElement,
	callback: (entry: ResizeObserverEntry) => void
) => {
	const observer = new ResizeObserver((entries) => {
		entries.forEach((entry) => {
			callback(entry);
		});
	});

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
};
