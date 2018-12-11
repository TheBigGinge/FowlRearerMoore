import React from 'react';
import { HeaderScrollBehavior, ScrollListener } from './headerScrollBehavior';
import { Link } from 'react-router-dom';
import EmptyButton from './EmptyButton';
import MenuButton from './MenuButton';
import NavMenu from './NavMenu';
import {
    addScrollbarListener,
    removeScrollbarListener,
    ScrollbarListener } from 'utility/scrollContainer';
import { buildClassString } from 'utility/StringUtils';
// import logo from 'images/KyloHen.png';
import './Header.scss';

interface HeaderProps {
    large?: boolean;                    // whether to render large header vs normal
    disableScrollBehavior?: boolean;    // disable scrolling behavior/pin to top of page
    showMenuButton?: boolean;           // whether to show menu button in header
    showBackButton?: boolean;           // whether to show back button in header
    dispatch?: Function;                //
    currentPage?: Page;                 // currently visible/active page (for giving visual feedback)
    backUrl?: string;                   // url for back button
}

interface HeaderState {
    showShadow: boolean;                // whether or not to show drop shadow
    top: Number;                        // fixed position for top of header
    scrollbarWidth: Number;             // the width of the scrollbar
    menuVisible: boolean;               // whether or not menu is currently visible
}

class Header extends React.PureComponent<HeaderProps, HeaderState> {
    private _containerRef: HTMLElement;  // reference to header container DIV
    private _elementRef: HTMLElement;    // reference to header DIV so we can compute height
    private _scrollBehavior: HeaderScrollBehavior;
    private _detectScrollbarCallback: ScrollbarListener;
    private _scrollListener: ScrollListener;
    private _menuItems: NavMenuItem[];    // cached list of menu items
    private _closeMenuCallback: () => void;

    constructor(props: HeaderProps) {
        super(props);
        this._elementRef = null;
        this._menuItems = null;
        this.state = Object.assign({}, this.state, {
            showShadow: false,
            top: 0,
            scrollbarWidth: 0,
            menuVisible: false
        });

        this._scrollBehavior = new HeaderScrollBehavior(null);
        this._closeMenuCallback = () => this.setState({menuVisible: false});

        this._scrollListener = (scrollPos, overlappingContent) => {
            this._handleScroll(scrollPos, overlappingContent);
        };

        this._detectScrollbarCallback = (scrollbarWidth: number): void => {
            if (scrollbarWidth !== this.state.scrollbarWidth) {
                if (this._elementRef && !this.props.disableScrollBehavior) {
                    // purposefully violating React patterns here for perf reasons
                    this._elementRef.style.right = `${scrollbarWidth}px`;
                }
                this.setState({scrollbarWidth});
            }
        };
    }

    componentDidMount(): void {
        // initialize our scroll behavior now that we have concrete DOM elements
        const { disableScrollBehavior } = this.props;
        if (this._elementRef) {
            this._scrollBehavior.setScrollItemHeight(this._elementRef.offsetHeight);
        }
        this._configureScrollBehavior(!disableScrollBehavior);

        addScrollbarListener(this._detectScrollbarCallback);
    }

    componentDidUpdate(): void {
        // after each update, set up scroll behavior based on current state
        const { disableScrollBehavior } = this.props;
        this._configureScrollBehavior(!disableScrollBehavior);
    }

    componentWillUnmount(): void {
        // Cleanup any event handlers
        this._configureScrollBehavior(false);
        removeScrollbarListener(this._detectScrollbarCallback);
    }

    render(): JSX.Element {
        const {
            large,
            disableScrollBehavior,
            showMenuButton,
            showBackButton,
            currentPage,
            backUrl } = this.props;
        const {
            showShadow,
            top,
            scrollbarWidth,
            menuVisible } = this.state;

        const title = Header._getTitleForPage(currentPage);
        const fixed = !disableScrollBehavior;
        const headerClass = buildClassString({
            header: true,
            fixed,
            shadow: fixed && showShadow, // shadow only makes sense if in fixed mode
        });

        const leftButton = showMenuButton ?
            <MenuButton href={'/Home'}/> : null;
        const rightButton: JSX.Element = null; // placeholder for future

        const headerStyle = fixed ?
            {
                top: `${top}px`,
                right: `${scrollbarWidth}px`
            } :
            {};

        return (
            <div key="header"
                className={`header-container${large ? ' large' : ''}`}
                ref={ref => this._containerRef = ref}
            >
                <div
                    className={headerClass}
                    ref={ref => this._elementRef = ref}
                    style={headerStyle}
                >
                    { leftButton || <EmptyButton /> }
                    { this._renderLogo(title, currentPage) }
                    <h4 className="header-title">{title || ''}</h4>
                    { rightButton || <EmptyButton /> }
                    { this._renderMenu(menuVisible, currentPage)}
                </div>
            </div>
        );
    }

    // Determines title to display in header, based on current/visible page
    private static _getTitleForPage(page: Page): string {
        switch (page) {
            case Page.Home:
                return 'Home';
            case Page.NotFound:
                return 'How the hell did you get here?';
        }

        return '';
    }

    // Sets up scroll behavior object to implement our 'fixed' header behavior
    // (assumes we want to scroll within our parent element)
    private _configureScrollBehavior(enable: boolean): void {
        if (!enable) {
            // if disabling scroll behavior, reset state to reflect
            // header no longer being fixed
            // Could also just call this._handleScroll(0, false)
            this.setState({
                top: 0,
                showShadow: false});
        }

        if (this._containerRef) { // can only do this if materialized in DOM
            // ordering matters here -- the callback will get triggered if a new scroll parent
            // is set, putting us in the correct state for the current state of DOM
            this._scrollBehavior.setScrollListener(enable ? this._scrollListener : null);
            this._scrollBehavior.setScrollParent(enable ? this._containerRef.parentElement : null);
        }
    }

    private _handleScroll(headerPos: number, overlappingContent: boolean): void {
        const showShadow = overlappingContent;
        const shadowClass = 'shadow';
        // NOTE: This is purposefully violating React patterns to update properties
        // in as tight a loop as possible to avoid any lag.
        // In an ideal world, we'd use setState() here and render with new position and
        // shadow, but that makes things choppy
        if (this._elementRef) {
            this._elementRef.style.top = `${headerPos}px`;
            if (showShadow) {
                this._elementRef.classList.add(shadowClass);
            } else {
                this._elementRef.classList.remove(shadowClass);
            }
        }

        this.setState({
            showShadow,
            top: headerPos
        });
    }

    private _renderLogo(title: string, currentPage: Page): JSX.Element {
        const logoClass = buildClassString({
            logo: true,
            active: !title,
            large: true
        });

        return <Link to={`${PageUrl.Home}`} className={logoClass} >
            <img src={''} className="logo-img" alt={'Home'} />
        </Link>;
    }

    private _renderMenu(menuVisible: boolean, currentPage: Page): JSX.Element {
        return <NavMenu
            show={menuVisible}
            items={this._buildMenuItems()}
            closeCallback={this._closeMenuCallback}
            currentPage={currentPage}
        />;
    }

    private _buildMenuItems(): NavMenuItem[] {
        if (!this._menuItems) {
            this._menuItems = [
                {
                    to: PageUrl.Home,
                    text: 'Home',
                    icon: 'icon-home',
                    onClick: this._closeMenuCallback,
                    page: Page.Home
                }
            ];
        }

        return this._menuItems;
    }
}

export { Header };
export default Header;
