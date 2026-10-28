<script lang="ts">
	import Accordion from '$lib/sveltlana/components/Accordion/index.js';
	import AlertDialog from '$lib/sveltlana/components/AlertDialog/index.js';
	import Combobox from '$lib/sveltlana/components/Combobox/index.js';
	import Dropdown from '$lib/sveltlana/components/Dropdown/index.js';
	import Marquee from '$lib/sveltlana/components/Marquee.svelte';
	import Navbar from '$lib/sveltlana/components/Navbar.svelte';
	import Popover from '$lib/sveltlana/components/Popover/index.js';
	import Swipable from '$lib/sveltlana/components/Swipable/index.js';
	import TextInput from '$lib/sveltlana/components/TextInput.svelte';

	const marqueeItems = ['Create', 'Discover', 'Imagine', 'Build', 'Connect', 'Explore'];
	const colorOptions = ['Amethyst', 'Coral', 'Jade', 'Sapphire'];

	let email = $state('');
	let selectedColor = $state('');
	let isAlertOpen = $state(false);
	let alertResult = $state('');
	let swipeResult = $state('');
</script>

<svelte:head>
	<title>Sveltlana · Components</title>
	<meta name="description" content="Interactive examples of Sveltlana components." />
</svelte:head>

<Navbar class="site-nav">
	<a class="brand" href="#top">sveltlana</a>
	<a href="#motion">Motion</a>
	<a href="#components">Components</a>
</Navbar>

