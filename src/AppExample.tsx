import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';

import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Login/LoginPage';
import DegreeInformation from './pages/DegreeInformation.tsx/DegreeInformation';
import NextPage from './pages/NextPage/InstructionPage';
import { useCheckAuth } from './store/useAuthStore';


function App() {
  useCheckAuth(); // Run the initial auth check
  return (
    <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Layout isHomePage={true} isLoggedIn={false}><RequiredDocuments /></Layout>} />
          <Route path="/instruction_page" element={<Layout isHomePage={false} isLoggedIn={false}><NextPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/degree_information' element={<DegreeInformation/>}/>
        </Routes>
    </SnackbarProvider>
  );
}

export default App;