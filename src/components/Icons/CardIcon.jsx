import React from 'react'

export const CardIcon = (props) => {
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
                    d="M20 12.0001C20 8.9833 20 7.4745 19.0624 6.5377C18.1248 5.6009 16.6168 5.6001 13.6 5.6001H10.4C7.3832 5.6001 5.8744 5.6001 4.9376 6.5377C4.0008 7.4753 4 8.9833 4 12.0001C4 15.0169 4 16.5257 4.9376 17.4625C5.8752 18.3993 7.3832 18.4001 10.4 18.4001H13.6C16.6168 18.4001 18.1256 18.4001 19.0624 17.4625C19.5856 16.9401 19.8168 16.2401 19.9184 15.2001M10.4 15.2001H7.2M13.6 15.2001H12.4M4 10.4001H8M20 10.4001H11.2"
                    fill="none"
                    stroke={props.fill}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>

        </>
    )
}
