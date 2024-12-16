import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './pages/Layout'
import Home from './pages/Home'
import FormPage from './pages/FormPage'
import WizardForm from './components/WizardForm'
import Login from './pages/Login'
import Users from './pages/Users'
import Testimonial from './pages/Testimonial'
import Faq from "./pages/Faq"
import ContactFollowUp from './pages/ContactFollowUp';
import SeoFriendly from './pages/SeoFriendly';
import { RolesProvider } from './RolesContext';
import Software from './pages/Software';
import Mentor from './pages/Mentor';
import Placement from './pages/Placement';
import Career from './pages/Career';
import ParentCourse from './pages/ParentCourse';
import Course from './pages/Course';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import DemoMaster from './pages/DemoMaster';
import Blog from './pages/Blog';
import StudentsPlaced from './pages/studentsPlaced';


function App() {
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute >
          <RolesProvider>
          <Layout />
          </RolesProvider>
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: 'form-page', element: <FormPage /> },
        { path: 'wizard-form', element: <WizardForm /> },
        { path: 'testimonial', element: <Testimonial /> },
        { path: 'faq', element: <Faq /> },
        { path: 'contact', element: <Home /> },
        { path: '/users',element: <Users />,},
        { path: '/contact-followup',element: <ContactFollowUp />,},
        { path: '/seo-friendly',element: <SeoFriendly />,},
        { path: '/software',element: <Software />,},
        { path: '/mentor',element: <Mentor />,},
        { path: '/placement',element: <Placement />,},
        { path: '/career',element: <Career />,},
        { path: '/parentCourse',element: <ParentCourse />,},
        { path: '/course',element: <Course />,},
        { path: '/add-course',element: <AddCourse />,},
        { path: '/edit-course/:courseId', element: <EditCourse /> },
        { path: '/demo-master', element: <DemoMaster /> },
        { path: '/testimonial', element: <Testimonial /> },
        { path: '/blog', element: <Blog /> },
        { path: '/student-placed', element: <StudentsPlaced /> },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
