import { throttle } from 'utility/TimingUtils';

export interface ScrollListener {
    (scrollPos: number, overlappingContent: boolean): void;
}

const scrollThreshold: number = 30;

class HeaderScrollBehavior {
    private _scrollParent: HTMLElement;
    private _scrollCallback: EventListener;
    private _listener: ScrollListener;
    private _parentScrollPos: number;
    private _windowScrollPos: number;
    private _minPosition: number;
    private _position: number;

    constructor(scrollParent: HTMLElement) {
        this._scrollParent = null;
        this._parentScrollPos = 0;
        this._windowScrollPos = 0;
        this._listener = null;
        this._position = 0;
        this._minPosition = 0;
        this._scrollCallback = throttle(() => this._handleScroll());
        this.setScrollParent(scrollParent);
    }

    setScrollParent(scrollParent: HTMLElement): void {
        if (scrollParent === this._scrollParent) {
            return;
        }

        if (this._scrollParent) {
            this._scrollParent.removeEventListener('scroll', this._scrollCallback);
            window.removeEventListener('scroll', this._scrollCallback);
        }

        this._scrollParent = scrollParent;

        if (this._scrollParent) {
            this._scrollParent.addEventListener('scroll', this._scrollCallback);
            window.addEventListener('scroll', this._scrollCallback);

            // re-initialize to default values so next scroll triggers an 'event'
            this._parentScrollPos = 0;
            this._windowScrollPos = 0;
            this._handleScroll();
        }
    }

    // set height of item to be scrolled, so we can be sure to position it correctly
    // 'off screen'
    setScrollItemHeight(height: number): void {
        this._minPosition = -height - scrollThreshold;
    }

    // set callback to be called every time a scroll event happens/
    // the scroll position updates
    setScrollListener(listener: ScrollListener): void {
        this._listener = listener;
    }

    // Callback to handle div scrolling and update the position of the header
    // as appropriate
    private _handleScroll(): void {
        if (!this._scrollParent) {
            return;
        }

        const curScrollPos = Math.min(this._scrollParent.scrollTop,
            this._scrollParent.scrollHeight - this._scrollParent.clientHeight);

        const windowScrollPos = window.pageYOffset;

        if (curScrollPos === this._parentScrollPos && windowScrollPos === this._windowScrollPos) {
            return;
        }

        // first, handle normal div scrolling
        const delta = curScrollPos - this._parentScrollPos;
        this._position -= delta;
        if (delta > 0) {
            // scrolling down..
            this._position = Math.max(this._position, this._minPosition);
        } else {
            // scrolling up...
            if (curScrollPos < 0) {
                // To handle rubberbanding on Safari, only pin header to top if we've got a
                // positive scroll position
                this._position = -curScrollPos;
            } else {
                this._position = Math.min(0, this._position);
            }
        }
        this._parentScrollPos = curScrollPos;

        // deal with window scrolling/rubberbanding in mobile safari, which gives a negative scrollpos
        const windowDelta = Math.min(0, windowScrollPos);
        this._windowScrollPos = windowScrollPos;

        if (this._listener) {
            const overlapping = this._parentScrollPos > 0 && this._position !== -this._parentScrollPos;
            this._listener(this._position - windowDelta, overlapping);
        }
    }
}

export { HeaderScrollBehavior };
export default HeaderScrollBehavior;
