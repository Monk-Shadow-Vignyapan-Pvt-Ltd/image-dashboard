import React from 'react'

export const FragmentIcon = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width={24} height={24} fill="none" />
                <path
                    d="M9.5 7L4.5 12L9.5 17"
                    fill="none"
                    stroke={props.fill}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14.5 17L19.5 12L14.5 7"
                    fill="none"
                    stroke={props.fill}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </>
    )
}
