import AccordionComponent from './Accordion.svelte';
import Content from './AccordionContent.svelte';
import Trigger from './AccordionTrigger.svelte';

type AccordionType = typeof AccordionComponent & {
    Content: typeof Content;
    Trigger: typeof Trigger;
};

const Accordion = AccordionComponent as AccordionType;

Accordion.Content = Content;
Accordion.Trigger = Trigger;

export default Accordion;
