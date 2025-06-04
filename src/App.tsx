

import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Login/LoginPage';
import DegreeInformation from './pages/DegreeInformation.tsx/BachelorDegreeInformation';
import InstructionPage from './pages/InstructionPage.tsx/InstructionPage';

function App() {
  return (
    <SnackbarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
  
          <Route path="/" element={<RequiredDocuments />} />
          <Route path="required_documents" element={<RequiredDocuments />} />
          <Route path="instruction_page" element={<InstructionPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="degree_information" element={<DegreeInformation />} />
        </Route>
      </Routes>
    </SnackbarProvider>
  );
}

export default App;