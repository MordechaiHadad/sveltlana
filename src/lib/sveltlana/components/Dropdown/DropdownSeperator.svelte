<script lang="ts">
    type Props = {
        class?: string;
    };

    let { class: className = '' }: Props = $props();
</script>

<div class={className} data-seperator />