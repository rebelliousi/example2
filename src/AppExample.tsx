// import React from 'react';
// import {  Route, Routes } from 'react-router-dom';
// import Layout from './pages/Layout/Layout';
// import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';

// import SnackbarProvider from './components/Snackbar/SnackBarProvider';
// import LoginPage from './pages/Login/LoginPage';
// import DegreeInformation from './pages/DegreeInformation.tsx/DegreeInformation';
// import NextPage from './pages/NextPage/InstructionPage';
// import { useCheckAuth } from './store/useAuthStore';


// function App() {
//   useCheckAuth(); // Run the initial auth check
//   return (
//     <SnackbarProvider>
//         <Routes>
//           <Route path="/" element={<Layout isHomePage={true} isLoggedIn={false}><RequiredDocuments /></Layout>} />
//           <Route path="/instruction_page" element={<Layout isHomePage={false} isLoggedIn={false}><NextPage /></Layout>} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path='/degree_information' element={<DegreeInformation/>}/>
//         </Routes>
//     </SnackbarProvider>
//   );
// }

// export default App;




// import ToolTipIcon from "./assets/icons/TootTipIcon"


// const App = () => {
//   return (
//     <div className= 'min-h-screen  p-32 pr-12'>
//     <h1 className='text-headerBlue'>Degree Information</h1>

//     <div className='flex flex-col space-y-2'>
//       <div className='flex items-center space-x-2'>
//         <h1>Degree Type</h1>
//         <input type="text" />
//       </div>

//       <div className='flex items-center space-x-2 '>
//         <h1>Primary Major</h1>
//         <input type="text" />
//         <ToolTipIcon/>
//       </div>

//     </div>

//     </div>
//   )
// }

// export default App








// import { Route, Routes } from 'react-router-dom'; // Import Navigate
// import Layout from './pages/Layout/Layout';
// import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
// import SnackbarProvider from './components/Snackbar/SnackBarProvider';
// import LoginPage from './pages/Login/LoginPage';
// import DegreeInformation from './pages/DegreeInformation.tsx/DegreeInformation';

// import { useCheckAuth } from './store/useAuthStore';
// import InstructionPage from './pages/InstructionPage.tsx/InstructionPage';

// function App() {

//   useCheckAuth();

//   return (
//     <SnackbarProvider>
//       <Routes>
//         <Route path="/" element={<Layout isHomePage={true} isLoggedIn={false}><RequiredDocuments /></Layout>} />
//         <Route path="/instruction_page" element={<Layout isHomePage={false} isLoggedIn={false}><InstructionPage /></Layout>} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path='/degree_information' element={<DegreeInformation/>}/>
//       </Routes>
//     </SnackbarProvider>
//   );
// }

// export default App;



import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import RequiredDocuments from './pages/RequiredDocuments/RequiredDocuments';
import SnackbarProvider from './components/Snackbar/SnackBarProvider';
import LoginPage from './pages/Login/LoginPage';
import DegreeInformation from './pages/DegreeInformation.tsx/DegreeInformation';
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
          <Route path="degree-information" element={<DegreeInformation />} />
        </Route>
      </Routes>
    </SnackbarProvider>
  );
}

export default App;