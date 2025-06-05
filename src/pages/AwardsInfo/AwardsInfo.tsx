import { Input, Space, message, Select, Radio, Button, DatePicker } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";



import type { Moment } from 'moment';
import PlusIcon from "../../assets/icons/PlusIcon";
import TrashIcon from "../../assets/icons/TrashIcon"; // Import TrashIcon



interface AwardInfo {
    awardType: string | null;
    description: string | null;
    certificate: File | null;  // Changed to File type
    certificateName: string | null;
}

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

const AwardsInfo = () => {
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

    const [awardInfos, setAwardInfos] = useState<AwardInfo[]>([{
        awardType: null,
        description: null,
        certificate: null,
        certificateName: null,
    }]);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
 ;

    const handleAwardInfoChange = (index: number, fieldName: keyof AwardInfo, value: any) => {
        const updatedAwardInfos = [...awardInfos];
        updatedAwardInfos[index][fieldName] = value;
        setAwardInfos(updatedAwardInfos);
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedAwardInfos = [...awardInfos];
            updatedAwardInfos[index].certificate = file;
            updatedAwardInfos[index].certificateName = file.name;
            setAwardInfos(updatedAwardInfos);
        } else {
            const updatedAwardInfos = [...awardInfos];
            updatedAwardInfos[index].certificate = null;
            updatedAwardInfos[index].certificateName = null;
            setAwardInfos(updatedAwardInfos);
        }
    };

    const handlePlusClick = (index: number) => {
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.click();
        }
    };

    const handleAddEducationInfo = () => {
        setAwardInfos([
            ...awardInfos,
            { awardType: null, description: null, certificate: null, certificateName: null },
        ]);
    };

    const handleDeleteEducationInfo = (index: number) => {
        const updatedAwardInfos = [...awardInfos];
        updatedAwardInfos.splice(index, 1);
        setAwardInfos(updatedAwardInfos);
    };

    const handleFileChangeMain = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
            setFormData({ ...formData, passport: file.name });
        } else {
            setSelectedFile(null);
            setFormData({ ...formData, passport: null });
        }
    };

    const handlePlusClickMain = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        console.log("Form Data:", formData);
        console.log("Award Info:", awardInfos);

        const overallFormData = new FormData();

        // Append Degree Information
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                const typedKey = key as DegreeInformationKey;
                let value = formData[typedKey];

                if (typedKey === 'dateOfBirth' || typedKey === 'dateGiven') {
                    value = formData[typedKey] ? (formData[typedKey] as Moment).format('YYYY-MM-DD') : '';
                }

                overallFormData.append(key, value === null ? '' : String(value));
            }
        }

        // Append Award Information (including files)
        awardInfos.forEach((award, index) => {
            overallFormData.append(`awardType[${index}]`, award.awardType || '');
            overallFormData.append(`description[${index}]`, award.description || '');
            if (award.certificate) {
                overallFormData.append(`certificate[${index}]`, award.certificate);
            }
        });

        // Append Passport File
        if (selectedFile) {
            overallFormData.append('passport', selectedFile);
        }

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: overallFormData,
            });

            if (response.ok) {
                message.success("Form saved and data uploaded successfully!");
                navigate("/infos/guardians-info");
            } else {
                message.error("Error uploading data.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            message.error("Network error during upload.");
        }
    };

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
                {/* General Information */}
                <div className="mb-14">
                    <div className="mb-4">
                        <h1 className="text-headerBlue text-[14px] font-[500]">
                            Awards
                        </h1>
                    </div>

                    {awardInfos.map((awardInfo, index) => (
                        <div key={index} className=" rounded mb-4">
                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                                <label className="w-44 font-[400] text-[14px] self-center">Award type</label>
                                <Space>
                                    <Input
                                        placeholder="Enter Award Type"
                                        className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                        value={awardInfo.awardType || ""}
                                        onChange={(e) => handleAwardInfoChange(index, "awardType", e.target.value)}
                                    />
                                </Space>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                                <label className="w-44 font-[400] text-[14px] self-center">Description</label>
                                <Space>
                                    <Input
                                        placeholder="Enter Description"
                                        className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                        value={awardInfo.description || ""}
                                        onChange={(e) => handleAwardInfoChange(index, "description", e.target.value)}
                                    />
                                </Space>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                                <label className="w-44 font-[400] text-[14px] self-center">
                                    Certificate of graduation
                                </label>
                                <Space>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            onClick={() => handlePlusClick(index)}
                                            type="text"
                                            className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                                        >
                                            {awardInfo.certificateName
                                                ? awardInfo.certificateName
                                                : "Attach document"}
                                            <PlusIcon />
                                        </Button>
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleFileChange(index, e)}
                                            ref={(el) => {
                                                if (!fileInputRefs.current[index]) {
                                                    fileInputRefs.current[index] = el;
                                                }
                                            }}
                                            accept="image/*,application/pdf"
                                        />
                                        <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                                    </div>
                                </Space>
                            </div>
                            {awardInfos.length > 1 && (
                                <button
                                    onClick={() => handleDeleteEducationInfo(index)}
                                    className="px-8 py-2 flex items-center justify-center gap-2 border-[#FA896B] border text-[#FA896B] rounded hover:text-[#FA896B] hover:border-[#FA896B] w-[200px]"
                                >
                                    Delete info
                                    <TrashIcon className="w-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddEducationInfo}
                        className="px-8 py-2 flex items-center gap-2 border-blue-500 border text-blue-500 rounded"
                    >
                        <PlusIcon /> Add
                    </button>
                </div>

              
          <div className="flex justify-end mt-10 space-x-5">
            <Link to='/infos/education-info'
              className="text-textSecondary border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
            
            
            >
              Previous
            </Link>

            <Link to='/infos/other-doc-info'
              className="bg-primaryBlue  text-white  py-2 px-4 rounded"
              onClick={handleSubmit}
            
            >
              Next
            </Link>
          </div>
            </Space>
        </div>
    );
};

export default AwardsInfo;