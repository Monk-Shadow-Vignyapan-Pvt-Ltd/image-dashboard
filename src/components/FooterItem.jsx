import React from 'react';
import { Link } from 'react-router-dom';

export const FooterItem = (props) => {
    return (
        <li className="mb-4">
            <Link to={props.to || '#'} aria-label={props.ariaLabel || 'Footer link'} className="hover:underline">
                {props.name || 'Default Link'}
            </Link>
        </li>
    );
};

// Default props to handle missing values
FooterItem.defaultProps = {
    ariaLabel: 'Footer link',
    name: 'Default Link',
    to: '#',
};
