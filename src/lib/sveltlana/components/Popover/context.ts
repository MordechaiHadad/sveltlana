export type Context = {
	uid: string;
	source?: HTMLElement;
	content?: HTMLElement;
	isExpanded: boolean;
	closeOnOutsideClick: boolean;
	open: (source?: HTMLElement) => void;
	close: () => void;
};

export const handlePopoverToggle = (
	context: Pick<Context, 'isExpanded' | 'close'>,
	event: ToggleEvent
) => {
	const popover = event.currentTarget as HTMLElement;
	if (
		event.newState === 'closed' &&
		context.isExpanded &&
		popover.isConnected &&
		!popover.matches(':popover-open')
	) {
		context.close();
	}
};
