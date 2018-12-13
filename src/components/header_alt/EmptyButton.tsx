import React from 'react';
import HeaderButton from './HeaderButton';
import './EmptyButton.scss';

const EmptyButton = (): JSX.Element => {
     return <div className="empty-button">
         <HeaderButton />;
     </div>;
};

export { EmptyButton };
export default EmptyButton;
