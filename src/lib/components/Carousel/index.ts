import CarouselComponent from './Carousel.svelte';
import Arrow from './CarouselArrow.svelte';
import Content from './CarouselContent.svelte';
import Indicator from './CarouselIndicator.svelte';
import Item from './CarouselItem.svelte';

type CarouselType = typeof CarouselComponent & {
    Arrow: typeof Arrow;
    Content: typeof Content;
    Indicator: typeof Indicator;
    Item: typeof Item;
};

const Carousel = CarouselComponent as CarouselType;

Carousel.Arrow = Arrow;
Carousel.Content = Content;
Carousel.Indicator = Indicator;
Carousel.Item = Item;

export default Carousel;
