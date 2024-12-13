import React from 'react'

export const UploadIcon = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                fill={props.fill}
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M16 20V2.66663M16 2.66663L20 7.33329M16 2.66663L12 7.33329"
                    stroke="#F24E1E"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10.6665 29.3334H21.3332C25.1038 29.3334 26.9905 29.3334 28.1612 28.1627C29.3332 26.9894 29.3332 25.1054 29.3332 21.3334V20C29.3332 16.2294 29.3332 14.344 28.1612 13.172C27.1372 12.148 25.5665 12.0187 22.6665 12.0027M9.33317 12.0027C6.43317 12.0187 4.8625 12.148 3.8385 13.172C2.6665 14.344 2.6665 16.2294 2.6665 20V21.3334C2.6665 25.1054 2.6665 26.9907 3.8385 28.1627C4.2385 28.5627 4.72117 28.8254 5.33317 28.9987"
                    stroke="#F24E1E"
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            </svg>

        </>
    )
}
