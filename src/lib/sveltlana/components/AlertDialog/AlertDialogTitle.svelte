<script lang="ts">
    let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<h2 class={className}>
    {@render children()}
</h2>
