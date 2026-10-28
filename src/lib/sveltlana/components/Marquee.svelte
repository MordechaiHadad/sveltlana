<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
		duration?: number;
		gap?: string;
		direction?: 'left' | 'right';
		pauseOnHover?: boolean;
		'aria-label'?: string;
	};

	let {
		children,
		duration = 24,
		gap = '1.5rem',
		direction = 'left',
		pauseOnHover = true,
		'aria-label': ariaLabel = 'Scrolling banner',
		class: className
	}: Props = $props();

	let viewportElement: HTMLDivElement;
	let groupElement: HTMLDivElement;
	let groupCount = $state(2);
	let groupWidth = $state(0);

	onMount(() => {
		const update = () => {
			groupWidth = groupElement.getBoundingClientRect().width;
			if (!groupWidth) {
				groupCount = 2;
				return;
			}
			groupCount = Math.max(2, Math.ceil(viewportElement.clientWidth / groupWidth) + 1);
		};
		const observer = new ResizeObserver(update);

		observer.observe(viewportElement);
		observer.observe(groupElement);
		update();

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={viewportElement}
	class={className}
	role="region"
	aria-label={ariaLabel}
	aria-roledescription="marquee"
	data-pause-on-hover={pauseOnHover}
	style={`--marquee-duration: ${Number.isFinite(duration) && duration > 0 ? duration : 24}s; --marquee-gap: ${gap}; --marquee-distance: ${groupWidth}px; --marquee-direction: ${direction === 'right' ? 'reverse' : 'normal'}`}
>
	<div class="track">
		<div class="group" bind:this={groupElement}>
			{@render children()}
		</div>
		{#each Array.from({ length: groupCount - 1 }) as copy}
			<div class="group" aria-hidden="true">
				{@render children()}
			</div>
		{/each}
	</div>
</div>

<style>
	div[role='region'] {
		overflow: hidden;
	}

	.track {
		display: flex;
		width: max-content;
		animation: marquee var(--marquee-duration) linear infinite;
		animation-direction: var(--marquee-direction);
	}

	div[data-pause-on-hover='true']:hover .track,
	div[data-pause-on-hover='true']:focus-within .track {
		animation-play-state: paused;
	}

	.group {
		display: flex;
		flex: none;
		align-items: center;
		gap: var(--marquee-gap);
		padding-right: var(--marquee-gap);
	}

	@keyframes marquee {
		to {
			transform: translateX(calc(-1 * var(--marquee-distance)));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}

		.group + .group {
			display: none;
		}
	}
</style>
