<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { context } from './context.js';
	import { createEventDispatcher } from 'svelte';
	import { clickOutside } from '$lib/functions.js';
	import { twMerge } from 'tailwind-merge';

	const dispatch = createEventDispatcher();

	let isExpanded = false;
	let self: HTMLElement;
	let currentItem: HTMLElement;
	let itemsIndex = -1;
	export let closeOnOutsideClick = true;

	let context: Writable<context> = writable({
		isExpanded: isExpanded,
		currentIndex: itemsIndex
	});

	context.subscribe((value) => {
		isExpanded = value.isExpanded;
		itemsIndex = value.currentIndex;
		dispatch('expanded', isExpanded);
	});

	const close = () => {
		context.update((value) => {
			value.isExpanded = false;
			value.currentIndex = -1;
			return value;
		});
	};

	setContext('dropdown', context);

	const handleKeys = (event: KeyboardEvent) => {
		if (event.key === 'Escape') close();
		navigateDropdownItems(event);
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if ($context.isExpanded && itemsIndex > -1) currentItem.click();
		}
	};

	// TODO: Make this function support groups of items
	const navigateDropdownItems = (event: KeyboardEvent) => {
		const targets = ['ArrowUp', 'ArrowDown'];
		if (!targets.includes(event.key)) return;
		event.preventDefault();

		let target = self.querySelector('#dropdown-content') as HTMLElement;

		if (!target) return;

		const length = target.children.length;
		itemsIndex = getActiveItemIndex();
		currentItem = target.children[itemsIndex] as HTMLElement;

		const isArrowUp = event.key === 'ArrowUp';
		const edgeIndex = isArrowUp ? 0 : length - 1;

		if (itemsIndex === edgeIndex) itemsIndex = isArrowUp ? length : -1;

		const direction = isArrowUp ? -1 : 1;
		let activeItemIndex = itemsIndex + direction;
		let activeItemElement = target.children[activeItemIndex] as HTMLElement;

		if (!activeItemElement) return;

		while (activeItemElement.hasAttribute('data-seperator')) {
			activeItemIndex = (activeItemIndex + direction + length) % length;
			activeItemElement = target.children[activeItemIndex] as HTMLElement;
		}

		setActiveItem(activeItemElement);
		itemsIndex = activeItemIndex;
		setInactiveItem(currentItem);
		currentItem = activeItemElement;
		context.update((value) => {
			value.currentIndex = itemsIndex;
			return value;
		});
	};

	const getActiveItemIndex = () => {
		const activeItem = self.querySelector('[data-active]');
		const target = self.querySelector('#dropdown-content') as HTMLElement;
		const items = Array.from(target.children);
		const index = activeItem ? items.indexOf(activeItem) : -1;
		return index;
	};

	const setActiveItem = (element: HTMLElement) => {
		const parent = element.parentElement;
		if (!parent) return;
		parent.scrollTop = element.offsetTop;
		element.setAttribute('data-active', '');
	};

	const setInactiveItem = (element: HTMLElement) => {
		if (!element && element === currentItem) return;
		element.removeAttribute('data-active');
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class={twMerge('relative inline-block', $$props.class)}
	role="button"
	bind:this={self}
	tabindex="-1"
	use:clickOutside={() => {
		if (closeOnOutsideClick) close();
	}}
	on:keydown={handleKeys}
	on:mouseover={() => {
		itemsIndex = -1;
		currentItem && currentItem.removeAttribute('data-active');
	}}
>
	<slot />
</div>
