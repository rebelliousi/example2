import React, { useState, useRef, useEffect } from 'react';
import { Select, DatePicker, Input, message, Space, Button } from 'antd';
import 'antd';
import moment from 'moment';
import TrashIcon from '../../assets/icons/TrashIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import InfoCircleIcon from '../../assets/icons/InfoCircleIcon';
import { useSendFiles } from '../../hooks/Client/useSendFIles';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Enum'lar yerine sabit nesneler
const GuardianRelation = {
    FATHER: 'father',
    MOTHER: 'mother',
    GRANDPARENT: 'grandparent',
    SIBLING: 'sibling',
    UNCLE: 'uncle',
    AUNT: 'aunt',
} as const;

type GuardianRelationType = typeof GuardianRelation[keyof typeof GuardianRelation];

const DocumentType = {
    SCHOOL_CERTIFICATE: 'school_certificate',
    PASSPORT: 'passport',
    MILITARY_DOCUMENT: 'military_document',
    INFORMATION: 'information',
    RELATIONSHIP_TREE: 'relationship_tree',
    MEDICAL_RECORD: 'medical_record',
    DESCRIPTION: 'description',
    TERJIIMEHAL: 'terjiimehal',
    LABOR_BOOK: 'labor_book',
    DUSHUNDIRISH: 'Dushundirish',
} as const;

type DocumentTypeType = typeof DocumentType[keyof typeof DocumentType];

interface WithFilePaths {
    filePaths?: string[];
}

interface GuardianDocumentWithFile {
    type: DocumentTypeType;
    file: number | null;
}

interface GuardianWithFiles {
    relation: GuardianRelationType;
    first_name: string;
    last_name: string;
    father_name: string;
    date_of_birth: string;
    place_of_birth: string;
    phone: string;
    address: string;
    work_place: string;
    documents: GuardianDocumentWithFile[];
    filePaths: string[];
    isDeceased?: boolean | null;
}

// Guardian Form Component
interface GuardianFormProps {
    initialGuardians?: GuardianWithFiles[];
    onGuardiansSubmit: (guardians: GuardianWithFiles[]) => void;
}

