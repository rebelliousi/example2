import { Select, Space, message } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useEffect } from "react";
import { useAdmissionMajor } from "../../hooks/AdmissionMajor/useAdmissionMajor";
import { useAddClient } from "../../hooks/Client/useAddClient";
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const DegreeType = {
    BACHELOR: "BACHELOR",
    MASTER: "MASTER",
} as const;

type DegreeTypeValue = "BACHELOR" | "MASTER";

interface DegreeInformation {
    degree: DegreeTypeValue;
    primary_major: number;
    admission_major: number[];
}

const DegreeInformationForm = () => {
    const degreeOptions = [
        { label: "Bachelor's Degree", value: DegreeType.BACHELOR },
        { label: "Master's Degree", value: DegreeType.MASTER },
    ];

    const { data: majorData, isLoading: isMajorLoading } = useAdmissionMajor(1);
    const majorOptions = majorData?.results || [];

    const [degreeType, setDegreeType] = useState<DegreeTypeValue | undefined>(undefined);
    const [primaryMajor, setPrimaryMajor] = useState<number | undefined>(undefined);
    const [additionalMajors, setAdditionalMajors] = useState<number[]>([]); // number[] olarak değiştirildi

    const { mutate: addClient, isPending: isAddingClient } = useAddClient();

    const handlePrimaryMajorChange = (value: number) => {
        setPrimaryMajor(value);
    };

    const handleAdditionalMajorChange = (index: number, value: number | null) => {
        const newMajors = [...additionalMajors];
        if (value !== null) {
            newMajors[index] = value;
        } else {
            newMajors.splice(index, 1); // Değeri sil
        }
        setAdditionalMajors(newMajors);
    };

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!degreeType || !primaryMajor) {
            message.error("Please select Degree Type and Primary Major.");
            return;
        }

        const degreeInformation: DegreeInformation = {
            degree: degreeType,
            primary_major: primaryMajor,
            admission_major: additionalMajors, // Filtreleme kaldırıldı
        };

        // sessionStorage'a kaydet
        sessionStorage.setItem('degreeInformation', JSON.stringify(degreeInformation));

        console.log("Degree Information:", degreeInformation);
        message.success("Degree information saved. Proceeding to the next page.");

        navigate('/infos/general-information');
    };

    // State for displaying additional major selects
    const [showAdditionalMajors, setShowAdditionalMajors] = useState(false);

    // Update showAdditionalMajors when degreeType changes
    useEffect(() => {
        setShowAdditionalMajors(degreeType === DegreeType.BACHELOR);
    }, [degreeType]);

    // Sayfa yüklendiğinde sessionStorage'dan verileri geri yükle
    useEffect(() => {
        const storedDegreeInformation = sessionStorage.getItem('degreeInformation');
        if (storedDegreeInformation) {
            const parsedData = JSON.parse(storedDegreeInformation);
            setDegreeType(parsedData.degree);
            setPrimaryMajor(parsedData.primary_major);
            // additionalMajors'ı number[]'e dönüştür
            setAdditionalMajors(((parsedData.admission_major || []) as any[]).filter((major) => typeof major === 'number'));
        }
    }, []);

    return (

        <div className="pt-10 px-4">
            <div className="mb-4">
                <h1 className="text-headerBlue text-[14px] font-[500]">
                    Degree Information
                </h1>
            </div>

            <Space direction="vertical" size="middle" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="w-32 font-[400] text-[14px]">Degree Type</label>
                    <Space>
                        <Select
                            placeholder="Select Degree Type"
                            className="w-[400px]  h-[40px] border-[#DFE5EF] rounded-lg"
                            value={degreeType}
                            onChange={(value) => setDegreeType(value as DegreeTypeValue)}
                        >
                            {degreeOptions.map((degree) => (
                                <Option key={degree.value} value={degree.value}>
                                    {degree.label}
                                </Option>
                            ))}
                        </Select>
                        <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                    </Space>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="w-32 font-[400] text-[14px]">Primary Major</label>
                    <Space>
                        <Select
                            placeholder="Select Primary Major"
                            className="rounded-lg w-[400px] h-[40px] border-[#DFE5EF]"
                            value={primaryMajor}
                            onChange={handlePrimaryMajorChange}
                            loading={isMajorLoading}
                            disabled={isMajorLoading}
                        >
                            {majorOptions.map((major) => (
                                <Option key={major.id} value={major.id}>
                                    {major.major}
                                </Option>
                            ))}
                        </Select>
                        <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                    </Space>
                </div>

                {/* Conditional rendering of additional major selects */}
                {showAdditionalMajors &&
                    [0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                            <label className="w-32 font-[400] text-[14px]">
                                Major {index + 2}
                            </label>
                            <Space>
                                <Select
                                    placeholder={`Select Major ${index + 2}`}
                                    className="rounded-lg w-[400px] h-[40px] border-[#DFE5EF]"
                                    value={additionalMajors[index]}
                                    onChange={(value) =>
                                        handleAdditionalMajorChange(index, value)
                                    }
                                    loading={isMajorLoading}
                                    disabled={isMajorLoading}
                                    allowClear
                                >
                                    {majorOptions.map((major) => (
                                        <Option key={major.id} value={major.id}>
                                            {major.major}
                                        </Option>
                                    ))}
                                </Select>
                                {index === 0 && (
                                    <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                                )}
                            </Space>
                        </div>
                    ))}

                <div className="flex justify-end mt-10 space-x-5">
                    <button
                        className="text-textSecondary border  border-#DFE5EF hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
                        onClick={() => navigate(-1)}
                        disabled={isAddingClient}
                    >
                        Previous
                    </button>

                    <Link to='/infos/general-information'
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

export default DegreeInformationForm;