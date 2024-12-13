import React from 'react'

export const ProfilePic = (props) => {
    return (
        <>
            <img className="rounded-full object-cover icon-xl border-2 border-accent" src={props.Img} alt="props.imgName" />
        </>
    )
}