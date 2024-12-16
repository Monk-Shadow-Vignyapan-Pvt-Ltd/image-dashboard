import React, { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { UploadIcon } from '../components/Icons/UploadIcon';
import { UpArrow } from '../components/Icons/UpArrow';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../config/constant.js';
import Editor from '../components/Editor.jsx';
import { useNavigate,useParams, useLocation } from 'react-router-dom';
import { useRoles } from '../RolesContext';
import AccessDenied from '../components/AccessDenied.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select'


const EditCourse = () => {
    const { courseId } = useParams();
  const [selectedParentCourse, setSelectedParentCourse] = useState('');
  // Main Image input start
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [sections, setSections] = useState([]);
  const [modulepoints, setModulepoints] = useState([{ id: 1, title: '', description: '' }]);
  const [courseName, setCourseName] = useState('');
  const [duration, setDuration] = useState('');
  const [durations, setDurations] = useState(["3 Months", "6 Months", "9 Months", "12 Months", "18 Months", "24 Months"])
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { userRoles } = useRoles();
  const { userId } = useRoles();
  const actionRoles = userRoles?.find(role => role.name === "Users");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [parentCourses, setParentCourses] = useState(location.state?.parentCourses);
  const [courses, setCourses] = useState(location.state?.courses);
  const [nextBatchStartDate, setNextBatchStartDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [softwares, setSoftwares] = useState([]);
  const [softwaresList, setSoftwaresList] = useState([]);
  const [avgCtc,setAvgCtc] = useState(null);
  const [isDemoAvailable,setIsDemoAvailable] = useState(false);
  const [isClubCourse,setIsClubCourse] = useState(false);
  const [courseEnabled,setCourseEnabled] = useState(true);
  const [isCourseLoading,setIsCourseLoading]  = useState(true);
  const [IsMentorLoading,setIsMentorLoading] = useState(true);
  const [mentors,setMentors] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [difficulty,setDifficulty] = useState("");
  const [mode,setMode] = useState("");
  const [assignments,setAssignments] = useState("");
  const [hiredBy,setHiredBy] = useState("");
  const [thisCourseIsFor, setThisCourseIsFor] = useState([{ id: 1, description: '' }]);

  const fetchSoftwares = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/softwares/getSoftwares`);
      const softwareOptions = response.data.softwares.map(software => ({
        value: software.softwareName,
        label: software.softwareName,
      }));

      setSoftwaresList(softwareOptions);
      setIsLoading(false)
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

  const fetchCourseById = async () => {
    try {
        const response = await axios.put(`${API_BASE_URL}/courses/getCourseById/${courseId}`);
        const course = response?.data?.course;

        const parentCourse = parentCourses.find(parentCourse => parentCourse._id === course?.parentCourseId);
        if (parentCourse) {
            setSelectedParentCourse({ id: parentCourse._id, name: parentCourse.parentCourseName });
        } else {
            console.error('Parent Course not found for the course.');
        }

        if (course) {
            setCourseName(course?.courseName);
            setDuration(course?.duration)
            setDescription(course?.description);
            setModulepoints(course.modules) ;
            if (course.thumbnail) decodeBase64Image(course.thumbnail, setFile);
            setNextBatchStartDate(new Date(course?.nextBatchStartDate));
            setSoftwares(course?.softwares.map(software => ({
                value: software,
                label: software,
              })));
            setMentors(course?.mentors.map(mentor => ({
                value: mentor,
                label: mentor,
              })));
            setAvgCtc(course?.avgCtc);
            setIsDemoAvailable(course?.isDemoAvailable);
            setIsClubCourse(course?.isClubCourse);
            setSections(course?.others);
            setCourseEnabled(course.courseEnabled);
            setIsCourseLoading(false);
            setDifficulty(course?.difficulty);
            setMode(course?.mode);
            setAssignments(course?.assignments);
            setHiredBy(course?.hiredBy);
            setThisCourseIsFor(course?.thisCourseIsFor);
        } else {
            console.error('Course data not found!');
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to fetch course.');
    }
};

// Decode base64 images
const decodeBase64Image = (base64Image, setFileFunction) => {
    try {
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

        const byteCharacters = atob(base64Image);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, Math.min(offset + 1024, byteCharacters.length));
            const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i));
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: mimeType });
        const file = new File([blob], `image.${mimeType.split("/")[1]}`, { type: mimeType });
        setFileFunction(file);
    } catch (error) {
        console.error("Error decoding base64 image:", error);
    }
};

  useEffect(() => {
    fetchSoftwares();
    fetchCourseById();
    fetchMentors();
  }, [])

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


  const addNewSection = () => {
    setSections([...sections, { id: sections.length + 1, points: [{ id: 1 }] }]);
  };

  const removeSection = (id) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== id));
  };

  const moveSection = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);
    setSections(updatedSections);
  };


  const addNewPoint = (sectionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, points: [...section.points, { id: section.points.length + 1 }] }
        : section
    ));
  };

  const removePoint = (sectionId, pointId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, points: section.points.filter(point => point.id !== pointId) }
        : section
    ));
  };

  const updateSectionName = (sectionId, sectionName) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, sectionName }
          : section
      )
    );
  };

  const updatePointTitle = (sectionId, pointId, title) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            points: section.points.map((point) =>
              point.id === pointId
                ? { ...point, title }
                : point
            ),
          }
          : section
      )
    );
  };

  const updatePointDescription = (sectionId, pointId, description) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            points: section.points.map((point) =>
              point.id === pointId
                ? { ...point, description }
                : point
            ),
          }
          : section
      )
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.index === destination.index) return;

    moveSection(source.index, destination.index);
  };

  const addNewModulepoint = () => {
    setModulepoints([...modulepoints, { id: modulepoints.length + 1, title: '', description: '' }]);
  };

  const removeModulepoint = (id) => {
    setModulepoints((prevModulepoints) => prevModulepoints.filter((modulepoint) => modulepoint.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setModulepoints((prevModulepoints) =>
      prevModulepoints.map((modulepoint) =>
        modulepoint.id === id ? { ...modulepoint, [field]: value } : modulepoint
      )
    );
  };

  const addNewIsForpoint = () => {
    setThisCourseIsFor([...thisCourseIsFor, { id: thisCourseIsFor.length + 1, description: '' }]);
  };

  const removeIsForpoint = (id) => {
    setThisCourseIsFor((prevIsForpoints) => prevIsForpoints.filter((isFor) => isFor.id !== id));
  };

  const handleInputIsForChange = (id, field, value) => {
    setThisCourseIsFor((prevIsForpoints) =>
      prevIsForpoints.map((isFor) =>
        isFor.id === id ? { ...isFor, [field]: value } : isFor
      )
    );
  };



  const handleUploadClick = async () => {
    setIsLoading(true);
    const filteredModulepoints = modulepoints.filter(item => item.title && item.description);
    const filteredIsForpoints = thisCourseIsFor.filter(item => item.description);
    const filteredSections = sections.map((item, index) => {
      if (item.sectionName) {
        const filteredPoints = item.points.filter(point => point.title && point.description);
        if (filteredPoints.length > 0) {
          return {
            ...item,
            points: filteredPoints
          };
        }
      }
      // If the item does not match any of the criteria, return the item unchanged.
      return null; // You can return `null` to exclude or just `item` to keep it.
    }).filter(item => item !== null);
    if (!courseName || !description || !file || !selectedParentCourse.id || !duration || softwares.length === 0 
      || mentors.length === 0 || !nextBatchStartDate || !avgCtc || filteredModulepoints.length === 0
      || filteredIsForpoints.length === 0 || !difficulty || !mode || !assignments || !hiredBy) {
      setIsLoading(false);
      return toast.warn('Please fill out all required fields or required images.');
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const data = {
        courseName: courseName,
        description: description,
        thumbnail: reader.result,
        duration: duration,
        nextBatchStartDate: nextBatchStartDate,
        difficulty:difficulty,
        mode:mode,
        assignments:assignments,
        hiredBy:hiredBy,
        thisCourseIsFor:filteredIsForpoints,
        softwares:softwares.map(option => option.value),
        mentors:mentors.map(option => option.value),
        avgCtc:avgCtc,
        isDemoAvailable:isDemoAvailable,
        isClubCourse:isClubCourse,
        modules: filteredModulepoints,
        others: filteredSections,
        parentCourseId: selectedParentCourse.id,
        courseEnabled: courseEnabled,
        userId: userId
      };

      try {
        const endpoint = `${API_BASE_URL}/courses/updateCourse/${courseId}`;

        const response = await axios.post(endpoint, data, {
          headers: { 'Content-Type': 'application/json' }
        });

        setSelectedParentCourse("");
        setFile(null);
        setDragging(false);
        setSections([]);
        setModulepoints([{ id: 1, title: '', description: '' }]);
        setCourseName("");
        setDescription("");
        setNextBatchStartDate("");
        toast.success('Course added successfully!');
        setTimeout(() => {
          navigate('/course', { state: { courses: courses.map(course => 
            course._id === courseId ? { ...course, ...response?.data.course } : course
        ), parentCourses: parentCourses, addCourse: true } });
        }, 500)

      } catch (error) {
        console.error('Error uploading course:', error);
        toast.error('Failed to upload course.');
      } finally {
        setIsLoading(false);
      }
    };

    // Start reading the first file
    reader.readAsDataURL(file);


  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date) => {
    setNextBatchStartDate(date);
    setIsCalendarOpen(false); // Close the calendar after date selection
  };

  const formatIndianNumber = (value) => {
    if (!value) return "";
    const x = value.replace(/,/g, ""); // Remove existing commas
    const lastThree = x.slice(-3);
    const otherNumbers = x.slice(0, -3);
    const formattedValue =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
    return formattedValue;
  };

  const handleInputThousandChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
    if (!isNaN(rawValue)) {
      setAvgCtc(rawValue);
    }
  };



  return (
    <>
      {actionRoles?.actions?.permission ?
        isLoading || isCourseLoading || IsMentorLoading?
          <div className='w-full h-100 flex justify-center items-center bg-cardBg card-shadow rounded-lg'>
            <i className="loader" />
          </div>

          :
          <div className={`relative w-full bg-cardBg card-shadow flex flex-col rounded-lg px-3 py-4 gap-4`}>
            <span className="text-lg font-semibold">Add Course</span>
            <div className="grid grid-cols-12 items-center justify-between gap-x-3 gap-y-4">
              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label className="text-md font-semibold required" htmlFor="parentCourse">Select Parent Course</label>
                <Listbox value={selectedParentCourse} onChange={setSelectedParentCourse}>
                  <div className="relative">
                    <ListboxButton
                      id="parentCourse"
                      className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-1.5 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                    >
                      <span className="flex items-center h-5">
                        {selectedParentCourse?.name || 'Select Parent Course'}
                      </span>
                    </ListboxButton>

                    <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {parentCourses?.map((parentCourse) => (
                        <ListboxOption
                          key={parentCourse._id}
                          value={{ id: parentCourse._id, name: parentCourse.parentCourseName }}
                          className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                        >
                          {parentCourse.parentCourseName.replace(/-/g, ' ')}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>



              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label className="gap-2 text-md font-semibold required" htmlFor="courseName" >Course Name</label>
                <input id="courseName" value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                  type="text"
                  placeholder="Enter your Course Name" />
              </div>

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
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

              <div className="flex flex-col gap-2 col-span-12 md:col-span-12 lg:col-span-8 h-full">
                <label className="gap-2 text-md font-semibold required" htmlFor="description" >Course Description</label>
                <textarea id="description" value={description}
                  onChange={(e) => setDescription(e.target.value)} className="font-input-style text-sm min-h-40 min-w-0 flex-1 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText" placeholder="Enter Course Description" />
              </div>

              <div className="col-span-12 lg:col-span-4 uploader-container flex gap-2 flex-col">
                <label className="text-md font-semibold required">Course Thumbnail</label>
                <div
                  className={`upload-box w-full min-h-50 border-2 border-dashed rounded-lg flex justify-center items-center bg-mainBg ${dragging ? 'dragging' : ''}`}
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
                        className="h-full max-h-65 w-full object-cover object-center rounded-lg"
                      />
                      <span className="absolute bottom-0 rounded-b-lg w-full bg-gradient-to-t from-accent to-accent/0 text-cardBg text-center px-2 pt-3 pb-1 bg-">{file.name}</span>
                    </div>
                  ) : (
                    <div className="upload-prompt flex flex-col items-center text-secondaryText">
                      <UploadIcon width={24} height={24} fill={'none'} />
                      <div className="flex flex-col items-center mt-3">
                        <span className="text-sm text-secondaryText">Drag and drop</span>
                        <span className="text-sm text-secondaryText font-semibold">or</span>
                        <label className="text-sm text-accent font-semibold">
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

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label className="gap-2 text-md font-semibold required" htmlFor="nextBatchStartDate">
                  Next Batch Start Date
                </label>
                <div
                  className="border rounded-md p-2 cursor-pointer bg-white text-gray-700"
                  onClick={toggleCalendar}
                >
                  {nextBatchStartDate ? nextBatchStartDate.toDateString() : 'Select a date'}
                </div>
                {isCalendarOpen && (
                  <Calendar
                    onChange={handleDateChange}
                    tileDisabled={({ date }) => date < new Date()} // Disable past dates
                    value={nextBatchStartDate}
                    className="react-calendar mt-2"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label htmlFor="softwares" className="block text-sm font-semibold required">
                  Select Softwares
                </label>
                <Select
                  isMulti
                  name="softwaresList"
                  placeholder="Select Softwares"
                  options={softwaresList}
                  value={softwares}
                  onChange={(selected) => setSoftwares(selected)}
                  className="basic-multi-select text-md"
                  classNamePrefix="select"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label htmlFor="mentors" className="block text-sm font-semibold required">
                  Select Mentors
                </label>
                <Select
                  isMulti
                  name="mentorsList"
                  placeholder="Select Mentors"
                  options={mentorsList}
                  value={mentors}
                  onChange={(selected) => setMentors(selected)}
                  className="basic-multi-select text-md"
                  classNamePrefix="select"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                <label
                  className="gap-2 text-md font-semibold required"
                  htmlFor="avgCtc"
                >
                  Average Annual CTC
                </label>
                <input
                  id="avgCtc"
                  value={formatIndianNumber(avgCtc)} // Format the value on display
                  onChange={handleInputThousandChange}
                  className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                  type="text"
                  placeholder="Enter your Average Annual CTC"
                />
              </div>

              <div className="flex flex-col items-center gap-2 col-span-12 md:col-span-6 lg:col-span-4">
              <label className="text-md  font-semibold flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isDemoAvailable}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        onChange={() => setIsDemoAvailable(!isDemoAvailable)}
                    />
                    <span className="font-semibold text-md">Is Demo Available For This Course ?</span>
                </label>
              </div>

              <div className="flex flex-col items-center gap-2 col-span-12 md:col-span-6 lg:col-span-4">
              <label className="text-md font-semibold flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isClubCourse}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        onChange={() => setIsClubCourse(!isClubCourse)}
                    />
                    <span className="font-semibold text-md">Is This Club Course ?</span>
                </label>
              </div>

              <div className="flex flex-col gap-2 col-span-12 md:col-span-6 ">
                              <label className="text-md font-semibold required" htmlFor="parentCourse">Difficulty</label>
                              <Listbox value={difficulty} onChange={setDifficulty}>
                                <div className="relative">
                                  <ListboxButton
                                    id="duration"
                                    className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-1.5 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                  >
                                    <span className="flex items-center h-5">
                                      {difficulty || 'Select Difficulty'}
                                    </span>
                                  </ListboxButton>
              
                                  <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <ListboxOption
                                        
                                        value="Beginner"
                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                      >
                                        Beginner
                                      </ListboxOption>
                                      <ListboxOption
                                        
                                        value="Intermediate"
                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                      >
                                        Intermediate
                                      </ListboxOption>
                                      <ListboxOption
                                        
                                        value="Advanced"
                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                      >
                                        Advanced
                                      </ListboxOption>
                                  </ListboxOptions>
                                </div>
                              </Listbox>
                            </div>
              
                            <div className="flex flex-col gap-2 col-span-12 md:col-span-6">
                              <label className="text-md font-semibold required" htmlFor="parentCourse">Course Mode</label>
                              <Listbox value={mode} onChange={setMode}>
                                <div className="relative">
                                  <ListboxButton
                                    id="duration"
                                    className="relative w-full cursor-default font-input-style text-sm rounded-lg px-3 py-1.5 bg-mainBg placeholder:text-secondaryText focus:ring-1 focus:outline-accent focus:ring-accent"
                                  >
                                    <span className="flex items-center h-5">
                                      {mode || 'Select Course Mode'}
                                    </span>
                                  </ListboxButton>
              
                                  <ListboxOptions className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg bg-white py-2 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <ListboxOption
                                        value="Online"
                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                      >
                                        Online
                                      </ListboxOption>
                                      <ListboxOption
                                        value="Offline"
                                        className="group relative cursor-default select-none text-sm rounded-md py-2 px-2 text-gray-900 data-[focus]:bg-lightRed data-[focus]:text-white"
                                      >
                                        Offline
                                      </ListboxOption>
                                  </ListboxOptions>
                                </div>
                              </Listbox>
                            </div>
              
                            <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                              <label className="gap-2 text-md font-semibold required" htmlFor="courseName" >Assignments</label>
                              <input id="assignments" value={assignments}
                                onChange={(e) => setAssignments(e.target.value)}
                                className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                type="text"
                                placeholder="Enter your Assignments" />
                            </div>
              
                            <div className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4">
                              <label className="gap-2 text-md font-semibold required" htmlFor="courseName" >Hired By</label>
                              <input id="hiredBy" value={hiredBy}
                                onChange={(e) => setHiredBy(e.target.value)}
                                className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                type="text"
                                placeholder="Enter your Hired By Agencies" />
                            </div>

            </div>
            
            <div className="relative col-span-12 border-2 flex flex-col rounded-lg px-4 py-4">
                          <div className="relative w-full flex items-center justify-between rounded-lg gap-2">
                            <span className="text-lg font-bold text-accent required">This Course is For</span>
                          </div>
            
                          <div className="transition-all duration-300 overflow-hidden flex flex-col items-center justify-between gap-x-3 gap-y-4 mt-1">
                            <div className="w-full grid grid-cols-12 gap-x-3 gap-y-4">
                            </div>
            
                            <div className="point-list-style w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                              {thisCourseIsFor.map((idFor) => (
                                <div key={idFor.id} className="flex flex-col relative gap-3 p-3 border-2 rounded-lg">
                                  <button onClick={() => removeIsForpoint(idFor.id)} className="absolute top-2 right-2">
                                    <FaPlus className="rotate-45" size={18} fill={"#f05f23"} />
                                  </button>
                                  <div className="w-full flex flex-col gap-1.5">
                
                                    <textarea
                                      id={`PointDescription-${idFor.id}`}
                                      className="font-input-style text-sm min-h-20 min-w-0 flex-1 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                      placeholder="Enter Point Description"
                                      value={idFor.description}
                                      onChange={(e) => handleInputIsForChange(idFor.id, 'description', e.target.value)}
                                    />
                                  </div>
                                </div>
                              ))}
                              <div onClick={addNewIsForpoint} className="flex relative gap-2 items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer">
                                <FaPlus size={18} fill={"#f05f23"} />
                                <span className="text-accent font-semibold">Add New Point</span>
                              </div>
                            </div>
            
                          </div>
                        </div>


            <div className="relative col-span-12 border-2 flex flex-col rounded-lg px-4 py-4">
              <div className="relative w-full flex items-center justify-between rounded-lg gap-2">
                <span className="text-lg font-bold text-accent required">Modules Of {courseName}?</span>
              </div>

              <div className="transition-all duration-300 overflow-hidden flex flex-col items-center justify-between gap-x-3 gap-y-4 mt-3">
                <div className="w-full grid grid-cols-12 gap-x-3 gap-y-4">
                </div>

                <div className="point-list-style w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {modulepoints.map((modulepoint) => (
                    <div key={modulepoint.id} className="flex flex-col relative gap-3 p-3 border-2 rounded-lg">
                      <button onClick={() => removeModulepoint(modulepoint.id)} className="absolute top-2 right-2">
                        <FaPlus className="rotate-45" size={18} fill={"#f05f23"} />
                      </button>
                      <div className="w-full flex flex-col gap-1.5">
                        <label className="gap-2 text-md font-semibold" htmlFor={`PointTitle-${modulepoint.id}`}>
                          Module Title
                        </label>
                        <input
                          id={`PointTitle-${modulepoint.id}`}
                          className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                          type="text"
                          placeholder="Enter Module Title"
                          value={modulepoint.title}
                          onChange={(e) => handleInputChange(modulepoint.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="w-full flex flex-col gap-1.5">
                        <label className="gap-2 text-md font-semibold" htmlFor={`PointDescription-${modulepoint.id}`}>
                          Module Description
                        </label>
                        <textarea
                          id={`PointDescription-${modulepoint.id}`}
                          className="font-input-style text-sm min-h-20 min-w-0 flex-1 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                          placeholder="Enter Module Description"
                          value={modulepoint.description}
                          onChange={(e) => handleInputChange(modulepoint.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <div onClick={addNewModulepoint} className="flex relative gap-2 items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer">
                    <FaPlus size={18} fill={"#f05f23"} />
                    <span className="text-accent font-semibold">Add Module</span>
                  </div>
                </div>

              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={sections} direction="vertical">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative col-span-12 border-2 flex flex-col rounded-lg px-4 py-4"
                          >
                            <div className="relative w-full flex items-center justify-between rounded-lg gap-2">
                              <span className="text-lg font-bold text-accent">Section Form</span>
                              <button onClick={() => removeSection(section.id)}>
                                <FaPlus className="rotate-45" size={18} fill={"#f05f23"} />
                              </button>
                            </div>

                            <div className="transition-all duration-300 overflow-hidden flex flex-col items-center justify-between gap-x-3 gap-y-4 mt-3">
                              <div className="w-full grid grid-cols-12 gap-x-3 gap-y-4">
                                <div className="flex flex-col gap-2 col-span-12 md:col-span-6">
                                  <label
                                    className="gap-2 text-md font-semibold"
                                    htmlFor={`sectionName-${section.id}`}
                                  >
                                    Section Name
                                  </label>
                                  <input
                                    id={`sectionName-${section.id}`}
                                    className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                    type="text"
                                    placeholder="Enter your Section Name"
                                    value={section.sectionName || ""}
                                    onChange={(e) => updateSectionName(section.id, e.target.value)}
                                  />
                                </div>

                              </div>
                              <div className="point-list-style w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {section.points.map((point) => (
                                  <div
                                    key={point.id}
                                    className="flex flex-col relative gap-3 p-3 border-2 rounded-lg"
                                  >
                                    <button
                                      onClick={() => removePoint(section.id, point.id)}
                                      className="absolute top-2 right-2"
                                    >
                                      <FaPlus className="rotate-45" size={18} fill={"#f05f23"} />
                                    </button>
                                    <div className="w-full flex flex-col gap-1.5">
                                      <label
                                        className="gap-2 text-md font-semibold"
                                        htmlFor={`PointTitle-${point.id}`}
                                      >
                                        Point Title
                                      </label>
                                      <input
                                        id={`PointTitle-${point.id}`}
                                        className="font-input-style text-sm min-w-0 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                        type="text"
                                        placeholder="Enter your Point Title"
                                        value={point.title || ""}
                                        onChange={(e) =>
                                          updatePointTitle(section.id, point.id, e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="w-full flex flex-col gap-1.5">
                                      <label
                                        className="gap-2 text-md font-semibold"
                                        htmlFor={`PointDescription-${point.id}`}
                                      >
                                        Point Description
                                      </label>
                                      <textarea
                                        id={`PointDescription-${point.id}`}
                                        className="font-input-style text-sm min-h-20 min-w-0 flex-1 rounded-lg px-3 py-2 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                        placeholder="Enter Point Description"
                                        value={point.description || ""}
                                        onChange={(e) =>
                                          updatePointDescription(
                                            section.id,
                                            point.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                                <div
                                  onClick={() => addNewPoint(section.id)}
                                  className="flex relative gap-2 items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer"
                                >
                                  <FaPlus size={18} fill={"#f05f23"} />
                                  <span className="text-accent font-semibold">Add Point</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <button
              onClick={addNewSection}
              className="col-span-12 border-2 flex items-center justify-center rounded-lg px-4 py-2 gap-3"
            >
              <FaPlus size={16} fill={"#f05f23"} />
              <span className="text-lg font-bold text-accent">Add Section</span>
            </button>



            <button onClick={handleUploadClick} className="bg-accent hover:bg-accent/70 px-6 py-1.5 w-fit text-sm font-semibold text-cardBg rounded-lg">Submit</button>

          </div>
        : <AccessDenied />}
      <ToastContainer />
    </>
  )
}

export default EditCourse;