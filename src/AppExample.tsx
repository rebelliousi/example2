import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Login/LoginPage';
import InstructionPage from './pages/InstructionPage.tsx/InstructionPage';
import InformationRoutes from './components/Routes/InformationRoutes';
import ApplicationStatusPage from './pages/ApplicationStatus/ApplicationStatusPage';

function App() {
  return (
    <SnackbarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RequiredDocuments />} /> {/* Ana sayfa */}
          <Route path="required_documents" element={<RequiredDocuments />} />
          <Route path="instruction_page" element={<InstructionPage />} />
          <Route path='application-status' element={<ApplicationStatusPage/>}/>
              </Route>
          <Route path="login" element={<LoginPage />} />
      
          <Route path="infos/*" element={<InformationRoutes />} /> {/* infos/ sonrası için */}
     
      </Routes>
    </SnackbarProvider>
  );
}

export default App;