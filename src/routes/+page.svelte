<script lang="ts">
	import Carousel from '$lib/components/Carousel/Carousel.svelte';
	import CarouselArrow from '$lib/components/Carousel/CarouselArrow.svelte';
	import CarouselContent from '$lib/components/Carousel/CarouselContent.svelte';
	import CarouselIndicator from '$lib/components/Carousel/CarouselIndicator.svelte';
	import CarouselItem from '$lib/components/Carousel/CarouselItem.svelte';
</script>

<div>
	<Carousel class="test max-w-96 mt-56 flex flex-col gap-5" on:scroll={(event) => {}}>
		<CarouselContent>
			{#each Array.from({ length: 10 }) as _}
				<CarouselItem class="opacity-60 data-[active]:opacity-100">
					<img
						src="https://images.unsplash.com/photo-1717597860306-e6d3602f9913?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="A beautiful landscape"
					/>
				</CarouselItem>
			{/each}
		</CarouselContent>
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
		<CarouselIndicator length={10} />
	</Carousel>
</div>

<style>
	:global(.test) {
		margin-inline: auto;
	}
</style>
