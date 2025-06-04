// AddMajorPlanLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Container from '../../components/Container/Container'; // Adjust path if needed
import ArrowRightTabs from '../../components/Tabs/ArrowRightTabs';
import React from 'react';

const AddMajorPlanLayout: React.FC = () => {
    const location = useLocation();

    // Define your tabs configuration here.  Crucially, *no* styling is forced.
    const tabs = [
        {
            id: 1,
            name: 'Saylan ugry',
            link: '/degree-information',
        },
        {
            id: 2,
            name: 'General information',
            link: '/general-information',
        },
        {
            id: 3,
            name: 'Ene-ata',
            link: '/ene-ata',
        },
        {
            id: 4,
            name: 'Bilimi',
            link: '/bilimi',
        },
        {
            id: 5,
            name: 'Awards',
            link: '/awards',
        },
        {
            id: 6,
            name: 'Other Documents',
            link: '/other-documents',
        },
    ];

    return (
        <Container>
            <div className="min-h-screen p-8 lg:p-16 xl:p-24">
                <div className="mb-4">
                    <h1 className="text-headerBlue text-[14px] font-[500]">
                        {/* You can dynamically set the title if needed */}
                        Add Major Plan
                    </h1>
                </div>

                <ArrowRightTabs tabs={tabs} />

                <Outlet /> {/* This is where the content of the child route will render */}
            </div>
        </Container>
    );
};

export default AddMajorPlanLayout;