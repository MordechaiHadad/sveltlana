<script lang="ts">
	type InputType =
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'tel'
		| 'url'
		| 'search'
		| 'date'
		| 'datetime-local'
		| 'time'
		| 'week'
		| 'month'
		| 'color'
		| 'range'
		| 'hidden';

	let uid = 'input-' + Math.random().toString(36).slice(2, 9);

	let {
		value = $bindable(),
		type = 'text' as InputType,
		error = null,
		name = '',
		oninput,
		onblur,
		disabled = false,
		placeholder = '',
		styles = { wrapper: '', label: '', input: '', error: '' }
	} = $props();

	function handleInput(event: Event) {
		oninput?.(event);
	}

	function handleBlur(event: FocusEvent) {
		onblur?.(event);
	}
</script>

<div class={styles.wrapper}>
	{#if name}
		<label for={uid} class={styles.label}>{name}</label>
	{/if}

	<input
		id={uid}
		{name}
		{type}
		class={styles.input}
		{disabled}
		{placeholder}
		bind:value
		oninput={handleInput}
		onblur={handleBlur}
	/>

	{#if error}
		<small class={styles.error}>{error}</small>
	{/if}
</div>
