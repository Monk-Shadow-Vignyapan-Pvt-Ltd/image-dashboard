import React from 'react'

export const Menu = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="none"
                    stroke={props.stroke}
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M4 7h3m13 0h-9m9 10h-3M4 17h9m-9-5h16"
                />
            </svg>
        </>
    )
}
