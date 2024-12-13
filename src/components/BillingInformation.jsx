import React from 'react'
import { ThreeDotsMenu } from './Icons/ThreeDotsMenu'
import { SearchIcon } from './Icons/SearchIcon'

const BillingInformation = () => {
    return (
        <div className="w-full flex flex-col col-span-12 lg:col-span-8 md:items-center bg-cardBg rounded-lg card-shadow p-0 h-full p-5 gap-6">
            <div className="flex justify-between items-center w-full">
                <div className="w-full flex flex-col">
                    <span className="text-lg font-semibold text-primaryText">Billing Information</span>
                </div>
                <SearchIcon width={24} height={24} fill={"none"} />
            </div>
            <div className="flex flex-col w-full gap-2 flex-1 justify-center">
                <div className="p-4 border-2 rounded-lg w-full">
                    <div className="flex justify-between items-start w-full">
                        <div className="w-full flex flex-col">
                            <span className="text-lg font-semibold text-primaryText">Oliver Liam</span>
                        </div>
                        <ThreeDotsMenu width={26} height={26} fill={"none"} />
                    </div>
                    <div className="flex flex-col mt-3 gap-1.5">
                        <div className="flex gap-1">
                            <span className="text-md">Company Name :</span>
                            <span className="text-md font-semibold">Viking Burrito</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-md">Email Address :</span>
                            <span className="text-md font-semibold">oliver@burrito.com</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-md">VAT Number :</span>
                            <span className="text-md font-semibold">FRB1235476</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-2 rounded-lg w-full">
                    <div className="flex justify-between items-start w-full">
                        <div className="w-full flex flex-col">
                            <span className="text-lg font-semibold text-primaryText">Oliver Liam</span>
                        </div>
                        <ThreeDotsMenu width={26} height={26} fill={"none"} />
                    </div>
                    <div className="flex flex-col mt-3 gap-1.5">
                        <div className="flex gap-1">
                            <span className="text-md">Company Name :</span>
                            <span className="text-md font-semibold">Viking Burrito</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-md">Email Address :</span>
                            <span className="text-md font-semibold">oliver@burrito.com</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-md">VAT Number :</span>
                            <span className="text-md font-semibold">FRB1235476</span>
                        </div>
                    </div>
                </div>
                <button className="bg-transparent text-accent text-md font-semibold w-full border-2 border- hover:border-accent duration-300 rounded-lg py-3">See More</button>
            </div>
        </div>
    )
}

export default BillingInformation