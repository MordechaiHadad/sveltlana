import type { IContext } from './context.js';

export const toggle = (context: IContext) => {
	context.currentIndex = -1;
	context.isExpanded = !context.isExpanded;
};
