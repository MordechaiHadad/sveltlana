import type { IContext } from './context.js';

export const toggle = (context: IContext) => {
	context.currentIndex = -1;
	context.isExpanded = !context.isExpanded;
};

export const debounce = (fn: Function, delay: number, debounce: { isDebouncing: boolean }) => {
	if (debounce.isDebouncing) return;
	debounce.isDebouncing = true;
	fn();
	setTimeout(() => {
		debounce.isDebouncing = false;
	}, delay);
};
