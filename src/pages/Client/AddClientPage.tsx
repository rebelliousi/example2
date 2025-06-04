import { Outlet, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import type { ITab } from '../../models/models';
import ArrowRightTabs from '../../components/Tabs/ArrowRightTabs';



const AddMajorPlanPage = () => {
    const { major_plan_id } = useParams();
    const tabs: ITab[] = [
        {
            id: 1,
            name: 'Saylan ugry',
            link: `/department-head/major-plans/add/general`,
        },
        {
            id: 2,
            name: 'General information',
            link: `/department-head/major-plans/add/${major_plan_id}/subjects`,
        },
        {
            id: 3,
            name: 'Ene-ata',
            link: `/department-head/major-plans/add/${major_plan_id}/exams`,
        },
        {
            id: 4,
            name: 'Bilimi',
            link: `/department-head/major-plans/add/${major_plan_id}/table`,
        },
        {
            id: 5,
            name: 'Awards',
            link: `/department-head/major-plans/add/${major_plan_id}/table`,
        },
        {
            id: 6,
            name: 'Other Documents',
            link: `/department-head/major-plans/add/${major_plan_id}/table`,
        },
    ];

    return (
        <div>
            <Container>
                <div className="max-2xl:px-5 text-primaryText">
                    <div className="h-20 flex items-center">
                        
                    </div>
                    <div className="pb-4">
                        <ArrowRightTabs disabled={true} tabs={tabs} />  {/* disabled={true} burada */}
                    </div>
                    {/* Geçici placeholder veya statik içerik */}
                    <Outlet />
                </div>
            </Container>
        </div>
    );
};

export default AddMajorPlanPage;