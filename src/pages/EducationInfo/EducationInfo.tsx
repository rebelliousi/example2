import { Input, Space, Button, DatePicker, message } from "antd";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useArea } from "../../hooks/Area/useAreas";
import type { Moment } from "moment";
import PlusIcon from "../../assets/icons/PlusIcon";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import moment from 'moment'; // moment'i import et
import { useSendFiles } from '../../hooks/Client/useSendFIles'; // Hook'un doğru konumunu belirtin

// const { Option } = Select; // REMOVE THIS LINE - Select is no longer used!

interface EducationInformation {
    name: string;
    school_gpa: number;
    graduated_year: number;
    files: string[]; // Assuming file IDs from backend
    filePaths: string[]; // Assuming file paths from backend
}

type EducationInformationKey = keyof EducationInformation;


const EducationInfo = () => {
    const { data: areaData, isLoading: isAreaLoading } = useArea();
    const areaOptions = areaData?.results || [];
    const navigate = useNavigate();

    const [educationInfos, setEducationInfos] = useState<EducationInformation[]>([
        {
            name: '',
            school_gpa: 0,
            graduated_year: 0,
            files: [],
            filePaths: [],
        },
    ]);

    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([]);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        fileInputRefs.current = Array(educationInfos.length).fill(null);
    }, [educationInfos.length]);

    const { mutate: uploadFile, isPending: isFileUploadLoading } = useSendFiles(); // useSendFiles hook'unu ekleyin

    const handleInputChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: EducationInformationKey
    ) => {
        const newEducationInfos = [...educationInfos];
        newEducationInfos[index] = {
            ...newEducationInfos[index],
            [fieldName]: fieldName === 'school_gpa' ? parseFloat(e.target.value) : e.target.value as any, // Type assertion for dynamic keys
        };
        setEducationInfos(newEducationInfos);
    };

    const handleNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleInputChange(index, e, "name");
    };

    const handleSchoolGpaChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleInputChange(index, e, "school_gpa");
    };

    const handleGraduatedYearChange = (index: number, date: Moment | null) => {
        const newEducationInfos = [...educationInfos];
        newEducationInfos[index] = {
            ...newEducationInfos[index],
            graduated_year: date ? date.year() : 0, // Extract the year
        };
        setEducationInfos(newEducationInfos);
    };


    const deleteFile = (index: number) => {
        setSelectedFiles((prevSelectedFiles) => {
            const newSelectedFiles = [...prevSelectedFiles];
            newSelectedFiles[index] = null; // Dosyayı listeden kaldır
            return newSelectedFiles;
        });

        setEducationInfos((prevEducationInfos) => {
            const newEducationInfos = [...prevEducationInfos];
            newEducationInfos[index] = {
                ...newEducationInfos[index],
                files: [], // Sertifika listesini temizle - Changed to 'files'
                filePaths: [], // Dosya yolu listesini temizle
            };
            return newEducationInfos;
        });

        message.success('File deleted successfully');
    };

    const handleFileChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;

        setSelectedFiles((prevSelectedFiles) => {
            const newSelectedFiles = [...prevSelectedFiles];
            newSelectedFiles[index] = file;
            return newSelectedFiles;
        });

        if (file) {
            const formData = new FormData();
            formData.append('path', file); // 'path' yerine sunucunuzun beklediği alanı kullanın

            uploadFile(formData, {
                onSuccess: (data: any) => {
                    // Dosya başarıyla yüklendi, sunucudan dönen URL veya ID'yi kullanın
                    const newEducationInfos = [...educationInfos];
                    newEducationInfos[index] = {
                        ...newEducationInfos[index],
                        files: [...newEducationInfos[index].files, data.id], // Veya sunucudan dönen URL'yi kullanın: data.path - Changed to 'files' and assumed data.id is the file ID
                        filePaths: [...newEducationInfos[index].filePaths, data.path],
                    };
                    setEducationInfos(newEducationInfos);
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

    const handleAddEducationInfo = () => {
        setEducationInfos((prevEducationInfos) => [
            ...prevEducationInfos,
            {
                name: '',
                school_gpa: 0,
                graduated_year: 0,
                files: [],
                filePaths: [],
            },
        ]);

        setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, null]);
    };

    const handleDeleteEducationInfo = (index: number) => {
        setEducationInfos((prevEducationInfos) => {
            const newEducationInfos = [...prevEducationInfos];
            newEducationInfos.splice(index, 1);
            return newEducationInfos;
        });

        setSelectedFiles((prevSelectedFiles) => {
            const newSelectedFiles = [...prevSelectedFiles];
            newSelectedFiles.splice(index, 1);
            return newSelectedFiles;
        });

        fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
    };

    const handleSubmit = () => {
        // Validation before saving to sessionStorage
        const hasEmptyName = educationInfos.some(info => !info.name);

        if (hasEmptyName) {
            message.error("Please enter a school name for all entries.");
            return; // Stop submission
        }

        // sessionStorage'a kaydet
        sessionStorage.setItem('educationInformation', JSON.stringify(educationInfos));
        navigate("/infos/awards-info");
    };

    const setFileInputRef = (index: number, el: HTMLInputElement | null) => {
        fileInputRefs.current[index] = el;
    };

    useEffect(() => {
        const storedEducationInfos = sessionStorage.getItem('educationInformation');
        if (storedEducationInfos) {
            const parsedData = JSON.parse(storedEducationInfos);

            // Tarih dönüştürme işlemini kaldır veya sadece yılı al
            const educationInfosWithYear = parsedData.map((educationInfo: any) => ({
                ...educationInfo,
                graduated_year: educationInfo.graduated_year ? parseInt(educationInfo.graduated_year, 10) : 0,
            }));
            setEducationInfos(educationInfosWithYear);
        }
    }, []);

    return (
        <div className="pt-10 px-4 pb-10">
            <Space direction="vertical" size="middle" className="w-full">

                {educationInfos.map((educationInfo, index) => (
                    <div key={index} className="mb-14">
                        <div className="mb-4">
                            <h1 className="text-headerBlue text-[14px] font-[500]">
                                {index === 0
                                    ? "School Graduation Information"
                                    : "Other Graduation Information"}
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                School Name
                            </label>
                            <Space>
                                <Input
                                    placeholder="Enter School Name"
                                    className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                    value={educationInfo.name || ""}
                                    onChange={(e) => handleNameChange(index, e)}
                                />
                            </Space>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                School GPA
                            </label>
                            <Space>
                                <Input
                                    type="number"
                                    placeholder="Enter School GPA"
                                    className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                                    value={educationInfo.school_gpa?.toString() || ""}
                                    onChange={(e) => handleSchoolGpaChange(index, e)}
                                />
                            </Space>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                            <label className="w-44 font-[400] text-[14px] self-center">
                                Graduated year
                            </label>
                            <Space>
                                <DatePicker
                                    picker="year"
                                    className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                                    value={educationInfo.graduated_year ? moment(educationInfo.graduated_year.toString(), 'YYYY') : null}
                                    onChange={(date) => handleGraduatedYearChange(index, date)}
                                    placeholder="Select Year"
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
                                            onClick={() => {
                                                if (selectedFiles[index]) {
                                                    deleteFile(index);
                                                } else {
                                                    handlePlusClick(index);
                                                }
                                            }}
                                            type="text"
                                            className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                                        >
                                            {selectedFiles[index]
                                                ? selectedFiles[index]!.name
                                                : "Attach document"}
                                            {selectedFiles[index] ? <TrashIcon className='w-5' /> : <PlusIcon style={{ fontSize: '16px', marginLeft: '5px' }} />}
                                        </Button>

                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileChange(index, e)}
                                        ref={(el) => {
                                            if (el) {
                                                setFileInputRef(index, el);
                                            }
                                        }}
                                        accept="image/*,application/pdf"
                                    />

                                    <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                                </div>
                            </Space>
                        </div>
                        {index > 0 && (
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

                <div className="flex justify-end mt-12 space-x-5">
                    <Link
                        to="/infos/guardians-info"
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
            </Space>
            {isFileUploadLoading && <div>File is uploading...</div>} {/* Yükleme göstergesi */}
        </div>
    );
};

export default EducationInfo;