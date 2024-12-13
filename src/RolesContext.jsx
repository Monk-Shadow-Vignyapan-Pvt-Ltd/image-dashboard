import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config/constant';
import { LoaderAnime } from './components/LoaderAnime';

export const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
    const [userRoles, setUserRoles] = useState([]);
    const [userId, setUserID] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            let token = localStorage.getItem('auth-token');
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/auth/getUser`,
                    { headers: { 'x-auth-token': token } }
                );
                setUserRoles(response.data.roles);
                setUserID(response.data.id);
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false); // Ensure loading completes
            }
        };

        fetchRoles();
    }, []);

    if (isLoading) {
        return <LoaderAnime />; // Render the loader while loading
    }

    return (
        <RolesContext.Provider value={{ userRoles, userId, users }}>
            {children}
        </RolesContext.Provider>
    );
};

export const useRoles = () => {
    return useContext(RolesContext);
};
