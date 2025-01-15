import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { EditIcon } from "../components/Icons/EditIcon";
import { MdOutlineDelete } from 'react-icons/md';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../config/constant.js';
import { useRoles } from '../RolesContext';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import ParentCourse from './ParentCourse.jsx';
import AccessDenied from '../components/AccessDenied.jsx';

const Course = () => {
    const [selectedParentCourse, setSelectedParentCourse] = useState('all');  // Default to empty string
    const [parentCourses, setParentCourses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const { userId } = useRoles();
    const { users } = useRoles();
    const { userRoles } = useRoles();
    const actionRoles = userRoles?.find(role => role.name === "Users");
    const [isLoading, setIsLoading] = useState(true);
    const [isParentCoursesLoading,setIsParentCoursesLoading] = useState(true);
    const location = useLocation();
    const [isFromAddCourse,setIsFromAddCourse] = useState(location.state?.addCourse ? true : false );
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchParentCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parentCourses/getParentCourses`);
            setParentCourses(response.data.parentCourses);
            setIsParentCoursesLoading(false)
        } catch (error) {
            console.error('Error fetching Parent Courses :', error);
            toast.error('Failed to fetch Parent Courses .');
        }
    };

    const fetchCourses = async () => {
        try {
            if(isFromAddCourse){
            setCourses(location.state?.courses)
            setParentCourses(location.state?.parentCourses);
            setFilteredCourses(location.state?.courses); 
            setIsParentCoursesLoading(false);
            setIsLoading(false);
            }else{
            fetchParentCourses();
            const response = await axios.get(`${API_BASE_URL}/courses/getCourses`);
            setCourses(response.data.courses);
            setFilteredCourses(response.data.courses);
            setIsLoading(false);
            
        }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses.');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedParentCourse === 'all') {
            setFilteredCourses(courses);
        } else if (selectedParentCourse) {
            setFilteredCourses(courses.filter(course => course.parentCourseId === selectedParentCourse));
        }
    }, [selectedParentCourse, courses]);

    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/add-course', { state: { courses:courses,parentCourses:parentCourses } });
    };

    const handleEditClick = (courseId) => {
        navigate(`/edit-course/${courseId}`, { state: { courses:courses,parentCourses:parentCourses } });
    };

    const handleDeleteClick = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setIsProcessing(true); // Show loader before the operation
            setTimeout(async () => {
                try {
                    await axios.delete(`${API_BASE_URL}/courses/deleteCourse/${courseId}`);
                    toast.success('Course deleted successfully!');
                    setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
                    setFilteredCourses(prevFiltered => prevFiltered.filter(course => course._id !== courseId));
                } catch (error) {
                    console.error('Error deleting course:', error);
                    toast.error('Failed to delete course.');
                } finally {
                    setIsProcessing(false); // Hide loader after the operation
                }
            }, 500); // Delay for a visible loader
        }
    };

    const handleCourseOnOff = async (course, value) => {
        setIsProcessing(true); // Show loader before the operation
        const updatedCourse = { ...course, courseEnabled: value === 'on' };

        setTimeout(async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/courses/updateCourse/${course._id}`, updatedCourse, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Course updated successfully!');
                setCourses(prevCourses => prevCourses.map(c => (c._id === course._id ? response?.data.course : c)));
                setFilteredCourses(prevFiltered => prevFiltered.map(c => (c._id === course._id ? response?.data.course : c)));
            } catch (error) {
                console.error('Error editing course:', error);
                toast.error('Failed to edit course.');
            } finally {
                setIsProcessing(false); // Hide loader after the operation
            }
        }, 500); // Delay for a visible loader
    };
    

    return (
        <>
            
            {actionRoles?.actions?.permission ?
            (isLoading || isParentCoursesLoading || isProcessing) ?
                <div className='w-full h-100 flex justify-center items-center bg-mainBg'>
                    <i className="loader" />
                </div>

                : 
                <div className="relative w-full bg-cardBg card-shadow flex flex-col rounded-lg p-4">
                <div className="flex flex-col w-full relative mt-6">
                    <div className="relative w-full flex flex-col sm:flex-row items-center sm:items-end md:items-center justify-between gap-3 sm:gap-2">
                    <div className="w-full sm:w-fit flex flex-col md:flex-row md:items-center gap-2">
                            <span>Select Parent Course</span>

                            <Listbox value={selectedParentCourse} onChange={setSelectedParentCourse}>
                                <div className="relative">
                                    <ListboxButton
                                        id="parentCourse"
                                        className="relative min-w-50 w-fit cursor-default font-input-style text-md rounded-lg px-3 py-1 border-2 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                    >
                                        <span className="flex items-center h-5">
                                            {selectedParentCourse === 'all'
                                                ? 'Select All'
                                                : parentCourses.find(parentCourse => parentCourse._id === selectedParentCourse)?.parentCourseName}
                                        </span>
                                    </ListboxButton>

                                    <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <ListboxOption value="all" className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white">
                                            Select All
                                        </ListboxOption>
                                        {parentCourses?.map((parentCourse) => (
                                            <ListboxOption
                                                key={parentCourse._id}
                                                value={parentCourse._id}
                                                className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                            >
                                                {parentCourse.parentCourseName.replace(/-/g, ' ')}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>
                        <button
                            onClick={handleAddClick}
                            className="w-full sm:w-fit bg-accent hover:bg-accent/70 px-6 py-1.5 text-md font-semibold text-cardBg rounded-lg"
                        >
                            Add New Course
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
                        {filteredCourses?.map((course) => {
                            const parentCourse = parentCourses.find(parentCourse => parentCourse._id === course.parentCourseId);
                            return (
                                <div key={course._id} className="flex flex-col gap-3 rounded-lg p-3 border-2">
                                    <img className="w-full min-h-50 max-h-50 rounded-lg border-2" src={course.thumbnail} alt="" />
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-lg text-accent font-semibold">{course.courseName}</span>
                                        {/* <span className="text-md">Next Batch Start Date : {new Date(course?.nextBatchStartDate).toDateString()}</span> */}
                                        <span className="text-md">{parentCourse?.parentCourseName || 'Parent Course Not Found'}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-1 space-x-2 rounded-lg bg-mainBg select-none">
                                            <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`radio-${course._id}`}
                                                    defaultValue="on"
                                                    className="peer hidden flex-1"
                                                    checked={course.courseEnabled}
                                                    onChange={() => handleCourseOnOff(course, 'on')}
                                                />
                                                <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                                                    On
                                                </span>
                                            </label>
                                            <label className="radio flex-1 flex flex-grow items-center justify-center rounded-lg cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`radio-${course._id}`}
                                                    defaultValue="off"
                                                    className="peer hidden flex-1"
                                                    checked={!course.courseEnabled}
                                                    onChange={() => handleCourseOnOff(course, 'off')}
                                                />
                                                <span className="text-sm flex-1 text-center peer-checked:bg-gradient-to-r peer-checked:bg-accent peer-checked:text-white peer-checked:font-semibold p-2 rounded-lg transition duration-150 ease-in-out">
                                                    Off
                                                </span>
                                            </label>
                                        </div>
                                        <button onClick={() => handleEditClick(course._id)}>
                                            <EditIcon width={20} height={20} fill={"#444050"} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(course._id)}>
                                            <MdOutlineDelete size={24} fill='#ff2023' />
                                        </button>
                                        <div id={`tooltip-${course._id}`} className="tooltip-wrapper">
                                            <IoIosInformationCircleOutline size={26} fill={"#444050"} />
                                        </div>
                                        <ReactTooltip
                                            anchorId={`tooltip-${course._id}`}
                                            place="top"
                                            content={
                                                <div>
                                                    <div>
                                                        <strong>Created or Updated By:</strong> {users.find(user => user._id === course.userId)?.username || "Unknown"}
                                                    </div>
                                                    <div>
                                                        <strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}
                                                    </div>
                                                    <div>
                                                        <strong>Updated At:</strong> {new Date(course.updatedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            } />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                </div>
                </div>
                : <AccessDenied/>}
                <ToastContainer />
        </>
    );
};

export default Course;
