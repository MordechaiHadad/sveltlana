<script lang="ts">
	import { getContext } from 'svelte';
	import type { Context } from './context';

	let {
		class: className = '',
		disabled = false,
		value = '',
		placeholder = '',
		oninput: parentOnInput
	}: {
		class?: string;
		disabled?: boolean;
		value?: string;
		placeholder?: string;
		oninput?: (e: Event) => void;
	} = $props();

	const context: Context = getContext('combobox');

	const toggle = () => {
		context.isExpanded = !context.isExpanded;
		context.onExpand(context.isExpanded);
	};

	const openIfClosed = () => {
		if (!context.isExpanded) {
			context.isExpanded = true;
			context.onExpand(true);
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (context.isExpanded && context.currentIndex > -1) return;
			toggle();
		}
	};

	const handleInput = (e?: Event) => {
		openIfClosed();
		parentOnInput?.(e as Event);
	};
</script>

<input
	class={className}
	bind:value
	{placeholder}
	onclick={toggle}
	onfocus={openIfClosed}
	oninput={(e) => handleInput(e)}
	onkeydown={handleKeydown}
	{disabled}
/>
