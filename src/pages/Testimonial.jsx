import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { UploadIcon } from '../components/Icons/UploadIcon';
import DataTable from 'react-data-table-component';  // Import DataTable component
import { API_BASE_URL } from '../config/constant.js';
import Select from 'react-select'
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { EditIcon } from '../components/Icons/EditIcon.jsx';
import { MdOutlineDelete } from 'react-icons/md';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";

const Testimonial = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [showForAll, setShowForAll] = useState(true);
    const [file, setFile] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const { userRoles } = useRoles();
    const { userId } = useRoles();
    const {users} = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users")
    const [isLoading, setIsLoading] = useState(true);
    const [isCourseLoading,setIsCourseLoading] = useState(true);


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

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses/getCourses`);
            setCourses(response.data.courses
                .filter(course => course.courseEnabled)
                .map(course => ({ value: course._id, label: course.courseName })));
                setIsCourseLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses.');
        } finally {
            //setLoadingServices(false);
        }
    };

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/testimonials/getTestimonials`);
                setTestimonials(response.data.testimonials);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                toast.error('Failed to fetch testimonials.');
            }
        };
        fetchTestimonials();
        fetchCourses();
    }, []);

    const openModal = (testimonial = null) => {
        setEditingTestimonial(testimonial);
        setName(testimonial ? testimonial.name : '');
        setDescription(testimonial ? testimonial.description : '');
        setSelectedCourses(testimonial ? filterCourses(courses, testimonial.courseId) : []);
        setShowForAll(testimonial ? testimonial.showForAll : true);
        setImage(testimonial ? testimonial.image : null);
        testimonial ? decodeBase64Image(testimonial.image, setFile) : setFile(null);
        setIsModalOpen(true);
    };

    const filterCourses = (courses = [], courseIdList = []) => {
        if (!Array.isArray(courses) || !Array.isArray(courseIdList)) {
            console.error("Invalid input: courses or courseIdList is not an array");
            return [];
        }
        return courses.filter(course => courseIdList.includes(course.value));
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
        setEditingTestimonial(null);
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
            setFile(selectedFile);
        }
    };

    const handleUploadClick = async () => {
        setIsLoading(true);
        const courseId = showForAll ? [] : selectedCourses.map(option => option.value)
        if (!name || !description || !file) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields or required images.');
        }

        if(!showForAll && (courseId.length ==0)){
            setIsLoading(false);
            return toast.warn('Please Select At Least One Course');
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const data = {
                name,
                description,
                imageBase64: reader.result,
                courseId,
                showForAll,
                userId
            };
            try {
                const endpoint = editingTestimonial
                    ? `${API_BASE_URL}/testimonials/updateTestimonial/${editingTestimonial._id}`
                    : `${API_BASE_URL}/testimonials/addTestimonial`;
                await axios.post(endpoint, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
                setName('');
                setDescription('');
                setImage(null);
                setFile(null);
                setSelectedCourses([]);
                setShowForAll(false);
                setEditingTestimonial(null);
                const fetchResponse = await axios.get(`${API_BASE_URL}/testimonials/getTestimonials`);
                setTestimonials(fetchResponse.data.testimonials);
                setIsLoading(false);
                closeModal();
            } catch (error) {
                console.error('Error uploading testimonial:', error);
                toast.error('Failed to upload testimonial.');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteClick = async (testimonialId) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/testimonials/deleteTestimonial/${testimonialId}`);
                toast.success('Testimonial deleted successfully!');
                const fetchResponse = await axios.get(`${API_BASE_URL}/testimonials/getTestimonials`);
                setTestimonials(fetchResponse.data.testimonials);
                setIsLoading(false);
            } catch (error) {
                console.error('Error deleting testimonial:', error);
                toast.error('Failed to delete testimonial.');
            }
        }
    };

    // Columns for the DataTable
    const columns = [
        {
            name: 'ID',
            width: "150px",
            selector: (row, index) => row._id.slice(-4),
            sortable: true,
        },
        {
            name: 'Name',
            width: "200px",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            width: "300px",
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Image',
            width: "250px",
            cell: row => (
                <img
                    src={row.image}
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
        }
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

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
        {actionRoles?.actions?.permission ?
        isLoading || isCourseLoading  ?
        <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
               <i className="loader" />
           </div>
        :
        <div className="mx-auto w-full flex flex-col col-span-12 md:col-span-8 justify-between bg-cardBg rounded-lg card-shadow p-5 gap-6">

            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                    <label htmlFor="search-testimonials"><SearchIcon width={18} height={18} fill={"none"} /></label>
                    <input id='search-testimonials' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by Name or Description" />
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg"
                >
                    Add Testimonials
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Testimonial Modal"
                className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                overlayClassName="overlay"
            >
                <h2 className="text-xl font-bold text-accent">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="block text-sm font-semibold required">
                        User Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        placeholder="Testimonial Name"
                        onChange={(e) => setName(e.target.value)}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="block text-sm font-semibold required">
                        Testimonial Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Testimonial Description"
                        style={{ minHeight: "100px" }}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <label className="text-sm font-semibold flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showForAll}
                        className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        onChange={() => setShowForAll(!showForAll)}
                    />
                    <span className="text-primaryText text-sm">Show For All Services ?</span>
                </label>

                {showForAll ? null:<div className="flex flex-col gap-1">
                    <label htmlFor="maincourseId" className="block text-sm font-semibold required">
                        Select Courses
                    </label>
                    <Select
                        isMulti
                        name="courses"
                        placeholder="Select Courses"
                        options={courses}
                        value={selectedCourses}
                        onChange={(selected) => setSelectedCourses(selected)}
                        className="basic-multi-select text-md"
                        classNamePrefix="select"
                    />
                </div>}

                <div className="flex flex-col gap-1">
                <label htmlFor="testimonialImage" className="block text-sm font-semibold required">
                        Testimonial Image
                    </label>
                    <div
                    className={`upload-box w-full h-65 border-2 border-dashed rounded-lg flex justify-center items-center bg-mainBg ${dragging ? 'dragging' : ''}`}
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
                

                <div className="grid grid-cols-2 gap-3 m-x-4 w-full">
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium  ${uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : editingTestimonial
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {uploading ? 'Uploading...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                    </button>
                    <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                        Cancel
                    </button>
                </div>
            </Modal>

            <h3 className="text-xl font-bold text-accent">All Testimonials</h3>
            <div className="overflow-hidden border-2 rounded-lg">
                {/* DataTable Component */}
                <DataTable
                    columns={columns}
                    data={filteredTestimonials}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    // striped
                    customStyles={customStyles}
                />
               
            </div>
        </div>
         :  <AccessDenied/>}
          <ToastContainer />
        </>
    );
};

Modal.setAppElement('#root'); // Set this if you are using #root in your HTML
export default Testimonial;
