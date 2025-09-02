<script lang="ts">
    let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<p class={className}>
    {@render children()}
</p>
