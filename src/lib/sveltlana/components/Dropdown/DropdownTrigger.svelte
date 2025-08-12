<script lang="ts">
import { getContext, type Snippet } from 'svelte';
import type { IContext } from './context';
import { toggle } from "./functions"

let {
	class: className = '',
	children
}: {
	class?: string;
	children: Snippet;
} = $props();

let context: IContext = getContext('dropdown');

const handleClick = () => {
	toggle(context);
};

const handleEnter = (event: KeyboardEvent) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		if (context.isExpanded && context.currentIndex > -1) return;
		else handleClick();
	}
};
</script>

<button onclick={handleClick} class={className} onkeydown={handleEnter}>
	{@render children()}
</button>
