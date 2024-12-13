import React from 'react';
import loadervideo from '../assets/loader.mp4';

export const Loader = () => {
    return (
        <div className='w-screen h-screen block fixed top-0 left-0 z-10'>
            <video
                muted
                loop
                autoPlay
                className='w-full h-full object-cover bg-cover scale-125'
                preload="auto"
                playsInline // Ensures the video plays inline on iOS devices instead of fullscreen
                webkit-playsinline="true" // WebKit-specific attribute for inline playback on iOS
            >
                <source src={loadervideo} type="video/mp4" />
                {/* Provide fallback content for browsers that do not support the video element */}
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
