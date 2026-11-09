export type Context = {
	uid: string;
	source?: HTMLElement;
	isExpanded: boolean;
	closeOnOutsideClick: boolean;
	currentIndex: number;
	onExpand: (isExpanded: boolean) => void;
	onCollapse: (isExpanded: boolean) => void;
};
