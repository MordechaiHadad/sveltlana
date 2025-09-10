export type Context = {
	isExpanded: boolean;
	currentIndex: number;
	onExpand: (isExpanded: boolean) => void;
	onCollapse: (isExpanded: boolean) => void;
};
