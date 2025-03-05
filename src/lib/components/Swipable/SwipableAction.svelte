<script lang="ts">
    import { getContext } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { SwipableContext } from './context.js';

    type Props = {
        class?: string;
        side: 'left' | 'right';
        onAction?: () => void;
        threshold?: number;
        children?: any;
    }

    let { 
        class: className = '', 
        side, 
        onAction = () => {}, 
        children 
    }: Props = $props();
    
    const context: SwipableContext = getContext('swipable');
    
    let isThresholdReached = $derived(
        context.thresholdMet && 
        ((side === 'left' && context.swipeDistance < 0) || 
         (side === 'right' && context.swipeDistance > 0))
    );

    let lastSwipingDirection = $state('none');
    
    $effect(() => {
        // Only trigger action when swiping STOPS (direction changes to none)
        // AND the threshold was reached for this side
        if (context.swipingDirection === 'none' && 
            lastSwipingDirection !== 'none' && 
            isThresholdReached) {
                onAction();
        }
        
        // Update for next comparison
        lastSwipingDirection = context.swipingDirection;
    });
</script>

<div 
    class={twMerge(
        'absolute top-0 h-full flex items-center justify-center z-0',
        side === 'left' ? 'right-0 pr-2' : 'left-0 pl-2',
        className
    )}
>
    {@render children()}
</div>