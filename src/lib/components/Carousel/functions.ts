import type { Writable } from 'svelte/store';
import type { IContext } from './context.js';
import { getContext } from 'svelte';
import type { Direction } from './types.js';

export const scroll = (direction: 'next' | 'prev', context: IContext, index?: number) => {
	let newSlide = context.currentSlide;
	let currentItem = context.currentItem;
	const carouselContent = context.carousel?.querySelector('[data-carousel-content]') as HTMLElement;
	if (!carouselContent) return;

	if (index && isNumberPositive(index) && length > index) {
		newSlide = index;
		const child = carouselContent?.children[newSlide] as HTMLElement;

		if(!context.currentItem) return;
		setScroll(child, context.currentItem, carouselContent, context.direction);
		currentItem = child;

		context.currentSlide = newSlide;
		context.currentItem = currentItem;
		return;
	}

	if (direction === 'next') {
		newSlide += 1;

		if (context.currentSlide >= length - 1) newSlide = 0;

		const child = carouselContent?.children[newSlide] as HTMLElement;

		if(!context.currentItem) return;
		setScroll(child, context.currentItem, carouselContent, context.direction);
		currentItem = child;
	} else {
		newSlide -= 1;

		if (context.currentSlide <= 0) newSlide = length - 1;

		const child = carouselContent.children[newSlide] as HTMLElement;

		if(!context.currentItem) return;
		setScroll(child, context.currentItem, carouselContent, context.direction);
		currentItem = child;
	}

	context.currentSlide = newSlide;
	context.currentItem = currentItem;
};

const setScroll = (
	child: HTMLElement,
	currentItem: HTMLElement,
	carouselContent: HTMLElement,
	direction: Direction
) => {
	child?.setAttribute('data-active', '');

	if (direction === 'row')
		carouselContent?.scroll({
			left: child?.offsetLeft,
			behavior: 'smooth'
		});
	else
		carouselContent?.scroll({
			top: child?.offsetTop,
			behavior: 'smooth'
		});

	currentItem.removeAttribute('data-active');
};

export const isNumberPositive = (number: number) => number >= 0;

import type { Action } from 'svelte/action';

interface AutoplayOptions {
	enabled: boolean;
	interval: number;
}

interface AutoplayOptions {
	enabled: boolean;
	interval: number;
}

export const autoplay: Action<HTMLElement, AutoplayOptions> = (
	node,
	{ enabled, interval = 3000 }
) => {
	let intervalId: number;

	const startAutoplay = () => {
		stopAutoplay();
		if (enabled) {
			intervalId = window.setInterval(() => {
				node.dispatchEvent(new CustomEvent('autoplay'));
			}, interval);
		}
	};

	const stopAutoplay = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	};

	startAutoplay();

	return {
		update(newOptions: AutoplayOptions) {
			enabled = newOptions.enabled;
			interval = newOptions.interval;
			startAutoplay();
		},
		destroy() {
			stopAutoplay();
		}
	};
};
