import React from 'react'

export const VideoPlayer = ({ video }) => {
    return (
        <>
            {/* ----------------- Video Player Start ----------------- */}
            <video
                muted
                autoPlay
                loop
                className='w-full h-full object-cover bg-cover scale-125'
                preload="auto"
                playsInline // Ensures the video plays inline on iOS devices instead of fullscreen
                webkit-playsinline // WebKit-specific attribute for inline playback on iOS
            >
                <source src={video} type="video/mp4" />
            </video>
            {/* ----------------- Video Player End ----------------- */}
        </>
    )
}
