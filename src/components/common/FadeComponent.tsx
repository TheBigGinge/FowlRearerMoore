import React from 'react';
import { buildClassString } from 'utility/StringUtils';
import './FadeComponent.scss';

interface FadeComponentProps {
    children?: JSX.Element|JSX.Element[];        // children to be faded in/out
    className?: string;            // className to be applied to component/wrapper
    fadeDuration?: number;         // duration of fade animation (in ms)
    fadeDelay?: number;            // amount of time to delay before animating (in ms)
    show: boolean;                 // whether a show (fade-in) or hide (fade-out) animation
}

interface FadeComponentState {
    transitioning: boolean;
}

const defaultFadeDuration = 250; // in ms
const defaultFadeDelay = 0;      // in ms

class FadeComponent extends React.PureComponent<FadeComponentProps, FadeComponentState> {
    private _elt: HTMLElement;

    constructor(props: FadeComponentProps) {
        super(props);
        this.state = Object.assign({}, this.state, { transitioning: false });
    }

    componentDidMount(): void {
        // For this to work with header in 'responsive' mode, we need to only have
        // CSS transitions set when we need it/the item is in the process of being
        // shown/hidden
        if (this._elt) {
            this._elt.addEventListener('transitionend', () => {
                this.setState({transitioning: false});
            });
        }
    }

    componentWillReceiveProps(nextProps: FadeComponentProps): void {
        // if we're transitioning visibility, set the transition class
        // on the DIV to use CSS transitions
        if (nextProps.show !== this.props.show) {
            this.setState({transitioning: true});
        }
    }

    render(): JSX.Element|JSX.Element[] {
        const { children, show, fadeDuration, fadeDelay, className } = this.props;
        const classString = buildClassString({
            [className]: !!className,
            'fade-container': true,
            'hide': !show,
            'show': show,
            'transition': this.state.transitioning
        });

        const styleDict = {
            transitionDuration: `${fadeDuration || defaultFadeDuration}ms`,
            transitionDelay: `${fadeDelay || defaultFadeDelay}ms`
        };

        return (
            <div
                className={classString}
                style={styleDict}
                ref={elt => this._elt = elt}
            >
                { children }
            </div>
        );
    }
}

export { FadeComponent };
export default FadeComponent;
