<script lang="ts">
	import Dropdown from '$lib/components/Dropdown/Dropdown.svelte';
	import DropdownContent from '$lib/components/Dropdown/DropdownContent.svelte';
	import DropdownItem from '$lib/components/Dropdown/DropdownItem.svelte';
	import DropdownSeperator from '$lib/components/Dropdown/DropdownSeperator.svelte';
	import DropdownTrigger from '$lib/components/Dropdown/DropdownTrigger.svelte';

	let randomStrings = [
		'red apple',
		'yellow banana',
		'sweet cherry',
		'juicy date',
		'ripe elderberry',
		'fresh fig',
		'green grape',
		'purple plum',
		'tart lemon',
		'ripe mango',
		'juicy orange',
		'ripe peach',
		'crisp pear',
		'sweet pineapple',
		'ripe raspberry',
		'juicy strawberry',
		'tangy tangerine',
		'ripe watermelon',
		'juicy kiwi'
	];
    let selected = '';
</script>

<!-- svelte-ignore missing-declaration -->
<Dropdown>
	<DropdownTrigger class="trigger">{selected.length > 0 ? selected : "Click me"}</DropdownTrigger>
	<DropdownContent>
		{#each randomStrings as string}
			<DropdownItem class="item" on:select={() => {
                selected = string;
            }}>{string}</DropdownItem>
		{/each}
		<DropdownSeperator class="seperator" />
	</DropdownContent>
</Dropdown>

<style>
    .item {
        white-space: nowrap;
		text-align: start;
	}
    .trigger {
        white-space: nowrap;
    }
    .seperator {
        width: 100%;
        border: 1px solid #333333;
    }
</style>
