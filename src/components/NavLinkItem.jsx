import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export const NavLinkItem = ({ to, ariaLabel, target, navCss, name }) => {
    return (
        <NavLink
            to={to}
            aria-label={ariaLabel}
            target={target}
            className={`block ${navCss} font-semibold hover:text-primary duration-300 ease-linear`}
        >
            {name}
        </NavLink>
    );
};

NavLinkItem.propTypes = {
    to: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    target: PropTypes.string,
    navCss: PropTypes.string,
    name: PropTypes.string.isRequired,
};

NavLinkItem.defaultProps = {
    target: '_self', // Default behavior to open in the same tab
    navCss: '', // Default to no additional CSS
};
