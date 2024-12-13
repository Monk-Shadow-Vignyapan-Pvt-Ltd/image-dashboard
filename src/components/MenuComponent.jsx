import React from 'react'
import { Link } from 'react-router-dom'
import { UpArrow } from './Icons/UpArrow'

export const MenuComponent = (props) => {
    return (
        <li className="mb-2 last:mb-0">
            <Link onClick={props.onClick} className={`current-menu-section menu-section duration-100 ease-linear 
                px-3 py-2 flex items-center relative justify-between ${props.isActive && 'bg-menuActive'} hover:bg-menuActive rounded-lg`} to={props.to} >
                <div className="flex items-center flex-1">
                    <div className={`active-menu-status ${props.isActive && 'bg-accent'} h-3 w-2 absolute left-[-4px] rounded-lg`}></div>
                    {props.icon}
                    <span className="text-md ms-2">{props.name}</span>
                </div>
                {props.isArrow && <UpArrow width={20} height={20} fill={"none"} />}
            </Link>
        </li>
    )
}
