import React from 'react'
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { BsTwitterX } from 'react-icons/bs'
import { IoCall } from 'react-icons/io5'
import { IoLogoWhatsapp } from 'react-icons/io'
import { Facebook } from '../components/Icons/Facebook'
import { Whatsapp } from '../components/Icons/Whatsapp'
import { PhoneIcon } from '../components/Icons/PhoneIcon'

export const Footer = () => {
    return (
        <div className="px-4 pb-3 container">
            {/* ----------------------------------------- Footer Start ----------------------------------------- */}
            <footer className={`w-full bg-cardBg app-header card-shadow rounded-lg px-4 py-4`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-md font-semibold text-accent">© 2024, Made by Monk Shadow</span>
                    <div className="flex gap-5">
                        <Facebook width={20} height={20} fill={"none"} />
                        <Whatsapp width={20} height={20} fill={"none"} />
                        <PhoneIcon width={20} height={20} fill={"none"} />
                    </div>
                </div>
            </footer>
            {/* ----------------------------------------- Footer End ----------------------------------------- */}
        </div>
    )
}
