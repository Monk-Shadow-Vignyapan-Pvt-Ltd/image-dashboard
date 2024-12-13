import React from 'react';
import { EditIcon } from "./Icons/EditIcon"
import { MdOutlineDelete } from 'react-icons/md';

const ServiceListCard = () => {

    return (
        <div className="flex flex-col gap-3 rounded-lg p-3 border-2">
            <img className="w-full min-h-50 max-h-80 rounded-lg border-2" src='' alt="" />
            <div className="flex flex-col gap-1.5">
                <span className="text-lg text-accent font-semibold">Service Name</span>
                <span className="text-md">Category Name</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex flex-1 space-x-2 rounded-lg bg-mainBg select-none">
                    <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                        <input
                            type="radio"
                            name="radio"
                            defaultValue="html"
                            className="peer hidden flex-1"
                            defaultChecked={true}
                        />
                        <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                            On
                        </span>
                    </label>
                    <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                        <input
                            type="radio"
                            name="radio"
                            defaultValue="react"
                            className="peer hidden flex-1"
                        />
                        <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                            Off
                        </span>
                    </label>
                </div>
                <button><EditIcon width={20} height={20} fill={"#444050"} /></button>
                <button><MdOutlineDelete size={24} fill='#ff2023' /></button>
            </div>
        </div>
    );
};

export default ServiceListCard;
