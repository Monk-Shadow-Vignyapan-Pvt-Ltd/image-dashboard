import React from 'react'

export const DocumentIcon = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width={24} height={24} fill="white" />
                <path
                    d="M17 4H7C5.89543 4 5 4.84276 5 5.88235V18.1176C5 19.1572 5.89543 20 7 20H17C18.1046 20 19 19.1572 19 18.1176V5.88235C19 4.84276 18.1046 4 17 4Z"
                    fill="none"
                    stroke={props.fill}
                    strokeWidth={2}
                />
                <path
                    d="M9 8.70605H15M9 12.4708H15M9 16.2355H13"
                    fill="none"
                    stroke={props.fill}
                    strokeWidth={2}
                    strokeLinecap="round"
                />
            </svg>
        </>
    )
}
