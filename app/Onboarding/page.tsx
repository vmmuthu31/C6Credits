"use client";
import React, { useEffect, useState } from "react";
import Layout from "../utils/Layout";
import Modal from "../Components/Modal";
import { BASEURL } from "@/Constants/constant";
import WorldIDconnect from "../Components/WorldIDconnect";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import {
  cookieToInitialState,
  useAccount,
  useDisconnect,
  WagmiProvider,
  useReadContract,
  useWriteContract,
  type Config,
} from "wagmi";
import abi from "../config/contractAbi.json"
const contractAddresss = "0x064fDd34631E558dBD57EA80aaf4B02Da4b1fA19";
function Onboarding() {
  const [step, setStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [userType, setUserType] = useState<"company" | "offsetter" | null>(
    null
  );
  useEffect(() => {
    const generatedUUID = uuidv4();
    setOffsetDetails((prevDetails) => ({
      ...prevDetails,
      nfcID: generatedUUID,
    }));
  }, []);

  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    industry: "",
    location: "",
    carbonCreditsNeeded: "",
    companyurl: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [offsetDetails, setOffsetDetails] = useState({
    nfcID: "",
    email: "",
    carbonOffsetAmount: "",
    date: "",
    location: "",
    purpose: "",
  });

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(e.target.value as "company" | "offsetter");
  };

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyDetails({
      ...companyDetails,
      [name]: value,
    });
  };
  

  const handleOffsetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOffsetDetails({
      ...offsetDetails,
      [name]: value,
    });
  };

  const handleCompanySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Only call preventDefault if there's an event



    try {
      const response = await fetch(`${BASEURL}/api/auth/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyDetails),
      });



      if (response.ok) {
        toast.success("Company onboarded successfully!");
        setTimeout(() => {
          setIsModalVisible(true);
        }, 5000);
      } else {
        const errorData = await response.json();
        toast.error("Error onboarding company");
        console.error("Error onboarding company:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting company form:", error);
    }
  };

  const handleOffsetSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    writeContract({ 
      abi,
      address: contractAddresss,
      functionName: 'registerProject',
      args: [
        offsetDetails.purpose,
        offsetDetails.location,
        offsetDetails.carbonOffsetAmount,
        
        1
      ],
   })

    const formattedDate = new Date(offsetDetails.date);

    try {
      const response = await fetch(`${BASEURL}/api/auth/offsets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...offsetDetails,
          date: formattedDate,
        }),
      });

      if (response.ok) {
        toast.success("Carbon offset created successfully!");
        setIsModalVisible(true);
      } else {
        const errorData = await response.json();
        console.error("Error creating carbon offset:", errorData.message);
        toast.error("Error creating carbon offset");
      }
    } catch (error) {
      console.error("Error submitting offset form:", error);
    }
  };

  const readd = useReadContract()


  const { writeContract } = useWriteContract()
  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        {step === 1 && (
          <div className="py-5 font-poppins md:p-14">
            <h1 className="text-3xl text-center font-bold mb-10">
              Select Your Role
            </h1>
            <div className="flex md:items-center justify-center gap-5 md:gap-10">
              {/* Company User */}
              <label
                className={`bg-[#002A16] text-[#F6F4EB] py-5 px-4 w-72 rounded-lg cursor-pointer shadow-md relative transition-all hover:scale-105 ${
                  userType === "company" ? "border-4 border-green-400" : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[#F6F4EB] text-left text-xl font-semibold">
                    I’m a Company
                  </span>
                  {userType === "company" && (
                    <span className="w-4 h-4 rounded-full bg-green-400"></span>
                  )}
                </div>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  onChange={handleUserTypeChange}
                  checked={userType === "company"}
                  className="opacity-0 absolute"
                />
                <span className="text-[#F6F4EB] text-sm">
                  Join the platform to manage and offset your carbon credits and
                  make an impact.
                </span>
              </label>

              {/* Offset User */}
              <label
                className={`bg-[#002A16] text-[#F6F4EB] py-5 px-4 w-72 rounded-lg cursor-pointer shadow-md relative transition-all hover:scale-105 ${
                  userType === "offsetter" ? "border-4 border-green-400" : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[#F6F4EB] text-left text-xl font-semibold">
                    I’m an Offsetter
                  </span>
                  {userType === "offsetter" && (
                    <span className="w-4 h-4 rounded-full bg-green-400"></span>
                  )}
                </div>
                <input
                  type="radio"
                  name="userType"
                  value="offsetter"
                  onChange={handleUserTypeChange}
                  checked={userType === "offsetter"}
                  className="opacity-0 absolute"
                />
                <span className="text-[#F6F4EB] text-sm">
                  Participate in carbon offsetting programs and contribute to a
                  greener world.
                </span>
              </label>
            </div>

            {/* Next button */}
            {userType && (
              <button
                onClick={() => setStep(2)}
                className="mt-6 mx-auto block bg-[#002A16] text-[#F6F4EB] py-3 px-6 rounded-lg hover:bg-opacity-90"
              >
                Next
              </button>
            )}
          </div>
        )}

        {step === 2 && userType === "company" && (
          <div className="mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Onboard Company to Carbon Credits
            </h2>
            <form onSubmit={handleCompanySubmit}>
              <div className="mb-4">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyDetails.companyName}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="industry" className="block text-sm font-medium">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={companyDetails.industry}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Technology">Technology</option>
                  <option value="Energy">Energy</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={companyDetails.location}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="companyurl"
                  className="block text-sm font-medium"
                >
                  Company URL
                </label>
                <input
                  type="text"
                  id="companyurl"
                  name="companyurl"
                  value={companyDetails.companyurl}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="carbonCreditsNeeded"
                  className="block text-sm font-medium"
                >
                  Estimated Carbon Credits Needed
                </label>
                <input
                  type="number"
                  id="carbonCreditsNeeded"
                  name="carbonCreditsNeeded"
                  value={companyDetails.carbonCreditsNeeded}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={companyDetails.contactEmail}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={companyDetails.contactPhone}
                  onChange={handleCompanyChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="pb-4">
                <WorldIDconnect
                  userType={userType}
                  onSuccessCallback={handleCompanySubmit}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && userType === "offsetter" && (
          <div className="mx-auto">
            <h2 className="text-2xl font-bold mb-4">Carbon Offset Using NFC</h2>
            <form onSubmit={handleOffsetSubmit}>
              <div className="mb-4">
                <label htmlFor="nfcID" className="block text-sm font-medium">
                  NFC ID
                </label>
                <input
                  type="text"
                  id="nfcID"
                  name="nfcID"
                  value={offsetDetails.nfcID}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Enter your Email{" "}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={offsetDetails.email}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="carbonOffsetAmount"
                  className="block text-sm font-medium"
                >
                  Carbon Offset Amount (in tons)
                </label>
                <input
                  type="number"
                  id="carbonOffsetAmount"
                  name="carbonOffsetAmount"
                  value={offsetDetails.carbonOffsetAmount}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium">
                  Date of Offset
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={offsetDetails.date}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={offsetDetails.location}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="purpose" className="block text-sm font-medium">
                  Purpose of Offset
                </label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={offsetDetails.purpose}
                  onChange={handleOffsetChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="pb-4">
                <WorldIDconnect
                  userType={userType}
                  onSuccessCallback={handleOffsetSubmit}
                />
              </div>{" "}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() =>{ setIsModalVisible(false);

   
        }
        }
      />
    </Layout>
  );
}

export default Onboarding;
