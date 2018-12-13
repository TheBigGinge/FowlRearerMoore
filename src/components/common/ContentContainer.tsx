import React from 'react';
import './ContentContainer.scss';

interface ContentContainerProps {
    className?: string;
    nopadding?: boolean;
    children?: JSX.Element|JSX.Element[];
}

const ContentContainer = (props: ContentContainerProps): JSX.Element => {
    const noPaddingClass = props.nopadding ? ' no-padding' : '';
    const className = props.className ? ` ${props.className}` : '';
    return (
        <div className={`content-container${noPaddingClass}${className}`}>
            {props.children}
        </div>
    );
};

export { ContentContainer };
export default ContentContainer;
