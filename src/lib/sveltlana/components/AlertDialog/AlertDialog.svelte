<script lang="ts">
	import Modal from '$lib/sveltlana/components/Modal.svelte';
	import { setContext, type Snippet } from 'svelte';
	import type { Context } from './context';
	import { twMerge } from 'tailwind-merge';

	let {
		isOpen = $bindable(false),
		onConfirm = () => {},
		onCancel = () => {},
		styles = {},
		children
	}: {
		isOpen?: boolean;
		onConfirm?: () => void;
		onCancel?: () => void;
		styles?: { container?: string; content?: string };
		children: Snippet;
	} = $props();

	const handleConfirm = () => {
		onConfirm?.();
		isOpen = false;
	};

	const handleCancel = () => {
		onCancel?.();
		isOpen = false;
	};

	let context: Context = $state({ isOpen, onConfirm: handleConfirm, onCancel: handleCancel });

	$effect(() => {
		context.isOpen = isOpen;
	});

	setContext('alertdialog', context);
</script>

<Modal bind:isOpen styles={{ container: styles.container, content: twMerge("h-fit flex-col", styles.content) }}>
	{@render children()}
</Modal>
