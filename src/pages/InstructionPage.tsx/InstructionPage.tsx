import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDocument } from '../../hooks/Documents/useDocuments';
import { useAuthStore } from '../../store/useAuthStore';
import LoadingIndicator from '../../components/Status/LoadingIndicator';
import { useModalStore } from '../../store/loginModalStore';

const InstructionPage: React.FC = () => {
    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const { data, isLoading, isError } = useDocument();
    const { openLoginModal } = useModalStore();
    const location = useLocation();

    useEffect(() => {
        if (!isLoggedIn) {
            // Store the current path in localStorage
            localStorage.setItem('redirectAfterLogin', location.pathname);
        }
    }, [isLoggedIn, location.pathname]);

    const handleStartClick = () => {
        if (isAgreed) {
            if (!isLoggedIn) {
             
                openLoginModal();

                
            } else {
                navigate('/infos/degree-information');
            }
        } else {
            alert('Please agree to the terms before starting.');
        }
    };

    const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(event.target.checked);
    };

    if (isLoading) {
        return <div className="min-h-[800px] flex items-center justify-center"><LoadingIndicator /></div>;
    }

    if (isError || !data || !data.results || data.results.length === 0) {
        return <div>Error loading data or no data available.</div>;
    }

    const firstDocument = data.results[0];
    const year = firstDocument?.year;
    const maddeler = firstDocument?.description?.split("\r\n") || [];

    return (
        <div className="container mx-auto mt-14 p-4 min-h-screen">
            <div className="text-center mb-10">
                <h1 className='text-primaryText text-[18px] font-[400]'>
                    TURKMENISTANYN OGUZ HAN ADYNDAKY INZENER TEHNOLOGIYALAR UNIWERSITETI <br /> {year}- {year ? parseInt(year) + 1 : 'YYYY'} YYL
                </h1>
            </div>

            <h1 className="text-[#5D87FF] text-md mb-5 w-[500px]">Description</h1>
            <div className='px-2'>
                <h1 className="text-primaryText text-[18px]  font-[500] mb-2">
                    Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt a,
                    aliquet sit amet lorem pellentesque eu tincidunt a, aliquet sit amet
                    lorem.
                </h1>
                <p className="">
                    Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.

                </p>
            </div>

            <ul className="list-decimal  text-primaryText px-5 mt-5">
                {maddeler.map((madde, index) => (
                    <li key={index} className="py-2  text-[16px] ">
                        {madde}
                    </li>
                ))}
            </ul>
            <div className='flex justify-between items-center mt-5'>
                <div className=" flex items-center ">
                    <input
                        type="checkbox"
                        id="agree"
                        className="mr-2 outline-none"
                        checked={isAgreed}
                        onChange={handleAgreementChange}
                    />
                    <label htmlFor="agree">Men ahli maglumatlar bilen tanyshdym....</label>
                </div>

                <div className="mt-4 text-right">
                    <button
                        onClick={handleStartClick}
                        className={` py-2 px-4 rounded ${isAgreed ? 'bg-[#5D87FF] text-white hover:bg-[#3a5cc9]' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        disabled={!isAgreed}
                    >
                        Start
                    </button>
                </div>
            </div>


        </div>
    );
};

export default InstructionPage;