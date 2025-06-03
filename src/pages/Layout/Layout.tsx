// pages/Layout/Layout.tsx

import React, {useCallback,} from 'react';
import {  useNavigate } from "react-router-dom";
import Main from "../../components/Main/Main";
import Navbar from '../../components/Navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  isHomePage: boolean;
  isLoggedIn: boolean;
  profileImage?: string;

}

const Layout: React.FC<LayoutProps> = ({ children, isHomePage, isLoggedIn, profileImage, }) => {
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        navigate('/login', { replace: true }); 
    }, [navigate]);

    return (
        <div>
            <Navbar
                isHomePage={isHomePage}
                isLoggedIn={isLoggedIn}
                profileImage={profileImage}
                onLogout={handleLogout}
            />
            <Main>
                {children}
            </Main>
        </div>
    );
};

export default Layout;