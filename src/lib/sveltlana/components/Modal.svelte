<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	
	const browser: boolean = typeof window !== 'undefined';

	type Props = {
		children: Snippet;
		isOpen?: boolean;
		styles?: { container?: string; content?: string };
	};
	let { children, isOpen = $bindable(false), styles = {} }: Props = $props();

	$effect(() => {
		if (!browser) return;

		if (isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'auto';
	});

	onMount(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				isOpen = false;
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

{#if isOpen}
	<div
		class={twMerge(
			'fixed inset-0 z-[9999] flex w-full h-full flex-wrap overflow-y-auto overflow-x-hidden bg-neutral-600/50 backdrop-blur-xs',
			styles.container
		)}
		role="dialog"
		aria-hidden={!isOpen}
	>
		<!-- Modal Content -->
		<div class={twMerge('z-[10000] flex w-full items-center justify-center p-4', styles.content)}>
			{@render children()}
		</div>
	</div>
{/if}


