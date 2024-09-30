export const intersectionObserver = (
    node: Element,
    {
        callback,
        threshold,
        delay
    }: {
        callback: Function;
        threshold?: number;
        delay?:
            | number
            | {
                    in?: number;
                    out?: number;
              };
    }
) => {
    let timeoutId: number | null = null;

    const observer = new IntersectionObserver((entries) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;

        let delayTime = 0;
        if (typeof delay === 'number') {
            delayTime = delay;
        } else if (typeof delay === 'object') {
            delayTime = isIntersecting ? delay.in || 0 : delay.out || 0;
        }

        timeoutId = window.setTimeout(() => {
            callback(entries);
        }, delayTime);
    }, {
        threshold
    });

    observer.observe(node);

    return {
        destroy() {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            observer.unobserve(node);
        }
    };
};
