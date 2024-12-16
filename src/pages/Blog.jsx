import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import DataTable from 'react-data-table-component';
import 'react-toastify/dist/ReactToastify.css';
import EditorBlog from '../components/EditorBlog.jsx';
import { UploadIcon } from '../components/Icons/UploadIcon';
import { API_BASE_URL } from '../config/constant.js';
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { EditIcon } from '../components/Icons/EditIcon.jsx';
import { MdOutlineDelete } from 'react-icons/md';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";


const Blog = () => {
    const [blogs, setBlogs] = useState([]); // Blog list
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const [editingBlog, setEditingBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const { userRoles } = useRoles();
    const {users} = useRoles();
    const { userId } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const [isLoading, setIsLoading] = useState(true);


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

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/blogs/getBlogs`);
                setBlogs(response?.data?.blogs);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching blogs:', error);
                toast.error('Failed to fetch blogs.');
            }
        };
        fetchBlogs();
    }, []);

    const openModal = (blog = null) => {
        setEditingBlog(blog);
        setBlogTitle(blog ? blog.blogTitle : "");
        setBlogDescription(blog ? blog.blogDescription : "");
        blog ? decodeBase64Image(blog.blogImage, setFile) : setFile(null);
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
        setEditingBlog(null);
    };

    const handleUploadClick = async () => {
        setIsLoading(true);
        if (!blogTitle || !blogDescription || !file ) {
            setIsLoading(false);
            return toast.warn('Please fill out all fields and select an image.');
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const data = {
                blogTitle,
                blogDescription,
                blogImage: reader.result,
                userId
            };
            try {
                const endpoint = editingBlog
                    ? `${API_BASE_URL}/blogs/updateBlog/${editingBlog._id}`
                    : `${API_BASE_URL}/blogs/addBlog`;

                await axios.post(endpoint, data, { headers: { 'Content-Type': 'application/json' } });
                toast.success(editingBlog ? 'Blog updated successfully!' : 'Blog added successfully!');
                setBlogTitle('');
                setBlogDescription('');
                setFile(null);
                const fetchResponse = await axios.get(`${API_BASE_URL}/blogs/getBlogs`);
                setBlogs(fetchResponse.data.blogs);
                closeModal();
                setIsLoading(false);
            } catch (error) {
                console.error('Error uploading blog:', error);
                toast.error('Failed to upload blog.');
            }finally{ 
                
                //toast.success(editingBlog ? 'Blog updated successfully!' : 'Blog added successfully!');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteClick = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/blogs/deleteBlog/${blogId}`);
                toast.success('Blog deleted successfully!');
                const fetchResponse = await axios.get(`${API_BASE_URL}/blogs/getBlogs`);
                setBlogs(fetchResponse.data.blogs);
                setIsLoading(false);
            } catch (error) {
                console.error('Error deleting blog:', error);
                toast.error('Failed to delete blog.');
            }finally{
              
               // toast.success('Blog deleted successfully!');
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
            name: 'Blog Title',
            width: '400px',
            selector: row => row.blog,
            cell: row => (
                <div dangerouslySetInnerHTML={{ __html: row.blogTitle }} />
            ),
            sortable: true,
        },
        {
            name: 'Blog Image',
            width: "250px",
            cell: row => (
                <img
                    src={row.blogImage}
                    alt="Testimonial"
                    className="w-32 h-20 object-cover rounded-md shadow-sm"
                />
            ),
        },
        {
            name: 'Actions',
            width: "140px",
            cell: row => (
                <div className="flex gap-4">
                    <button
                        onClick={() => openModal(row)}
                    >
                        <EditIcon width={20} height={20} fill={"#444050"} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row._id)}
                    >
                        <MdOutlineDelete size={26} fill='#ff2023' />
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

    const filteredBlogs = blogs.filter(blog =>
        blog.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    return (
        <>
         {actionRoles?.actions?.permission ?
         isLoading ?
         <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                <i className="loader" />
            </div>
         :
        <div className="mx-auto w-full flex flex-col col-span-12 md:col-span-8 justify-between bg-cardBg rounded-lg card-shadow p-5 gap-6">

            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                    <label htmlFor="search-testimonials"><SearchIcon width={18} height={18} fill={"none"} /></label>
                    <input id='search-testimonials' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search Blog by Name or Description" />
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg"
                >
                    Add Blog
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Blog Modal"
                className="w-full max-w-[700px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                overlayClassName="overlay"
            >
                <h2 className="text-xl font-bold text-accent">
                    {editingBlog ? 'Edit Blog' : 'Add Blog'}
                </h2>

                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                        Blog Title
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={blogTitle}
                        placeholder="Blog Title"
                        onChange={(e) => setBlogTitle(e.target.value)}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="block text-sm font-semibold mb-2">
                        Blog Description
                    </label>
                    <textarea
                        id="description"
                        value={blogDescription}
                        onChange={(e) => setBlogDescription(e.target.value)}
                        placeholder="Blog Description"
                        style={{ minHeight: "fit-content" }}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="block text-sm font-semibold mb-2">
                        Blog Image
                    </label>
                    <div
                        className={`upload-box w-ful h-65 border-2 border-dashed rounded-lg flex justify-center items-center bg-mainBg ${dragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="relative h-full w-full">
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded-md shadow-lg hover:bg-red-600"
                                    onClick={() => setFile(null)} // Clear the file on click
                                >X</button>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="h-full w-full object-cover rounded-lg"
                                />
                                <span className="absolute bottom-0 rounded-b-lg w-full bg-gradient-to-t from-accent to-accent/0 text-cardBg text-center px-2 pt-3 pb-1 bg-">{file.name}</span>
                            </div>
                        ) : (
                            <div className="upload-prompt flex flex-col items-center text-secondaryText">
                                <UploadIcon width={24} height={24} fill={'none'} />
                                <div className="flex flex-col items-center mt-3">
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

                {/* Editor Component */}
                {/* <div className="h-[800px]"> */}
                {/* </div> */}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 m-x-4 w-full">
                    <button
                        onClick={handleUploadClick}
                        className="px-6 py-2 rounded-lg text-cardBg text-md font-medium bg-green-600 hover:bg-green-700"
                    >
                        {editingBlog ? 'Update Blog' : 'Add Blog'}
                    </button>
                    <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                        Cancel
                    </button>
                </div>
            </Modal>

            <h3 className="text-xl font-bold text-accent">Blog List</h3>
            <div className="overflow-hidden border-2 rounded-lg">
                <DataTable
                    columns={columns}
                    data={filteredBlogs} // Use filteredBlogs instead of blogs
                    pagination
                    highlightOnHover
                    customStyles={customStyles}
                />
                
            </div>
        </div>
        :  <AccessDenied/>}
        <ToastContainer />
        </>
    );
};

Modal.setAppElement('#root');
export default Blog;
