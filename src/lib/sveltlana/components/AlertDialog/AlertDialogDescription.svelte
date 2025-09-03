<script lang="ts">
	import { Snippet } from "svelte";

    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<p class={className}>
    {@render children()}
</p>
