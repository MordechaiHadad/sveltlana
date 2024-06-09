import type { Writable } from 'svelte/store';
import type { context } from './context.js';
import { getContext } from 'svelte';

export const scroll = (direction: 'next' | 'prev', context: Writable<context>, index?: number) => {
	let length = 0;
	let currentSlide = 0;
	let carousel!: HTMLElement;
	let currentItem!: HTMLElement;

	context.subscribe((c) => {
		length = c.length;
		currentSlide = c.currentSlide;
		carousel = c.carousel as HTMLElement;
		currentItem = c.currentItem as HTMLElement;
	});

	let newSlide = currentSlide;
	const carouselContent = carousel.querySelector('[data-carousel-content]') as HTMLElement;

	if (index !== undefined && isNumberPositive(index) && length > index) {
		newSlide = index;
		const child = carouselContent?.children[newSlide] as HTMLElement;

		setScroll(child, currentItem, carouselContent);
		currentItem = child;

		updateCurrentSlide(newSlide, currentItem, context);
		return;
	}

	if (direction === 'next') {
		newSlide += 1;

		if (currentSlide >= length - 1) newSlide = 0;

		const child = carouselContent?.children[newSlide] as HTMLElement;

		setScroll(child, currentItem, carouselContent);
		currentItem = child;
	} else {
		newSlide -= 1;

		if (currentSlide <= 0) newSlide = length - 1;

		const child = carouselContent.children[newSlide] as HTMLElement;

		setScroll(child, currentItem, carouselContent);
		currentItem = child;
	}

	updateCurrentSlide(newSlide, currentItem, context);
};

const setScroll = (child: HTMLElement, currentItem: HTMLElement, carouselContent: HTMLElement) => {
	child?.setAttribute('data-active', '');
	carouselContent?.scroll({
		left: child?.offsetLeft,
		behavior: 'smooth'
	});

	currentItem.removeAttribute('data-active');
	currentItem = child;
};

const updateCurrentSlide = (
	currentSlide: number,
	currentItem: HTMLElement,
	context: Writable<context>
) => {
	context.update((c) => ({ ...c, currentSlide, currentItem }));
};

export const isNumberPositive = (number: number) => number >= 0;
