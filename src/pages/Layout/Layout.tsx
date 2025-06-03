import React from 'react';
import Main from "../../components/Main/Main";
import Navbar from '../../components/Navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  isHomePage: boolean;
  isLoggedIn: boolean; // Add isLoggedIn prop
  profileImage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, isHomePage, isLoggedIn, profileImage }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} isHomePage={isHomePage} profileImage={profileImage} /> {/* Pass isLoggedIn to Navbar */}
      <Main>
        {children}
      </Main>
    </div>
  );
};

export default Layout;