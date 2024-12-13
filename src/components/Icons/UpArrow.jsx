import React from 'react'

export const UpArrow = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                fill={props.fill}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17 14L12 9L7 14"
                    stroke="#444050"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </>
    )
}
