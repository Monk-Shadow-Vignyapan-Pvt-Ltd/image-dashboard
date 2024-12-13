import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import DataTable from 'react-data-table-component';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config/constant.js';
import Select from 'react-select'
import { SearchIcon } from '../components/Icons/SearchIcon.jsx';
import { EditIcon } from '../components/Icons/EditIcon.jsx';
import { MdOutlineDelete } from 'react-icons/md';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoIosInformationCircleOutline } from "react-icons/io";

const Faq = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [showForAll, setShowForAll] = useState(true);
    const [faqs, setFaqs] = useState([]);
    const [editingFaq, setEditingFaq] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mainServices, setMainServices] = useState([]);
    const [selectedMainServices, setSelectedMainServices] = useState([]);
    const { userRoles } = useRoles();
    const { userId } = useRoles();
    const {users} = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "FAQs");
    const [isLoading, setIsLoading] = useState(true);
    const [subServices, setSubServices] = useState([]);
    const [selectedSubServices, setSelectedSubServices] = useState([]);
    const [isServiceLoading, setIsServiceLoading] = useState(true);
    const [isSubServiceLoading, setIsSubServiceLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services/getServicesFrontend`);
            setMainServices(response.data.services
                .filter(service => service.serviceEnabled)
                .map(service => ({ value: service._id, label: service.serviceName })));
                setIsServiceLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to fetch services.');
        } finally {
            //setLoadingServices(false);
        }
    };

    const fetchSubServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subServices/getSubServicesFrontend`);
            setSubServices(response.data.subServices
                .filter(subService => subService.subServiceEnabled)
                .map(subService => ({ value: subService._id, label: subService.subServiceName })));
                setIsSubServiceLoading(false);
        } catch (error) {
            console.error('Error fetching sub services:', error);
            toast.error('Failed to fetch sub services.');
        } finally {
            //setLoadingServices(false);
        }
    };


    // Fetch FAQs
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/faqs/getFaqs`);
                setFaqs(response.data.faqs);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
                toast.error('Failed to fetch FAQs.');
            }
        };
        fetchFaqs();
        fetchServices();
        fetchSubServices();
    }, []);

    // Open modal to edit or add FAQ
    const openModal = (faq = null) => {
        setEditingFaq(faq);
        setQuestion(faq ? faq.question : '');
        setAnswer(faq ? faq.answer : '');
        setSelectedMainServices(faq ? filterServices(mainServices, faq.serviceId) : []);
        setSelectedSubServices(faq ? filterServices(subServices, faq.serviceId) : []);
        setShowForAll(faq ? faq.showForAll : true);
        setIsModalOpen(true);
    };

    const filterServices = (services = [], serviceIdList = []) => {
        if (!Array.isArray(services) || !Array.isArray(serviceIdList)) {
            console.error("Invalid input: services or serviceIdList is not an array");
            return [];
        }
        return services.filter(service => serviceIdList.includes(service.value));
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    // Handle adding or updating FAQ
    const handleUploadClick = async () => {
        setIsLoading(true);
        const serviceId = showForAll ? [] : [...selectedMainServices.map(option => option.value), ...selectedSubServices.map(option => option.value)]
        if (!question || !answer) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields.');
        }
        if(!showForAll && (serviceId.length ==0)){
            setIsLoading(false);
            return toast.warn('Please Select At Least One Service or Sub service');
        }
        setUploading(true);
        const data = {
            question,
            answer,
            serviceId,
            showForAll,
            userId
        };
        try {
            const endpoint = editingFaq
                ? `${API_BASE_URL}/faqs/updateFaq/${editingFaq._id}`
                : `${API_BASE_URL}/faqs/addFaq`;
            await axios.post(endpoint, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success(editingFaq ? 'FAQ updated successfully!' : 'FAQ added successfully!');
            setQuestion('');
            setAnswer('');
            setSelectedMainServices([]);
            setShowForAll(false);
            setEditingFaq(null);
            const fetchResponse = await axios.get(`${API_BASE_URL}/faqs/getFaqs`);
            setFaqs(fetchResponse.data.faqs);
            setIsLoading(false);
            closeModal();
        } catch (error) {
            console.error('Error uploading FAQ:', error);
            toast.error('Failed to upload FAQ.');
        } finally {
            setUploading(false);
        }
    };

    // Handle deleting FAQ
    const handleDeleteClick = async (faqId) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/faqs/deleteFaq/${faqId}`);
                toast.success('FAQ deleted successfully!');
                const fetchResponse = await axios.get(`${API_BASE_URL}/faqs/getFaqs`);
                setFaqs(fetchResponse.data.faqs);
                setIsLoading(false);
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                toast.error('Failed to delete FAQ.');
            }
        }
    };

    // Define DataTable columns
    const columns = [
        {
            name: 'ID',
            width: "150px",
            selector: (row, index) => row._id.slice(-4),
            sortable: true,
        },
        {
            name: 'Question',
            width: '350px',
            selector: row => row.question,
            sortable: true,
        },
        {
            name: 'Answer',
            width: '450px',
            selector: row => row.answer,
            sortable: true,
        },
        {
            name: 'Actions',
            width: '140px',
            cell: row => (
                <div className="flex gap-4">
                    <button
                        onClick={() => openModal(row)} // Open modal for editing
                    >
                        <EditIcon width={20} height={20} fill={"#444050"} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row._id)} // Handle delete
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

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
         {actionRoles?.actions?.permission ?
         isLoading || isServiceLoading || isSubServiceLoading ?
         <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                <i className="loader" />
            </div>
         :
        <div className="mx-auto w-full flex flex-col col-span-12 md:col-span-8 justify-between bg-cardBg rounded-lg card-shadow p-5 gap-6">

            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Name or Description"
                    className="w-56 p-2 text-sm"
                /> */}
                <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                    <label htmlFor="search-FAQ"><SearchIcon width={18} height={18} fill={"none"} /></label>
                    <input id='search-FAQ' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by Name or Description" />
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg"
                >
                    Add FAQ
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="FAQ Modal"
                className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                overlayClassName="overlay"
            >
                <h2 className="text-xl font-bold text-accent">
                    {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
                </h2>
                <div className="flex flex-col gap-1">
                    <label htmlFor="question" className="block text-sm font-semibold required">
                        Question
                    </label>
                    <input
                        id="question"
                        type="text"
                        value={question}
                        placeholder="Enter FAQ Question"
                        onChange={(e) => setQuestion(e.target.value)}
                        className="bg-mainBg placeholder:text-secondaryText focus:outline-accent text-sm rounded-lg px-3 py-2 block w-full flatpickr-input"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="answer" className="block text-sm font-semibold required">
                        Answer
                    </label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter FAQ Answer"
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
                    <label htmlFor="mainserviceId" className="block text-sm font-semibold required">
                        Select Services
                    </label>
                    <Select
                        isMulti
                        name="services"
                        placeholder="Select Services"
                        options={mainServices}
                        value={selectedMainServices}
                        onChange={(selected) => setSelectedMainServices(selected)}
                        className="basic-multi-select text-md"
                        classNamePrefix="select"
                    />
                </div>}

                {showForAll ? null:<div className="flex flex-col gap-1">
                    <label htmlFor="mainserviceId" className="block text-sm font-semibold">
                        Select Sub Services
                    </label>
                    <Select
                        isMulti
                        name="subServices"
                        placeholder="Select Sub Services"
                        options={subServices}
                        value={selectedSubServices}
                        onChange={(selected) => setSelectedSubServices(selected)}
                        className="basic-multi-select text-md"
                        classNamePrefix="select"
                    />
                </div>}

                <div className="grid grid-cols-2 gap-3 m-x-4 w-full">
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium ${uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : editingFaq
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {uploading ? 'Uploading...' : editingFaq ? 'Update FAQ' : 'Add FAQ'}
                    </button>
                    <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                        Cancel
                    </button>
                </div>
            </Modal>

            <h3 className="text-xl font-bold text-accent">All FAQs</h3>
            <div className="overflow-hidden border-2 rounded-lg">
                <DataTable
                    columns={columns}
                    data={filteredFaqs}
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

export default Faq;
