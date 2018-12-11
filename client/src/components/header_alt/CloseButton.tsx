import React from 'react';
import HeaderButton from './HeaderButton';

interface CloseButtonProps {
    href: string;
}

const CloseButton = (props: CloseButtonProps): JSX.Element => {
    return <HeaderButton
        iconName="icon-cancel"
    />;
};

export { CloseButton };
export default CloseButton;