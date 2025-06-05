import {  Space, message, Select, Radio, Button } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Moment } from 'moment';
import PlusIcon from "../../assets/icons/PlusIcon";



interface DegreeInformation {
    firstName: string | null;
    lastName: string | null;
    fatherName: string | null;
    gender: string | null;
    nationality: string | null;
    dateOfBirth: Moment | null;
    area: number | null;
    address: string | null;
    placeOfBirth: string | null;
    homePhoneNumber: string | null;
    cellPhoneNumber: string | null;
    email: string | null;
    serialNumber: string | null;
    documentNumber: string | null;
    dateGiven: Moment | null;
    givenBy: string | null;
    passport: string | null;
}

type DegreeInformationKey = keyof DegreeInformation;

const OtherDocuments = () => {
 
    const navigate = useNavigate();

    const [formData, setFormData] = useState<DegreeInformation>({
        firstName: null,
        lastName: null,
        fatherName: null,
        gender: null,
        nationality: null,
        dateOfBirth: null,
        area: null,
        address: null,
        placeOfBirth: null,
        homePhoneNumber: null,
        cellPhoneNumber: null,
        email: null,
        serialNumber: null,
        documentNumber: null,
        dateGiven: null,
        givenBy: null,
        passport: null,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: Exclude<DegreeInformationKey, 'dateOfBirth' | 'dateGiven'>
    ) => {
        setFormData({ ...formData, [fieldName]: e.target.value });
    };

    
  

    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
            setFormData({ ...formData, passport: file.name });
        } else {
            setSelectedFile(null);
            setFormData({ ...formData, passport: null });
        }
    };

    const handlePlusClick = () => {
        fileInputRef.current?.click();
    };

    
    const handleSubmit = async () => {
        console.log("Form Data:", formData);
        console.log("Selected File:", selectedFile);
            navigate("/application-status");

        const formDataToSend = new FormData();

        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                const typedKey = key as DegreeInformationKey;
                let value = formData[typedKey];

                if (typedKey === 'dateOfBirth' || typedKey === 'dateGiven') {
                    value = formData[typedKey] ? (formData[typedKey] as Moment).format('YYYY-MM-DD') : '';
                }

                formDataToSend.append(key, value === null ? '' : String(value));
            }
        }

        if (selectedFile) {
            formDataToSend.append('passport', selectedFile);

        } else {
            try {
                const response = await fetch('/api/save-form', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (response.ok) {
                    message.success("Form saved (no passport uploaded).");
                } else {
                    message.error("Error saving form.");
                }
            } catch (error) {
                console.error("Save form error:", error);
                message.error("Network error during form save.");
            }

        }

        setSelectedFile(null);
        setFormData({
            firstName: null,
            lastName: null,
            fatherName: null,
            gender: null,
            nationality: null,
            dateOfBirth: null,
            area: null,
            address: null,
            placeOfBirth: null,
            homePhoneNumber: null,
            cellPhoneNumber: null,
            email: null,
            serialNumber: null,
            documentNumber: null,
            dateGiven: null,
            givenBy: null,
            passport: null,
        });


    };

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
               
                {/* Passport Information */}
                <div className="mb-4">
                    <h1 className="text-headerBlue text-[14px] font-[500]">
                    Other Documents
                    </h1>
                </div>

                


               

               
                <div className="flex flex-col sm:flex-row items-start gap-4 ">
                    <label className="w-44 font-[400] text-[14px] self-center">Saglyk kepilnama</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile bg-bgFile  border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>

                 <div className="flex flex-col sm:flex-row items-start gap-4 ">
                    <label className="w-44 font-[400] text-[14px] self-center">3 arka</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile bg-bgFile  border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>

                 <div className="flex flex-col sm:flex-row items-start gap-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Maglumat</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile bg-bgFile  border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>

                 <div className="flex flex-col sm:flex-row items-start gap-4 ">
                    <label className="w-44 font-[400] text-[14px] self-center">Terjimehal</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile bg-bgFile  border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>


                 <div className="flex flex-col sm:flex-row items-start gap-4 ">
                    <label className="w-44 font-[400] text-[14px] self-center">3X4 surat</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile border-[#DFE5EF]  bg-bgFile  rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>

         

              <div className="flex flex-col sm:flex-row items-start gap-4 ">
                    <label className="w-44 font-[400] text-[14px] self-center">Military service</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile border-[#DFE5EF] bg-bgFile rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Nika haty</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer hover:bg-hoverBgFile bg-bgFile  border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                            >
                                {selectedFile ? selectedFile.name : "Attach passport copy"}
                                <PlusIcon />
                            </Button>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />

                            <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                        </div>
                    </Space>
                </div>


                <div className="flex justify-end mt-12 space-x-5">
                    <Link to='/infos/degree-information'
                        className="text-textSecondary border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
                      
                    >
                        Previous
                    </Link>

                    <Link to='/application-status'
                        type="primary"
                        onClick={handleSubmit}
                        className="bg-primaryBlue text-white py-2 px-4 rounded"
                    >
                        Finish
                    </Link>
                </div>
            </Space>
        </div>
    );
};

export default OtherDocuments;