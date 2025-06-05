import { Input, Space, message, Select, Radio, Button, DatePicker } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useArea } from "../../hooks/Area/useAreas";
import type { RadioChangeEvent } from "antd";
import moment from 'moment';
import type { Moment } from 'moment';
import PlusIcon from "../../assets/icons/PlusIcon";

const { Option } = Select;

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

const GeneralInformationForm = () => {
    const { data: areaData, isLoading: isAreaLoading } = useArea();
    const areaOptions = areaData?.results || [];
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

    const handleGivenByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, givenBy: e.target.value });
    };

    const handleGenderChange = (e: RadioChangeEvent) => {
        setFormData({ ...formData, gender: e.target.value });
    };

    const handleAreaChange = (value: number | null) => {
        setFormData({ ...formData, area: value });
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

    const handleDateChange = (date: Moment | null, fieldName: 'dateOfBirth' | 'dateGiven') => {
        setFormData({ ...formData, [fieldName]: date });
    };

    const handleSubmit = async () => {
        console.log("Form Data:", formData);
        console.log("Selected File:", selectedFile);

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

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (response.ok) {
                    message.success("Form saved and passport uploaded successfully!");
                } else {
                    message.error("Error uploading passport.");
                }
            } catch (error) {
                console.error("Upload error:", error);
                message.error("Network error during upload.");
            }
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

        navigate("/infos/general-information");
    };

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
                {/* General Information */}
                <div className="mb-14">
                    <div className="mb-4">
                        <h1 className="text-headerBlue text-[14px] font-[500]">
                            General Information
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">First name</label>
                        <Space>
                            <Input
                                placeholder="Enter First Name"
                                className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                value={formData.firstName || ""}
                                onChange={(e) => handleInputChange(e, "firstName")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Last name</label>
                        <Space>
                            <Input
                                placeholder="Enter Last Name"
                                className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                value={formData.lastName || ""}
                                onChange={(e) => handleInputChange(e, "lastName")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Father's name</label>
                        <Space>
                            <Input
                                placeholder="Enter Father's Name"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.fatherName || ""}
                                onChange={(e) => handleInputChange(e, "fatherName")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Gender</label>
                        <Space>
                            <Radio.Group onChange={handleGenderChange} value={formData.gender}>
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                            </Radio.Group>
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Nationality</label>
                        <Space>
                            <Input
                                placeholder="Enter Nationality"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.nationality || ""}
                                onChange={(e) => handleInputChange(e, "nationality")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Date of birth</label>
                        <Space>
                            <DatePicker
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                                value={formData.dateOfBirth}
                                onChange={(date) => handleDateChange(date, 'dateOfBirth')}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Area</label>
                        <Space>
                            <Select
                                placeholder="Select Area"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                                value={formData.area || undefined}
                                onChange={handleAreaChange}
                                loading={isAreaLoading}
                                allowClear
                            >
                                {areaOptions.map((area) => (
                                    <Option key={area.id} value={area.id}>
                                        {area.name}
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Address</label>
                        <Space>
                            <Input
                                placeholder="Enter Address"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.address || ""}
                                onChange={(e) => handleInputChange(e, "address")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Place of birth</label>
                        <Space>
                            <Input
                                placeholder="Enter Place of Birth"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.placeOfBirth || ""}
                                onChange={(e) => handleInputChange(e, "placeOfBirth")}
                            />
                        </Space>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mb-14">
                    <div className="mb-4">
                        <h1 className="text-headerBlue text-[14px] font-[500]">
                            Contact Information
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Home phone number</label>
                        <Space>
                            <Input
                                placeholder="Enter Home Phone Number"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.homePhoneNumber || ""}
                                onChange={(e) => handleInputChange(e, "homePhoneNumber")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">Cellphone number</label>
                        <Space>
                            <Input
                                placeholder="Enter Cell Phone Number"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.cellPhoneNumber || ""}
                                onChange={(e) => handleInputChange(e, "cellPhoneNumber")}
                            />
                        </Space>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">E-mail</label>
                        <Space>
                            <Input
                                placeholder="Enter Email"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={formData.email || ""}
                                onChange={(e) => handleInputChange(e, "email")}
                            />
                        </Space>
                    </div>
                </div>

                {/* Passport Information */}
                <div className="mb-4">
                    <h1 className="text-headerBlue text-[14px] font-[500]">
                        Passport Information
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Serial number</label>
                    <Space>
                        <Input
                            placeholder="Enter Serial Number"
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                            value={formData.serialNumber || ""}
                            onChange={(e) => handleInputChange(e, "serialNumber")}
                        />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Document number</label>
                    <Space>
                        <Input
                            placeholder="Enter Document Number"
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                            value={formData.documentNumber || ""}
                            onChange={(e) => handleInputChange(e, "documentNumber")}
                        />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Date given</label>
                    <Space>
                        <DatePicker
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                            value={formData.dateGiven}
                            onChange={(date) => handleDateChange(date, 'dateGiven')}
                        />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Given by</label>
                    <Space>
                        <Input
                            placeholder="Enter Given By"
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                            value={formData.givenBy || ""}
                            onChange={handleGivenByChange}
                        />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">Passport</label>
                    <Space>
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
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
                        onClick={() => navigate(-1)}
                    >
                        Previous
                    </Link>

                    <Link to='/infos/guardians-info'
                        type="primary"
                        onClick={handleSubmit}
                        className="bg-primaryBlue text-white py-2 px-4 rounded"
                    >
                        Next
                    </Link>
                </div>
            </Space>
        </div>
    );
};

export default GeneralInformationForm;