<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { Context } from './context';
	import { twMerge } from 'tailwind-merge';
	import { clickOutside } from '../../actions/clickOutside';

	type Props = {
		closeOnOutsideClick?: boolean;
		class?: string;
		onexpand: (isExpanded: boolean) => void;
		children: Snippet;
	};

	let { closeOnOutsideClick = true, class: className = '', onexpand, children }: Props = $props();

	let context: Context = $state({
		isExpanded: false,
		currentIndex: -1
	});

	$effect(() => {
		onexpand(context.isExpanded);
	});
	let self: HTMLElement;
	let currentItem: HTMLElement;

	const close = () => {
		context.isExpanded = false;
		context.currentIndex = -1;
	};

	setContext('dropdown', context);

	const handleKeys = (event: KeyboardEvent) => {
		if (event.key === 'Escape') close();
		navigateDropdownItems(event);
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (context.isExpanded && context.currentIndex > -1) currentItem.click();
		}
	};

	// TODO: Make this function support groups of items
	const navigateDropdownItems = (event: KeyboardEvent) => {
		const targets = ['ArrowUp', 'ArrowDown'];
		if (!targets.includes(event.key)) return;
		event.preventDefault();
		let itemsIndex = context.currentIndex;

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
		context.currentIndex = itemsIndex;
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

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	class={twMerge('relative inline-block', className)}
	role="button"
	bind:this={self}
	tabindex="-1"
	use:clickOutside={{
		callback: () => {
			if (closeOnOutsideClick) close();
		}
	}}
	onkeydown={handleKeys}
	onmouseover={() => {
		context.currentIndex = -1;
		currentItem && currentItem.removeAttribute('data-active');
	}}
>
	{@render children()}
</div>
