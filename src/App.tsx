// App.tsx


import {  Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
import InstructionPage from './pages/NextPage/InstructionPage';
import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Login/LoginPage';
import DegreeInformation from './pages/DegreeInformation.tsx/DegreeInformation';

function App() {
  return (
    <SnackbarProvider>
      
        <Routes>
          <Route path="/" element={<Layout isLoggedIn={false} isHomePage={true}><RequiredDocuments /></Layout>} />
          <Route path="/instruction_page" element={<Layout isLoggedIn={false} isHomePage={false}><InstructionPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/degree_information' element={<DegreeInformation/>}/>
        </Routes>
     
    </SnackbarProvider>
  );
}

export default App;