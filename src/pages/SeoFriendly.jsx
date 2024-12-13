import React, { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant.js';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';

const SeoFriendly = () => {
    const [selectedPage, setSelectedPage] = useState('');
    const [pages, setPages] = useState([
        "Home",
        "About",
        "Before After Gallary",
        "Contact",
        "Blog",
        "Main Or Direct Services",
        "Sub Services",
    ]);
    
    // State variables for storing fetched data
    const [blogs, setBlogs] = useState([]);
    const [mainServices, setMainServices] = useState([]);
    const [subServices, setSubServices] = useState([]);

    const [selectedSecondary, setSelectedSecondary] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoUrl, setSeoUrl] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Seo")
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/blogs/getBlogs`);
            setBlogs(response?.data?.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to fetch blogs.');
        }
    };

    const fetchMainServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services/getServicesFrontend`);
            setMainServices(response.data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to fetch services.');
        }
    };

    const fetchSubServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subServices/getSubServicesFrontend`);
            setSubServices(response.data.subServices || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching sub services:', error);
            toast.error('Failed to fetch sub services.');
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchMainServices();
        fetchSubServices();
    }, []);

    useEffect(() => {
        const fetchSeoPage = async () => {
            if (selectedSecondary !== "") {
                try {
                    const response = await axios.get(`${API_BASE_URL}/seos/getSeoByPageName/${selectedSecondary}`);
                    setSeoTitle(response.data.seoEntry ? response.data.seoEntry.seoTitle : "");
                    setSeoDescription(response.data.seoEntry ? response.data.seoEntry.seoDescription : "")
                    setSeoUrl(response.data.seoEntry ? response.data.seoEntry.seoUrl : "")
                } catch (error) {
                    console.error("Error fetching SEO page:", error);
                    //toast.error("Failed to fetch pages.");
                }
            }
        };
    
        fetchSeoPage(); // Call the async function
    }, [ selectedSecondary]);

    useEffect(() => {
        const fetchSeoPage = async () => {
            if (selectedPage !== "") {
                try {
                    const response = await axios.get(`${API_BASE_URL}/seos/getSeoByPageName/${selectedPage}`);
                    setSeoTitle(response.data.seoEntry ? response.data.seoEntry.seoTitle : "");
                    setSeoDescription(response.data.seoEntry ? response.data.seoEntry.seoDescription : "")
                    setSeoUrl(response.data.seoEntry ? response.data.seoEntry.seoUrl : "")
                } catch (error) {
                    console.error("Error fetching SEO page:", error);
                    //toast.error("Failed to fetch pages.");
                }
            }
        };
    
        fetchSeoPage(); // Call the async function
    }, [ selectedPage]);

    // Reset the secondary selection when the primary page is changed
    useEffect(() => {
        
            setSelectedSecondary(''); // Reset secondary selection when selecting pages other than "Blog", "Main Or Direct Services", or "Sub Services"
        
    }, [selectedPage]);

    // Conditional secondary options based on selected primary page
    const getSecondaryOptions = () => {
        switch (selectedPage) {
            case 'Blog':
                return blogs.map((blog) => blog.blogTitle); // assuming blog has a 'blogTitle' property
            case 'Main Or Direct Services':
                return mainServices.map((service) => service.serviceName); // assuming service has a 'serviceName' property
            case 'Sub Services':
                return subServices.map((subService) => subService.subServiceName); // assuming subService has a 'subServiceName' property
            default:
                return [];
        }
    };

    const handleUploadClick = async () =>{
        setIsLoading(true)
        let blogOrServiceId = "";

    switch (selectedPage) {
        case 'Blog':
            const selectedBlog = blogs.find((blog) => selectedSecondary === blog.blogTitle);
            blogOrServiceId = selectedBlog ? selectedBlog._id : ''; // assuming blog has 'id' property
            break;
        case 'Main Or Direct Services':
            const selectedMainService = mainServices.find((service) => selectedSecondary === service.serviceName);
            blogOrServiceId = selectedMainService ? selectedMainService._id : ''; // assuming service has 'id' property
            break;
        case 'Sub Services':
            const selectedSubService = subServices.find((subService) => selectedSecondary === subService.subServiceName);
            blogOrServiceId = selectedSubService ? selectedSubService._id : ''; // assuming subService has 'id' property
            break;
        default:
            blogOrServiceId = '';
    }

    if(selectedPage === "Main Or Direct Services" || selectedPage === "Sub Services"){
        if(selectedSecondary === ""){
            setIsLoading(false);
            return toast.error("Please Select At Least One Service");
        }
    }
    const data = {
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        seoUrl: seoUrl,
        blogOrServiceId: blogOrServiceId === "" ? null : blogOrServiceId,
        pageName: selectedSecondary ? selectedSecondary : selectedPage,
        
    };

    try {
        const endpoint = `${API_BASE_URL}/seos/addSeo`;

        await axios.post(endpoint, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        toast.success('Seo submited successfully!');
        setSeoTitle("");
        setSeoDescription("");
        setSeoUrl("");
        setIsLoading(false);
    } catch (error) {
        console.error('Error submitting seo:', error);
        toast.error('Failed to submit seo.');
    }

    }

    return (
        <>
         {actionRoles?.actions?.permission ?
          isLoading ?
          <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                 <i className="loader" />
             </div>
          :
        <div className="mx-auto w-full flex flex-col col-span-12 md:col-span-8 justify-between bg-cardBg rounded-lg card-shadow p-5 gap-6">
            <div className="flex flex-col w-full relative mt-6">
                <div className="relative w-full flex flex-col sm:flex-row items-center sm:items-end md:items-center gap-3 sm:gap-6">
                    <div className="w-full sm:w-fit flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-semibold">Select Page</span>

                        {/* Primary Listbox */}
                        <Listbox value={selectedPage} onChange={setSelectedPage}>
                            <div className="relative">
                                <ListboxButton
                                    id="page"
                                    className="relative min-w-50 w-fit cursor-default font-input-style text-md rounded-lg px-3 py-1 border-2 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                >
                                    <span className="flex items-center h-5">
                                        {selectedPage || 'Select Page'}
                                    </span>
                                </ListboxButton>

                                <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {pages.map((page, index) => (
                                        <ListboxOption
                                            key={index}
                                            value={page}
                                            className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                        >
                                            {page}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>

                    {/* Secondary Listbox - Rendered Conditionally */}
                    {["Blog", "Main Or Direct Services", "Sub Services"].includes(selectedPage) && (
                        <div className="w-full sm:w-fit flex flex-col md:flex-row md:items-center gap-2"> {/* Added margin-left for spacing */}
                            <span className="font-semibold">Select {selectedPage}</span>

                            <Listbox value={selectedSecondary} onChange={setSelectedSecondary}>
                                <div className="relative">
                                    <ListboxButton
                                        id="secondary"
                                        className="relative min-w-50 w-fit cursor-default font-input-style text-md rounded-lg px-3 py-1 border-2 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                    >
                                        <span className="flex items-center h-5">
                                            {selectedSecondary || `Select ${selectedPage}`}
                                        </span>
                                    </ListboxButton>

                                    <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {getSecondaryOptions().map((option, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={option}
                                                className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                            >
                                                {option}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>
                    )}
                </div>

                
            </div>

            <div className="relative w-full bg-cardBg border-2 border-border flex flex-col rounded-lg px-3 py-4 gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="question" className="block text-sm font-semibold required">
                        Page Name
                    </label>
                    <input
                        id="page name"
                        type="text"
                        value={selectedSecondary ? selectedSecondary : selectedPage}
                        placeholder="Page Name"
                        disabled
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="answer" className="block text-sm font-semibold required">
                        Seo MetaData Title
                    </label>
                    <input
                        id="title"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Enter Seo MetaData Title"
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="answer" className="block text-sm font-semibold required">
                        Seo Url
                    </label>
                    <input
                        id="url"
                        value={seoUrl}
                        onChange={(e) => setSeoUrl(e.target.value)}
                        placeholder="Enter Seo MetaData Title"
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="answer" className="block text-sm font-semibold required">
                        Seo MetaData Description
                    </label>
                    <textarea
                        id="description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Enter Seo MetaData Description"
                        style={{ minHeight: "100px" }}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <button onClick={handleUploadClick} className="bg-accent hover:bg-accent/70 px-6 py-1.5 w-fit text-sm font-semibold text-cardBg rounded-lg">Submit</button>
            </div>
        </div>
        :  <AccessDenied/>}
        <ToastContainer />
        </>
    );
};

export default SeoFriendly;
