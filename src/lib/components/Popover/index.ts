import PopoverComponent from './Popover.svelte';
import Content from './PopoverContent.svelte';
import Trigger from './PopoverTrigger.svelte';

type PopoverType = typeof PopoverComponent & {
    Content: typeof Content;
    Trigger: typeof Trigger;
};

const Popover = PopoverComponent as PopoverType;

Popover.Content = Content;
Popover.Trigger = Trigger;

export default Popover;