const GuardianForm: React.FC<GuardianFormProps> = ({
    initialGuardians = [
        {
            relation: GuardianRelation.FATHER,
            first_name: '',
            last_name: '',
            father_name: '',
            date_of_birth: '',
            place_of_birth: '',
            phone: '',
            address: '',
            work_place: '',
            documents: [],
            filePaths: [],
            isDeceased: null,
        },
        {
            relation: GuardianRelation.MOTHER,
            first_name: '',
            last_name: '',
            father_name: '',
            date_of_birth: '',
            place_of_birth: '',
            phone: '',
            address: '',
            work_place: '',
            documents: [],
            filePaths: [],
            isDeceased: null,
        },
    ],
    onGuardiansSubmit,
}) => {
    const [guardians, setGuardians] = useState<GuardianWithFiles[]>(initialGuardians);
    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(initialGuardians.map(() => null));
    const [selectedDeathCertificateFiles, setSelectedDeathCertificateFiles] = useState<(File | null)[]>(initialGuardians.map(() => null));
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<(DocumentTypeType | null)[]>(initialGuardians.map(() => null));
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const deathCertificateInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [deathCertificateDocumentTypes, setDeathCertificateDocumentTypes] = useState<(DocumentTypeType | null)[]>(initialGuardians.map(() => null));

    const {
        mutate: uploadFile,
        isPending: isFileUploadLoading,
    } = useSendFiles();

    const navigate = useNavigate();

    useEffect(() => {
        fileInputRefs.current = fileInputRefs.current.slice(0, guardians.length);
        deathCertificateInputRefs.current = deathCertificateInputRefs.current.slice(0, guardians.length);
        setSelectedDocumentTypes(prev => prev.slice(0, guardians.length));
        setDeathCertificateDocumentTypes(prev => prev.slice(0, guardians.length));

        // Ensure state arrays match the number of guardians
        setSelectedFiles(prev => prev.slice(0, guardians.length).concat(Array(guardians.length - prev.length).fill(null)));
        setSelectedDeathCertificateFiles(prev => prev.slice(0, guardians.length).concat(Array(guardians.length - prev.length).fill(null)));
        setSelectedDocumentTypes(prev => prev.slice(0, guardians.length).concat(Array(guardians.length - prev.length).fill(null)));
        setDeathCertificateDocumentTypes(prev => prev.slice(0, guardians.length).concat(Array(guardians.length - prev.length).fill(null)));
    }, [guardians.length]);


    const handleGuardianChange = (index: number, name: string, value: any) => {
        let updatedValue = value;
        if (name === 'date_of_birth') {
            if (value && moment.isMoment(value)) {
                updatedValue = formatDateForApi(value);
            } else {
                updatedValue = ''; // or handle the invalid date case as needed
            }
        }

        setGuardians((prev) => {
            const newGuardians = [...prev];
            newGuardians[index] = {
                ...newGuardians[index],
                [name]: updatedValue,
            };
            return newGuardians;
        });
    };

    const handleFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const documentType = selectedDocumentTypes[index];

        if (!documentType) {
            message.error('Please select a document type first.');
            return;
        }

        if (file) {
            setSelectedFiles((prev) => {
                const newSelectedFiles = [...prev];
                newSelectedFiles[index] = file;
                return newSelectedFiles;
            });

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => {
                    setGuardians((prev) => {
                        const newGuardians = [...prev];
                        const updatedDocuments: GuardianDocumentWithFile[] = [...newGuardians[index].documents, {
                            type: documentType,
                            file: data.id,
                        }];
                        newGuardians[index] = {
                            ...newGuardians[index],
                            documents: updatedDocuments,
                            filePaths: [...(newGuardians[index].filePaths || []), data.path],
                        };
                        return newGuardians;
                    });
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        }
    };

    const handleDeathCertificateChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const documentType = deathCertificateDocumentTypes[index];

        if (!documentType) {
            message.error('Please select a document type first.');
            return;
        }

        if (file) {
            setSelectedDeathCertificateFiles((prev) => {
                const newFiles = [...prev];
                newFiles[index] = file;
                return newFiles;
            });

            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => {
                    setGuardians((prev) => {
                        const newGuardians = [...prev];
                        const updatedDocuments: GuardianDocumentWithFile[] = [...newGuardians[index].documents, {
                            type: documentType,
                            file: data.id,
                        }];
                        newGuardians[index] = {
                            ...newGuardians[index],
                            documents: updatedDocuments,
                            filePaths: [...(newGuardians[index].filePaths || []), data.path],
                        };
                        return newGuardians;
                    });
                    message.success('File uploaded successfully');
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
                },
            });
        }
    };


    const handlePlusClick = (index: number) => {
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.click();
        }
    };

    const handleDeathCertificatePlusClick = (index: number) => {
        if (deathCertificateInputRefs.current[index]) {
            deathCertificateInputRefs.current[index]!.click();
        }
    };

    const formatDateForApi = (date: moment.Moment | null): string => {
        if (!date) return '';
        return date.format('YYYY-MM-DD'); // API expects YYYY-MM-DD
    };

    const formatDateForInput = (dateString: string): moment.Moment | null => {
        if (!dateString) return null;
        return moment(dateString, 'YYYY-MM-DD');  // Parse as YYYY-MM-DD
    };

    const addGuardian = () => {
        setGuardians((prev) => ([
            ...prev,
            {
                relation: GuardianRelation.GRANDPARENT,
                first_name: '',
                last_name: '',
                father_name: '',
                date_of_birth: '',
                place_of_birth: '',
                phone: '',
                address: '',
                work_place: '',
                documents: [],
                filePaths: [],
                isDeceased: null,
            },
        ]));
        setSelectedFiles(prev => [...prev, null]);
        setSelectedDeathCertificateFiles(prev => [...prev, null]);
        setSelectedDocumentTypes(prev => [...prev, null]);
        setDeathCertificateDocumentTypes(prev => [...prev, null]);
    };

    const removeItem = (index: number) => {
        setGuardians((prev) => {
            const newItems = [...prev];
            newItems.splice(index, 1);
            return newItems;
        });
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });
        setSelectedDeathCertificateFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });
        setSelectedDocumentTypes(prev => {
            const newTypes = [...prev];
            newTypes.splice(index, 1);
            return newTypes;
        });
        setDeathCertificateDocumentTypes(prev => {
            const newTypes = [...prev];
            newTypes.splice(index, 1);
            return newTypes;
        });
    };

    const handleSubmit = () => {
        try {
            sessionStorage.setItem('guardianData', JSON.stringify(guardians));
            message.success('Guardian data saved to session storage!');
            onGuardiansSubmit(guardians);
        } catch (error) {
            console.error('Error saving to session storage:', error);
            message.error('Failed to save guardian data to session storage!');
        }

        navigate("/infos/education-info");
    };

    // Helper function to set fileInputRef at a specific index
    const setFileInputRef = (index: number, element: HTMLInputElement | null) => {
        if (fileInputRefs.current) {
            fileInputRefs.current[index] = element;
        }
    };

    const setDeathCertificateInputRef = (index: number, element: HTMLInputElement | null) => {
        if (deathCertificateInputRefs.current) {
            deathCertificateInputRefs.current[index] = element;
        }
    };

    const handleDeceasedChange = (index: number, value: boolean | null) => {
        setGuardians(prev => {
            const newGuardians = [...prev];
            newGuardians[index] = {
                ...newGuardians[index],
                isDeceased: value,
            };
            return newGuardians;
        });
    };

    const handleDocumentTypeChange = (index: number, value: DocumentTypeType | null) => {
        setSelectedDocumentTypes(prev => {
            const newTypes = [...prev];
            newTypes[index] = value;
            return newTypes;
        });
    };

    const handleDeathCertificateDocumentTypeChange = (index: number, value: DocumentTypeType | null) => {
        setDeathCertificateDocumentTypes(prev => {
            const newTypes = [...prev];
            newTypes[index] = value;
            return newTypes;
        });
    };

    // Function to render the form for a single guardian
    const renderGuardianForm = (guardian: GuardianWithFiles, index: number, isOtherGuardian: boolean = false) => (
        <div className="col-span-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-headerBlue text-[14px] font-[500]">
                    {guardian.relation === GuardianRelation.FATHER ? "Father's General Information" :
                        guardian.relation === GuardianRelation.MOTHER ? "Mother's General Information" :
                            `Guardian ${index + 1} General Information`}
                </h1>
                {guardian.relation !== GuardianRelation.FATHER && guardian.relation !== GuardianRelation.MOTHER && (
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className=" text-gray-400"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>

            {/* Conditionally render the Relation field based on the guardian's relation */}
            {guardian.relation !== GuardianRelation.FATHER && guardian.relation !== GuardianRelation.MOTHER && (
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Relation:
                    </label>
                    <div className="w-[400px]">
                        <Select
                            value={guardian.relation}
                            onChange={(value) => handleGuardianChange(index, 'relation', value)}
                            style={{ width: '100%', height: '40px' }}
                        >
                            {Object.entries(GuardianRelation).map(([key, value]) => (
                                <Select.Option key={key} value={value as GuardianRelationType}>
                                    {key}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
            )}

            {/* ... Rest of the form fields (first name, last name, etc.) ... */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <label className="w-44 font-[400] text-[14px] self-center">
                    First name
                </label>
                <Space>
                    <Input
                        placeholder="Enter First Name"
                        className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                        value={guardian.first_name}
                        onChange={(e) => handleGuardianChange(index, 'first_name', e.target.value)}
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
                        value={guardian.last_name}
                        onChange={(e) => handleGuardianChange(index, 'last_name', e.target.value)}
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
                        value={guardian.father_name}
                        onChange={(e) => handleGuardianChange(index, 'father_name', e.target.value)}
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
                        value={guardian.date_of_birth ? moment(guardian.date_of_birth) : null}
                        onChange={(date) => handleGuardianChange(index, 'date_of_birth', date)}
                        format="YYYY-MM-DD"
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
                        className="w-[400px]  border-[#DFE5EF] rounded-md text-[14px]"
                        value={guardian.place_of_birth}
                        onChange={(e) => handleGuardianChange(index, 'place_of_birth', e.target.value)}
                    />
                </Space>
            </div>

            {/*Conditionally render "Dead" select based on "isOtherGuardian" */}
            {!isOtherGuardian && (
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <label className="w-44 font-[400] text-[14px] self-center">
                        Dead?
                    </label>
                    <Space>
                        <Select
                            placeholder="Select"
                            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                            value={guardian.isDeceased === null ? undefined : guardian.isDeceased}
                            onChange={(value) => handleDeceasedChange(index, value)}
                            allowClear
                        >
                            <Select.Option value={true}>Yes</Select.Option>
                            <Select.Option value={false}>No</Select.Option>
                        </Select>
                    </Space>
                </div>
            )}

            {/* Render address and contact information only if NOT other guardian and not deceased OR if it IS an other guardian*/}
            {(!isOtherGuardian && guardian.isDeceased === false) || isOtherGuardian ? (
                <>
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">
                            Address
                        </label>
                        <Space>
                            <Input
                                placeholder="Enter Address"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={guardian.address}
                                onChange={(e) => handleGuardianChange(index, 'address', e.target.value)}
                            />
                        </Space>
                    </div>

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
                                placeholder="Enter Phone Number"
                                className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                                value={guardian.phone}
                                onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
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
                                value={guardian.work_place}
                                onChange={(e) => handleGuardianChange(index, 'work_place', e.target.value)}
                            />
                        </Space>
                    </div>
                    {/* Document Type Selection for Passport */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">
                            Document Type (Passport)
                        </label>
                        <div className="w-[400px]">
                            <Select
                                placeholder="Select Document Type"
                                className="w-full h-[40px] border-[#DFE5EF] rounded-md"
                                value={selectedDocumentTypes[index] || undefined}
                                onChange={(value) => handleDocumentTypeChange(index, value as DocumentTypeType)}
                            >
                                {Object.entries(DocumentType).map(([key, value]) => (
                                    <Select.Option key={key} value={value as DocumentTypeType}>
                                        {key}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Passport Upload */}
                    <div className="flex sm:flex-row items-start gap-4 mb-4">
                        <label className="w-44 font-[400] text-[14px] self-center">
                            Passport
                        </label>
                        <div className="flex w-[400px]">
                            <Space>
                                <div className="flex items-center justify-between w-[400px]">
                                    <Button
                                        onClick={() => handlePlusClick(index)}
                                        type="text"
                                        className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-full h-[40px] flex items-center justify-center"
                                    >
                                        {selectedFiles[index]
                                            ? selectedFiles[index]!.name
                                            : "Attach Passport copy"}
                                        <PlusIcon />
                                    </Button>
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileChange(index, e)}
                                        ref={(el) => {
                                            setFileInputRef(index, el);
                                        }}
                                    />
                                </div>
                            </Space>
                            <div className="flex items-center ml-4">
                                <InfoCircleIcon className="text-blue-500 hover:text-blue-700 mr-5" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                guardian.isDeceased === true && (
                    <>
                        {/* Document Type Selection for Death Certificate */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                Document Type (Death Certificate)
                            </label>
                            <div className="w-[400px]">
                                <Select
                                    placeholder="Select Document Type"
                                    className="w-full h-[40px] border-[#DFE5EF] rounded-md"
                                    value={deathCertificateDocumentTypes[index] || undefined}
                                    onChange={(value) => handleDeathCertificateDocumentTypeChange(index, value as DocumentTypeType)}
                                >
                                    {Object.entries(DocumentType).map(([key, value]) => (
                                        <Select.Option key={key} value={value as DocumentTypeType}>
                                            {key}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Death Certificate Upload */}
                        <div className="flex  sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                Death Certificate
                            </label>
                            <div className=" flex w-[400px]">
                                <Space>
                                    <div className="flex items-center justify-between  w-[400px]">
                                        <Button
                                            onClick={() => handleDeathCertificatePlusClick(index)}
                                            type="text"
                                            className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-full h-[40px] flex items-center justify-center"
                                        >
                                            {selectedDeathCertificateFiles[index]
                                                ? selectedDeathCertificateFiles[index]!.name
                                                : "Attach Death Certificate copy"}
                                            <PlusIcon />
                                        </Button>
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleDeathCertificateChange(index, e)}
                                            ref={(el) => {
                                                setDeathCertificateInputRef(index, el);
                                            }}
                                        />
                                    </div>
                                </Space>
                                <div className="flex items-center ml-4">
                                    <InfoCircleIcon className="text-blue-500 hover:text-blue-700 mr-5" />
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    );

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="grid grid-cols-12 gap-28 mb-14">
                    {/* Render Father's Form */}
                    {renderGuardianForm(guardians[0], 0)}

                    {/* Render Mother's Form */}
                    {renderGuardianForm(guardians[1], 1)}
                </div>

                {/* Render Additional Guardians */}
                {guardians.slice(2).map((guardian, index) => (
                    <div key={index + 2} className="grid grid-cols-12 gap-28 mb-14">
                        {renderGuardianForm(guardian, index + 2, true)}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addGuardian}
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

export default GuardianForm;