"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import { useAccount } from "wagmi";
import {
  Attestation,
  EvmChains,
  IndexService,
  SignProtocolClient,
  SpMode,
} from "@ethsign/sp-sdk";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast
import Layout from "../utils/Layout";

export default function RegisterProject() {
  const { address } = useAccount(); // Wagmi hook to get wallet address
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Carbon credit details state
  const [carbonCreditDetails, setCarbonCreditDetails] = useState({
    projectName: "",
    projectType: "",
    carbonAmount: 0,
  });

  // Function to create attestation
  const createAttestation = async () => {
    try {
      setIsLoading(true);
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.arbitrumSepolia, // Set your blockchain network
      });

      const { projectName, projectType, carbonAmount } = carbonCreditDetails;

      const timestamp = Math.floor(Date.now() / 1000);

      const data = {
        ProjectName: projectName,
        ProjectType: projectType,
        CarbonAmount: carbonAmount,
        Timestamp: timestamp,
      };

      const schemaIdWithType = "onchain_evm_421614_0x100"; // Example schema ID
      const schemaId = schemaIdWithType.split("_").pop(); // Extract schema ID

      // Create attestation using SignProtocolClient
      const createAttestationRes = await client.createAttestation({
        schemaId,
        data,
      });

      console.log("Attestation created:", createAttestationRes);
      toast.success("Carbon Credit Attestation created successfully!"); // Show success toast
    } catch (error) {
      console.error("Error creating attestation:", error);
      toast.error("Failed to create attestation"); // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attestations
  const fetchAttestations = async () => {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      id: "",
      schemaId: "onchain_evm_421614_0x100",
      attester: "",
      page: 1,
      mode: "onchain",
      indexingValue: "",
    });
    console.log("Attestation list:", res);

    if (res?.rows) {
      const filteredAttestations = res.rows.filter(
        (attestation) =>
          attestation.attester.toLowerCase() === address.toLowerCase()
      );
      console.log("Filtered attestations:", filteredAttestations);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex w-full justify-center ">
        <div className=" p-8 rounded-lg  max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Project Attestation
          </h1>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Project Name:
            </label>
            <input
              type="text"
              value={carbonCreditDetails.projectName}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  projectName: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Project Type:
            </label>
            <input
              type="text"
              value={carbonCreditDetails.projectType}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  projectType: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Carbon Amount (metric tons):
            </label>
            <input
              type="number"
              value={carbonCreditDetails.carbonAmount}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  carbonAmount: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={createAttestation}
            disabled={isLoading}
            className={`w-full py-3 text-white font-semibold rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Attestation"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
