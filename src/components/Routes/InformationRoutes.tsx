import React, { Suspense } from 'react';
import LoadingIndicator from '../Status/LoadingIndicator';
import { Route, Routes } from 'react-router-dom';
import InfoLayout from '../InfoLayout/InfoLayout';
import DegreeInformationForm from '../../pages/DegreeInformation.tsx/BachelorDegreeInformation';
import ClientListPage from '../../pages/Client/ClientListPage';

const InformationRoutes = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        <Route path="list" element={<ClientListPage />} />
        <Route path="/" element={<InfoLayout />}> {/* ID yok */}
          <Route path="degree-information" element={<DegreeInformationForm />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default InformationRoutes;