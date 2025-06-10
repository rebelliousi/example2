import { Space, Button, message } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/icons/PlusIcon";
import { useAddClient } from "../../hooks/Client/useAddClient";
import { useSendFiles } from "../../hooks/Client/useSendFIles"; // useSendFiles import edildi
import moment from 'moment';

type FileFieldName = "saglykKepilnama" | "threeArka" | "maglumat" | "terjimehal" | "threeXFourSurat" | "militaryService" | "nikaHaty";

// DocumentType enum'ını tanımlayın
enum DocumentType {
    SCHOOL_CERTIFICATE = "school_certificate",
    PASSPORT = "passport",
    MILITARY_DOCUMENT = "military_document",
    INFORMATION = "information",
    RELATIONSHIP_TREE = "relationship_tree",
    MEDICAL_RECORD = "medical_record",
    DESCRIPTION = "description",
    TERJIMEHAL = "terjiimehal",
    LABOR_BOOK = "labor_book",
    // Döküman tiplerini backend'deki tanımlara göre güncelleyin
    SAGLYK_KEPILNAMA = "medical_record", // Saglyk kepilnama için MEDICAL_RECORD
    THREE_ARKA = "information", // 3 arka için INFORMATION (emin değilim, teyit edin)
    MAGLUMAT = "information", // Maglumat için INFORMATION
    THREE_X_FOUR_SURAT = "medical_record", // 3X4 surat için MEDICAL_RECORD (emin değilim, teyit edin)
    MILITARY_SERVICE = "medical_record", // Military service için MEDICAL_RECORD
    NIKA_HATY = "medical_record", // Nika haty için MEDICAL_RECORD (emin değilim, teyit edin)
}

interface FileState {
    type: DocumentType;
    file: File | null;
    filePaths: string[]; // Burada string[] olması daha mantıklı, dosya yollarını tutacak
}

interface FileIdsState {
    [key: string]: number | null; // Field name'e karşılık gelen file ID'sini tutacak
}

interface AwardInfo {
    awardType?: string;
    description?: string;
    certificate?: File | null;
}


