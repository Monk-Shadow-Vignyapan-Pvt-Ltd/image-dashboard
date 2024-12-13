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
import Select from 'react-select';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DemoMaster = () => {
    const [demos, setDemos] = useState([]);
    const [editingDemo, setEditingDemo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const { userId } = useRoles();
    const { users } = useRoles();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [isCourseLoading, setIsCourseLoading] = useState(true);
    const [duration, setDuration] = useState('');
    const [durations, setDurations] = useState(["1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "1 Week"]);
    const [nextDemoStartDate, setNextDemoStartDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [IsMentorLoading, setIsMentorLoading] = useState(true);
    const [mentors, setMentors] = useState([]);
    const [mentorsList, setMentorsList] = useState([]);

    const fetchDemos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/demos/getDemos`);
            setDemos(response.data.demos);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching demos:', error);
            toast.error('Failed to fetch demos.');
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses/getCourses`);
            setCourses(response.data.courses);
            setIsCourseLoading(false)
        } catch (error) {
            console.error('Error fetching softwares:', error);
            toast.error('Failed to fetch softwares.');
        }
    };

    const fetchMentors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mentors/getMentors`);
            const mentorOptions = response.data.mentors.map(mentor => ({
                value: mentor.mentorName,
                label: mentor.mentorName,
            }));
            setMentorsList(mentorOptions);
            setIsMentorLoading(false)
        } catch (error) {
            console.error('Error fetching mentors:', error);
            toast.error('Failed to fetch mentors.');
        }
    };

    useEffect(() => {
        fetchDemos();
        fetchCourses();
        fetchMentors();
    }, []);

    const openModal = (demo = null) => {
        setEditingDemo(demo);
        setDuration(demo ? demo.duration : '');
        setNextDemoStartDate(demo ? new Date(demo?.nextDemoStartDate) : null);
        setMentors(demo ? demo?.mentors.map(mentor => ({
            value: mentor,
            label: mentor,
        })) : []);
        setSelectedCourse(demo ? { id: courses.find(course => course._id === demo?.courseId)._id, name: courses.find(course => course._id === demo?.courseId).courseName } : '') ;
        
        setIsModalOpen(true);


    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDemo(null);
    };


    const handleUploadClick = async () => {
        setIsLoading(true);
        if (!selectedCourse.id || !nextDemoStartDate || mentors.length === 0) {
            setIsLoading(false);
            return toast.warn('Please fill out all required fields.');
        }

        setUploading(true);

        const data = {
            courseId: selectedCourse.id,
            duration,
            nextDemoStartDate,
            mentors: mentors.map(option => option.value),
            userId
        };

        try {
            const endpoint = editingDemo
                ? `${API_BASE_URL}/demos/updateDemo/${editingDemo._id}`
                : `${API_BASE_URL}/demos/addDemo`;

            await axios.post(endpoint, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success(editingDemo ? 'Demo updated successfully!' : 'Demo added successfully!');
            fetchDemos();
            setIsLoading(false);
            closeModal();
        } catch (error) {
            console.error('Error uploading demo:', error);
            toast.error('Failed to upload demo.');
        } finally {
            setUploading(false);
        }



    };

    const handleDeleteClick = async (Id) => {
        if (window.confirm('Are you sure you want to delete this demo?')) {
            try {
                setIsLoading(true);
                await axios.delete(`${API_BASE_URL}/demos/deleteDemo/${Id}`);
                toast.success('Demo deleted successfully!');
                fetchDemos();
                setIsLoading(false)
            } catch (error) {
                console.error('Error deleting demo:', error);
                toast.error('Failed to delete demo.');
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
            name: 'Course Name',
            selector: row =>{
                const courseName = courses.find(course => course._id === row.courseId).courseName;
                return courseName;
            },
            sortable: true,
        },
        {
            name: 'Duration',
            selector: row => row.duration,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: row => new Date(row.nextDemoStartDate).toDateString(),
            sortable: true,
        },
        {
            name: 'Mentors',
            selector: row => row.mentors.join(", "),
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

    const filtereddemos = demos.filter(demo =>
        isCourseLoading ? demos : courses.find(course => course._id === demo.courseId).courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(demo.nextDemoStartDate).toDateString().toLowerCase().includes(searchQuery.toLowerCase()) || 
        demo.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(demo.mentors) &&
        demo.mentors.some((mentor) =>
          mentor.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const handleDateChange = (date) => {
        setNextDemoStartDate(date);
        setIsCalendarOpen(false); // Close the calendar after date selection
    };

    return (
        <>
            {actionRoles?.actions?.permission ?
                isLoading || isCourseLoading || IsMentorLoading ?
                    <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
                        <i className="loader" />
                    </div>
                    :
                    <div className="p-6 bg-cardBg card-shadow rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center border-2 px-3 py-2 rounded-lg">
                                <label htmlFor="search-demo"><SearchIcon width={18} height={18} fill={"none"} /></label>
                                <input id='search-demo' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ms-2 w-full sm:w-60 bg-transparent text-sm p-0 focus:outline-0" type="text" placeholder="Search by course name or duration" />
                            </div>

                            <button onClick={() => openModal()} className="bg-accent hover:bg-accent/70 px-3 py-2 h-full text-sm font-semibold text-cardBg rounded-lg">
                                Add New Demo
                            </button>
                        </div>

                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            contentLabel="Mentor Modal"
                            className="w-full max-w-[500px] max-h-[96vh] overflow-auto bg-cardBg z-50 m-4 p-6 rounded-2xl flex flex-col gap-4"
                            overlayClassName="overlay"
                        >
                            <h2 className="text-xl font-bold text-accent">
                                {editingDemo ? 'Edit Demo' : 'Add Demo'}
                            </h2>

                            <div className="flex-1 overflow-auto">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                                        <label className="text-md font-semibold required" htmlFor="parentCourse">Select Course</label>
                                        <Listbox value={selectedCourse} onChange={setSelectedCourse}>
                                            <div className="relative">
                                                <ListboxButton
                                                    id="Course"
                                                    className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-1.5 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                                >
                                                    <span className="flex items-center h-5">
                                                        {selectedCourse?.name || 'Select Course'}
                                                    </span>
                                                </ListboxButton>

                                                <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {courses?.map((course) => (
                                                        <ListboxOption
                                                            key={course._id}
                                                            value={{ id: course._id, name: course.courseName }}
                                                            className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                                        >
                                                            {course.courseName.replace(/-/g, ' ')}
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </div>
                                        </Listbox>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                <label htmlFor="mentorsDemoList" className="block text-sm font-semibold required">
                                    Select Mentors
                                </label>
                                <Select
                                    isMulti
                                    name="mentorsDemoList"
                                    placeholder="Select Mentors"
                                    options={mentorsList}
                                    value={mentors}
                                    onChange={(selected) => setMentors(selected)}
                                    className="basic-multi-select text-md"
                                    classNamePrefix="select"
                                />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold required" htmlFor="parentCourse">Course Duration</label>
                                    <Listbox value={duration} onChange={setDuration}>
                                        <div className="relative">
                                            <ListboxButton
                                                id="duration"
                                                className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-1.5 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                            >
                                                <span className="flex items-center h-5">
                                                    {duration || 'Select Course Duration'}
                                                </span>
                                            </ListboxButton>

                                            <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {durations?.map((item, index) => (
                                                    <ListboxOption
                                                        key={index}
                                                        value={item}
                                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                                    >
                                                        {item}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>



                                <div className="flex flex-col gap-1">
                                    <label className="gap-2 text-md font-semibold required" htmlFor="nextDemoStartDate">
                                        Next Demo Start Date
                                    </label>
                                    <div
                                        className="border rounded-md p-2 cursor-pointer bg-white text-gray-700"
                                        onClick={toggleCalendar}
                                    >
                                        {nextDemoStartDate ? nextDemoStartDate.toDateString() : 'Select a date'}
                                    </div>
                                    {isCalendarOpen && (
                                        <Calendar
                                            onChange={handleDateChange}
                                            tileDisabled={({ date }) => date < new Date()} // Disable past dates
                                            value={nextDemoStartDate}
                                            className="react-calendar mt-2"
                                        />
                                    )}
                                </div>

                                

                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full sticky bottom-0 z-10">
                                <button
                                    onClick={handleUploadClick}
                                    disabled={uploading}
                                    className={`px-6 py-2 rounded-lg text-cardBg text-md font-medium ${uploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : editingDemo
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    {uploading ? 'Uploading...' : editingDemo ? 'Update Demo' : 'Add Demo'}
                                </button>
                                <button onClick={closeModal} className="px-6 py-2 rounded-lg font-medium text-md text-cardBg bg-dangerRed duration-300">
                                    Cancel
                                </button>
                            </div>
                        </Modal>

                        <div className="overflow-hidden border-2 rounded-lg">
                            <DataTable
                                columns={columns}
                                data={filtereddemos}
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
export default DemoMaster;
