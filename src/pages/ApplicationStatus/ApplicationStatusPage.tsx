import { useNavigate, Link } from 'react-router-dom';
import { Space, Button } from "antd";
import Container from "../../components/Container/Container";
import Navbar from "../../components/Navbar/Navbar";

import { useEffect, useState } from 'react';
import React from 'react'; // Import React
import { useClients } from '../../hooks/Client/useClients';
import type { Client } from '../../hooks/Client/useClients'; // Import Client interface

const ApplicationStatusPage = () => {
    const navigate = useNavigate();

    const { data, isError, error } = useClients(1);
    console.log('application datasi:', data)

    const [noteSection, setNoteSection] = useState<React.ReactNode>(null);

    useEffect(() => {
        if (data?.results && data?.results.length > 0) { // Check if results exist and are not empty
            const firstResult = data.results[0]; // Get the first result

            if (firstResult.status === "APPROVED") {
                setNoteSection(
                    <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                        <h1 className="mb-5 font-bold text-[18px]">Verify your personality</h1>
                        <p className="pb-7">Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.</p>
                        <p>Vivamus quis metus in nunc semper efficitur eget vitae diam. Proin justo diam, venenatis sit amet eros in, iaculis auctor magna. Pellentesque sit amet accumsan urna, sit amet pretium ipsum. Fusce condimentum venenatis mauris et luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>
                    </div>
                );
            } else if (firstResult.status === "REJECTED") {
                setNoteSection(
                    <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                        <h1 className="mb-5 font-bold text-[18px]">Rejection Reason</h1>
                        <p className="pb-7">{firstResult.id || "No rejection reason provided."}</p>
                    </div>
                );
            } else {
                setNoteSection(
                    <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                        <h1 className="mb-5 font-bold text-[18px]">Note or text</h1>
                        <p className="pb-7">We will send you a notification in 3 days, please wait</p>
                        <p>Vivamus quis metus in nunc semper efficitur eget vitae diam. Proin justo diam, venenatis sit amet eros in, iaculis auctor magna. Pellentesque sit amet accumsan urna, sit amet pretium ipsum. Fusce condimentum venenatis mauris et luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>
                    </div>
                );
            }
        } else {
            // Handle the case where data is null or results array is empty.  For example:
            setNoteSection(
                <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                    <h1 className="mb-5 font-bold text-[18px]">No Application Data</h1>
                    <p className="pb-7">No application data available.</p>
                </div>
            );
        }

    }, [data]);  // useEffect depends on 'data' to re-render when the data changes


    if (isError) {
        return (
            <Container>
                <Navbar />
                <div>Error: {error?.message || "An error occurred."}</div>
            </Container>
        );
    }


    const getStatusColors = (status: Client["status"] | undefined) => { // use status: string | undefined
        switch (status) {
            case "PENDING":
                return { textColor: "#FFAE1F", backgroundColor: "#FEF5E5" };
            case "APPROVED":
                return { textColor: "#24C381", backgroundColor: "#EDFFF5" };
            case "REJECTED":
                return { textColor: "#FA896B", backgroundColor: "#FBF2EF" };
            default:
                return { textColor: "#000000", backgroundColor: "#FFFFFF" };
        }
    };

    const statusColors = getStatusColors(data?.results?.[0]?.status); // Access status safely, using optional chaining and checking length

    const firstClient = data?.results?.[0]; // Safely get the first client

    return (
        <Container>
            <Navbar />
            <div className="pt-20 px-4 pb-10">
                <Space direction="vertical" size="middle" className="w-full">
                    <div className="mb-14">
                        <div className="mb-4">
                            <h1 className="text-headerBlue text-[14px] font-[500]">
                                Information
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Name
                            </label>
                            <div className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px] flex items-center px-2">
                                {firstClient?.full_name}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Major
                            </label>
                            <div className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px] flex items-center px-2">
                                {/* Safely access the major */}
                                {firstClient?.primary_major?.major}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Address
                            </label>
                            <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2">
                                {firstClient?.user?.area} {/* Safe access */}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Phone number
                            </label>
                            <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2">
                                {firstClient?.id}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left ">
                                Status
                            </label>
                            <div
                                className="w-auto h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2 py-2"
                                style={{
                                    backgroundColor: statusColors?.backgroundColor, // Safe access
                                    color: statusColors?.textColor, // Safe access
                                }}
                            >
                                {firstClient?.status}
                            </div>
                        </div>
                    </div>



                    <div className="flex justify-start space-x-5 ">
                        <Link
                            to={`/detail/${firstClient?.id}`} // Safe access
                            className="bg-primaryBlue hover:text-white  text-white  py-2 px-4 rounded"
                        >
                            Form Overview
                        </Link>
                        <Button
                            className="text-textSecondary bg-white border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all hover:duration-500"

                        >
                            Edit form
                        </Button>
                    </div>
                </Space>
            </div>
            {noteSection} {/* Render the note section here */}
        </Container>
    );
};

export default ApplicationStatusPage;