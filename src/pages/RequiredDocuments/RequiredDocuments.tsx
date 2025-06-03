import React from "react";
import { Link } from "react-router-dom";
import { useDocument } from "../../hooks/Documents/useDocuments";
import DownloadIcon from "../../assets/icons/DownloadIcon";
import LoadingIndicator from "../../components/Status/LoadingIndicator";

const RequiredDocuments: React.FC = () => {
  const { data, isLoading, isError } = useDocument();

   if (isLoading) {
    return (
      <div className="min-h-[800px] flex items-center justify-center">  {/* Changed here */}
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || !data || !data.results || data.results.length === 0) {
    return <div>Error loading data or no data available.</div>;
  }

  const firstDocument = data.results[0];

  const conditions = firstDocument?.text?.split("\r\n") || [];

  const year = firstDocument?.year;

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto mt-20 p-4">
        <div className="text-center mb-10">
          <h1 className="text-primaryText text-[18px] font-[400]">
            TURKMENISTANYN OGUZ HAN ADYNDAKY INZENER TEHNOLOGIYALAR UNIWERSITETI{" "}
            <br /> {year}- {year ? parseInt(year) + 1 : "YYYY"} YYL{" "}
          
          </h1>
        </div>

        <h1 className="text-[#5D87FF] px-2 text-md mb-5 w-[500px]">
          Required documents
        </h1>

        <div className="px-2">
          <h1 className=" text-primaryText text-[18px]  font-[500] mb-2">
            Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt a,
            aliquet sit amet lorem pellentesque eu tincidunt a, aliquet sit amet
            lorem.
          </h1>
          <p className="">
            Cras eget elit semper, congue sapien id, pellentesque diam. Nulla faucibus diam nec fermentum ullamcorper. Praesent sed ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio. Integer sit amet elit ac justo sagittis dignissim.
          </p>
         
        </div>

        <ul className="list-decimal text-primaryText px-5 mt-5">
           
          {conditions.map((item, index) => (
            <li key={index} className="py-2  text-[16px]">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex space-x-2 items-center ">
          <a href="#" className="text-[#4570EA] hover:underline">
            Download list of required documents
          </a>
          <DownloadIcon/>
        </div>

        <div className="mt-10 text-right ">
          <Link to="/instruction_page" className="text-blue-500 hover:underline">
            <button className="bg-[#5D87FF] text-white p-2 rounded px-5">
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocuments;