import React from 'react';
import { Footer } from '../section/Footer';
import Header from '../section/Header';
import { loginImg } from '../assets';
import { Link, useNavigate } from 'react-router-dom';
import { ShowPasswordIcon } from '../components/Icons/ShowPasswordIcon';

const SignUp = () => {

    const navigate = useNavigate();

    const handleLogInClick = () => {
        navigate('/banner');
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
                        <form className="flex-1 flex flex-col h-full items-center justify-center lg:max-w-[550px] bg-cardBg rounded-lg card-shadow p-5 gap-8">
                            <div className="w-full max-w-[400px] lg:max-w-none flex flex-col">
                                <h2 className="text-xxl font-bold text-accent w-full">Sign Up</h2>
                                <p className="text-md text-secondaryText mt-2 w-full">Enter your email and password to Login</p>
                            </div>

                            <div className="w-full items-center justify-between grid grid-cols-1 gap-6 max-w-[400px] lg:max-w-none">

                                <div className="flex flex-col">
                                    <input id="Username" className="font-input-style text-md min-w-0 rounded-lg px-3 py-3 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="text" placeholder="Enter your Username" />
                                </div>
                                <div className="flex flex-col">
                                    <input id="email" className="font-input-style text-md min-w-0 rounded-lg px-3 py-3 focus:outline-accent bg-mainBg placeholder:text-secondaryText" type="email" placeholder="Enter your Email" />
                                </div>
                                <div className="focus-within:outline-1 focus-within:outline-accent bg-mainBg flex items-center justify-between px-3 py-3 rounded-lg">
                                    <input id="password" className="font-input-style flex-1 me-2 text-md min-w-0 focus:outline-none bg-mainBg placeholder:text-secondaryText" type="password" placeholder="Enter your First Name" />
                                    <ShowPasswordIcon width={16} height={16} fill={"none"} />
                                </div>
                                <div className="focus-within:outline-1 focus-within:outline-accent bg-mainBg flex items-center justify-between px-3 py-3 rounded-lg">
                                    <input id="Confirm-Password" className="font-input-style flex-1 me-2 text-md min-w-0 focus:outline-none bg-mainBg placeholder:text-secondaryText" type="Password" placeholder="Re-Enter your Password" />
                                    <ShowPasswordIcon width={16} height={16} fill={"none"} />
                                </div>
                                <div className="flex justify-between items-end gap-3">
                                    <button onClick={handleLogInClick} className="bg-accent w-full h-fit hover:bg-accent/70 px-3 py-3 text-md font-semibold text-cardBg rounded-lg">Sign Up</button>
                                </div>
                            </div>

                            <span className="text-md">Already have an account ? <Link to={'/login'} className="text-md font-bold text-accent hover:text-accent/70 hover:underline">Login</Link></span>


                        </form>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default SignUp;
