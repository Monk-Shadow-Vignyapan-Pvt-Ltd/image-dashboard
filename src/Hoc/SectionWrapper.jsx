import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const SectionWrapper = ({ children, sectionClass = '' }) => {
    return (
        <section className={classNames('relative flex flex-col justify-center py-12 md:py-24', sectionClass)}>
            <div className='container relative'>
                <div className='w-full lg:w-11/12 mx-auto'>
                    {children}
                </div>
            </div>
        </section>
    );
};

// Adding prop types for clarity
SectionWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    sectionClass: PropTypes.string,
};
