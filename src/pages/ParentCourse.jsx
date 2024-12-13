import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { UploadIcon } from '../components/Icons/UploadIcon';
import DataTable from 'react-data-table-component';
import { API_BASE_URL } from '../config/constant.js';
import { EditIcon } from '../components/Icons/EditIcon.jsx';
import { MdOutlineDelete } from 'react-icons/md';
import { ShowPasswordIcon } from '../components/Icons/ShowPasswordIcon';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { FaPlus } from 'react-icons/fa6';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";

const ParentCourse = () => {
    const [parentCourseName, setParentCourseName] = useState('');
    const [parentCourses, setParentCourses] = useState([]);
    const [editingParentCourse, setEditingParentCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const { userId } = useRoles();
    const {users} = useRoles();
    const [isLoading, setIsLoading] = useState(true);

    const fetchParentCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parentCourses/getParentCourses`);
            setParentCourses(response.data.parentCourses);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching Parent Courses :', error);
            toast.error('Failed to fetch Parent Courses .');
        }
    };

    useEffect(() => {
        fetchParentCourses();
    }, []);

    const openModal = (parentCourse = null) => {
        setEditingParentCourse(parentCourse);
        setParentCourseName(parentCourse ? parentCourse.parentCourseName : '');
        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingParentCourse(null);
    };


    const handleUploadClick = async () => {
        setIsLoading(true);
        if (!parentCourseName ) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields.');
        }

        setUploading(true);
            const data = {
                parentCourseName,
                userId
            };

            try {
                const endpoint = editingParentCourse
                    ? `${API_BASE_URL}/parentCourses/updateParentCourse/${editingParentCourse._id}`
                    : `${API_BASE_URL}/parentCourses/addParentCourse`;

                await axios.post(endpoint, data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success(editingParentCourse ? 'Parent Course updated successfully!' : 'Parent Course added successfully!');
                fetchParentCourses();
                setIsLoading(false);
                closeModal();
            } catch (error) {
                console.error('Error uploading Parent Course:', error);
                toast.error('Failed to upload Parent Course.');
            } finally {
                setUploading(false);
            }
       
    };

    const handleDeleteClick = async (Id) => {
        if (window.confirm('Are you sure you want to delete this Parent Course?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/parentCourses/deleteParentCourse/${Id}`);
                toast.success('Parent Course deleted successfully!');
                fetchParentCourses();
                setIsLoading(false)
            } catch (error) {
                console.error('Error deleting Parent Course:', error);
                toast.error('Failed to delete Parent Course.');
            }
        }
    };

    const columns = [
        {
            name: 'ID',
            width: "150px",
            selector: (row, index) => row._id.slice(-4),
            sortable: true,
        },
        {
            name: 'Parent Course',
            selector: row => row.parentCourseName,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex gap-4">
                    <button onClick={() => openModal(row)}>
                        <EditIcon width={20} height={20} fill="#444050" />
                    </button>
                    <button onClick={() => handleDeleteClick(row._id)}>
                        <MdOutlineDelete size={26} fill="#ff2023" />
                    </button>
                    <div id={`tooltip-${row._id}`} className="tooltip-wrapper">
                        <IoIosInformationCircleOutline size={26} fill={"#444050"} />
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

    const customStyles = {
        headCells: {
            style: {
                color: "var(--accent)",
                fontWeight: "700",
                fontSize: "14px"
            },
        },
        cells: {
            style: {
                paddingTop: '8px',
                paddingBottom: '8px',
            },
        },
    };

    const filteredParentCourses = parentCourses.filter(parentCourse =>
        parentCourse.parentCourseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {actionRoles?.actions?.permission ?
            isLoading ?
            <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                   <i className="loader" />
               </div>
            :
                <div className="p-6 bg-cardBg card-shadow rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                            <label htmlFor="search-parentCourse"><SearchIcon width={18} height={18} fill={"none"} /></label>
                            <input id='search-parentCourse' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by parent course name" />
                        </div>

                        <button onClick={() => openModal()} className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg">
                            Add Parent Course
                        </button>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Parent Course Modal"
                        className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                        overlayClassName="overlay"
                    >
                        <h2 className="text-xl font-bold text-accent">
                            {editingParentCourse ? 'Edit Parent Course' : 'Add Parent Course'}
                        </h2>

                        <div className="flex-1 overflow-auto">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="block text-md font-semibold required">
                                Parent Course Name
                                </label>
                                <input
                                    id="parentCourseOption"
                                    type="text"
                                    value={parentCourseName}
                                    placeholder="Enter Parent Course Name"
                                    onChange={(e) => setParentCourseName(e.target.value)}
                                    className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full sticky bottom-0 z-10">
                            <button
                                onClick={handleUploadClick}
                                disabled={uploading}
                                className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium ${uploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : editingParentCourse
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : editingParentCourse ? 'Update Parent Course' : 'Add Parent Course'}
                            </button>
                            <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                                Cancel
                            </button>
                        </div>
                    </Modal>

                    <div className="overflow-hidden border-2 rounded-lg">
                        <DataTable
                            columns={columns}
                            data={filteredParentCourses}
                            pagination
                            highlightOnHover
                            // pointerOnHover
                            // striped
                            customStyles={customStyles}
                        />
                        
                    </div>
                </div>
                : <AccessDenied />}
                <ToastContainer />
        </>
    );
};

Modal.setAppElement('#root');
export default ParentCourse;
