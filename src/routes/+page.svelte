<script lang="ts">
	import Carousel from '$lib/components/Carousel/Carousel.svelte';
	import CarouselArrow from '$lib/components/Carousel/CarouselArrow.svelte';
	import CarouselContent from '$lib/components/Carousel/CarouselContent.svelte';
	import CarouselIndicator from '$lib/components/Carousel/CarouselIndicator.svelte';
	import CarouselItem from '$lib/components/Carousel/CarouselItem.svelte';
	import { isNumberPositive, scroll } from '$lib/components/Carousel/functions.js';
</script>

<Carousel
	class="test max-w-96 max-h-96 mt-56 flex flex-col gap-5"
	autoplayEnabled={true}
	autoplayInterval={2500}
	on:scroll={(event) => {
		if (event.detail.event.ctrlKey)
			scroll(isNumberPositive(event.detail.event.deltaY) ? 'prev' : 'next', event.detail.context);
	}}
>
	<CarouselContent direction="column" class="gap-2">
		{#each Array.from({ length: 20 }) as _, i}
			<CarouselItem
				class="brightness-50 data-[active]:brightness-100 duration-[1.25s] ease-in-out transition-all"
			>
				{#if i % 2 === 0}
					<img
						class="pointer-events-none rounded-md w-full"
						src="https://images.unsplash.com/photo-1717597860306-e6d3602f9913?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="A beautiful landscape"
					/>
				{:else}
					<img
						src="https://images.unsplash.com/photo-1712688930249-98e1963af7bd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						class="pointer-events-none rounded-md w-full"
						alt="A beautiful landscape"
					/>
				{/if}
				<!-- <div class="w-full h-56 rounded border border-gray-400 text-5xl">{i}</div> -->
			</CarouselItem>
		{/each}
	</CarouselContent>
	<div class="flex w-full justify-between gap-8">
		<div class="flex gap-4">
			<CarouselArrow class="rounded-full bg-gray-200 p-2" type="prev"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg
				></CarouselArrow
			>
			<CarouselArrow class="rounded-full bg-gray-200 p-2" type="next"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg
				></CarouselArrow
			>
		</div>
		<CarouselIndicator
			class="flex-wrap"
			pointStyle="text-gray-300 data-[active]:text-blue-500 transition-colors duration-300 ease-in-out"
		/>
	</div>
</Carousel>

<style>
	:global(.test) {
		margin-inline: auto;
	}
</style>
