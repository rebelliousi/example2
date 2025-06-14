// Navbar.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../public/img/logo 1.png';
import profile from '../../../public/img/image.png';
import Button from '../Buttons/Button';
import { Avatar } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/loginModalStore'; // Corrected path

const Navbar: React.FC = () => {
    const [profileModal, setProfileModal] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn, logout } = useAuthStore();
    const { openLoginModal } = useModalStore();

    const handleLogOut = useCallback(() => {
        logout();
        openLoginModal();
        localStorage.removeItem('redirectAfterLogin'); // Clear stored path
    }, [logout, openLoginModal]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setProfileModal(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleProfileClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setProfileModal((prev) => !prev);
    };

    const handleLoginClick = (event: React.MouseEvent) => {
        event.preventDefault();
        openLoginModal();
    };

    return (
        <nav className={`fixed top-0 left-0 right-0  bg-white `}>
            <div className="container mx-auto py-4 flex items-center justify-between">
                <div className="flex items-center justify-center space-x-1">
                    <img src={logo} alt="" className='w-10' />
                    <h1 className='text-[#4570EA] text-lg'>TITU</h1>
                </div>
                <div className="text-right flex items-center relative">

                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center mr-4">
                                <button onClick={handleProfileClick} className="relative">
                                    <Avatar
                                        alt="User Avatar"
                                        src={`${profile}`}
                                        sx={{
                                            width: 35,
                                            height: 35,
                                        }}
                                    />
                                </button>
                            </div>

                            {profileModal && (
                                <div
                                    ref={dropdownRef}
                                    className={`absolute shadow-lg right-0 top-10 w-[230px] pb-4 table-content bg-white rounded-md transition-all duration-500 ease-in-out
                ${profileModal ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                                >
                                    <div className="px-5 pt-3 text-center flex  flex-col items-center text-primaryText">
                                        <div className="flex py-2 items-center">
                                            <Avatar
                                                alt="User Avatar"
                                                src={`${profile}`}
                                                sx={{ width: 60, height: 60 }}
                                            />
                                        </div>

                                        <div className='space-y-2'>
                                            <h1 className="text-black font-semibold">Aman Amanow</h1>
                                            <p className="text-sm text-gray-400">amanow@gmail.com</p>

                                        </div>

                                        <Button
                                            onClick={handleLogOut}
                                            className="w-full mt-4 h-10"
                                            variant="outline"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="#" onClick={handleLoginClick} className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;