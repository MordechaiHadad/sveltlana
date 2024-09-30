<script lang="ts">
	import { resizeObserver } from "$lib/actions/resizeObserver.js";
</script>

<div use:resizeObserver={(entry) => console.log(entry)}>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam
</div>