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
		label = '',
		required = false,
		oninput,
		onblur,
		disabled = false,
		placeholder = '',
		styles = { wrapper: '', label: '', input: '', error: '', asterisk: '' }
	} = $props();

	function handleInput(event: Event) {
		oninput?.(event);
	}

	function handleBlur(event: FocusEvent) {
		onblur?.(event);
	}
</script>

<div class={styles.wrapper}>
	{#if label}
		<label for={uid} class={styles.label}>{label}{#if required}<span class={styles.asterisk}> *</span>{/if}</label>
	{/if}

	<input
		id={uid}
		name={label}
		{type}
		class={styles.input}
		{disabled}
		{placeholder}
		{required}
		bind:value
		oninput={handleInput}
		onblur={handleBlur}
	/>

	{#if error}
		<small class={styles.error}>{error}</small>
	{/if}
</div>
