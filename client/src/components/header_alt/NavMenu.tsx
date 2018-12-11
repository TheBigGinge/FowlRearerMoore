import React from 'react';
// import CloseButton from 'components/Header/CloseButton';
import { Link } from 'react-router-dom';
import ContentContainer from 'components/common/ContentContainer';
import FadeComponent from 'components/common/FadeComponent';
// import { NavigationAction } from 'types/sharedUITypes';

import './NavMenu.scss';

interface NavMenuProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    items: NavMenuItem[];
    show: boolean;
    closeCallback: () => void;
    currentPage?: Page;
}

const fadeDuration = 125; // ms

class NavMenu extends React.PureComponent<NavMenuProps, {}> {
    private _keyHandler: EventListener;
    private _removeNavFilter: () => void;

    componentDidMount(): void {
        // Attach keypress handler to dismiss the menu if ESC is pressed
        this._keyHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.props.closeCallback();
            }
        };

        window.addEventListener('keydown', this._keyHandler);
    }

    componentWillUnmount(): void {
        if (this._keyHandler) {
            window.removeEventListener('keydown', this._keyHandler);
        }

        if (this._removeNavFilter) {
            this._removeNavFilter();
            this._removeNavFilter = null;
        }
    }

    render(): JSX.Element|JSX.Element[] {
        const {
            firstName,
            lastName,
            email,
            items,
            closeCallback,
            show } = this.props;

        return <FadeComponent show={show} fadeDuration={fadeDuration} className="nav-menu">
            <div className="button-container">
                {/*<CloseButton to={closeCallback}/>*/}
            </div>
            <ContentContainer>
                <div className="heading">
                    <div className="email pxl-small">{email}</div>
                </div>
            </ContentContainer>
            <ContentContainer className="nav-list-container" nopadding={true}>
                <ul className="nav-list">
                    { items.map(item => this._renderNavItem(item)) }
                </ul>
            </ContentContainer>
        </FadeComponent>;
    }

    // Returns the page that we should consider 'active' for the current page
    private _activePageForPage(page: Page): Page {
        return page;
    }

    private _renderNavItem(item: NavMenuItem): JSX.Element {
        const {currentPage} = this.props;
        const { to, text, icon, page } = item;
        const defaultIcon = 'icon-check-empty default-icon';
        const active = page != null && page === this._activePageForPage(currentPage);
        return <li key={text} className={`nav-list-item${active ? ' active' : ''}`}>
            <Link className="nav-list-link" to={to} >
                <div className="nav-list-item-content">
                    <i className={`nav-item-icon ${icon || defaultIcon}`} />
                    <div className="nav-item-text">
                        {text}
                    </div>
                </div>
            </Link>
        </li>;
    }
}

export { NavMenu };
export default NavMenu;