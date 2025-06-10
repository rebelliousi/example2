import { Input, Space, Select, Button, DatePicker, message } from "antd";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Moment } from "moment";
import moment from 'moment';
import PlusIcon from "../../assets/icons/PlusIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useSendFiles } from "../../hooks/Documents/useSendFiles";


const { Option } = Select;

interface GuardianInfo {
    firstName: string | null;
    lastName: string | null;
    fatherName: string | null;
    dateOfBirth: Moment | null;
    address: string | null;
    placeOfBirth: string | null;
    isDeceased: boolean | null;
    passport: string | null;
    homePhoneNumber: string | null;
    cellPhoneNumber: string | null;
    deathCertificate: string | null;
    passportFileId?: number | null; // Added to store file ID
    deathCertificateFileId?: number | null; // Added to store file ID
}

type GuardianInfoKey = keyof GuardianInfo;

const GuardiansInfo = () => {
    const navigate = useNavigate();

    // Initial state for a guardian
    const initialGuardianState: GuardianInfo = {
        firstName: null,
        lastName: null,
        fatherName: null,
        dateOfBirth: null,
        address: null,
        placeOfBirth: null,
        isDeceased: null,
        passport: null,
        homePhoneNumber: null,
        cellPhoneNumber: null,
        deathCertificate: null,
        passportFileId: null, // Initialize as null
        deathCertificateFileId: null, // Initialize as null
    };

    // State for the father form
    const [fatherFormData, setFatherFormData] = useState<GuardianInfo>({
        ...initialGuardianState,
    });

    // State for the mother form
    const [motherFormData, setMotherFormData] = useState<GuardianInfo>({
        ...initialGuardianState,
    });

    // State for other guardians (array)
    const [otherGuardians, setOtherGuardians] = useState<GuardianInfo[]>([]);

    // File states for father and mother
    const [fatherSelectedFile, setFatherSelectedFile] = useState<File | null>(null);
    const [motherSelectedFile, setMotherSelectedFile] = useState<File | null>(null);

    // File states for death certificates
    const [fatherDeathCertificateFile, setFatherDeathCertificateFile] = useState<File | null>(null);
    const [motherDeathCertificateFile, setMotherDeathCertificateFile] = useState<File | null>(null);

    // File states for other guardians
    const [otherGuardianFiles, setOtherGuardianFiles] = useState<File[]>([]);
    const [otherGuardianDeathCertificateFiles, setOtherGuardianDeathCertificateFiles] = useState<File[]>([]);

    // useRef hooks for file input elements
    const fatherFileInputRef = useRef<HTMLInputElement>(null);
    const motherFileInputRef = useRef<HTMLInputElement>(null);
    const fatherDeathCertificateInputRef = useRef<HTMLInputElement>(null);
    const motherDeathCertificateInputRef = useRef<HTMLInputElement>(null);
    const otherGuardianFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const otherGuardianDeathCertificateInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs for other guardians
    useEffect(() => {
        otherGuardianFileInputRefs.current = [];
        otherGuardianDeathCertificateInputRefs.current = [];
    }, []);

    // useSendFiles hook
    const { mutate: uploadFile, isPending: isFileUploadLoading } = useSendFiles();

    // Handlers for input changes
    const handleFatherInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: GuardianInfoKey
    ) => {
        setFatherFormData({ ...fatherFormData, [fieldName]: e.target.value });
    };

    const handleMotherInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: GuardianInfoKey
    ) => {
        setMotherFormData({ ...motherFormData, [fieldName]: e.target.value });
    };

    const handleOtherGuardianInputChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: GuardianInfoKey
    ) => {
        const newGuardians = [...otherGuardians];
        newGuardians[index] = {
            ...newGuardians[index],
            [fieldName]: e.target.value,
        };
        setOtherGuardians(newGuardians);
    };

    // Handlers for date changes
    const handleFatherDateChange = (
        date: Moment | null,
        fieldName: "dateOfBirth" | "deathCertificate"
    ) => {
        setFatherFormData({ ...fatherFormData, [fieldName]: date });
    };

    const handleMotherDateChange = (
        date: Moment | null,
        fieldName: "dateOfBirth" | "deathCertificate"
    ) => {
        setMotherFormData({ ...motherFormData, [fieldName]: date });
    };

    const handleOtherGuardianDateChange = (
        index: number,
        date: Moment | null,
        fieldName: "dateOfBirth"
    ) => {
        const newGuardians = [...otherGuardians];
        newGuardians[index] = { ...newGuardians[index], [fieldName]: date };
        setOtherGuardians(newGuardians);
    };

    // Handlers for deceased state changes
    const handleFatherDeceasedChange = (value: boolean | null) => {
        setFatherFormData({ ...fatherFormData, isDeceased: value });
    };

    const handleMotherDeceasedChange = (value: boolean | null) => {
        setMotherFormData({ ...motherFormData, isDeceased: value });
    };

    const handleOtherGuardianDeceasedChange = (
        index: number,
        value: boolean | null
    ) => {
        const newGuardians = [...otherGuardians];
        newGuardians[index] = { ...newGuardians[index], isDeceased: value };
        setOtherGuardians(newGuardians);
    };

    // Handlers for file changes
    const handleFatherFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFatherSelectedFile(file);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    setFatherFormData(prevFormData => ({
                        ...prevFormData,
                        passport: file.name,
                        passportFileId: data.id, // Store the file ID
                    }));
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });

        } else {
            setFatherSelectedFile(null);
            setFatherFormData((prevFormData) => ({
                ...prevFormData,
                passport: null,
                passportFileId: null, // Reset file ID
            }));
        }
    };

    const handleMotherFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setMotherSelectedFile(file);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    setMotherFormData(prevFormData => ({
                        ...prevFormData,
                        passport: file.name,
                        passportFileId: data.id, // Store the file ID
                    }));
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });

        } else {
            setMotherSelectedFile(null);
            setMotherFormData((prevFormData) => ({
                ...prevFormData,
                passport: null,
                passportFileId: null, // Reset file ID
            }));
        }
    };

    const handleOtherGuardianFileChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        const newGuardians = [...otherGuardians];

        if (file) {
            const newFiles = [...otherGuardianFiles];
            newFiles[index] = file;
            setOtherGuardianFiles(newFiles);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    newGuardians[index] = {
                        ...newGuardians[index],
                        passport: file.name,
                        passportFileId: data.id, // Store the file ID
                    };
                    setOtherGuardians(newGuardians);
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        } else {
            newGuardians[index] = {
                ...newGuardians[index],
                passport: null,
                passportFileId: null, // Reset file ID
            };
            setOtherGuardians(newGuardians);
        }
    };

    const handleFatherDeathCertificateChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setFatherDeathCertificateFile(file);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    setFatherFormData(prevFormData => ({
                        ...prevFormData,
                        deathCertificate: file.name,
                        deathCertificateFileId: data.id, // Store the file ID
                    }));
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        } else {
            setFatherDeathCertificateFile(null);
            setFatherFormData((prevFormData) => ({
                ...prevFormData,
                deathCertificate: null,
                deathCertificateFileId: null, // Reset file ID
            }));
        }
    };

    const handleMotherDeathCertificateChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setMotherDeathCertificateFile(file);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    setMotherFormData(prevFormData => ({
                        ...prevFormData,
                        deathCertificate: file.name,
                        deathCertificateFileId: data.id, // Store the file ID
                    }));
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        } else {
            setMotherDeathCertificateFile(null);
            setMotherFormData((prevFormData) => ({
                ...prevFormData,
                deathCertificate: null,
                deathCertificateFileId: null, // Reset file ID
            }));
        }
    };

    const handleOtherGuardianDeathCertificateChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        const newGuardians = [...otherGuardians];

        if (file) {
            const newDeathCertificateFiles = [...otherGuardianDeathCertificateFiles];
            newDeathCertificateFiles[index] = file;
            setOtherGuardianDeathCertificateFiles(newDeathCertificateFiles);

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => { // data'nın türünü any olarak değiştirdim.
                    newGuardians[index] = {
                        ...newGuardians[index],
                        deathCertificate: file.name,
                        deathCertificateFileId: data.id, // Store the file ID
                    };
                    setOtherGuardians(newGuardians);
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        } else {
            newGuardians[index] = {
                ...newGuardians[index],
                deathCertificate: null,
                deathCertificateFileId: null, // Reset file ID
            };
            setOtherGuardians(newGuardians);
        }
    };

    // Handlers for plus button clicks
    const handleFatherPlusClick = () => {
        fatherFileInputRef.current?.click();
    };

    const handleMotherPlusClick = () => {
        motherFileInputRef.current?.click();
    };

    const handleFatherDeathCertificatePlusClick = () => {
        fatherDeathCertificateInputRef.current?.click();
    };

    const handleMotherDeathCertificatePlusClick = () => {
        motherDeathCertificateInputRef.current?.click();
    };

    const handleOtherGuardianPlusClick = (index: number) => {
        if (otherGuardianFileInputRefs.current[index]) {
            otherGuardianFileInputRefs.current[index].click();
        }
    };

    const handleOtherGuardianDeathCertificatePlusClick = (index: number) => {
        if (otherGuardianDeathCertificateInputRefs.current[index]) {
            otherGuardianDeathCertificateInputRefs.current[index].click();
        }
    };

    // Handlers for adding and deleting guardians
    const handleAddGuardian = () => {
        setOtherGuardians([...otherGuardians, { ...initialGuardianState }]);
    };

    const handleDeleteGuardian = (index: number) => {
        const newGuardians = [...otherGuardians];
        newGuardians.splice(index, 1);
        setOtherGuardians(newGuardians);

        const newFiles = [...otherGuardianFiles];
        newFiles.splice(index, 1);
        setOtherGuardianFiles(newFiles);

        const newDeathCertificateFiles = [...otherGuardianDeathCertificateFiles];
        newDeathCertificateFiles.splice(index, 1);
        setOtherGuardianDeathCertificateFiles(newDeathCertificateFiles);
    };

    // Handler for form submission
    const handleSubmit = () => {
        //sessionStorage'a kaydet
        const guardiansData = {
            fatherFormData: fatherFormData,
            motherFormData: motherFormData,
            otherGuardians: otherGuardians
        };
        sessionStorage.setItem('guardiansInformation', JSON.stringify(guardiansData));

        navigate("/infos/education-info");
    };

    // Component for rendering passport information
    const renderPassportInformation = (
        formData: GuardianInfo,
        handleInputChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            fieldName: GuardianInfoKey
        ) => void,
        selectedFile: File | null,
        fileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        fileInputRef: React.RefObject<HTMLInputElement | null>,
        handlePlusClick: () => void,
        onDelete?: () => void,
        deathCertificate?: boolean
    ) => (
        <>
            <div className="flex  sm:flex-row items-start gap-4 mb-4">
                <label className="w-44 font-[400] text-[14px] self-center">
                    {deathCertificate ? "Death Certificate" : "Passport"}
                </label>
                <div className=" flex w-[400px]">
                    <Space>
                        <div className="flex items-center justify-between  w-[400px]">
                            <Button
                                onClick={handlePlusClick}
                                type="text"
                                className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-full h-[40px] flex items-center justify-center"
                            >
                                {selectedFile
                                    ? selectedFile.name
                                    : `Attach ${deathCertificate ? "Death Certificate" : "Passport"} copy`}
                                <PlusIcon />
                            </Button>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={fileInputChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </Space>
                    <div className="flex items-center ml-4">
                        <InfoCircleIcon className="text-blue-500 hover:text-blue-700 mr-5" />
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="px-8 py-2 flex items-center justify-center gap-2 border-[#FA896B] border text-[#FA896B] rounded hover:text-[#FA896B] hover:border-[#FA896B] w-[200px]"
                            >
                                Delete guardian
                                <TrashIcon className="w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    // Components for rendering contact and address information
    const renderContactInformation = (
        formData: GuardianInfo,
        handleInputChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            fieldName: GuardianInfoKey
        ) => void
    ) => (
        <>
            <div className="mb-4 mt-20">
                <h1 className="text-headerBlue text-[14px] font-[500]">
                    Contact Information
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <label className="w-44 font-[400] text-[14px] self-center">
                    Phone number
                </label>
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
                <label className="w-44 font-[400] text-[14px] self-center">
                    Work place
                </label>
                <Space>
                    <Input
                        placeholder="Enter work place"
                        className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                        value={formData.cellPhoneNumber || ""}
                        onChange={(e) => handleInputChange(e, "cellPhoneNumber")}
                    />
                </Space>
            </div>
        </>
    );

    const renderAddressInformation = (
        formData: GuardianInfo,
        handleInputChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            fieldName: GuardianInfoKey
        ) => void
    ) => (
        <>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <label className="w-44 font-[400] text-[14px] self-center">
                    Address
                </label>
                <Space>
                    <Input
                        placeholder="Enter Address"
                        className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange(e, "address")}
                    />
                </Space>
            </div>
        </>
    );

    // Component for rendering the guardian form
    const renderGuardianForm = (
        formData: GuardianInfo,
        formTitle: string,
        handleInputChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            fieldName: GuardianInfoKey
        ) => void,
        handleDateChange: (
            date: Moment | null,
            fieldName: "dateOfBirth" | "deathCertificate"
        ) => void,
        handleDeceasedChange: (value: boolean | null) => void,
        selectedFile: File | null,
        fileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        fileInputRef: React.RefObject<HTMLInputElement | null>,
        handlePlusClick: () => void,
        deathCertificateFile: File | null,
        deathCertificateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        deathCertificateInputRef: React.RefObject<HTMLInputElement | null>,
        handleDeathCertificatePlusClick: () => void,
        onDelete?: () => void,
        isOtherGuardian?: boolean
    ) => {
        return (
            <div className="mb-14 col-span-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-headerBlue text-[14px] font-[500]">
                        {formTitle}
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">
                        First name
                    </label>
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
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Last name
                    </label>
                    <Space>
                        <Input
                            placeholder="Enter Last Name"
                            className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                            value={formData.lastName || ""}
                            onChange={(e) => handleInputChange(e, "lastName")}
                        />
                    </Space>
                </div>

                {/* Father's Name Input */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Father's name
                    </label>
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
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Date of birth
                    </label>
                    <Space>
                        <DatePicker
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                            value={formData.dateOfBirth}
                            onChange={(date) => handleDateChange(date, "dateOfBirth")}
                        />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Place of birth
                    </label>
                    <Space>
                        <Input
                            placeholder="Enter Place of Birth"
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                            value={formData.placeOfBirth || ""}
                            onChange={(e) => handleInputChange(e, "placeOfBirth")}
                        />
                    </Space>
                </div>

                {!isOtherGuardian && (
                    <>
                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                Dead?
                            </label>
                            <Space>
                                <Select
                                    placeholder="Select"
                                    className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                                    value={
                                        formData.isDeceased === null ? undefined : formData.isDeceased
                                    }
                                    onChange={handleDeceasedChange}
                                    allowClear
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </Space>
                        </div>

                        {formData.isDeceased === false && (
                            <>
                                {renderAddressInformation(formData, handleInputChange)}
                                {renderContactInformation(formData, handleInputChange)}
                                {renderPassportInformation(
                                    formData,
                                    handleInputChange,
                                    selectedFile,
                                    fileInputChange,
                                    fileInputRef,
                                    handlePlusClick,
                                    onDelete,
                                    false
                                )}
                            </>
                        )}

                        {formData.isDeceased === true && (
                            <>
                                {renderPassportInformation(
                                    formData,
                                    handleInputChange,
                                    deathCertificateFile,
                                    deathCertificateInputChange,
                                    deathCertificateInputRef,
                                    handleDeathCertificatePlusClick,
                                    onDelete,
                                    true
                                )}
                            </>
                        )}
                    </>
                )}

                {isOtherGuardian && (
                    <>
                        {renderAddressInformation(formData, handleInputChange)}
                        {renderContactInformation(formData, handleInputChange)}
                        {renderPassportInformation(
                            formData,
                            handleInputChange,
                            selectedFile,
                            fileInputChange,
                            fileInputRef,
                            handlePlusClick,
                            onDelete,
                            false
                        )}
                    </>
                )}
            </div>
        );
    };

    // Callback functions to set file input refs for other guardians
    const setFileInputRefCallback = (index: number) => (el: HTMLInputElement | null) => {
        otherGuardianFileInputRefs.current[index] = el;
    };

    const setDeathCertificateInputRefCallback = (index: number) => (el: HTMLInputElement | null) => {
        otherGuardianDeathCertificateInputRefs.current[index] = el;
    };

    // useEffect to load data from sessionStorage on initial load
    useEffect(() => {
        const storedGuardiansInformation = sessionStorage.getItem('guardiansInformation');
        if (storedGuardiansInformation) {
            const parsedData = JSON.parse(storedGuardiansInformation);

            //Datepicker için moment objelerine dönüştürme
            const fatherDateOfBirth = parsedData.fatherFormData?.dateOfBirth ? moment(parsedData.fatherFormData.dateOfBirth) : null;
            const fatherDeathCertificate = parsedData.fatherFormData?.deathCertificate ? moment(parsedData.fatherFormData.deathCertificate) : null;
            const motherDateOfBirth = parsedData.motherFormData?.dateOfBirth ? moment(parsedData.motherFormData.dateOfBirth) : null;
            const motherDeathCertificate = parsedData.motherFormData?.deathCertificate ? moment(parsedData.motherFormData.deathCertificate) : null;

            //State'leri güncelleme
            setFatherFormData({ ...parsedData.fatherFormData, dateOfBirth: fatherDateOfBirth, deathCertificate: fatherDeathCertificate });
            setMotherFormData({ ...parsedData.motherFormData, dateOfBirth: motherDateOfBirth, deathCertificate: motherDeathCertificate });
            setOtherGuardians(parsedData.otherGuardians || []); // Diğer velileri de ekle
        }
    }, []);

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="grid grid-cols-12 gap-28">
                    {renderGuardianForm(
                        fatherFormData,
                        "Father's General Information",
                        handleFatherInputChange,
                        handleFatherDateChange,
                        handleFatherDeceasedChange,
                        fatherSelectedFile,
                        handleFatherFileChange,
                        fatherFileInputRef,
                        handleFatherPlusClick,
                        fatherDeathCertificateFile,
                        handleFatherDeathCertificateChange,
                        fatherDeathCertificateInputRef,
                        handleFatherDeathCertificatePlusClick,
                        undefined,
                        false
                    )}

                    {renderGuardianForm(
                        motherFormData,
                        "Mother's General Information",
                        handleMotherInputChange,
                        handleMotherDateChange,
                        handleMotherDeceasedChange,
                        motherSelectedFile,
                        handleMotherFileChange,
                        motherFileInputRef,
                        handleMotherPlusClick,
                        motherDeathCertificateFile,
                        handleMotherDeathCertificateChange,
                        motherDeathCertificateInputRef,
                        handleMotherDeathCertificatePlusClick,
                        undefined,
                        false
                    )}
                </div>

                {otherGuardians.length > 0 &&
                    otherGuardians.map((guardian, index) => (
                        <div className="grid grid-cols-12 gap-28" key={index}>
                            {renderGuardianForm(
                                guardian,
                                `Other Guardian ${index + 1} Information`,
                                (e, fieldName) =>
                                    handleOtherGuardianInputChange(index, e, fieldName),
                                (date, fieldName) =>
                                    handleOtherGuardianDateChange(index, date, fieldName),
                                (value) => handleOtherGuardianDeceasedChange(index, value),
                                otherGuardianFiles[index] || null,
                                (e) => handleOtherGuardianFileChange(index, e),
                                setFileInputRefCallback(index),
                                () => handleOtherGuardianPlusClick(index),
                                otherGuardianDeathCertificateFiles[index] || null,
                                (e) => handleOtherGuardianDeathCertificateChange(index, e),
                                setDeathCertificateInputRefCallback(index),
                                () => handleOtherGuardianDeathCertificatePlusClick(index),
                                () => handleDeleteGuardian(index),
                                true
                            )}
                        </div>
                    ))}

                <button
                    type="button"
                    onClick={handleAddGuardian}
                    className="px-8 py-2 flex items-center gap-2 border-blue-500 border text-blue-500 rounded"
                >
                    <PlusIcon /> Add guardian
                </button>
            </Space>

            <div className="flex justify-end mt-12 space-x-5">
                <Link
                    to="/infos/general-information"
                    className="text-textSecondary border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
                >
                    Previous
                </Link>

                <Button
                    type="primary"
                    onClick={handleSubmit}
                    className="bg-primaryBlue text-white py-2 px-4 rounded"
                >
                    Next
                </Button>
            </div>
            {isFileUploadLoading && <div>File is uploading...</div>}
        </div>
    );
};

export default GuardiansInfo;