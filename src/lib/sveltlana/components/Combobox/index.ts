import ComboboxComponent from './Combobox.svelte';
import Content from './ComboboxContent.svelte';
import Item from './ComboboxItem.svelte';
import Seperator from './ComboboxSeperator.svelte';
import Input from './ComboboxInput.svelte';

type ComboboxType = typeof ComboboxComponent & {
    Content: typeof Content;
    Item: typeof Item;
    Seperator: typeof Seperator;
    Input: typeof Input;
};

const Combobox = ComboboxComponent as ComboboxType;

Combobox.Content = Content;
Combobox.Item = Item;
Combobox.Seperator = Seperator;
Combobox.Input = Input;

export default Combobox;
