import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Registration/RegistrationPage';
import InstructionPage from './pages/InstructionPage.tsx/InstructionPage';
import InformationRoutes from './components/Routes/InformationRoutes';
import ApplicationStatusPage from './pages/ApplicationStatus/ApplicationStatusPage';
import DetailPage from './pages/DetailPage/DetailApplication';



function App() {
  return (
    <SnackbarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RequiredDocuments />} /> {/* Ana sayfa */}
          <Route path="required_documents" element={<RequiredDocuments />} />
          <Route path="instruction_page" element={<InstructionPage />} />
          <Route path="application-status" element={<ApplicationStatusPage />} />
          {/* <Route path="detail/:id" element={<DetailPage />} />  */}
        </Route>
       

        <Route path="infos/*" element={<InformationRoutes />} /> {/* infos/ sonrası için */}
          <Route path="detail/:id" element={<DetailPage />} /> 
      </Routes>
    </SnackbarProvider>
  );
}

export default App;