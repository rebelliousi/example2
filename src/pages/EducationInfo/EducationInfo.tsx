import { Input, Space, message, Select, Button, DatePicker } from "antd";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useArea } from "../../hooks/Area/useAreas";
import type { Moment } from "moment";
import PlusIcon from "../../assets/icons/PlusIcon";
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";

const { Option } = Select;

interface DegreeInformation {
  graduatedSchool: string | null;
  graduatedYear: Moment | null;
  region: number | null;
  district: string | null;
  certificateOfGraduation: File | null; // Changed from passport to certificateOfGraduation
}

type DegreeInformationKey = keyof DegreeInformation;

const EducationInfo = () => {
  const { data: areaData, isLoading: isAreaLoading } = useArea();
  const areaOptions = areaData?.results || [];
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DegreeInformation>({
    graduatedSchool: null,
    graduatedYear: null,
    region: null,
    district: null,
    certificateOfGraduation: null, // Changed initial value
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: DegreeInformationKey
  ) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleRegionChange = (value: number | null) => {
    setFormData({ ...formData, region: value });
  };

  const handleGraduatedYearChange = (date: Moment | null) => {
    setFormData({ ...formData, graduatedYear: date });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, certificateOfGraduation: file }); // Changed state update
    } else {
      setSelectedFile(null);
      setFormData({ ...formData, certificateOfGraduation: null }); // Changed state update
    }
  };

  const handlePlusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    console.log("Form Data:", formData);
    console.log("Selected File:", selectedFile);

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const typedKey = key as DegreeInformationKey;
        let value: any = formData[typedKey];

        if (typedKey === "graduatedYear") {
          value = formData[typedKey]
            ? (formData[typedKey] as Moment).format("YYYY-MM-DD")
            : "";
        }

        if (typedKey !== "certificateOfGraduation") { // Changed check
          formDataToSend.append(key, value === null ? "" : String(value));
        }
      }
    }

    if (selectedFile) {
      formDataToSend.append("certificateOfGraduation", selectedFile); // Changed append name
    }

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
        <div className="mb-14">
          <div className="mb-4">
            <h1 className="text-headerBlue text-[14px] font-[500]">
              School Graduation Information
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
                value={formData.graduatedSchool || ""}
                onChange={(e) => handleInputChange(e, "graduatedSchool")}
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
                value={formData.graduatedYear}
                onChange={handleGraduatedYearChange}
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
                value={formData.region || undefined}
                onChange={handleRegionChange}
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
                value={formData.district || ""}
                onChange={(e) => handleInputChange(e, "district")}
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
                  onClick={handlePlusClick}
                  type="text"
                  className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-[400px] h-[40px] flex items-center justify-center"
                >
                  {selectedFile ? selectedFile.name : "Attach document"}
                  <PlusIcon />
                </Button>

                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/*,application/pdf"
                />

                <InfoCircleIcon className="text-blue-500 hover:text-blue-700" />
              </div>
            </Space>
          </div>
        </div>

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