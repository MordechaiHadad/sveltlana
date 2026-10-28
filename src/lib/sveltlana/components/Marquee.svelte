<script lang="ts">
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
</script>

<!-- shortcut: short content can leave a blank gap, measure and repeat items when callers need automatic viewport fill -->
<div
	class={className}
	role="region"
	aria-label={ariaLabel}
	aria-roledescription="marquee"
	data-pause-on-hover={pauseOnHover}
	style={`--marquee-duration: ${Number.isFinite(duration) && duration > 0 ? duration : 24}s; --marquee-gap: ${gap}; --marquee-direction: ${direction === 'right' ? 'reverse' : 'normal'}`}
>
	<div class="track">
		<div class="group">
			{@render children()}
		</div>
		<div class="group" aria-hidden="true">
			{@render children()}
		</div>
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
			transform: translateX(-50%);
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
