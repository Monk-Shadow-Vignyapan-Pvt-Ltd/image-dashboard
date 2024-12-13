import React from 'react'
import { ThreeDotsMenu } from './Icons/ThreeDotsMenu'
import { BellIcon } from './Icons/BellIcon'
import { FragmentIcon } from './Icons/FragmentIcon'
import { CartIcon } from './Icons/CartIcon'
import { CardIcon } from './Icons/CardIcon'
import { LockIcon } from './Icons/LockIcon'
import { DocumentIcon } from './Icons/DocumentIcon'

const OrdersOverview = () => {
    return (
        <div className="w-full flex flex-col col-span-12 lg:col-span-4 md:items-center bg-cardBg rounded-lg card-shadow p-0 h-full p-5 gap-4">
            <div className="flex justify-between items-start w-full">
                <div className="w-full flex flex-col">
                    <span className="text-lg font-semibold text-primaryText">Orders Overview</span>
                    <span className="text-xxl font-semibold text-safeGreen text-primaryText">24%</span>
                </div>
                <ThreeDotsMenu width={26} height={26} fill={"none"} />
            </div>
            <div className="flex w-full gap-2">
                <div className="w-10 h-full flex justify-center py-4 relative">
                    <div className="border-2 rounded-full">
                        <div className="absolute top-[1%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <BellIcon width={24} height={24} fill="#F05F23" />
                        </div>
                        <div className="absolute top-[19.5%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <FragmentIcon width={24} height={24} fill="#F05F23" />
                        </div>
                        <div className="absolute top-[36%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <CartIcon width={24} height={24} fill="#848484" />
                        </div>
                        <div className="absolute top-[54%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <CardIcon width={24} height={24} fill="#848484" />
                        </div>
                        <div className="absolute top-[71.5%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <LockIcon width={24} height={24} fill="#848484" />
                        </div>
                        <div className="absolute top-[89%] w-full right-0 flex items-center justify-center bg-cardBg">
                            <DocumentIcon width={24} height={24} fill="#848484" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">$2400, Design changes</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">New order #1832412</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">Server payments for April</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">New card added for order #4395133</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">Unlock packages for development</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="text-md font-semibold">New order #9583120</span>
                        <span className="text-md">22 DEC 7:20 PM</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdersOverview