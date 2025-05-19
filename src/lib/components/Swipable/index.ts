import SwipableComponent from './Swipable.svelte';
import Action from './SwipableAction.svelte';
import Content from './SwipableContent.svelte';

type SwipableType = typeof SwipableComponent & {
    Action: typeof Action;
    Content: typeof Content;
};

const Swipable = SwipableComponent as SwipableType;

Swipable.Action = Action;
Swipable.Content = Content;

export default Swipable;
