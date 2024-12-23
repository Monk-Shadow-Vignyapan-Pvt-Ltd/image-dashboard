import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config/constant.js';
import { EditIcon } from '../components/Icons/EditIcon.jsx';
import { MdOutlineDelete } from 'react-icons/md';
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaPlus } from 'react-icons/fa6';

Modal.setAppElement('#root'); // Set the app element for accessibility


const ContactFollowUp = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [followupUpdates, setFollowupUpdates] = useState({});
    const [customStatuses, setCustomStatuses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [editStatusIndex, setEditStatusIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { userRoles } = useRoles();
    const { userId } = useRoles();
    const { users } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Contact")
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchContacts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/contacts/getContacts`);
                setContacts(response?.data?.contacts);
                setFilteredContacts(response?.data?.contacts.filter(contact => !contact.isContactClose));
               
            } catch (error) {
                console.error('Error fetching contacts:', error);
                toast.error('Failed to fetch contacts.');
            }
        };

        const fetchFollowups = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/followups/getFollowups`);
                const followupMap = response.data.followups.reduce((acc, followup) => {
                    acc[followup.contactId] = followup;
                    return acc;
                }, {});
                setFollowupUpdates(followupMap);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching follow-ups:", error);
                toast.error("Failed to fetch follow-ups.");
            }
        };

        const fetchStatuses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/statuses/getStatuses`);
                setCustomStatuses(response.data.statuses);
            } catch (error) {
                console.error('Error fetching statuses:', error);
                toast.error('Failed to fetch statuses.');
            }
        };

        fetchContacts();
        fetchFollowups();
        fetchStatuses();
    }, []);


    const handleStatusUpdate = (id, status) => {
        setFollowupUpdates((prev) => ({
            ...prev,
            [id]: { ...prev[id], status },
        }));
    };

    const handleFollowupMessageChange = (id, message) => {
        setFollowupUpdates((prev) => ({
            ...prev,
            [id]: { ...prev[id], followupMessage: message },
        }));
    };

    const saveFollowupMessage = async (id) => {
        setIsLoading(true);
        const { status, followupMessage } = followupUpdates[id] || {};
        if (!status || !followupMessage) {
            setIsLoading(false);
            toast.error("Please provide both status and follow-up message.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/followups/addFollowup`, {
                contactId: id,
                status,
                followupMessage,
                userId
            });
            toast.success("Follow-up saved successfully!");
            setIsLoading(false);
        } catch (error) {
            console.error('Error saving follow-up:', error);
            toast.error("Failed to save follow-up.");
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewStatus("");
        setEditStatusIndex(null);
    };

    const addOrUpdateStatus = async () => {
        if (!newStatus.trim()) {
            toast.error("Status cannot be empty.");
            return;
        }
        // const updatedStatuses = [...customStatuses];
        if (editStatusIndex !== null) {
            const endpoint = `${API_BASE_URL}/statuses/updateStatus/${editStatusIndex}`
            await axios.post(endpoint, { name: newStatus }, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success("Status Edited successfully.");
            setNewStatus("")
            const response = await axios.get(`${API_BASE_URL}/statuses/getStatuses`);
            setCustomStatuses(response.data.statuses);

        } else {
            if (customStatuses.includes(newStatus)) {
                toast.error("Status already exists.");
                return;
            }
            await axios.post(`${API_BASE_URL}/statuses/addStatus`, { name: newStatus });
            toast.success("Status added successfully.");
            const response = await axios.get(`${API_BASE_URL}/statuses/getStatuses`);
            setCustomStatuses(response.data.statuses);

        }
        // setCustomStatuses(updatedStatuses);
        // closeModal();
    };

    const deleteStatus = async (id) => {
        if (window.confirm('Are you sure you want to delete this Status?')) {
            try {
                await axios.delete(`${API_BASE_URL}/statuses/deleteStatus/${id}`);
                toast.success('status deleted successfully!');
                const response = await axios.get(`${API_BASE_URL}/statuses/getStatuses`);
                setCustomStatuses(response.data.statuses);
            } catch (error) {
                console.error('Error deleting status:', error);
                toast.error('Failed to delete status.');
            }
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
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
            name: 'Status',
            width: "200px",
            cell: row => (
                <select
                    value={followupUpdates[row._id]?.status || "Pending"}
                    onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
                    className="border rounded p-1"
                    style={{ maxWidth: "190px" }}
                >
                    {customStatuses.map((status, index) => (
                        <option key={status._id} value={status.name}>{status.name}</option>
                    ))}
                </select>
            ),
        },
        {
            name: 'Follow Up Message',
            width: "150px",
            cell: row => (
                <input
                    type="text"
                    value={followupUpdates[row._id]?.followupMessage || ""}
                    onChange={(e) => handleFollowupMessageChange(row._id, e.target.value)}
                    className="border rounded p-1 w-full"
                />
            ),
        },
        {
            name: 'Actions',
            width: "200px",
            cell: row => (
                <div className="flex gap-4">
                    <button
                        onClick={() => saveFollowupMessage(row._id)}
                        className="bg-accent hover:bg-accent/70 px-6 py-1.5 text-sm font-semibold text-cardBg rounded-lg"
                    >
                        Save
                    </button>
                    <div id={`tooltip-${row._id}`} className="tooltip-wrapper">
                        <IoIosInformationCircleOutline size={24} fill={"#444050"} />
                    </div>
                    <ReactTooltip
                        anchorId={`tooltip-${row._id}`}
                        place="top"
                        content={
                            <div>
                                <div>
                                    <strong>Created or Updated By:</strong> {users.find(user => user._id === row.userId)?.username || "Unknown"}
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

    const filteredSearchedContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    return (
        <>
            {actionRoles?.actions?.permission ?
            isLoading ?
            <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                   <i className="loader" />
               </div>
            :
                <div className="mx-auto w-full flex flex-col bg-cardBg rounded-lg card-shadow p-5 gap-6">
                    <div className="w-full flex flex-col gap-3">
                        <h3 className="text-xl font-bold text-accent">Manage Follow-Ups</h3>
                        <div className="flex flex-col sm:flex-row flex-1 gap-3 items-center justify-between">
                            <div className="w-full sm:w-fit flex items-center border-2 px-3 py-2 rounded-lg">
                                <label htmlFor="search-FAQ"><SearchIcon width={18} height={18} fill={"none"} /></label>
                                <input id='search-FAQ' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by Name or Email etc." />
                            </div>
                            <button
                                onClick={openModal}
                                className="w-full sm:w-fit bg-accent hover:bg-accent/70 px-4 py-2 text-sm font-semibold text-white rounded"
                            >
                                Create Or Update Custom Status
                            </button>
                        </div>
                    </div>
                    <div className="overflow-hidden border-2 rounded-lg">
                        <DataTable
                            columns={columns}
                            data={filteredSearchedContacts}
                            pagination
                            highlightOnHover
                            pointerOnHover
                        // striped
                        />
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
                        overlayClassName="overlay"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Manage Custom Status</h2>
                            <button onClick={closeModal} className="icon-lg flex items-center justify-center rounded-full bg-accent">
                                <FaPlus className="rotate-45 text-mainBg" size={22} />
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full sm:w-full flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full font-input-style text-md rounded-lg px-3 py-2 border border-border bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                />
                            </div>
                            <div className="w-full sm:w-fit flex gap-2">
                                <button
                                    onClick={addOrUpdateStatus}
                                    className="w-full sm:w-fit border-accent border bg-accent hover:bg-accent/70 duration-300 px-4 py-2 text-sm font-semibold text-white rounded-lg"
                                >
                                    {editStatusIndex !== null ? "Update" : "Add"}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="w-full sm:w-fit border-secondaryText border bg-secondaryText hover:bg-secondaryText/80 duration-300 px-4 py-2 text-sm font-semibold text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <ul className="border-2 border-border flex flex-col gap-2 p-3 rounded-xl max-h-100 overflow-auto">
                            {customStatuses.map((status, index) => (
                                <li key={status._id} className="flex justify-between items-center p-2 rounded-lg border-2 hover:bg-border/30 duration-300">
                                    <span>{status.name}</span>
                                    {(status.name === "Pending" || status.name === "Cancelled") ? null :
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setEditStatusIndex(status._id);
                                                    setNewStatus(status.name);
                                                }}
                                            >
                                                <EditIcon width={20} height={20} fill={"#444050"} />
                                            </button>
                                            <button
                                                onClick={() => deleteStatus(status._id)}
                                            >
                                                <MdOutlineDelete size={26} fill='#ff2023' />
                                            </button>
                                        </div>
                                    }

                                </li>
                            ))}
                        </ul>
                    </Modal>
                   
                </div>
                : <AccessDenied />}
                 <ToastContainer />
        </>
    );
};

export default ContactFollowUp;
