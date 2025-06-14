import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDocument } from "../../hooks/Documents/useDocuments";
import DownloadIcon from "../../assets/icons/DownloadIcon";
import LoadingIndicator from "../../components/Status/LoadingIndicator";
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/loginModalStore';

const RequiredDocuments: React.FC = () => {
    const { data, isLoading, isError } = useDocument();
    const { isLoggedIn } = useAuthStore();
    const { openLoginModal } = useModalStore();
    const location = useLocation();

    useEffect(() => {
        if (!isLoggedIn) {
            // Store the current path in localStorage
            localStorage.setItem('redirectAfterLogin', location.pathname);
        }
    }, [isLoggedIn, location.pathname]);

    if (isLoading) {
        return (
            <div className="min-h-[800px] flex items-center justify-center">
                <LoadingIndicator />
            </div>
        );
    }

    if (isError || !data || !data.results || data.results.length === 0) {
        return <div className="min-h-[800px]">Error loading data or no data available.</div>;
    }

    const firstDocument = data.results[0];
    const conditions = firstDocument?.text?.split("\r\n") || [];
    const year = firstDocument?.year;

    // Function to generate download links
    const getAttachmentDownloadLinks = (): string[] => {
        if (!firstDocument?.attachments || firstDocument.attachments.length === 0) {
            return [];
        }

        // Assuming attachments are just IDs and the API provides an endpoint to fetch the file
        // You'll likely need to adapt this based on your actual API.
        return firstDocument.attachments.map(attachmentId => `/api/download/attachment/${attachmentId}`); // Replace with your actual download endpoint
    };

    const attachmentDownloadLinks = getAttachmentDownloadLinks();

    return (
        <div className="">
            <div className="container mx-auto mt-20 p-4">
                <div className="text-center mb-10">
                    <h1 className="text-primaryText text-[18px] font-[400]">
                        TURKMENISTANYN OGUZ HAN ADYNDAKY INZENER TEHNOLOGIYALAR UNIWERSITETI{" "}
                        <br /> {year}- {year ? parseInt(year) + 1 : "YYYY"} YYL
                    </h1>
                </div>

                <h1 className="text-[#5D87FF] px-2 text-md mb-5 w-[500px]">
                    Required documents
                </h1>

                <div className="px-2">
                    <h1 className=" text-primaryText text-[18px]  font-[500] mb-2">
                        Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt a,
                        aliquet sit amet lorem pellentesque eu tincidunt a, aliquet sit amet
                        lorem.
                    </h1>
                    <p className="">
                        Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.
                    </p>

                </div>

                <ul className="list-decimal text-primaryText px-5 mt-5">

                    {conditions.map((item, index) => (
                        <li key={index} className="py-2  text-[16px]">
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex space-x-2 items-center ">
                    {attachmentDownloadLinks.length > 0 ? (
                        attachmentDownloadLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link}
                                className="text-[#4570EA] hover:underline"
                                download // Add the download attribute if it is a direct file URL
                            >
                                Download List of Required Documents {attachmentDownloadLinks.length > 1 ? `(Part ${index + 1})` : ''}
                            </a>
                        ))
                    ) : (
                        <span className="text-gray-500">No documents available for download.</span>
                    )}
                    <DownloadIcon />
                </div>

                <div className="mt-10 text-right ">
                    <Link to="/instruction_page" className="text-blue-500 hover:underline">
                        <button className="bg-[#5D87FF] text-white p-2 rounded px-5">
                            Next
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RequiredDocuments;