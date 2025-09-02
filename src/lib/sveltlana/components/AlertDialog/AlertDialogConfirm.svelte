<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import { getContext } from 'svelte';
    import type { Context } from './context';

    let { class: className = '', children = 'Confirm' }: { class?: string; children?: any } = $props();

    const context = getContext('alertdialog') as Context;

    const handleClick = () => {
        context.onConfirm?.();
        context.isOpen = false;
    };
</script>

<button type="button" class={twMerge('inline-flex items-center', className)} onclick={handleClick}>
    {@render children()}
</button>
