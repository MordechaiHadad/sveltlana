import { describe, expect, it, vi } from 'vitest';
import { handlePopoverToggle } from './context.js';

describe('handlePopoverToggle', () => {
	const closedEvent = (isConnected: boolean, isOpen: boolean) =>
		({
			newState: 'closed',
			currentTarget: {
				isConnected,
				matches: () => isOpen
			}
		}) as unknown as ToggleEvent;

	it('syncs a native light-dismiss with component state', () => {
		const context = { isExpanded: true, close: vi.fn() };

		handlePopoverToggle(context, closedEvent(true, false));

		expect(context.close).toHaveBeenCalledOnce();
	});

	it('ignores a queued close after the popover has reopened', () => {
		const context = { isExpanded: true, close: vi.fn() };

		handlePopoverToggle(context, closedEvent(true, true));

		expect(context.close).not.toHaveBeenCalled();
	});

	it('ignores a close event from an unmounted popover', () => {
		const context = { isExpanded: true, close: vi.fn() };

		handlePopoverToggle(context, closedEvent(false, false));

		expect(context.close).not.toHaveBeenCalled();
	});
});
