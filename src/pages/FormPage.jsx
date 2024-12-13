import React, { useState, useEffect } from 'react';
import { HeroSection } from '../section/HeroSection';

import { Datepicker } from "flowbite-react";
// import { DataSvg } from '../components/Icons/DataSvg';
import { ShowPasswordIcon } from '../components/Icons/ShowPasswordIcon';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css';
import confirmDate from 'flatpickr/dist/plugins/confirmDate/confirmDate';

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CloseIcon } from '../components/Icons/CloseIcon';
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const FormPage = () => {

    const customTheme = {
        color: {
            primary: "bg-red-500 hover:bg-red-600",
        },
    };


    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date).split('/').join('-');
    };

    useEffect(() => {
        flatpickr('#dateOfBirth', {
            enableTime: false,
            dateFormat: "d-m-y", // Flatpickr date format
            maxDate: new Date(),
            plugins: [new confirmDate({
                confirmText: 'OK',
                showAlways: false,
                theme: 'light',
            })],
            disableMobile: true,
        });
    }, []);

    // const [selected, setSelected] = useState(people[3])

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event) => {
        // Check if the key pressed is Enter or Comma
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            if (inputValue && !tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
                setInputValue('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };


    return (
        <form className={`relative w-full bg-cardBg card-shadow flex flex-col rounded-lg px-3 pt-2 pb-4`}>
            <span className="text-lg font-semibold mb-5">Form</span>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center justify-between gap-3">

                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="firstName" >First Name</label>
                    <input id="firstName" className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your First Name" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="lastName">Last Name</label>
                    <input id="lastName" className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your Last Name" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="gender">Gender</label>
                    <div className="flex space-x-2 rounded-lg bg-mainBg select-none">
                        <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                            <input
                                id="gender"
                                type="radio"
                                name="radio"
                                defaultValue="html"
                                className="peer hidden flex-1"
                                defaultChecked={true}
                            />
                            <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                                Male
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
                                Female
                            </span>
                        </label>
                        <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                            <input
                                type="radio"
                                name="radio"
                                defaultValue="vue"
                                className="peer hidden flex-1"
                            />
                            <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                                Others
                            </span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col light">
                    <label className="mb-1 text-md font-semibold" htmlFor="dateOfBirth">Birth Date</label>
                    <div className="relative col">
                        {/* <DataSvg /> */}
                        <input
                            id="dateOfBirth"
                            type="text"
                            name="dateOfBirth"
                            readOnly // Set readOnly since Flatpickr manages input
                            className="bg-mainBg placeholder:text-secondaryText focus:outline-none text-sm rounded-lg px-3 py-2 block w-full "
                            placeholder="Enter your Date of Birth"
                        />
                    </div>
                    {/* <Datepicker
                        theme={customTheme} color="primary"
                        weekStart={1} // Monday
                    /> */}
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="password">Password</label>
                    <div className="focus-within:outline-1 focus-within:outline-accent bg-mainBg flex items-center justify-between px-3 py-2 rounded-lg">
                        <input id="password" className="font-input-style flex-1 me-2 text-sm min-w-0 focus:outline-none bg-mainBg placeholder:text-secondaryText" type="password" placeholder="Enter your First Name" />
                        <ShowPasswordIcon width={16} height={16} fill={"none"} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="email">Email</label>
                    <div className="focus-within:outline-1 focus-within:outline-accent bg-mainBg flex items-center justify-between px-3 py-2 rounded-lg">
                        <input id="email" className="font-input-style flex-1 me-2 text-sm min-w-0 focus:outline-none bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your Email" />
                        <span className="text-accent text-sm">@gmail.com</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="company">Company</label>
                    <input id="company" className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your Company Name" />
                </div>
                <div className="flex flex-col">
                    {/* <Listbox value={selected} onChange={setSelected}> */}
                    <Listbox >
                        <Label className="mb-1 text-md font-semibold" htmlFor="country">Country</Label>
                        <div className="relative">
                            <ListboxButton id="country" className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-2 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent sm:text-sm sm:leading-6">
                                <span className="flex items-center flex h-5">
                                    {/* <img alt="" src={selected.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                    Select your Country
                                </span>
                                {/* <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                </span> */}
                            </ListboxButton>

                            <ListboxOptions
                                transition
                                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                            >
                                <ListboxOption
                                    className="group relative cursor-default select-none rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                >
                                    <div className="flex items-center">
                                        {/* <img alt="" src={person.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                        <span className="block truncate text-sm font-normal group-data-[selected]:font-semibold">
                                            India
                                        </span>
                                    </div>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                        {/* <CheckIcon aria-hidden="true" className="h-5 w-5" /> */}
                                    </span>
                                </ListboxOption>
                                <ListboxOption
                                    className="group relative cursor-default select-none rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                >
                                    <div className="flex items-center">
                                        {/* <img alt="" src={person.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                        <span className="block truncate text-sm font-normal group-data-[selected]:font-semibold">
                                            USA
                                        </span>
                                    </div>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                        {/* <CheckIcon aria-hidden="true" className="h-5 w-5" /> */}
                                    </span>
                                </ListboxOption>
                                <ListboxOption
                                    className="group relative cursor-default select-none rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                >
                                    <div className="flex items-center">
                                        {/* <img alt="" src={person.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                        <span className="block truncate text-sm font-normal group-data-[selected]:font-semibold">
                                            UK
                                        </span>
                                    </div>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                        {/* <CheckIcon aria-hidden="true" className="h-5 w-5" /> */}
                                    </span>
                                </ListboxOption>
                            </ListboxOptions>
                        </div>
                    </Listbox>


                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="phoneNo">Phone No</label>
                    <div className="focus-within:outline-1 focus-within:outline-accent bg-mainBg flex items-center justify-between px-3 py-2 rounded-lg">
                        <span className="text-accent text-sm">+91</span>
                        <input id="phoneNo" className="font-input-style flex-1 ms-2 text-sm min-w-0 focus:outline-none bg-mainBg placeholder:text-secondaryText" type="number" placeholder="Enter Your Phone No" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="resume" className="mb-1 text-md font-semibold peer-disabled:cursor-not-allowed">
                        Resume
                    </label>
                    <input
                        id="resume"
                        type="file"
                        className="flex w-full rounded-md border border-input border-0 bg-mainBg placeholder:text-secondaryText px-3 py-1.5 text-sm file:border-0 file:bg-transparent file:text-accent file:text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold" htmlFor="language">Language</label>
                    <div className="flex flex-wrap items-center border bg-mainBg border-0 rounded-lg px-2 py-2 gap-2">
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center text-sm bg-lightAccent rounded-md px-2">
                                <span className="text-accent text-sm">{tag}</span>
                                <button
                                    type="button"
                                    className="ml-2 text-red-500 h-5"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    <CloseIcon width={8} height={8} fill={"none"} />
                                </button>
                            </div>
                        ))}
                        <input
                            id="language"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="border-none outline-none flex-1 text-sm bg-transparent placeholder:text-secondaryText"
                            placeholder="Add a tag and press Enter"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold">Payment Method</label>
                    <div className="flex items-center py-2 gap-4">
                        <div className="flex items-center">
                            <input
                                id="paymentMethod1"
                                type="radio"
                                name="paymentMethod"
                                className="peer accent-accent"
                                required
                            />
                            <label htmlFor="paymentMethod1" className="flex items-center cursor-pointer">
                                <span className="text-primaryText text-sm ms-1">Credit/Debit/ATM Card</span>
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="paymentMethod2"
                                type="radio"
                                name="paymentMethod"
                                className="peer accent-accent"
                                required
                            />
                            <label htmlFor="paymentMethod2" className="flex items-center cursor-pointer">
                                <span className="text-primaryText text-sm ms-1">PayPal</span>
                            </label>
                        </div>
                    </div>
                </div>


            </div>

            <div className="flex flex-col mt-3">
                <label className="mb-1 text-md font-semibold" htmlFor="Message" >Message</label>
                <textarea id="Message" className="font-input-style text-sm h-20 min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your First Name" />
            </div>
            <div className="flex items-center mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input id="relatedEmails" type="checkbox" className="sr-only peer" value="" />
                    <div
                        className="group peer bg-white rounded-full duration-300 w-8 h-3.5 ring-2 ring-lightText after:duration-300 after:bg-lightText peer-checked:after:bg-accent peer-checked:ring-accent after:rounded-full after:absolute after:h-2.5 after:w-2.5 after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4.5"
                    ></div>
                </label>
                <label htmlFor="relatedEmails" className="text-sm ms-2 text-secondaryText">Send me related emails</label>
            </div>
            <div className="flex items-center mt-3">
                <label className="flex items-center cursor-pointer">
                    <div
                        className={`relative w-3.5 h-3.5 flex items-center justify-center border-2 rounded-sm ${isChecked ? 'border-accent border-2' : 'border-lightText'} transition-all duration-200`}
                    >
                        <input
                            id='termsAndConditions'
                            type="checkbox"
                            className="opacity-0 absolute w-full h-full cursor-pointer"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        {isChecked && (
                            <div className="w-2 h-2  bg-orange-500 rounded-sm"></div>
                        )}
                    </div>
                    <label htmlFor="termsAndConditions" className="text-sm ms-2 text-secondaryText">Agree to our terms and conditions</label>
                </label>
            </div>
            <button className="bg-accent hover:bg-accent/70 px-6 py-1.5 w-fit text-sm font-semibold text-cardBg rounded-lg mt-3">Submit</button>
        </form>
    )
}

export default FormPage