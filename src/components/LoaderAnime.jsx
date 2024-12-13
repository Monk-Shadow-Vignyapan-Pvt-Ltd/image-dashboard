import React from 'react';
import loadervideo from '../assets/loader.mp4';

export const LoaderAnime = () => {
    return (
        <div className='w-screen h-screen fixed flex justify-center items-center top-0 left-0 z-10 bg-accent'>
            <i className="loader" />
        </div>
    );
}
