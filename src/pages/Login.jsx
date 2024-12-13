import React,{useState} from 'react';
import { Footer } from '../section/Footer';
import Header from '../section/Header';
import { loginImg } from '../assets';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'; // Import axios
import { API_BASE_URL } from '../config/constant.js';
import { ShowPasswordIcon } from '../components/Icons/ShowPasswordIcon';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogInClick = async () => {
        if (!email || !password ) {
            toast.error('Please fill out all required fields.');
            return;
        }
        const data = {
            email,
            password,
        };
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                localStorage.setItem("auth-token", response.data.token);
                toast.success('Account created successfully');
                navigate('/'); 
                // Redirect to home or login page
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <>
            <div className="w-full lg:w-auto lg:h-screen lg:overflow-y-auto text-primaryText flex-1 flex flex-col gap-4">
                <Header />
                <div className="flex-1 container px-4 flex flex-col gap-4 mb-3">
                    <div className="flex-1 flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 flex items-center justify-center bg-cardBg rounded-lg card-shadow p-5 gap-5">
                            <img className="w-full max-w-[500px]" src={loginImg} alt="Login Image" />
                        </div>
                        <div className="flex-1 flex flex-col h-full items-center justify-center lg:max-w-[550px] bg-cardBg rounded-lg card-shadow p-5 gap-8">
                            <div className="w-full max-w-[400px] lg:max-w-none flex flex-col">
                                <h2 className="text-xxl font-bold text-accent w-full">Login</h2>
                                <p className="text-md text-secondaryText mt-2 w-full">Enter your email and password to Login</p>
                            </div>

                            <div className="w-full items-center justify-between grid grid-cols-1 gap-6 max-w-[400px] lg:max-w-none">

                            <div className="flex flex-col">
                                    <label htmlFor="userEmail" className="block mb-1 text-md font-semibold required">
                                        User Email
                                    </label>
                                    <input
                                        id="email"
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="font-input-style text-md min-w-0 rounded-lg px-3 py-3 focus:outline-accent bg-mainBg placeholder:text-secondaryText"
                                        type="email"
                                        placeholder="Enter your Email"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="password" className="block mb-1 text-md font-semibold required">
                                        Password
                                    </label>
                                    <div className="flex items-center bg-mainBg rounded-lg px-3 py-3 focus-within:outline focus-within:outline-accent">
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
                                <div className="flex justify-between items-end gap-3">
                                    <button onClick={handleLogInClick} className="bg-accent w-full h-fit hover:bg-accent/70 px-3 py-3 text-md font-semibold text-cardBg rounded-lg">Login</button>
                                </div>
                            </div>

                                {/* <span className="text-md">Don’t have an account ? <Link to={'/sign-up'} className="text-md font-bold text-accent hover:text-accent/70 hover:underline">Sign up</Link></span> */}
                                

                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
