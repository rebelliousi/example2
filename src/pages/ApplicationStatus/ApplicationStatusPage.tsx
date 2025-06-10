
import { useNavigate, Link } from "react-router-dom";
import { Space } from "antd";
import Container from "../../components/Container/Container";
import Navbar from "../../components/Navbar/Navbar";




const ApplicationStatusPage = () => {
  const navigate = useNavigate();

  // Placeholder data - replace with your actual data
  const formData = {
    name: "John Doe",
    major: "Computer Science",
    address: "123 Main St, City, Country",
    phoneNumber: "+1 234 567 890",
    status: "Active"
  };

  const handleSubmit = () => {
    // Handle form submission if needed
  };

  return (
    <Container>
      <Navbar />
      <div className="pt-10 px-4 pb-10">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="mb-14">
            <div className="mb-4">
              <h1 className="text-headerBlue text-[14px] font-[500]">
                Information
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <label className="w-32 font-[400] text-[14px] self-center">
                Name
              </label>
              <Space>
                <div className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px] flex items-center">
                  {formData.name}
                </div>
              </Space>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 ">
              <label className="w-32 font-[400] text-[14px] self-center">
                Major
              </label>
              <Space>
                <div className="rounded-md w-[400px] h-[40px] border-[#DFE5EF] text-[14px] flex items-center">
                  {formData.major}
                </div>
              </Space>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <label className="w- font-[400] text-[14px] self-center">
                Address
              </label>
              <Space>
                <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center">
                  {formData.address}
                </div>
              </Space>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <label className="w-44 font-[400] text-[14px] self-center">
                Phone number
              </label>
              <Space>
                <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center">
                  {formData.phoneNumber}
                </div>
              </Space>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <label className="w-44 font-[400] text-[14px] self-center">
                Status
              </label>
              <Space>
                <div className="w-[400px] h-[40px] border-[#DFE5EF] rounded-md text-[14px] flex items-center">
                  {formData.status}
                </div>
              </Space>
            </div>
          </div>

          <div className="flex justify-end mt-12 space-x-5">
            <Link
              to="/infos/degree-information"
              className="text-textSecondary border border-[#DFE5EF] hover:bg-primaryBlue hover:text-white py-2 px-4 rounded hover:transition-all duration-500"
            >
              Previous
            </Link>

           
          </div>
        </Space>
      </div>
    </Container>
  );
};

export default ApplicationStatusPage;