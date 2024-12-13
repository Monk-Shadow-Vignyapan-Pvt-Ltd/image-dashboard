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

const Users = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [roles, setRoles] = useState([
        { name: 'Users', actions: { permission: false, } },
        { name: 'Banner', actions: { permission: false, } },
        { name: 'Category', actions: { permission: false, } },
        { name: 'Service', actions: { permission: false, } },
        { name: 'Testimonial', actions: { permission: false, } },
        { name: 'FAQs', actions: { permission: false, } },
        { name: 'Blogs', actions: { permission: false, } },
        { name: 'Contact', actions: { permission: false, } },
        { name: 'Survey', actions: { permission: false, } },
        { name: 'Seo', actions: { permission: false, } },
    ]);

    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/getUsers`);
            setUsers(response.data.users);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user = null) => {
        setEditingUser(user);
        setEmail(user ? user.email : '');
        setPassword('');
        setUsername(user ? user.username : '');
        setAvatar(user ? user.avatar : null);
        setIsAdmin(user ? user.isAdmin : false);
        setRoles(user ? user.roles : [
            { name: 'Users', actions: { permission: false, } },
            { name: 'Banner', actions: { permission: false, } },
            { name: 'Category', actions: { permission: false, } },
            { name: 'Service', actions: { permission: false, } },
            { name: 'Testimonial', actions: { permission: false, } },
            { name: 'FAQs', actions: { permission: false, } },
            { name: 'Blogs', actions: { permission: false, } },
            { name: 'Contact', actions: { permission: false, } },
            { name: 'Survey', actions: { permission: false, } },
            { name: 'Seo', actions: { permission: false, } },
        ]);
        //setFile(null);
        user ? decodeBase64Image(user.avatar, setFile) : setFile(null);
        //setPrivilegesOriginal
        setIsModalOpen(true);

    };

    const decodeBase64Image = (base64Image, setFileFunction) => {
        try {
            // Check for and remove the base64 prefix (JPEG or PNG)
            const base64PrefixJpeg = 'data:image/jpeg;base64,';
            const base64PrefixPng = 'data:image/png;base64,';

            let mimeType = '';
            if (base64Image.startsWith(base64PrefixJpeg)) {
                base64Image = base64Image.slice(base64PrefixJpeg.length);
                mimeType = 'image/jpeg';
            } else if (base64Image.startsWith(base64PrefixPng)) {
                base64Image = base64Image.slice(base64PrefixPng.length);
                mimeType = 'image/png';
            } else {
                throw new Error("Unsupported image type");
            }

            // Decode base64 string
            const byteCharacters = atob(base64Image); // Decode base64 string
            const byteArrays = [];

            // Convert the binary data into an array of bytes
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, Math.min(offset + 1024, byteCharacters.length));
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }

            // Create a Blob from the binary data
            const blob = new Blob(byteArrays, { type: mimeType });

            // Create a File object from the Blob
            const file = new File([blob], "image." + mimeType.split("/")[1], { type: mimeType });

            // Set the file state using the provided setter function
            setFileFunction(file);
        } catch (error) {
            console.error("Error decoding base64 image:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };


    const handleUploadClick = async () => {
        setIsLoading(true);
        if (!email || !username ||  !password) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsLoading(false);
            toast.error('Please enter a valid email address.');
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const data = {
                email,
                username,
                password: password || undefined,
                avatar: file ? reader.result : null,
                isAdmin,
                roles: roles,
            };

            try {
                const endpoint = editingUser
                    ? `${API_BASE_URL}/auth/updateUser/${editingUser._id}`
                    : `${API_BASE_URL}/auth/addUser`;

                await axios.post(endpoint, data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success(editingUser ? 'User updated successfully!' : 'User added successfully!');
                fetchUsers();
                setIsLoading(false);
                closeModal();
            } catch (error) {
                console.error('Error uploading user:', error);
                toast.error('Failed to upload user.');
            } finally {
                setUploading(false);
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reader.onloadend();
        }
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/auth/deleteUser/${userId}`);
                toast.success('User deleted successfully!');
                fetchUsers();
                setIsLoading(false)
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user.');
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
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'Admin',
            selector: row => (row.isAdmin ? 'Yes' : 'No'),
        },
        {
            name: 'Avatar',
            selector: row => (
                row.avatar ? (
                    <img
                        src={row.avatar}
                        alt="Image"
                        className="w-10 h-10 object-cover border-2 border-lightAccent rounded-md shadow-sm"
                    />
                ) : (
                    <div>No Image</div>
                )
            ),
            sortable: true
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

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const ActionButton = ({ label, isChecked, onClick }) => (

        <button
            onClick={onClick}
            // className={`flex items-center px-2 py-1 rounded ${isChecked ? 'bg-safeGreen text-mainBg' : 'bg-placeHolder' } hover:${isChecked ? 'bg-green-600' : 'bg-gray-300 dark:hover:bg-lightAccent'}`}
            className={`flex items-center`}
        >
            <input className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" checked={isChecked} type="checkbox"></input>
            {/* {isChecked && <FaCheck className="h-4 w-4" />}  */}
            {/* <span>{label}</span> */}
        </button>
    );

    const handleActionChange = (sectionName, actionName) => {
        setRoles(prevPrivileges =>
            prevPrivileges.map(section =>
                section.name === sectionName
                    ? {
                        ...section,
                        actions: {
                            ...section.actions,
                            [actionName]: !section.actions[actionName],
                        },
                    }
                    : section
            )
        );
    };

    const handleIsAdminChange = () => {
        setIsAdmin(prevState => {
            const newIsAdmin = !prevState; // Toggle isAdmin
            if (newIsAdmin) {
                // If set to true, make all actions true
                setRoles(prevRoles =>
                    prevRoles.map(section => ({
                        ...section,
                        actions: {
                            permission: true,
                        }
                    }))
                );
            } else {
                // If set to false, reset roles to the default state (or you can set them to false if needed)
                setRoles(prevRoles =>
                    prevRoles.map(section => ({
                        ...section,
                        actions: {
                            permission: false,
                        }
                    }))
                );
            }
            return newIsAdmin; // Return the new value for isAdmin
        });
    };

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
                            <label htmlFor="search-category"><SearchIcon width={18} height={18} fill={"none"} /></label>
                            <input id='search-category' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by email or username" />
                        </div>

                        <button onClick={() => openModal()} className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg">
                            Add User
                        </button>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="User Modal"
                        className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                        overlayClassName="overlay"
                    >
                        <h2 className="text-xl font-bold text-accent">
                            {editingUser ? 'Edit User' : 'Add User'}
                        </h2>

                        <div className="flex-1 overflow-auto">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="block text-md font-semibold required">
                                    User Name
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    placeholder="Enter User Name"
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="question" className="block text-md font-semibold required">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    placeholder="Enter Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="block mb-1 text-md font-semibold required">
                                    Password
                                </label>
                                <div className="flex items-center bg-mainBg rounded-lg px-3 py-2 focus-within:outline focus-within:outline-accent">
                                    <input
                                        id="password"
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="font-input-style flex-1 text-md min-w-0 bg-mainBg placeholder:text-secondaryText focus:outline-none"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your Password"
                                    />
                                    <button onClick={() => setShowPassword((prev) => !prev)}><ShowPasswordIcon width={16} height={16} fill="none" className="cursor-pointer" /></button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="testimonialImage" className="block text-md font-semibold">
                                    User Image
                                </label>
                                <div
                                    className={`upload-box w-full border-2 border-dashed rounded-lg flex justify-center items-center bg-mainBg ${dragging ? 'dragging' : ''}`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    {file ? (
                                        <div className="relative w-full">
                                            <button
                                                className="absolute top-3 right-3 bg-red-500 text-white text-xs icon-lg flex items-center justify-center rounded-full shadow-lg hover:bg-red-600"
                                                onClick={() => setFile(null)} // Clear the file on click
                                            >
                                                <FaPlus className="rotate-45 text-mainBg" size={18} />
                                            </button>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="max-h-[500px] w-full object-cover object-top rounded-lg"
                                            />
                                            <span className="absolute bottom-0 rounded-b-lg w-full bg-gradient-to-t from-accent to-accent/0 text-cardBg text-center px-2 pt-4 pb-2">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="upload-prompt h-65 flex flex-col items-center justify-center text-secondaryText">
                                            <UploadIcon width={24} height={24} fill={'none'} />
                                            <div className="flex flex-col items-center mt-2">
                                                <span className="text-md text-secondaryText">Drag and drop</span>
                                                <span className="text-md text-secondaryText font-semibold">or</span>
                                                <label className="text-md text-accent font-semibold">
                                                    Browse Image
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">Permission</h2>
                                    <label className="text-sm font-semibold flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isAdmin}
                                            className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={handleIsAdminChange}
                                        />
                                        <span className="text-primaryText text-md">Is Admin ?</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {roles.map(section => (
                                        <div key={section.name} className="mb-2 w-full">
                                            <div className="flex items-center gap-4 w-full p-2 border-2 rounded">
                                                <h3
                                                    className={`flex-1 text-md font-semibold text-primaryText cursor-pointer ${currentSection === section.name ? 'text-blue-500' : ''}`}
                                                >
                                                    {section.name} :-
                                                </h3>
                                                <div>
                                                    {Object.keys(section.actions).map(action => (
                                                        <ActionButton
                                                            key={action}
                                                            label={action.charAt(0).toUpperCase() + action.slice(1)} // Exibe "View", "Create", etc.
                                                            isChecked={section.actions[action]} // Estado atual do botão
                                                            onClick={() => handleActionChange(section.name, action)} // Alterna o estado da ação
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full sticky bottom-0 z-10">
                            <button
                                onClick={handleUploadClick}
                                disabled={uploading}
                                className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium ${uploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : editingUser
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : editingUser ? 'Update User' : 'Add User'}
                            </button>
                            <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                                Cancel
                            </button>
                        </div>
                    </Modal>

                    <div className="overflow-hidden border-2 rounded-lg">
                        <DataTable
                            columns={columns}
                            data={filteredUsers}
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
export default Users;