<main id="top">
	<header class="intro">
		<p class="eyebrow">Svelte components</p>
		<h1>Simple building blocks.</h1>
		<p>Try the examples below, then style each component to fit your app.</p>
	</header>

	<section class="motion" id="motion" aria-labelledby="motion-title">
		<div class="section-heading">
			<h2 id="motion-title">Marquee</h2>
			<p>Hover or focus to pause.</p>
		</div>
		<Marquee class="marquee-row" duration={24} gap="2rem" aria-label="Creative words">
			{#each marqueeItems as item}
				<span class="marquee-item">{item}</span>
			{/each}
		</Marquee>
	</section>

	<section class="gallery" id="components" aria-label="Interactive component examples">
		<article class="demo-card">
			<div class="card-heading"><h2>Accordion</h2></div>
			<Accordion>
				<Accordion.Trigger class="accordion-trigger">
					<span>What is Sveltlana?</span><span aria-hidden="true">＋</span>
				</Accordion.Trigger>
				<Accordion.Content class="accordion-content">
					Small, headless Svelte components you can style to match your product.
				</Accordion.Content>
			</Accordion>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Dropdown</h2></div>
			<Dropdown>
				<Dropdown.Trigger class="control-button">Open menu</Dropdown.Trigger>
				<Dropdown.Content class="menu-panel">
					<Dropdown.Item class="menu-item">Edit profile</Dropdown.Item>
					<Dropdown.Item class="menu-item">Duplicate</Dropdown.Item>
					<Dropdown.Item class="menu-item" disabled>Archive (unavailable)</Dropdown.Item>
				</Dropdown.Content>
			</Dropdown>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Popover</h2></div>
			<Popover>
				<Popover.Trigger class="control-button">What’s this?</Popover.Trigger>
				<Popover.Content class="popover-panel">
					<strong>A little context</strong>
					<p>Keep useful details close to the control that needs them.</p>
				</Popover.Content>
			</Popover>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Combobox</h2></div>
			<Combobox>
				<Combobox.Input
					class="text-control"
					bind:value={selectedColor}
					placeholder="Choose a color"
				/>
				<Combobox.Content class="menu-panel">
					{#each colorOptions as color}
						<Combobox.Item class="menu-item" onselect={() => (selectedColor = color)}>
							{color}
						</Combobox.Item>
					{/each}
				</Combobox.Content>
			</Combobox>
			<p class="helper-text">Selected: {selectedColor || 'nothing yet'}</p>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Alert dialog</h2></div>
			<button class="control-button" onclick={() => (isAlertOpen = true)}>Delete draft</button>
			{#if alertResult}<p class="helper-text">{alertResult}</p>{/if}
			<AlertDialog
				bind:isOpen={isAlertOpen}
				onconfirm={() => (alertResult = 'Draft deleted.')}
				oncancel={() => (alertResult = 'Deletion cancelled.')}
				class="alert-dialog"
			>
				<AlertDialog.Header>
					<AlertDialog.Title class="dialog-title">Delete this draft?</AlertDialog.Title>
					<AlertDialog.Description class="dialog-copy">
						This action cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer class="dialog-actions">
					<AlertDialog.Cancel class="control-button">Cancel</AlertDialog.Cancel>
					<AlertDialog.Confirm class="control-button danger-button">
						Delete draft
					</AlertDialog.Confirm>
				</AlertDialog.Footer>
			</AlertDialog>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Swipable</h2></div>
			<Swipable class="swipe-demo" thresholdReachedClass="swipe-ready">
				<Swipable.Action side="left" onAction={() => (swipeResult = 'Item saved.')}>
					<span class="swipe-action">Save</span>
				</Swipable.Action>
				<Swipable.Content class="swipe-content">
					<span>Drag this card</span><span aria-hidden="true">⟷</span>
				</Swipable.Content>
			</Swipable>
			<p class="helper-text">{swipeResult || 'Swipe to save.'}</p>
		</article>

		<article class="demo-card">
			<div class="card-heading"><h2>Text input</h2></div>
			<TextInput
				bind:value={email}
				type="email"
				label="Email address"
				placeholder="you@example.com"
				styles={{
					wrapper: 'input-wrapper',
					label: 'input-label',
					input: 'text-control',
					error: 'input-error',
					asterisk: 'input-required'
				}}
			/>
			<p class="helper-text">{email ? `Ready to contact ${email}` : 'Your email stays here.'}</p>
		</article>
	</section>
</main>

<style>
	:global(html) {
		background: #fff;
		color: #242424;
		font-family: ui-sans-serif, system-ui, sans-serif;
	}

	:global(body) {
		margin: 0;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	:global(.site-nav) {
		position: sticky;
		top: 0;
		z-index: 10;
		box-sizing: border-box;
		max-width: 72rem;
		align-items: center;
		gap: 1.25rem;
		margin-inline: auto;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e5e5;
		background: rgb(255 255 255 / 95%);
	}

	:global(.site-nav a) {
		color: inherit;
		font-size: 0.9rem;
		text-decoration: none;
	}

	:global(.site-nav .brand) {
		margin-right: auto;
		font-weight: 700;
	}

	main {
		width: min(100% - 3rem, 72rem);
		margin-inline: auto;
	}

	.intro {
		padding-block: 4rem 2rem;
	}

	.eyebrow,
	.section-heading p,
	.helper-text {
		color: #686868;
		font-size: 0.875rem;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
	}

	.intro h1 {
		margin: 0;
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		letter-spacing: -0.06em;
	}

	.intro > p:last-child {
		color: #686868;
		line-height: 1.6;
	}

	.motion {
		padding-block: 1.5rem;
		border-block: 1px solid #e5e5e5;
	}

	.section-heading h2,
	.card-heading h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.section-heading p {
		margin: 0.35rem 0 0;
	}

	:global(.marquee-row) {
		padding-top: 1rem;
	}

	.marquee-item {
		font-weight: 600;
		white-space: nowrap;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
		gap: 1rem;
		padding-block: 2rem 4rem;
	}

	.demo-card {
		min-height: 11rem;
		padding: 1.25rem;
		border: 1px solid #e1e1e1;
		border-radius: 0.5rem;
	}

	.card-heading {
		margin-bottom: 1rem;
	}

	:global(.control-button),
	:global(.text-control) {
		box-sizing: border-box;
		min-height: 2.5rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid #d5d5d5;
		border-radius: 0.35rem;
		background: #fff;
		color: inherit;
	}

	:global(.control-button) {
		cursor: pointer;
	}

	:global(:focus-visible) {
		outline: 2px solid #56724b;
		outline-offset: 2px;
	}

	:global(.accordion-trigger) {
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 0.75rem 0;
		border: 0;
		border-top: 1px solid #e5e5e5;
		background: transparent;
		text-align: left;
		cursor: pointer;
	}

	:global(.accordion-content) {
		padding-bottom: 0.75rem;
		color: #686868;
		line-height: 1.5;
	}

	:global(.menu-panel),
	:global(.popover-panel) {
		z-index: 20;
		min-width: 12rem;
		margin-top: 0.35rem;
		padding: 0.35rem;
		border: 1px solid #e1e1e1;
		border-radius: 0.4rem;
		background: #fff;
		box-shadow: 0 8px 24px rgb(0 0 0 / 10%);
	}

	:global(.menu-item) {
		width: 100%;
		padding: 0.6rem 0.7rem;
		border: 0;
		border-radius: 0.25rem;
		background: transparent;
		text-align: left;
		cursor: pointer;
	}

	:global(.menu-item:hover),
	:global(.menu-item[data-active]) {
		background: #f2f2f2;
	}

	:global(.menu-item:disabled) {
		color: #888;
		cursor: not-allowed;
	}

	:global(.popover-panel) {
		width: 14rem;
		padding: 0.85rem;
	}

	:global(.popover-panel p) {
		margin-bottom: 0;
		color: #686868;
		line-height: 1.5;
	}

	:global(.text-control) {
		width: min(100%, 20rem);
	}

	.helper-text {
		margin: 0.6rem 0 0;
	}

	:global(.alert-dialog) {
		width: min(26rem, calc(100% - 3rem));
		padding: 1.25rem;
		border: 1px solid #e1e1e1;
		border-radius: 0.5rem;
	}

	:global(.alert-dialog::backdrop) {
		background: rgb(0 0 0 / 40%);
	}

	:global(.dialog-title) {
		margin: 0;
		font-size: 1.15rem;
	}

	:global(.dialog-copy) {
		color: #686868;
	}

	:global(.dialog-actions) {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	:global(.danger-button) {
		border-color: #9d423b;
		background: #9d423b;
		color: #fff;
	}

	:global(.swipe-demo) {
		min-height: 3.5rem;
		border-radius: 0.35rem;
		background: #e8eee3;
		cursor: grab;
		touch-action: pan-y;
	}

	:global(.swipe-ready) {
		background: #d7e4cd;
	}

	:global(.swipe-content) {
		display: flex;
		min-height: 3.5rem;
		align-items: center;
		justify-content: space-between;
		padding-inline: 1rem;
		background: #f2f2f2;
	}

	:global(.swipe-action) {
		padding-inline: 0.75rem;
		font-weight: 600;
	}

	:global(.input-wrapper) {
		display: grid;
		gap: 0.4rem;
	}

	:global(.input-label) {
		font-size: 0.875rem;
		font-weight: 600;
	}

	@media (max-width: 36rem) {
		:global(.site-nav) {
			gap: 0.8rem;
			padding-inline: 1rem;
		}

		main {
			width: min(100% - 2rem, 72rem);
		}
	}
</style>
