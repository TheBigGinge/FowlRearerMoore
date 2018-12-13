import React from 'react';
import HeaderButton from './HeaderButton';

interface MenuButtonProps {
    href: string;
}

const MenuButton = (props: MenuButtonProps): JSX.Element => {
    const { href } = props;
    return (
        <HeaderButton
            iconName="icon-menu"
        />
    );
};

export { MenuButton };
export default MenuButton;