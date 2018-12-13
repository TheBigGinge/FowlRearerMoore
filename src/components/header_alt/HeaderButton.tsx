import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderButton.scss';

interface HeaderButtonProps {
    iconName?: string;
    href?: string;
}

const HeaderButton = (props: HeaderButtonProps): JSX.Element => {
    const { iconName, href } = props;

    return (
        <Link
            to={href}
        >
            <div className="header-button">
                <i className={iconName} />
            </div>
        </Link>
    );
};

export { HeaderButton };
export default HeaderButton;