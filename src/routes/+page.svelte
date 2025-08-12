<script lang="ts">
	import Dropdown from '$lib/sveltlana/components/Dropdown';
	let selected = '';
</script>

<div class="h-[70rem]"></div>
<Dropdown expanded={(e) => {}}>
	<Dropdown.Trigger class="px-4 py-2 bg-blue-500 text-white rounded">
		Open Dropdown
	</Dropdown.Trigger>
	<Dropdown.Content class="bg-white border rounded shadow p-2">
		<Dropdown.Item select={() => (selected = 'Option 1')}>Option 1</Dropdown.Item>
		<Dropdown.Item select={() => (selected = 'Option 2')}>Option 2</Dropdown.Item>
		<Dropdown.Seperator class="my-1 border-t" />
		<Dropdown.Item select={() => (selected = 'Option 3')}>Option 3</Dropdown.Item>
	</Dropdown.Content>
</Dropdown>

<p>Selected: {selected}</p>
