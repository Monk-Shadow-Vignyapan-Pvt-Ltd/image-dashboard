import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { ThemeLight } from '../components/Icons/ThemeLight';
import { HeaderAddCard } from '../components/Icons/HeaderAddCard';
import { Notification } from '../components/Icons/Notification';
import { ProfilePic } from '../components/ProfilePic';
import { person1, imageLogo } from '../assets';
import { Logo } from '../components/Icons/Logo';
import { Menu } from '../components/Icons/Menu';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant.js';
import { useRoles } from '../RolesContext';
import { MenuComponent } from '../components/MenuComponent.jsx';

import { Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { MdCancel } from 'react-icons/md';
import MenuSectionIcon from '../components/MenuSectionIcon.jsx';

const Header = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { userId, users } = useRoles() || {};
    const [tokenAvailable, setTokenAvailable] = useState(false);
    const { userRoles } = useRoles() || {};


    const [openModal, setOpenModal] = useState(false);

    const [isClosing, setIsClosing] = useState(false); // Track closing animation

    const modalRef = useRef(null);


    const modalVariants = {
        hidden: { opacity: 0, x: "100%" },
        visible: { opacity: 1, x: "0%", transition: { duration: 0.4, ease: "easeInOut" } },
        exit: { opacity: 0, x: "100%", transition: { duration: 0.4, ease: "easeInOut" } },
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        // Trigger closing animation
        setIsClosing(true);

        // Wait for animation to complete before resetting the modal
        setTimeout(() => {
            setOpenModal(false);
            setIsClosing(false);
        }, 400); // Match the animation duration
    };

    useEffect(() => {
        // Close modal if clicked outside
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Trigger closing animation
                setIsClosing(true);

                // Wait for animation to complete before fully closing the modal
                setTimeout(() => {
                    setOpenModal(false);
                    setIsClosing(false); // Reset the closing state
                }, 400); // Match the animation duration in `modalVariants`
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024 && openModal) {
                setIsClosing(true);

                // Wait for the animation to complete before fully closing the modal
                setTimeout(() => {
                    setOpenModal(false);
                    setIsClosing(false); // Reset the closing state
                }, 400); // Match the animation duration in `modalVariants`
            }
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [openModal]);

    // const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const closeOffcanvas = () => {
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("auth-token");
        navigate("/login");
    }

    useEffect(() => {
        let token = localStorage.getItem('auth-token');
        if (token === null) {
            setTokenAvailable(false)
        } else {
            setTokenAvailable(true);
        }
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                closeOffcanvas();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         let token = localStorage.getItem('auth-token');
    //         try {
    //             const response = await axios.get(
    //                 `${API_BASE_URL}/auth/getUser`,
    //                 { headers: { 'x-auth-token': token } }
    //               );
    //             setUser(response.data); // Store the user data in state
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };

    //     fetchUserData();
    // }, []);

    return (
        <div className="px-4 pt-2 container sticky top-0 bg-gradient-to-b from-mainBg to-mainBg/0 z-40">
            <header className="w-full bg-cardBg app-header card-shadow rounded-lg px-3 py-2">
                <nav className="main-header flex items-center justify-between" aria-label="Global">
                    <Link to="/" className="header-logo lg:hidden">
                        <img className="h-5" src={imageLogo} alt="Image Black Logo" />
                    </Link>
                    <div className="hidden lg:flex items-center">
                        <SearchIcon width={24} height={24} fill="none" />
                        <input className="ms-2 w-250px bg-transparent p-0 focus:outline-0" type="Search" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden">
                            <SearchIcon width={24} height={24} fill="none" />
                        </button>
                        {/* <button>
                            <ThemeLight width={24} height={24} fill="none" />
                        </button> */}
                        <button>
                            <HeaderAddCard width={24} height={24} fill="none" />
                        </button>
                        <button>
                            <Notification width={24} height={24} fill="none" />
                        </button>
                        {/* ProfilePic Button */}
                        {tokenAvailable ?
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={toggleDropdown}>
                                <ProfilePic Img={users?.find(user => user._id === userId)?.avatar ? users?.find(user => user._id === userId)?.avatar : person1} alt="User Profile" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium">
                                            User Name: {users?.find(user => user._id === userId)?.username || 'Unknown User'}
                                        </p>

                                        {/* <p className="text-xs text-gray-500">john.doe@example.com</p> */}
                                    </div>
                                    {tokenAvailable ? <div className="py-2">
                                        {/* <Link
                                            to="/user-details"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            User Details
                                        </Link> */}
                                        <button
                                            onClick={() => {
                                                closeDropdown();
                                                handleLogout();

                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div> : null}
                                </div>
                            )}
                        </div> : null}

                        {tokenAvailable ? <button onClick={handleModalOpen} className="lg:hidden">
                            <Menu width={32} height={32} stroke="#f05f23" />
                        </button> : null}
                    </div>
                </nav>
            </header>


            {tokenAvailable ? <Modal
                show={openModal}
                onClose={handleModalClose}
                ref={modalRef}
            >
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate={openModal && !isClosing ? "visible" : "hidden"}
                    exit="exit"
                    className="fixed top-0 right-0 h-full bg-mainBg text-secondaryText flex flex-col gap-6 w-full sm:w-96 shadow-lg"
                >
                    <Modal.Body className="flex flex-col p-2 gap-6 shadow-lg transform translate-x-0 transition-transform duration-300">
                        <nav className="flex flex-col flex-1 overflow-auto">
                            <div className="w-full flex items-center justify-between p-4 mb-4">
                                <NavLink onClick={handleModalClose} aria-label='logo-brand' to={'/'}>
                                    <img src={imageLogo} alt="text-logo" className='h-8 object-cover w-auto' />
                                </NavLink>
                                <button
                                    className="text-red-600 text-3xl hover:text-red-400 duration-300 rounded-lg"
                                    onClick={handleModalClose}
                                >
                                    <MdCancel size={26} />
                                </button>
                            </div>
                            <ul className='flex flex-col'>
                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/users'} name={"Users"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {/* {userRoles?.find(role => role.name === "Banner")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/banner'} name={"Banner"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Category")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/category'} name={"Category"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Service")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/service'} name={"Service"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Testimonial")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/testimonial'} name={"Testimonials"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "FAQs")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/faq'} name={"FAQs"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Blogs")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/blog'} name={"Blogs"} icon={<MenuSectionIcon />} isActive={false} /> : null} */}

                                {userRoles?.find(role => role.name === "Contact")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/contact'} name={"Contacts"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Contact")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/contact-followup'} name={"Contact Follow Up"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/software'} name={"Softwares"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/mentor'} name={"Mentor Master"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/placement'} name={"Placement Partners"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/career'} name={"Career Options"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/parentCourse'} name={"Parent Courses"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/course'} name={"Courses"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/demo-master'} name={"Demo Master"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/testimonial'} name={"Testimonials"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/blog'} name={"Blogs"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/student-placed'} name={"Students Placed"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {/* {userRoles?.find(role => role.name === "Survey")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/surveys'} name={"Create Surveys"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Survey")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/responses'} name={"Surveys Responses"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Seo")?.actions?.permission ?
                                    <MenuComponent onClick={handleModalClose} to={'/seo-friendly'} name={"SEOs"} icon={<MenuSectionIcon />} isActive={false} /> : null}
                                
                                <MenuComponent onClick={handleModalClose} to={'/news-letter'} name={"News Letters"} icon={<MenuSectionIcon />} isActive={false} /> */}
                            </ul>
                        </nav>
                    </Modal.Body>
                </motion.div>
            </Modal> : null}

        </div>
    );
};

export default Header;
