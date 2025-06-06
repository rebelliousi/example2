import React, { Suspense } from 'react';
import LoadingIndicator from '../Status/LoadingIndicator';
import { Route, Routes } from 'react-router-dom';
import InfoLayout from '../InfoLayout/InfoLayout';
import DegreeInformationForm from '../../pages/DegreeInformation.tsx/DegreeInformation';
import ClientListPage from '../../pages/Client/ClientListPage';
import GeneralInformation from '../../pages/GeneralInformation/GeneralInformation';
import GuardiansInfoPage from '../../pages/GuardiansInfo/GuardiansInfo';
import EducationInfo from '../../pages/EducationInfo/EducationInfo';
import AwardsInfo from '../../pages/AwardsInfo/AwardsInfo';
import OtherDocuments from '../../pages/OtherDocuments/OtherDocuments';


const InformationRoutes = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        <Route path="list" element={<ClientListPage />} />
        <Route path="/" element={<InfoLayout />}> {/* ID yok */}
          <Route path="degree-information" element={<DegreeInformationForm />} />
           <Route path="general-information" element={<GeneralInformation />} />
           <Route path='guardians-info' element={<GuardiansInfoPage/>}/>
            <Route path='education-info' element={<EducationInfo/>}/>
             <Route path='awards-info' element={<AwardsInfo/>}/>
               <Route path='other-doc-info' element={<OtherDocuments/>}/>
            
        </Route>
      </Routes>
    </Suspense>
  );
};

export default InformationRoutes;