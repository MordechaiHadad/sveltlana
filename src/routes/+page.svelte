<script lang="ts">
	import Marquee from '$lib/sveltlana/components/Marquee.svelte';

	const icons = [
		{ symbol: '✳', name: 'Create' },
		{ symbol: '◈', name: 'Discover' },
		{ symbol: '✦', name: 'Imagine' },
		{ symbol: '⬡', name: 'Build' },
		{ symbol: '◉', name: 'Connect' },
		{ symbol: '✺', name: 'Explore' },
		{ symbol: '❋', name: 'Make' },
		{ symbol: '◇', name: 'Share' }
	];
</script>

<svelte:head>
	<title>Marquee demo</title>
	<meta name="description" content="A continuously scrolling Sveltlana marquee demo." />
</svelte:head>

<main>
	<section class="showcase" aria-labelledby="page-title">
		<p class="eyebrow">A little motion goes a long way</p>
		<h1 id="page-title">Keep good ideas <span>moving.</span></h1>
		<p class="description">A simple, endlessly looping marquee. Hover or focus it to pause.</p>

		<Marquee
			class="icon-marquee"
			duration={22}
			gap="2rem"
			aria-label="A scrolling list of creative words"
		>
			{#each icons as icon}
				<div class="icon-item">
					<span class="icon" aria-hidden="true">{icon.symbol}</span>
					<span>{icon.name}</span>
				</div>
			{/each}
		</Marquee>
	</section>
</main>

<style>
	main {
		min-height: 100svh;
		display: grid;
		place-items: center;
		background: #f5f4ef;
		color: #20231f;
		font-family: ui-sans-serif, system-ui, sans-serif;
	}

	.showcase {
		width: min(100%, 72rem);
		padding: 7rem 0;
		text-align: center;
	}

	.eyebrow {
		margin: 0 1rem 1.25rem;
		color: #697363;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 1rem;
		font-size: clamp(2.75rem, 8vw, 6.5rem);
		font-weight: 600;
		letter-spacing: -0.07em;
		line-height: 0.98;
	}

	h1 span {
		color: #60704e;
	}

	.description {
		margin: 1.5rem 1rem 4rem;
		color: #696c64;
		font-size: 1rem;
	}

	:global(.icon-marquee) {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		border-block: 1px solid #deded5;
		padding-block: 1.25rem;
	}

	.icon-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #383b34;
		font-size: 1rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.icon {
		width: 2.5rem;
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #e6e9df;
		color: #60704e;
		font-size: 1.25rem;
	}

	@media (max-width: 40rem) {
		.showcase {
			padding-block: 5rem;
		}

		.description {
			margin-bottom: 3rem;
		}
	}
</style>
