import React from 'react'

export const DownloadIcon = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.50003 22H16.5C19.328 22 20.743 22 21.621 21.122C22.5 20.242 22.5 18.829 22.5 16V15C22.5 12.172 22.5 10.758 21.621 9.87895C20.853 9.11095 20.675 9.01395 18.5 9.00195M6.00003 9.00195C3.82503 9.01395 4.14703 9.11095 3.37903 9.87895C2.50003 10.758 2.50003 12.172 2.50003 15V16C2.50003 18.829 2.50003 20.243 3.37903 21.122C3.67903 21.422 4.04103 21.619 4.50003 21.749"
                    stroke={props.fill}
                    strokeWidth={2}
                    strokeLinecap="round"
                />
                <path
                    d="M12.5 2V15M12.5 15L9.50003 11.5M12.5 15L15.5 11.5"
                    stroke={props.fill}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

        </>
    )
}
