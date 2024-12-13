import React from 'react'

export const MailIcon = (props) => {
    return (
        <>
            <svg
                width={props.width}
                height={props.height}
                fill={props.boxFill}
                viewBox="0 0 25 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    className="fill-safeGreen"
                    d="M22.6666 6C22.6666 4.9 21.7666 4 20.6666 4H4.66663C3.56663 4 2.66663 4.9 2.66663 6V18C2.66663 19.1 3.56663 20 4.66663 20H20.6666C21.7666 20 22.6666 19.1 22.6666 18V6ZM20.6666 6L12.6666 11L4.66663 6H20.6666ZM20.6666 18H4.66663V8L12.6666 13L20.6666 8V18Z"
                    fill=""
                />
            </svg>
        </>
    )
}
