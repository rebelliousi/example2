import { Input, Space, Select, Button, DatePicker } from "antd";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Moment } from "moment";

import PlusIcon from "../../assets/icons/PlusIcon";
import TrashIcon from "../../assets/icons/TrashIcon"; // Import TrashIcon
import InfoCircleIcon from "../../assets/icons/InfoCircleIcon";


const { Option } = Select;

interface DegreeInformation {
  firstName: string | null;
  lastName: string | null;
  fatherName: string | null;
  gender: string | null;
  nationality: string | null;
  dateOfBirth: Moment | null;
  area: string | null;
  address: string | null;
  placeOfBirth: string | null;
  isDeceased: boolean | null;
  passport: string | null;
  homePhoneNumber: string | null; // New field
  cellPhoneNumber: string | null; // New field
  email: string | null;
}

type DegreeInformationKey = keyof DegreeInformation;

const GuardiansInfo = () => {
  const navigate = useNavigate();

  const initialGuardianState: DegreeInformation = {
    firstName: null,
    lastName: null,
    fatherName: null,
    gender: null,
    nationality: null,
    dateOfBirth: null,
    area: null,
    address: null,
    placeOfBirth: null,
    isDeceased: null,
    passport: null,
    homePhoneNumber: null,
    cellPhoneNumber: null,
    email: null,
  };

  const [fatherFormData, setFatherFormData] = useState<DegreeInformation>({
    ...initialGuardianState,
  });
  const [motherFormData, setMotherFormData] = useState<DegreeInformation>({
    ...initialGuardianState,
  });
  const [otherGuardians, setOtherGuardians] = useState<DegreeInformation[]>([]);

  const [fatherSelectedFile, setFatherSelectedFile] = useState<File | null>(
    null
  );
  const [motherSelectedFile, setMotherSelectedFile] = useState<File | null>(
    null
  );

  const [otherGuardianFiles, setOtherGuardianFiles] = useState<File[]>([]);
  const fatherFileInputRef = useRef<HTMLInputElement>(null);
  const motherFileInputRef = useRef<HTMLInputElement>(null);
  const otherGuardianFileInputRefs = useRef<(HTMLInputElement | null)[]>([]); // Ref for an array of potentially null HTMLElements

  // Initialize otherGuardianFileInputRefs.current to an empty array.
  useEffect(() => {
    otherGuardianFileInputRefs.current = [];
  }, []);

  const handleFatherInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: DegreeInformationKey
  ) => {
    setFatherFormData({ ...fatherFormData, [fieldName]: e.target.value });
  };

  const handleMotherInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: DegreeInformationKey
  ) => {
    setMotherFormData({ ...motherFormData, [fieldName]: e.target.value });
  };

  const handleOtherGuardianInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: DegreeInformationKey
  ) => {
    const newGuardians = [...otherGuardians];
    newGuardians[index] = {
      ...newGuardians[index],
      [fieldName]: e.target.value,
    };
    setOtherGuardians(newGuardians);
  };

  const handleFatherDateChange = (
    date: Moment | null,
    fieldName: "dateOfBirth" | "dateGiven" | "givenBy"
  ) => {
    setFatherFormData({ ...fatherFormData, [fieldName]: date });
  };

  const handleMotherDateChange = (
    date: Moment | null,
    fieldName: "dateOfBirth" | "dateGiven" | "givenBy"
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

  const handleFatherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFatherSelectedFile(file);
      setFatherFormData((prevFormData) => ({
        ...prevFormData,
        passport: file.name,
      }));
    } else {
      setFatherSelectedFile(null);
      setFatherFormData((prevFormData) => ({
        ...prevFormData,
        passport: null,
      }));
    }
  };

  const handleMotherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMotherSelectedFile(file);
      setMotherFormData((prevFormData) => ({
        ...prevFormData,
        passport: file.name,
      }));
    } else {
      setMotherSelectedFile(null);
      setMotherFormData((prevFormData) => ({
        ...prevFormData,
        passport: null,
      }));
    }
  };

  const handleOtherGuardianFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const newGuardians = [...otherGuardians];

    if (file) {
      const newFiles = [...otherGuardianFiles];
      newFiles[index] = file;
      setOtherGuardianFiles(newFiles);

      newGuardians[index] = {
        ...newGuardians[index],
        passport: file.name,
      };
      setOtherGuardians(newGuardians);
    } else {
      newGuardians[index] = {
        ...newGuardians[index],
        passport: null,
      };
      setOtherGuardians(newGuardians);
    }
  };

  const handleFatherPlusClick = () => {
    fatherFileInputRef.current?.click();
  };

  const handleMotherPlusClick = () => {
    motherFileInputRef.current?.click();
  };

  const handleOtherGuardianPlusClick = (index: number) => {
    if (otherGuardianFileInputRefs.current[index]) {
      otherGuardianFileInputRefs.current[index].click();
    }
  };

  const handleAddGuardian = () => {
    setOtherGuardians([...otherGuardians, { ...initialGuardianState }]);
  };

  const handleDeleteGuardian = (index: number) => {
    const newGuardians = [...otherGuardians];
    newGuardians.splice(index, 1); // Remove the guardian at the specified index
    setOtherGuardians(newGuardians);

    const newFiles = [...otherGuardianFiles];
    newFiles.splice(index, 1);
    setOtherGuardianFiles(newFiles);

    // Also, you may need to adjust otherGuardianFileInputRefs if needed.
    // This depends on how you're using those refs.
  };

  const handleSubmit = async () => {
    console.log("Father Form Data:", fatherFormData);
    console.log("Mother Form Data:", motherFormData);
    console.log("Other Guardians Data:", otherGuardians);

  };
   
    navigate("/infos/education-info");
  const renderContactInformation = (
    formData: DegreeInformation,
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      fieldName: DegreeInformationKey
    ) => void,
    selectedFile: File | null,
    fileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>, // Allow null here
    handlePlusClick: () => void,
    onDelete?: () => void // Added onDelete prop
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
            placeholder="Enter Cell Phone Number"
            className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px]"
            value={formData.cellPhoneNumber || ""}
            onChange={(e) => handleInputChange(e, "cellPhoneNumber")}
          />
        </Space>
      </div>

      <div className="flex  sm:flex-row items-start gap-4 mb-4">
        <label className="w-44 font-[400] text-[14px] self-center">
          Passport
        </label>
        <div className=" flex w-[400px]">
          <Space>
            <div className="flex items-center justify-between  w-[400px]">
              {" "}
              {/* Changed from justify-center to justify-between */}
              <Button
                onClick={handlePlusClick}
                type="text"
                className="cursor-pointer border-[#DFE5EF] rounded-md text-[14px] w-full h-[40px] flex items-center justify-center"
              >
                {selectedFile ? selectedFile.name : "Attach passport copy"}
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
                className="px-8 py-2 flex items-center justify-center gap-2 border-[#FA896B] border text-[#FA896B] rounded hover:text-[#FA896B] hover:border-[#FA896B] w-[200px]" /* veya w-[200px] gibi sabit bir değer */
              >
               Delete guardian
          <TrashIcon className="w-4"/>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderAddressInformation = (
    formData: DegreeInformation,
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      fieldName: DegreeInformationKey
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

  const renderGuardianForm = (
    formData: DegreeInformation,
    formTitle: string,
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      fieldName: DegreeInformationKey
    ) => void,
    handleDateChange: (
      date: Moment | null,
      fieldName: "dateOfBirth" | "dateGiven" | "givenBy"
    ) => void,
    handleDeceasedChange: (value: boolean | null) => void,

    selectedFile: File | null,
    fileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>, // Allow null here
    handlePlusClick: () => void,
    onDelete?: () => void,
    isOtherGuardian?: boolean
  ) => {
    return (
      <div className="mb-14 col-span-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-headerBlue text-[14px] font-[500]">
            {formTitle}
          </h1>
          {/*{onDelete && (*/}
          {/*  <Button*/}
          {/*    type="text"*/}
          {/*    onClick={onDelete}*/}
          {/*    className="text-red-500 hover:text-red-700 flex items-center gap-2"*/}
          {/*  >*/}
          {/*    <TrashIcon /> Delete Guardian*/}
          {/*  </Button>*/}
          {/*)}*/}
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
                    formData.isDeceased === null
                      ? undefined
                      : formData.isDeceased
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
                {renderContactInformation(
                  formData,
                  handleInputChange,
                  selectedFile,
                  fileInputChange,
                  fileInputRef,
                  handlePlusClick
                )}
              </>
            )}

            {formData.isDeceased === true && (
              <>
                {renderContactInformation(
                  formData,
                  handleInputChange,
                  selectedFile,
                  fileInputChange,
                  fileInputRef,
                  handlePlusClick
                )}
              </>
            )}
          </>
        )}

        {isOtherGuardian && (
          <>
            {renderAddressInformation(formData, handleInputChange)}
            {renderContactInformation(
              formData,
              handleInputChange,
              selectedFile,
              fileInputChange,
              fileInputRef,
              handlePlusClick,
              onDelete
            )}
          </>
        )}
      </div>
    );
  };

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
            undefined,
            false
          )}
        </div>

        {/* Conditionally render the other guardians forms with the Delete button */}
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
                (el) => {
                  if (el && otherGuardianFileInputRefs.current) {
                    otherGuardianFileInputRefs.current[index] = el;
                  } else if (!otherGuardianFileInputRefs.current) {
                    otherGuardianFileInputRefs.current = [];
                  }
                },
                () => handleOtherGuardianPlusClick(index),
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

          <Link
            to="/infos/guardians-info"
            type="primary"
            onClick={handleSubmit}
            className="bg-primaryBlue text-white py-2 px-4 rounded"
          >
            Next
          </Link>
        </div>
    </div>

  );
};

export default GuardiansInfo;
