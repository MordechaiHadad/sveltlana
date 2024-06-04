import type { Writable } from 'svelte/store';
import type { context } from './context.js';

export const toggle = (context: Writable<context>) => {
	context.update((value) => ({ currentIndex: -1, isExpanded: !value.isExpanded }));
};

export const debounce = (fn: Function, delay: number, debounce: { isDebouncing: boolean }) => {
	if (debounce.isDebouncing) return;
	debounce.isDebouncing = true;
	fn();
	setTimeout(() => {
		debounce.isDebouncing = false;
	}, delay);
};
