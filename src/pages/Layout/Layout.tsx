// Layout.tsx
import React from 'react';
import Main from "../../components/Main/Main";
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import LoginPage from '../Registration/RegistrationPage';
import { useModalStore } from '../../store/loginModalStore';


const Layout: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal } = useModalStore(); // Access Zustand store

    return (
        <div>
            <Navbar />
            <Main>
                <Outlet />
            </Main>

            {isLoginModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="">
                        {/* LoginPage component, passing the closeModal function */}
                        <LoginPage closeModal={closeLoginModal} />
                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;