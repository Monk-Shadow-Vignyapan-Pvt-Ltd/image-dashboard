import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config/constant.js';
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaPlus } from 'react-icons/fa6';

Modal.setAppElement('#root');

const Home = () => {
    const [contacts, setContacts] = useState([]);
    const [followupsByContact, setFollowupsByContact] = useState({});
    const [selectedContactFollowups, setSelectedContactFollowups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [searchQuery, setSearchQuery] = useState('');
    const { userRoles } = useRoles();
    const { users } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Contact")

    const fetchData = async () => {
        setIsLoading(true); // Start loading
        try {
            const [contactsResponse, followupsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/contacts/getContacts`),
                axios.get(`${API_BASE_URL}/followups/getFollowups`),
            ]);

            const contactsData = contactsResponse?.data?.contacts || [];
            const followupsData = followupsResponse?.data?.followups || [];

            setContacts(contactsData);

            const groupedFollowups = followupsData.reduce((acc, followup) => {
                const { contactId } = followup;
                if (!acc[contactId]) acc[contactId] = [];
                acc[contactId].push(followup);
                return acc;
            }, {});

            setFollowupsByContact(groupedFollowups);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data.');
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowFollowups = (contactId) => {
        const followups = followupsByContact[contactId] || [];
        const sortedFollowups = [...followups].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setSelectedContactFollowups(sortedFollowups);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const contactColumns = [
        {
            name: 'Name',
            // selector: row => row.name,
            selector: row => (
                <div id={`tooltip-${row.name}`} className="tooltip-wrapper">
                    {row.name}
                    <ReactTooltip
                        anchorId={`tooltip-${row.name}`}
                        place="top"
                        content={row.name}
                    />
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Phone',
            // selector: row => row.phone,
            selector: row => (
                <div id={`tooltip-${row.phone}`} className="tooltip-wrapper">
                    {row.phone}
                    <ReactTooltip
                        anchorId={`tooltip-${row.phone}`}
                        place="top"
                        content={row.phone}
                    />
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Email',
            // selector: row => row.email,
            selector: row => (
                <div id={`tooltip-${row.email}`} className="tooltip-wrapper">
                    {row.email}
                    <ReactTooltip
                        anchorId={`tooltip-${row.email}`}
                        place="top"
                        content={row.email}
                    />
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Subject',
            // selector: row => row.subject,
            selector: row => (
                <div id={`tooltip-${row.subject}`} className="tooltip-wrapper">
                    {row.subject}
                    <ReactTooltip
                        anchorId={`tooltip-${row.subject}`}
                        place="top"
                        content={row.subject}
                    />
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Type',
            // selector: row => row.message,
            selector: row => row.isOnline ? "Online" : "Offline",
            sortable: true,
        },
        {
            name: 'Follow-Ups',
            cell: row => (
                <button
                    className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm text-nowrap font-semibold text-cardBg rounded-lg"
                    onClick={() => handleShowFollowups(row._id)}
                >
                    View Follow-Ups
                </button>
            ),
        },
        {
            name: 'Contact Close',
            cell: row => (
                <div className="flex gap-4">
                    <input
                        type="checkbox"
                        checked={row.isContactClose}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        onChange={() => handleContactCloseToggle(row)}
                    />
                    <div id={`tooltip-${row._id}`} className="tooltip-wrapper">
                        <IoIosInformationCircleOutline size={22} fill={"#444050"} />
                    </div>
                    <ReactTooltip
                        anchorId={`tooltip-${row._id}`}
                        place="top"
                        content={
                            <div>
                                <div>
                                    <strong>Updated Last By:</strong> {users.find(user => user._id === row.userId)?.username || "Unknown"}
                                </div>
                                <div>
                                    <strong>Created At:</strong> {new Date(row.createdAt).toLocaleString()}
                                </div>
                                <div>
                                    <strong>Updated At:</strong> {new Date(row.updatedAt).toLocaleString()}
                                </div>
                            </div>
                        }
                    />
                </div>
            ),
        },
    ];

    const handleContactCloseToggle = async (contact) => {
        setIsLoading(false);
        const data = {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            course: contact.course,
            isOnline: contact.isOnline,
            isContactClose: !contact.isContactClose,
            userId: contact.userId
        };
        try {
            const response = await axios.post(
                `${API_BASE_URL}/contacts/updateContact/${contact._id}`,
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            toast.error('Failed to update contact.');
        }
    };

    const customStyles = {
        headCells: {
            style: {
                color: "var(--accent)",
                fontWeight: "700",
                fontSize: "14px",
            },
        },
        cells: {
            style: {
                paddingTop: '8px',
                paddingBottom: '8px',
            },
        },
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {actionRoles?.actions?.permission ?
                <div className="mx-auto w-full flex flex-col col-span-12 md:col-span-8 justify-between bg-cardBg rounded-lg card-shadow p-5 gap-6">
                    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-accent">All Contacts</h3>
                        <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                            <label htmlFor="search-FAQ"><SearchIcon width={18} height={18} fill={"none"} /></label>
                            <input id='search-FAQ' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by Name or Email etc." />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                        <i className="loader" />
                    </div>
                    ) : (
                        <div className="overflow-hidden border-2 rounded-lg">
                            <DataTable
                                columns={contactColumns}
                                data={filteredContacts}
                                pagination
                                highlightOnHover
                                pointerOnHover
                                // striped
                                customStyles={customStyles}
                            />
                        </div>
                    )}

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Follow-Ups Modal"
                        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
                        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <div className="flex items-center justify-between w-full border-b-2 pb-4">
                            <h3 className="text-xl font-bold text-accent">Follow-Ups</h3>
                            <button onClick={closeModal} className="icon-lg flex items-center justify-center rounded-full bg-accent">
                                <FaPlus className="rotate-45 text-mainBg" size={22} />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {selectedContactFollowups.length > 0 ? (
                                selectedContactFollowups.map((followup, index) => (
                                    <div key={index} className="border-b-2 flex flex-col gap-2 py-4">
                                        <p><strong>Updated At:</strong> {new Date(followup.updatedAt).toLocaleString()}</p>
                                        <p><strong>Status:</strong> <span className="text-accent font-semibold">{followup.status}</span></p>
                                        <p><strong>Message:</strong> {followup.followupMessage}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No follow-ups available.</p>
                            )}
                        </div>
                        {/* <button
                            className="mt-4 bg-accent text-white px-4 py-2 rounded-lg"
                            onClick={closeModal}
                        >
                            Close
                        </button> */}
                        {/* <button onClick={closeModal} className="absolute top-4 right-4 icon-lg flex items-center justify-center rounded-full bg-accent">
                            <FaPlus className="rotate-45 text-mainBg" size={22} />
                        </button> */}
                    </Modal>

                    
                </div>
                : <AccessDenied />}
                <ToastContainer />
        </>
    );
};

export default Home;
