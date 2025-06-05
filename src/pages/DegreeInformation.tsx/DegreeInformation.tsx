import { Select, Space, message } from "antd";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import { useState, useEffect } from "react";
import { useAdmissionMajor } from "../../hooks/AdmissionMajor/useAdmissionMajor";
import { useAddClient } from "../../hooks/Client/useAddClient";
import { Link, useNavigate } from 'react-router-dom'; // useNavigate ekledik

const { Option } = Select;

const DegreeType = {
  BACHELOR: "BACHELOR",
  MASTER: "MASTER",
} as const;

type DegreeTypeKeys = keyof typeof DegreeType;
type ValueOf<T> = T[keyof T];
type DegreeTypeValue = ValueOf<typeof DegreeType>;

interface DegreeInformation {
  degree: DegreeTypeValue | null;
  primary_major: number | null;
  admission_major: (number | null)[];
}

const DegreeInformationForm = () => {
  const degreeOptions = [
    { label: "Bachelor's Degree", value: DegreeType.BACHELOR },
    { label: "Master's Degree", value: DegreeType.MASTER },
  ];

  const { data: majorData, isLoading: isMajorLoading } = useAdmissionMajor(1);
  const majorOptions = majorData?.results || [];

  const [degreeType, setDegreeType] = useState<DegreeTypeValue | null>(null);
  const [primaryMajor, setPrimaryMajor] = useState<number | null>(null);
  const [additionalMajors, setAdditionalMajors] = useState<(number | null)[]>(
    Array(3).fill(null)
  );

  const { mutate: addClient, isPending: isAddingClient } = useAddClient();

  const handlePrimaryMajorChange = (value: number) => {
    setPrimaryMajor(value);
  };

  const handleAdditionalMajorChange = (index: number, value: number | null) => {
    const newMajors = [...additionalMajors];
    newMajors[index] = value;
    setAdditionalMajors(newMajors);
  };

  const navigate = useNavigate(); // useNavigate'i tanımladık

  const handleSubmit = () => {
    if (!degreeType || !primaryMajor) {
      message.error("Please select Degree Type and Primary Major.");
      return;
    }

    const degreeInformation: DegreeInformation = {
      degree: degreeType,
      primary_major: primaryMajor,
      admission_major: additionalMajors.filter(
        (major) => major !== null
      ) as number[],
    };

    console.log("Degree Information:", degreeInformation);

    message.success("Degree information saved. Proceeding to the next page.");

    setDegreeType(null);
    setPrimaryMajor(null);
    setAdditionalMajors(Array(3).fill(null));

    navigate('/infos/general-information'); // Yönlendirme burada
  };

  // State for displaying additional major selects
  const [showAdditionalMajors, setShowAdditionalMajors] = useState(false);

  // Update showAdditionalMajors when degreeType changes
  useEffect(() => {
    setShowAdditionalMajors(degreeType === DegreeType.BACHELOR);
  }, [degreeType]);

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
                onChange={(value) => setDegreeType(value as DegreeTypeValue)} // Type assertion here
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
              onClick={() => navigate(-1)} // Önceki sayfaya gitme
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