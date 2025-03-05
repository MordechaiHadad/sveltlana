export type SwipableContext = {
    swipingDirection: 'left' | 'right' | 'none';
    swipeDistance: number;
    maxSwipe: number;
    containerWidth: number;
    resetSwipe: () => void;
    thresholdMet: boolean;
}