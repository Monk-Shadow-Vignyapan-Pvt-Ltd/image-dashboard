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

const Placement = () => {
    const [placementImage, setPlacementImage] = useState(null);
    const [placementName,setPlacementName] = useState('');
    const [file, setFile] = useState(null);
    const [placements, setPlacements] = useState([]);
    const [editingPlacement, setEditingPlacement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dragging, setDragging] = useState(false);

    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const { userId } = useRoles();
    const {users} = useRoles();
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlacements = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/placements/getPlacements`);
            setPlacements(response.data.placements);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching placement partners:', error);
            toast.error('Failed to fetch placement partners.');
        }
    };

    useEffect(() => {
        fetchPlacements();
    }, []);

    const openModal = (placement = null) => {
        setEditingPlacement(placement);
        setPlacementImage(placement ? placement.placementImage : null);
        setPlacementName(placement ? placement.placementName : '');
        placement ? decodeBase64Image(placement.placementImage, setFile) : setFile(null);
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
        setEditingPlacement(null);
    };


    const handleUploadClick = async () => {
        setIsLoading(true);
        if ( !file) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields.');
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const data = {
                placementImage: file ? reader.result : null,
                placementName,
                userId
            };

            try {
                const endpoint = editingPlacement
                    ? `${API_BASE_URL}/placements/updatePlacement/${editingPlacement._id}`
                    : `${API_BASE_URL}/placements/addPlacement`;

                await axios.post(endpoint, data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success(editingPlacement ? 'Placement Partner updated successfully!' : 'Placement Partner added successfully!');
                fetchPlacements();
                setIsLoading(false);
                closeModal();
            } catch (error) {
                console.error('Error uploading placement partner:', error);
                toast.error('Failed to upload placement partner.');
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

    const handleDeleteClick = async (Id) => {
        if (window.confirm('Are you sure you want to delete this placement partner?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/placements/deletePlacement/${Id}`);
                toast.success('Placement Partner deleted successfully!');
                fetchPlacements();
                setIsLoading(false)
            } catch (error) {
                console.error('Error deleting placement partner:', error);
                toast.error('Failed to delete placement partner.');
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
            name: 'Placement Partner Image',
            selector: row => (
                row.placementImage ? (
                    <img
                        src={row.placementImage}
                        alt="Image"
                        className="w-30 h-15 object-cover border-2 border-lightAccent rounded-md shadow-sm"
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
                       <h3 className="text-xl font-bold text-accent">All Placement Partners</h3>
                        <button onClick={() => openModal()} className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg">
                            Add Placement Partner
                        </button>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Placement Modal"
                        className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                        overlayClassName="overlay"
                    >
                        <h2 className="text-xl font-bold text-accent">
                            {editingPlacement ? 'Edit Placement Partner' : 'Add Placement Partner'}
                        </h2>

                        <div className="flex-1 overflow-auto">
                        <div className="flex flex-col gap-1">
                                <label htmlFor="username" className="block text-md font-semibold required">
                                    Placement Partner Name
                                </label>
                                <input
                                    id="mentorName"
                                    type="text"
                                    value={placementName}
                                    placeholder="Enter Placement Partner Name"
                                    onChange={(e) => setPlacementName(e.target.value)}
                                    className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="placementImage" className="block text-md font-semibold required">
                                Placement Partner Image
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
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full sticky bottom-0 z-10">
                            <button
                                onClick={handleUploadClick}
                                disabled={uploading}
                                className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium ${uploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : editingPlacement
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : editingPlacement ? 'Update Placement Partner' : 'Add Placement Partner'}
                            </button>
                            <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                                Cancel
                            </button>
                        </div>
                    </Modal>

                    <div className="overflow-hidden border-2 rounded-lg">
                        <DataTable
                            columns={columns}
                            data={placements}
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
export default Placement;
