import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { logo, imageLogo } from '../assets'
import { Logo } from './Icons/Logo'
import MenuSectionIcon from './MenuSectionIcon'
import MenuItemIcon from './MenuItemIcon'
// import { MenuComponent } from './MenuComponent'
import { HideSidebar } from './Icons/hideSidebar'
import { useRoles } from '../RolesContext';
import { UpArrow } from './Icons/UpArrow'

const Sidebar = (props) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [openSubMenus, setOpenSubMenus] = useState({});

    const { userRoles } = useRoles();

    const toggleSubMenu = (menuName) => {
        setOpenSubMenus((prevState) => ({
            ...prevState,
            [menuName]: !prevState[menuName],
        }));
    };

    const MenuComponent = (props) => {
        return (
            <li className="mb-2 last:mb-0">
                <Link onClick={props.onClick} className={`current-menu-section menu-section duration-100 ease-linear 
                    px-3 py-2 flex items-center relative justify-between ${props.isActive && 'bg-menuActive'} hover:bg-menuActive rounded-lg`} to={props.to} >
                    <div className="flex items-center flex-1">
                        <div className={`active-menu-status ${props.isActive && 'bg-accent'} h-3 w-2 absolute left-[-4px] rounded-lg`}></div>
                        {props.icon}
                        {!isSidebarCollapsed && <span className="text-md ms-2">{props.name}</span>}
                    </div>
                    {props.isArrow && <UpArrow width={20} height={20} fill={"none"} />}
                </Link>
            </li>
        )
    }

    return (
        <>
            <aside className={`app-sidebar hidden lg:flex flex-col card-shadow h-full px-3 pt-2 overflow-hidden ${isSidebarCollapsed ? "w-fit" : "w-[260px]"}`} id="sidebar">
                {/* Start::main-sidebar-header */}
                <div className={`px-3 py-2 flex justify-between items-center mb-4`}>

                    {!isSidebarCollapsed &&
                        <Link to="/" className="header-logo">
                            {/* <Logo width={32} height={"auto"} fill={"none"} /> */}
                            <img className="h-5" src={imageLogo} alt="Image Black Logo" />
                        </Link>
                    }
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hide-sidebar-button icon-md">
                        <HideSidebar width={20} height={20} fill={"none"} />
                    </button>
                </div>
                {/* End::main-sidebar-header */}
                {/* Start::main-sidebar */}
                <div className="main-sidebar flex-1 overflow-y-auto" id="sidebar-scroll">
                    {/* Start::nav */}
                    <nav className="main-menu-container nav nav-pills flex-column sub-open">
                        <ul className="main-menu flex flex-col">
                            <div className="mb-2">
                            
                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/users'} name={"Users"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {/* {userRoles?.find(role => role.name === "Banner")?.actions?.permission ?
                                    <MenuComponent to={'/banner'} name={"Banner"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Category")?.actions?.permission ?
                                    <MenuComponent to={'/category'} name={"Category"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Service")?.actions?.permission ?
                                    <MenuComponent to={'/service'} name={"Service"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Testimonial")?.actions?.permission ?
                                    <MenuComponent to={'/testimonial'} name={"Testimonials"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "FAQs")?.actions?.permission ?
                                    <MenuComponent to={'/faq'} name={"FAQs"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Blogs")?.actions?.permission ?
                                    <MenuComponent to={'/blog'} name={"Blogs"} icon={<MenuSectionIcon />} isActive={false} /> : null} */}

                                {userRoles?.find(role => role.name === "Contact")?.actions?.permission ?
                                    <div className="flex flex-col">
                                        <li className="mb-2">
                                            <div onClick={() => toggleSubMenu('contact')} className={`cursor-pointer current-menu-section menu-section duration-100 ease-linear px-3 py-2 flex items-center relative justify-between ${props.isActive && 'bg-menuActive'} hover:bg-menuActive rounded-lg`} to={props.to} >
                                                <div className="flex items-center flex-1">
                                                    <div className={`active-menu-status ${props.isActive && 'bg-accent'} h-3 w-2 absolute left-[-4px] rounded-lg`}></div>
                                                    <MenuSectionIcon />
                                                    {!isSidebarCollapsed && <span className="text-md ms-2">Contact</span>}
                                                </div>
                                                {!isSidebarCollapsed &&
                                                    <button className={`duration-300 ${openSubMenus['contact'] ? 'rotate-0' : 'rotate-180'}`}>
                                                        <UpArrow width={20} height={20} fill={"none"} />
                                                    </button>
                                                }
                                            </div>
                                        </li>

                                        <div className={`menu-section-items origin-top duration-200 ease-in-out ${openSubMenus['contact'] ? 'h-full scale-y-1 mb-2' : 'h-0 scale-y-0 '}`}>
                                            <ul className='flex flex-col'>

                                                <MenuComponent to={'/contact'} name={"Contacts"} icon={<MenuItemIcon />} isActive={false} />

                                                <MenuComponent to={'/contact-followup'} name={"Contact Follow Up"} icon={<MenuItemIcon />} isActive={false} />

                                            </ul>
                                        </div>
                                    </div> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/software'} name={"Softwares"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/mentor'} name={"Mentor Master"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/placement'} name={"Placement Partners"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/career'} name={"Career Options"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/parentCourse'} name={"Parent Courses"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/course'} name={"Courses"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/demo-master'} name={"Demo Master"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/testimonial'} name={"Testimonials"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/blog'} name={"Blogs"} icon={<MenuSectionIcon />} isActive={false} /> : null}
                                
                                {userRoles?.find(role => role.name === "Users")?.actions?.permission ?
                                    <MenuComponent to={'/student-placed'} name={"Students Placed"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                {/* {userRoles?.find(role => role.name === "Survey")?.actions?.permission ?
                                    <div className="flex flex-col">
                                        <li className="mb-2">
                                            <div onClick={() => toggleSubMenu('Survey')} className={`cursor-pointer current-menu-section menu-section duration-100 ease-linear px-3 py-2 flex items-center relative justify-between ${props.isActive && 'bg-menuActive'} hover:bg-menuActive rounded-lg`} to={props.to} >
                                                <div className="flex items-center flex-1">
                                                    <div className={`active-menu-status ${props.isActive && 'bg-accent'} h-3 w-2 absolute left-[-4px] rounded-lg`}></div>
                                                    <MenuSectionIcon />
                                                    {!isSidebarCollapsed && <span className="text-md ms-2">Surveys</span>}
                                                </div>
                                                {!isSidebarCollapsed &&
                                                    <button className={`duration-300 ${openSubMenus['Survey'] ? 'rotate-0' : 'rotate-180'}`}>
                                                        <UpArrow width={20} height={20} fill={"none"} />
                                                    </button>
                                                }
                                            </div>
                                        </li>

                                        <div className={`menu-section-items origin-top duration-200 ease-in-out ${openSubMenus['Survey'] ? 'h-full scale-y-1 mb-2' : 'h-0 scale-y-0 '}`}>
                                            <ul className='flex flex-col'>

                                                <MenuComponent to={'/surveys'} name={"Create Surveys"} icon={<MenuItemIcon />} isActive={false} />

                                                <MenuComponent to={'/responses'} name={"Surveys Responses"} icon={<MenuItemIcon />} isActive={false} />

                                            </ul>
                                        </div>
                                    </div> : null} */}

                                {/* {userRoles?.find(role => role.name === "Seo")?.actions?.permission ?
                                    <MenuComponent to={'/seo-friendly'} name={"SEOs"} icon={<MenuSectionIcon />} isActive={false} /> : null}

                                <MenuComponent to={'/news-letter'} name={"News Letters"} icon={<MenuSectionIcon />} isActive={false} /> */}

                            </div>

                        </ul>
                    </nav>
                    {/* End::nav */}
                </div>
                {/* End::main-sidebar */}
            </aside>
        </>

    )
}

export default Sidebar