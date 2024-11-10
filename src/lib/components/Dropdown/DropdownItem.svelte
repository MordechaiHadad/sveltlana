<script lang="ts">
	import { getContext } from 'svelte';
	import type { IContext } from './context.js';
	import { toggle } from './functions.js';

	type Props = {
		autoCloseOnClick?: boolean;
		class?: string;
		select: (context: IContext) => void;
	};

	let { autoCloseOnClick = true, class: className = '', select }: Props = $props();

	let context: IContext = getContext('dropdown');

	const handleClick = () => {
		select(context);
		if (autoCloseOnClick) toggle(context);
	};

	const onHover = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLElement;
		target.setAttribute('data-active', '');
	};

	const onHoverOut = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLElement;
		target.removeAttribute('data-active');
	};
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	class={className}
	onclick={handleClick}
	onmouseover={onHover}
	onmouseout={onHoverOut}
	tabindex="-1"
>
	<slot />
</button>
