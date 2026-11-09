export type Context = {
	swipingDirection: 'left' | 'right' | 'none';
	swipeDistance: number;
	containerWidth: number;
	resetSwipe: () => void;
	thresholdMet: () => boolean;
};
