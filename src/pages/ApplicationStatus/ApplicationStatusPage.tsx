import { useNavigate, Link } from 'react-router-dom';
import { Space, Button } from "antd";
import Container from "../../components/Container/Container";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { Spin } from 'antd';
import { useApplication, type IApplication } from "../../hooks/Application/useApplications";

const ApplicationStatusPage = () => {
    const navigate = useNavigate();
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [application, setApplication] = useState<IApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useApplication(page);
    console.log('application datasi:',data)

    useEffect(() => {
        const status = sessionStorage.getItem('applicationStatus');
        if (status) {
            setApplicationSubmitted(true);
        } else {
            setApplicationSubmitted(false);
        }
    }, []);
  console.log('application datasi2:',data)
    useEffect(() => {
        if (applicationSubmitted) {
            setLoading(true)
            if (data && data.results.length > 0) {
              //BURADA KENDI FILTRELEME LOGIGINIZI KULLANIN!

              //Get the current user ID
              const userId = 6; //This needs to be dynamic and come from the user login

              //Find the application of the user
              const userApplication = data.results.find(app => app.user.id === userId);

              if (userApplication) {
                setApplication(userApplication);
              } else {
                setApplication(null);
                console.warn("No application found for user ID:", userId);
              }
            }
            setLoading(false)
        } else {
            setLoading(false);
        }
    }, [data, applicationSubmitted]);
     console.log('application datasi3:',data)

    if (loading) {
        return (
            <Container>
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" tip="Loading Application..." />
                </div>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container>
                <Navbar />
                <div>Error: {error?.message || "An error occurred."}</div>
            </Container>
        );
    }

    if (!applicationSubmitted) {
        return (
            <Container>
                <Navbar />
                <div>Başvuru bulunamadı veya henüz gönderilmedi.</div>
            </Container>
        );
    }

    if (!application) {
        return (
            <Container>
                <Navbar />
                <div>Başvuru bilgileri alınamadı. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.</div>
            </Container>
        );
    }

    const getStatusColors = (status: IApplication["status"] | undefined) => {
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

    const statusColors = getStatusColors(application.status);

    let noteSection;

    if (application.status === "APPROVED") {
        noteSection = (
            <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                <h1 className="mb-5 font-bold text-[18px]">Verify your personality</h1>
                <p className="pb-7">Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.</p>
                <p>VVivamus quis metus in nunc semper efficitur eget vitae diam. Proin justo diam, venenatis sit amet eros in, iaculis auctor magna. Pellentesque sit amet accumsan urna, sit amet pretium ipsum. Fusce condimentum venenatis mauris et luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>
            </div>
        );
    } else if (application.status === "REJECTED") {
        noteSection = (
            <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                <h1 className="mb-5 font-bold text-[18px]">Rejection Reason</h1>
                <p className="pb-7">{application.id || "No rejection reason provided."}</p>
            </div>
        );
    } else {
        noteSection = (
            <div className="bg-[#F8FAFC] w-wull h-auto p-10">
                <h1 className="mb-5 font-bold text-[18px]">Note or text</h1>
                <p className="pb-7">We will send you a notification in 3 days, please wait</p>
                <p>Vivamus quis metus in nunc semper efficitur eget vitae diam. Proin justo diam, venenatis sit amet eros in, iaculis auctor magna. Pellentesque sit amet accumsan urna, sit amet pretium ipsum. Fusce condimentum venenatis mauris et luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>
            </div>
        );
    }

    const handleEditClick = () => {
        setIsEditing(true);
        navigate('/infos/degree-information', { state: { application, isEditing: true } });
    };
     console.log('application datasi4:',data)

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
                                {application.full_name}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Major
                            </label>
                            <div className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px] flex items-center px-2">
                           {Array.isArray(application.primary_major)
                            ? application.primary_major[0]?.major
                            : application.primary_major?.major}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Address
                            </label>
                            <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2">
                                {application.user.area}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left">
                                Phone number
                            </label>
                            <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2">
                                {application.admission}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-32 font-[400] text-[14px] text-left ">
                                Status
                            </label>
                            <div
                                className="w-auto h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center px-2 py-2"
                                style={{
                                    backgroundColor: statusColors.backgroundColor,
                                    color: statusColors.textColor,
                                }}
                            >
                                {application.status}
                            </div>
                        </div>
                    </div>

                    {noteSection}

                    <div className="flex justify-start space-x-5 ">
                        <Link
                            to={`/detail/${application.id}`}
                            className="bg-primaryBlue hover:text-white  text-white  py-2 px-4 rounded"
                        >
                            Form Overview
                        </Link>
                        <Button
                            className="text-textSecondary bg-white border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all hover:duration-500"
                            onClick={handleEditClick}
                        >
                            Edit form
                        </Button>
                    </div>
                </Space>
            </div>
        </Container>
    );
};

export default ApplicationStatusPage;