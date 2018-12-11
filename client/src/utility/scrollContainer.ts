
// Callback type to be notified of width of scrollbar as it changes
export interface ScrollbarListener { (scrollbarWidth: number): void; }

let scrollContainer: HTMLElement = null;            // top-level container on which scroll is enabled
let scrollbarTimer: number = null;                          // timer for detection of scrollbar
const scrollbarListeners: ScrollbarListener[] = []; // registered listeners of scrollbar changes

export const setScrollContainer = (container: HTMLElement): void => {
    scrollContainer = container;
};

export const getScrollContainer = (): HTMLElement => {
    return scrollContainer;
};

// Register a listener to be called back with the width of the scrollbar on current scrollContainer.
// Note that this will call back repeatedly on an interval, so it's on the consumer to avoid duplicate work
export const addScrollbarListener = (callback: ScrollbarListener): void => {
    if (!callback) {
        return;
    }
    scrollbarListeners.push(callback);
    if (!scrollbarTimer) {
        // polling interval is ~30fps (1000ms/30fps = 33ms)
        scrollbarTimer = window.setTimeout(detectScrollbar, 33);
    }
};

// Unregisters a listener to be called with width of scrollbar
export const removeScrollbarListener = (callback: ScrollbarListener): void => {
    if (!callback) {
        return;
    }

    const index = scrollbarListeners.indexOf(callback);
    if (index === -1) {
        return;
    }

    scrollbarListeners.splice(index, 1);
    if (scrollbarListeners.length === 0) {
        window.clearTimeout(scrollbarTimer);
        scrollbarTimer = 0;
    }
};

// checks for width of scrollbar, and calls any registered listeners with the width
const detectScrollbar = (): void => {
    scrollbarTimer = null;
    if (!scrollContainer || scrollbarListeners.length === 0) { return; }

    const clientWidth = scrollContainer.clientWidth;
    const offsetWidth = scrollContainer.offsetWidth;
    const delta = offsetWidth - clientWidth;
    scrollbarListeners.forEach(listener => {
        try {
            listener(delta);
        } catch {}
    });

    // polling interval is ~15fps (1000ms/15fps = 67ms)
    scrollbarTimer = window.setTimeout(detectScrollbar, 67);
};