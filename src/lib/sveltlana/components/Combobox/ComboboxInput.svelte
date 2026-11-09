<script lang="ts">
	import { getContext } from 'svelte';
	import type { Context } from './context.js';

	let {
		class: className = '',
		disabled = false,
		value = $bindable(''),
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
	let input: HTMLInputElement;

	const toggle = () => {
		context.source = input;
		context.isExpanded = !context.isExpanded;
		context.onExpand(context.isExpanded);
	};

	const openIfClosed = () => {
		context.source = input;
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
	aria-controls="{context.uid}-content"
	aria-expanded={context.isExpanded}
	bind:value
	{placeholder}
	style:anchor-name="--combobox-{context.uid}"
	bind:this={input}
	onclick={openIfClosed}
	onfocus={openIfClosed}
	oninput={(e) => handleInput(e)}
	onkeydown={handleKeydown}
	{disabled}
/>
