import { Input, Space, message, Select, Button, DatePicker } from "antd";
import { useState, useRef, useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";
import { useArea } from "../../hooks/Area/useAreas";
import type { Moment } from "moment";
import PlusIcon from "../../assets/icons/PlusIcon";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";
import TrashIcon from "../../assets/icons/TrashIcon";

const { Option } = Select;

interface DegreeInformation {
  graduatedSchool: string | null;
  graduatedYear: Moment | null;
  region: number | null;
  district: string | null;
  certificateOfGraduation: File | null;
}

type DegreeInformationKey = keyof DegreeInformation;

const EducationInfo = () => {
  const { data: areaData, isLoading: isAreaLoading } = useArea();
  const areaOptions = areaData?.results || [];
  const navigate = useNavigate();

  const [educationInfos, setEducationInfos] = useState<DegreeInformation[]>([
    {
      graduatedSchool: null,
      graduatedYear: null,
      region: null,
      district: null,
      certificateOfGraduation: null,
    },
  ]);

  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize fileInputRefs array with nulls based on the number of education infos
  useEffect(() => {
    fileInputRefs.current = Array(educationInfos.length).fill(null);
  }, [educationInfos.length]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: DegreeInformationKey
  ) => {
    const newEducationInfos = [...educationInfos];
    newEducationInfos[index] = {
      ...newEducationInfos[index],
      [fieldName]: e.target.value,
    };
    setEducationInfos(newEducationInfos);
  };

  const handleRegionChange = (index: number, value: number | null) => {
    const newEducationInfos = [...educationInfos];
    newEducationInfos[index] = { ...newEducationInfos[index], region: value };
    setEducationInfos(newEducationInfos);
  };

  const handleGraduatedYearChange = (index: number, date: Moment | null) => {
    const newEducationInfos = [...educationInfos];
    newEducationInfos[index] = {
      ...newEducationInfos[index],
      graduatedYear: date,
    };
    setEducationInfos(newEducationInfos);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setSelectedFiles(prevSelectedFiles => {
      const newSelectedFiles = [...prevSelectedFiles];
      newSelectedFiles[index] = file;
      return newSelectedFiles;
    });

    const newEducationInfos = [...educationInfos];
    newEducationInfos[index] = {
      ...newEducationInfos[index],
      certificateOfGraduation: file,
    };
    setEducationInfos(newEducationInfos);
  };

  const handlePlusClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.click();
    }
  };

  const handleAddEducationInfo = () => {
    setEducationInfos(prevEducationInfos => [
      ...prevEducationInfos,
      {
        graduatedSchool: null,
        graduatedYear: null,
        region: null,
        district: null,
        certificateOfGraduation: null,
      },
    ]);

    setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, null]);
  };

    const handleDeleteEducationInfo = (index: number) => {
        setEducationInfos(prevEducationInfos => {
            const newEducationInfos = [...prevEducationInfos];
            newEducationInfos.splice(index, 1);
            return newEducationInfos;
        });

        setSelectedFiles(prevSelectedFiles => {
            const newSelectedFiles = [...prevSelectedFiles];
            newSelectedFiles.splice(index, 1);
            return newSelectedFiles;
        });

        // Update fileInputRefs after deleting an education info
        fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);

    };


  const handleSubmit = async () => {
    console.log("Form Data:", educationInfos);
    console.log("Selected Files:", selectedFiles);

    const formDataToSend = new FormData();

    educationInfos.forEach((educationInfo, index) => {
      for (const key in educationInfo) {
        if (educationInfo.hasOwnProperty(key)) {
          const typedKey = key as DegreeInformationKey;
          let value: any = educationInfo[typedKey];

          if (typedKey === "graduatedYear") {
            value = educationInfo[typedKey]
              ? (educationInfo[typedKey] as Moment).format("YYYY-MM-DD")
              : "";
          }

          if (typedKey !== "certificateOfGraduation") {
            formDataToSend.append(
              `educationInfos[${index}][${key}]`,
              value === null ? "" : String(value)
            );
          }
        }
      }

      // Check if the selected file exists before appending to the FormData
      if (selectedFiles[index]) {
        formDataToSend.append(
          `educationInfos[${index}][certificateOfGraduation]`,
          selectedFiles[index]! // Non-null assertion because of the check above
        );
      }
    });

    try {
      const response = await fetch("/api/save-education-info", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        message.success("Education information saved successfully!");
        navigate("/infos/award-info");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        message.error(
          `Error saving education information. Server responded with: ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }
    } catch (error) {
      console.error("Error saving education information:", error);
      message.error("Network error during save.");
    }
  };

  return (
    <div className="pt-10 px-4 pb-10">
      <Space direction="vertical" size="middle" className="w-full">
        {/* General Information */}
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
                Graduated school
              </label>
              <Space>
                <Input
                  placeholder="Enter Graduated School"
                  className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px]"
                  value={educationInfo.graduatedSchool || ""}
                  onChange={(e) =>
                    handleInputChange(index, e, "graduatedSchool")
                  }
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
                  value={educationInfo.graduatedYear}
                  onChange={(date) => handleGraduatedYearChange(index, date)}
                  placeholder="Select Year"
                />
              </Space>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <label className="w-44 font-[400] text-[14px] self-center">
                Region
              </label>
              <Space>
                <Select
                  placeholder="Select Region"
                  className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md"
                  value={educationInfo.region || undefined}
                  onChange={(value) => handleRegionChange(index, value)}
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
              <label className="w-44 font-[400] text-[14px] self-center">
                District
              </label>
              <Space>
                <Input
                  placeholder="Enter District"
                  className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
                  value={educationInfo.district || ""}
                  onChange={(e) => handleInputChange(index, e, "district")}
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
                    {selectedFiles[index]
                      ? selectedFiles[index]!.name
                      : "Attach document"}
                    <PlusIcon />
                  </Button>

                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(index, e)}
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    accept="image/*,application/pdf"
                  />

                  <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
                </div>
              </Space>

            </div>
            {index > 0 && (  // Conditionally render the delete button
              <button
                  onClick={() => handleDeleteEducationInfo(index)} // Add onClick handler
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
    </div>
  );
};

export default EducationInfo;