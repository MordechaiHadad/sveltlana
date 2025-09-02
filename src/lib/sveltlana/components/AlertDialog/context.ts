export type Context = {
    isOpen: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
};
