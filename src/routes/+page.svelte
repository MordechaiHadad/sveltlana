<script lang="ts">
    import Swipable from "$lib/components/Swipable/Swipable.svelte";
    import SwipableAction from "$lib/components/Swipable/SwipableAction.svelte";
    import SwipableContent from "$lib/components/Swipable/SwipableContent.svelte";
  
    const handleArchive = () => {
        console.log('Item archived!');
    };
    
    const handleDelete = () => {
        console.log('Item deleted!');
    };
</script>

<Swipable class="w-96 mb-4 bg-transparent" thresholdReachedClass="bg-blue-500">
    <SwipableAction 
        side="left" 
        class="text-black px-4"
        onAction={handleArchive}
    >
        <span>Archive</span>
    </SwipableAction>
    
    <SwipableContent class="bg-white p-4 border rounded shadow">
        <div>Swipe me left or right</div>
    </SwipableContent>
    
    <SwipableAction 
        side="right" 
        class="text-black px-4"
        onAction={handleDelete}
    >
        <span>Delete</span>
    </SwipableAction>
</Swipable>