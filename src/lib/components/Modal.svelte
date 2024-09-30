<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';

	export let isOpen = false;
	export let styles: { container?: string; content?: string } = {};

	$: if (browser) {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}

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
			'fixed z-50 flex size-full flex-wrap overflow-y-auto overflow-x-hidden bg-neutral-600/50 backdrop-blur-sm',
			styles.container
		)}>

		<!-- Modal Content -->
		<div class={twMerge("z-50 flex w-full place-content-center px-2 lg:px-20 xl:px-40", styles.content)}>
			<slot />
		</div>
	</div>
{/if}
