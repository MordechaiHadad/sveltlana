<script lang="ts">
    import { getContext } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { Context } from './context';

    type Props = {
        class?: string;
        children?: any;
    }

    let { class: className = '', children }: Props = $props();
    
    const context: Context = getContext('swipable');
    
    let transform = $derived(`translateX(${context.swipeDistance}px)`);
</script>

<div 
    class={twMerge(
        'w-full transition-transform duration-100 ease-out relative z-10',
        className
    )}
    style:transform={transform}
>
    {@render children()}
</div>