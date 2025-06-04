import React from 'react';
import Main from "../../components/Main/Main";
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';


const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Main>
     <Outlet/>
      </Main>
    </div>
  );
};

export default Layout;