const OtherDocuments = () => {
    const navigate = useNavigate();
    const { mutate: addClient, isPending: isAddingClient } = useAddClient();
    const { mutate: uploadFile, isPending: isFileUploadLoading } = useSendFiles(); // useSendFiles hook'u

    const [files, setFiles] = useState<{ [key in FileFieldName]?: File | null }>({});

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
                    resolve(data.id);
                },
                onError: (error: any) => {
                    console.error('File upload failed', error);
                    message.error('File upload failed');
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
            setFiles(prev => ({ ...prev, [fieldName]: file }));
            try {
                const fileId = await uploadDocument(fieldName, file); // Dosyayı yükle ve ID'yi al
                setFileIds(prev => ({ ...prev, [fieldName]: fileId })); // File ID'yi state'e kaydet
            } catch (error) {
                console.error("Dosya yüklenirken hata oluştu:", error);
                // Hata durumunda kullanıcıyı bilgilendirebilirsiniz.
            }
        }
    };

    const handlePlusClick = (fieldName: FileFieldName) => {
        fileInputRefs.current[fieldName]?.click();
    };

    const handleSubmit = async () => {
        // sessionStorage'dan tüm verileri oku
        const degreeInformation = JSON.parse(sessionStorage.getItem('degreeInformation') || '{}');
        const generalInformation = JSON.parse(sessionStorage.getItem('generalInformation') || '{}');
        const guardians = JSON.parse(sessionStorage.getItem('guardianFormData') || '[]').guardians || []; // Düzeltme: Doğru anahtarı kullan
        const educationInformation = JSON.parse(sessionStorage.getItem('educationInformation') || '[]');
        const awardInformation = JSON.parse(sessionStorage.getItem('awardInformation') || '[]');

        // FormData oluştur
        const formData = new FormData();

        // Genel Bilgileri Ekle
        for (const key in generalInformation) {
            formData.append(`user[${key}]`, generalInformation[key] || '');
        }

        // Veli Bilgilerini Ekle
        guardians.forEach((guardian: any, index: number) => {
            for (const key in guardian) {
                if (key === 'documents') {
                    // documents dizisini doğru şekilde işle
                    guardian.documents.forEach((doc: any, docIndex: number) => {
                        formData.append(`guardians[${index}][documents][${docIndex}][type]`, doc.type || '');
                        formData.append(`guardians[${index}][documents][${docIndex}][file]`, doc.file || '');
                    });
                } else {
                    formData.append(`guardians[${index}][${key}]`, guardian[key] || '');
                }
            }
        });

        // Kurum Bilgilerini Ekle
        educationInformation.forEach((education: any, index: number) => {
            for (const key in education) {
                formData.append(`institutions[${index}][${key}]`, education[key] || '');
            }
        });

        // Ödül Bilgilerini Ekle
        awardInformation.forEach((award: any, index: number) => {
            formData.append(`olympics[${index}][type]`, award.type || '');
            formData.append(`olympics[${index}][description]`, award.description || '');
            award.files.forEach((fileId: any, fileIndex: number) => {
                formData.append(`olympics[${index}][files][${fileIndex}]`, fileId || '');
            });
        });

        // Diğer Dosyaları Ekle
        let documentIndex = 0;
        for (const key in fileIds) {
            if (fileIds[key] !== null) {
                formData.append(`documents[${documentIndex}][file]`, fileIds[key]!.toString());
                // key değerini DocumentType enum'ına göre eşleştir
                let documentType: string | null = null;
                switch (key) {
                    case "saglykKepilnama":
                        documentType = DocumentType.SAGLYK_KEPILNAMA;
                    break;
                    case "threeArka":
                        documentType = DocumentType.THREE_ARKA;
                        break;
                    case "maglumat":
                        documentType = DocumentType.MAGLUMAT;
                        break;
                    case "terjimehal":
                        documentType = DocumentType.TERJIMEHAL;
                        break;
                    case "threeXFourSurat":
                        documentType = DocumentType.THREE_X_FOUR_SURAT;
                        break;
                    case "militaryService":
                        documentType = DocumentType.MILITARY_SERVICE;
                    break;
                    case "nikaHaty":
                        documentType = DocumentType.NIKA_HATY;
                        break;
                    default:
                        documentType = null;
                        break;
                }
                if (documentType) {
                    formData.append(`documents[${documentIndex}][type]`, documentType);
                    documentIndex++;
                }
            }
        }

        // Diğer form verilerini ekle
        formData.append('degree', degreeInformation.degree || '');
        formData.append('primary_major', degreeInformation.primary_major || '');
        degreeInformation.admission_major.forEach((major: number, index: number) => {
            formData.append(`admission_major[${index}]`, major.toString() || '');
        });

        formData.append('status', "PENDING");

        // API'ye Gönder
        try {
            await addClient(formData);
            message.success('Başvuru gönderildi');
            sessionStorage.clear();
            navigate("/application-status");
        } catch (error: any) {
            message.error('Başvuru gönderilirken bir hata oluştu');
            console.error("Hata", error);
        }
    };

    useEffect(() => {
        const storedFiles = sessionStorage.getItem('otherDocumentsInformation');
        if (storedFiles) {
            const parsedFiles = JSON.parse(storedFiles);
            setFiles(parsedFiles);
        }
    }, []);

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
                    file={files.saglykKepilnama}
                    fileInputRef={el => (fileInputRefs.current.saglykKepilnama = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="3 arka"
                    fieldName="threeArka"
                    file={files.threeArka}
                    fileInputRef={el => (fileInputRefs.current.threeArka = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="Maglumat"
                    fieldName="maglumat"
                    file={files.maglumat}
                    fileInputRef={el => (fileInputRefs.current.maglumat = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="Terjimehal"
                    fieldName="terjimehal"
                    file={files.terjimehal}
                    fileInputRef={el => (fileInputRefs.current.terjimehal = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="3X4 surat"
                    fieldName="threeXFourSurat"
                    file={files.threeXFourSurat}
                    fileInputRef={el => (fileInputRefs.current.threeXFourSurat = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="Military service"
                    fieldName="militaryService"
                    file={files.militaryService}
                    fileInputRef={el => (fileInputRefs.current.militaryService = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <DocumentUpload
                    label="Nika haty"
                    fieldName="nikaHaty"
                    file={files.nikaHaty}
                    fileInputRef={el => (fileInputRefs.current.nikaHaty = el)}
                    onFileChange={handleFileChange}
                    onPlusClick={handlePlusClick}
                />

                <div className="flex justify-end mt-12 space-x-5">
                    <Link
                        to='/infos/awards-info'
                        className="text-textSecondary border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
                    >
                        Previous
                    </Link>

                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        className="bg-primaryBlue text-white py-2 px-4 rounded"
                        disabled={isAddingClient || isFileUploadLoading}
                    >
                        {isAddingClient ? "Submitting..." : "Finish"}
                        {isFileUploadLoading && " (Uploading...)"}
                    </Button>
                </div>
            </Space>
        </div>
    );
};

interface DocumentUploadProps {
    label: string;
    fieldName: FileFieldName;
    file?: File | null;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onFileChange: (fieldName: FileFieldName, e: React.ChangeEvent<HTMLInputElement>) => void;
    onPlusClick: (fieldName: FileFieldName) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    label,
    fieldName,
    file,
    fileInputRef,
    onFileChange,
    onPlusClick,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-start gap-4  ">
            <label className="w-44 font-[400] text-[14px] self-center">{label}</label>
            <Space>
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={() => onPlusClick(fieldName)}
                        type="text"
                        className="cursor-pointer hover:bg-hoverBgFile bg-bgFile border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                    >
                        {file ? file.name : "Attach document"}
                        <PlusIcon />
                    </Button>

                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => onFileChange(fieldName, e)}
                        ref={fileInputRef}
                    />

                    <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                </div>
            </Space>
        </div>
    );
};

export default OtherDocuments;