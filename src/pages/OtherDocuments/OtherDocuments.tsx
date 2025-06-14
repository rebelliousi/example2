import React, { useState, useRef, useEffect } from 'react';
import { Space, Button, message, Spin } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { Link, useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/icons/PlusIcon";
import TrashIcon from "../../assets/icons/TrashIcon"; // Import TrashIcon
import { useAddClient } from "../../hooks/Client/useAddClient";
import { useSendFiles } from "../../hooks/Client/useSendFIles";
import toast from "react-hot-toast";

type FileFieldName = "saglykKepilnama" | "threeArka" | "maglumat" | "terjimehal" | "threeXFourSurat" | "militaryService" | "nikaHaty";

enum DocumentType {
    SCHOOL_CERTIFICATE = "school_certificate",
    PASSPORT = "passport",
    MILITARY_DOCUMENT = "military_document",
    INFORMATION = "information",
    RELATIONSHIP_TREE = "relationship_tree",
    MEDICAL_RECORD = "medical_record",
    DESCRIPTION = "description",
    TERJIMEHAL = "terjiimehal", // Corrected
    LABOR_BOOK = "labor_book",
    SAGLYK_KEPILNAMA = "medical_record", // Assuming this is how you map it! double check.
    THREE_ARKA = "relationship_tree", // Updated
    MAGLUMAT = "information",
    THREE_X_FOUR_SURAT = "information", // Updated
    MILITARY_SERVICE = "military_document",
    NIKA_HATY = "nika_haty",
}

interface FileState {
    type: DocumentType;
    file: File | null;
    filePaths: string[];
    isUploading: boolean; // Yükleme durumunu takip etmek için
}

interface FileIdsState {
    [key: string]: number | null;
}

interface AwardInfo {
    awardType?: string;
    description?: string;
    certificate?: File | null;
}

// Interface for the Client Data
interface IClient {
    degree: string;
    primary_major: string;
    admission_major: string;
    user: any; // Replace 'any' with a more specific type if you have one for user info
    guardians: any[]; // Replace 'any[]' with a more specific type if you have one for guardian info
    institutions: any[]; // Replace 'any[]' with a more specific type if you have one for education info
    olympics: any[]; // Replace 'any[]' with a more specific type if you have one for award info
    documents: { type: DocumentType, file: number | null }[];
}

const OtherDocuments = () => {
    const navigate = useNavigate();
    const { mutate: addClient, isPending: isAddingClient } = useAddClient();
    const { mutate: uploadFile } = useSendFiles();

    const [files, setFiles] = useState<{ [key in FileFieldName]?: FileState }>({});
    const [fileIds, setFileIds] = useState<FileIdsState>({});

    const fileInputRefs = useRef<{
        [key in FileFieldName]: HTMLInputElement | null;
    }>({
        saglykKepilnama: null,
        threeArka: null,
        maglumat: null,
        terjimehal: null,
        threeXFourSurat: null,
        militaryService: null,
        nikaHaty: null,
    });

    const uploadDocument = async (fieldName: FileFieldName, file: File) => {
        return new Promise<number>((resolve, reject) => {
            const formData = new FormData();
            formData.append('path', file);

            uploadFile(formData, {
                onSuccess: (data: any) => {
                    setFileIds(prev => ({ ...prev, [fieldName]: data.id }));
                    setFiles(prev => {
                        const updatedFiles = { ...prev };
                        if (updatedFiles[fieldName]) {
                            updatedFiles[fieldName]!.isUploading = false;
                        }
                        return updatedFiles;
                    });
                    resolve(data.id);
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    toast.error('File upload failed');
                    setFiles(prev => {
                        const updatedFiles = { ...prev };
                        delete updatedFiles[fieldName];
                        return updatedFiles;
                    });
                    setFileIds(prev => {
                        const { [fieldName]: deleted, ...rest } = prev;
                        return rest;
                    });
                    reject(error);
                },
            });
        });
    };

    const handleFileChange = async (
        fieldName: FileFieldName,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({
                ...prev,
                [fieldName]: {
                    type: mapFileFieldToDocumentType(fieldName),
                    file: file,
                    filePaths: [],
                    isUploading: true
                }
            }));
            try {
                const fileId = await uploadDocument(fieldName, file);
                setFileIds(prev => ({ ...prev, [fieldName]: fileId }));
            } catch (error) {
                console.error("Something went wrong:", error);
                setFiles(prev => {
                    const updatedFiles = { ...prev };
                    delete updatedFiles[fieldName];
                    return updatedFiles;
                });
                setFileIds(prev => {
                    const { [fieldName]: deleted, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handlePlusClick = async (fieldName: FileFieldName) => {
        fileInputRefs.current[fieldName]?.click();
    };

    //Silme işlemini yönetecek fonksiyon
    const handleDeleteFile = (fieldName: FileFieldName) => {
        setFiles(prev => {
            const { [fieldName]: deleted, ...rest } = prev;
            return rest;
        });
        setFileIds(prev => {
            const { [fieldName]: deleted, ...rest } = prev;
            return rest;
        });
    };

    const handleSubmit = async () => {
        // Validation: Ensure required files are uploaded (except Nika Haty)
        const requiredFields: FileFieldName[] = ["saglykKepilnama", "threeArka", "maglumat", "terjimehal", "threeXFourSurat", "militaryService",];
        for (const field of requiredFields) {
            if (!fileIds[field]) {
                toast.error(`Please upload ${field}`);
                return; // Stop submission
            }
        }

        // Retrieve data from sessionStorage
        const degreeInformation = JSON.parse(sessionStorage.getItem('degreeInformation') || '{}');
        const generalInformation = JSON.parse(sessionStorage.getItem('generalInformation') || '{}');
        const guardians = JSON.parse(sessionStorage.getItem('guardians') || '[]');
        console.log("OtherDocuments - handleSubmit - sessionStorage'dan okunan guardians verisi:", guardians);
        const educationInformation = JSON.parse(sessionStorage.getItem('educationInformation') || '[]');
        const awardInformation = JSON.parse(sessionStorage.getItem('awardInformation') || '[]');

        // Create the IClient object
        const clientData: IClient = {
            degree: degreeInformation.degree,
            primary_major: degreeInformation.primary_major,
            admission_major: degreeInformation.admission_major,
            user: generalInformation,
            guardians: guardians.map((guardian: any) => ({
                ...guardian,
                date_of_birth: guardian.date_of_birth,
                documents: guardian.documents.map((doc: any) => ({
                    type: doc.type,
                    file: doc.file,
                })),
            })),
            institutions: educationInformation.map((education: any) => ({
                name: education.name,
                school_gpa: education.school_gpa,
                graduated_year: education.graduated_year,
                certificates: education.files,
            })),
            olympics: awardInformation.map((award: any) => ({
                type: award.type,
                description: award.description,
                files: award.files,
            })),
            documents: Object.entries(fileIds)
                .filter(([key, value]) => value !== null)
                .map(([key, value]) => {
                    let documentType: DocumentType | undefined;

                    switch (key) {
                        case "saglykKepilnama":
                            documentType = DocumentType.MEDICAL_RECORD; // Corrected mapping
                            break;
                        case "threeArka":
                            documentType = DocumentType.RELATIONSHIP_TREE;
                            break;
                        case "maglumat":
                            documentType = DocumentType.INFORMATION;
                            break;
                        case "terjimehal":
                            documentType = DocumentType.TERJIMEHAL;
                            break;
                        case "threeXFourSurat":
                            documentType = DocumentType.INFORMATION;
                            break;
                        case "militaryService":
                            documentType = DocumentType.MILITARY_DOCUMENT;
                            break;
                        case "nikaHaty":
                            documentType = DocumentType.NIKA_HATY;
                            break;
                        default:
                            documentType = undefined;
                            break;
                    }

                    return {
                        type: documentType!,
                        file: value,
                    };
                })
                .filter(doc => doc.type !== undefined) as { type: DocumentType; file: number | null }[],
        };

        console.log("Client Data being submitted:", clientData); // Verileri konsola yazdır

        // API call
        try {
            await addClient(clientData);
            toast.success('Application submitted');
            sessionStorage.clear();
            navigate("/application-status");
        } catch (error: any) {
            toast.error('An error occurred while submitting');
            console.error("Error", error);
        }
    };

    const mapFileFieldToDocumentType = (fieldName: FileFieldName): DocumentType => {
        switch (fieldName) {
            case "saglykKepilnama":
                return DocumentType.MEDICAL_RECORD;
            case "threeArka":
                return DocumentType.RELATIONSHIP_TREE;
            case "maglumat":
                return DocumentType.INFORMATION;
            case "terjimehal":
                return DocumentType.TERJIMEHAL;
            case "threeXFourSurat":
                return DocumentType.INFORMATION;
            case "militaryService":
                return DocumentType.MILITARY_DOCUMENT;
            case "nikaHaty":
                return DocumentType.NIKA_HATY;
            default:
                throw new Error(`Unknown field name: ${fieldName}`);
        }
    };

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="mb-4">
                    <h1 className="text-headerBlue text-[14px] font-[500]">
                        Other Documents
                    </h1>
                </div>

                <DocumentUpload
                    label="Saglyk kepilnama"
                    fieldName="saglykKepilnama"
                    file={files.saglykKepilnama?.file}
                    isUploading={files.saglykKepilnama?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.saglykKepilnama = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="3 arka"
                    fieldName="threeArka"
                    file={files.threeArka?.file}
                    isUploading={files.threeArka?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.threeArka = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="Maglumat"
                    fieldName="maglumat"
                    file={files.maglumat?.file}
                    isUploading={files.maglumat?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.maglumat = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="Terjimehal"
                    fieldName="terjimehal"
                    file={files.terjimehal?.file}
                    isUploading={files.terjimehal?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.terjimehal = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="3X4 surat"
                    fieldName="threeXFourSurat"
                    file={files.threeXFourSurat?.file}
                    isUploading={files.threeXFourSurat?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.threeXFourSurat = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="Military service"
                    fieldName="militaryService"
                    file={files.militaryService?.file}
                    isUploading={files.militaryService?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.militaryService = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required // Make required
                />

                <DocumentUpload
                    label="Nika haty"
                    fieldName="nikaHaty"
                    file={files.nikaHaty?.file}
                    isUploading={files.nikaHaty?.isUploading}
                    fileInputRef={el => (fileInputRefs.current.nikaHaty = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                    onDeleteFile={handleDeleteFile} //Dosya silme işleyicisi aktarılıyor
                    required={false} //Do not make it required
                />

                <div className="flex justify-end mt-12 space-x-5">
                    <Link
                        to='/infos/awards-info'
                        className="text-textSecondary bg-white border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all hover:duration-500"
                    >
                        Previous
                    </Link>

                    <button
                        onClick={handleSubmit}
                        className="bg-primaryBlue hover:text-white  text-white  py-2 px-4 rounded"
                        disabled={isAddingClient}
                    >
                        {isAddingClient ? "Submitting..." : "Finish"}
                    </button>
                </div>
            </Space>
        </div>
    );
};

interface DocumentUploadProps {
    label: string;
    fieldName: FileFieldName;
    file?: File | null;
    isUploading?: boolean;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileChange: (fieldName: FileFieldName, e: React.ChangeEvent<HTMLInputElement>) => void;
    onPlusClick: (fieldName: FileFieldName) => void;
    onDeleteFile: (fieldName: FileFieldName) => void; //Silme işleyicisi eklendi
    required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    label,
    fieldName,
    file,
    isUploading,
    fileInputRef,
    onFileChange,
    onPlusClick,
    onDeleteFile, //Silme işleyicisi alındı
    required = true
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-start gap-4  ">
            <label className="w-44 font-[400] text-[14px] self-center">{label}</label>
            <Space>
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={() => {
                            if (file) {
                                onDeleteFile(fieldName); //Dosyayı sil
                            } else {
                                onPlusClick(fieldName); //Dosya seçme penceresini aç
                            }
                        }}
                        type="text"
                        className="cursor-pointer hover:bg-hoverBgFile bg-bgFile border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                    >
                        {isUploading ? (
                            <Spin size="small" />
                        ) : (
                            <div className="flex items-center justify-center w-full gap-1">
                                {file ? file.name : "Attach document"}
                                {file ? <TrashIcon /> : <PlusIcon style={{ fontSize: '16px' }} />}
                            </div>
                        )}
                    </Button>

                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => onFileChange(fieldName, e)}
                        ref={fileInputRef}
                        required={required}
                    />

                    <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                </div>
            </Space>
        </div>
    );
};

export default OtherDocuments;