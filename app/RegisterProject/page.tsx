"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  Attestation,
  EvmChains,
  IndexService,
  SignProtocolClient,
  SpMode,
} from "@ethsign/sp-sdk";
import { toast } from "react-hot-toast";
import Layout from "../utils/Layout";

export default function RegisterProject() {
  const { address } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [carbonCreditDetails, setCarbonCreditDetails] = useState({
    projectName: "",
    projectType: "",
    carbonAmount: 0,
  });

  const createAttestation = async () => {
    try {
      setIsLoading(true);
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.arbitrumSepolia,
      });

      const { projectName, projectType, carbonAmount } = carbonCreditDetails;

      const timestamp = Math.floor(Date.now() / 1000);

      const data = {
        ProjectName: projectName,
        ProjectType: projectType,
        CarbonAmount: carbonAmount,
        Timestamp: timestamp,
      };

      const schemaIdWithType = "onchain_evm_421614_0x100";
      const schemaId = schemaIdWithType.split("_").pop();

      const createAttestationRes = await client.createAttestation({
        schemaId,
        data,
      });

      toast.success("Carbon Credit Attestation created successfully!");
    } catch (error) {
      console.error("Error creating attestation:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

    if (res?.rows) {
      const filteredAttestations = res.rows.filter(
        (attestation) =>
          attestation.attester.toLowerCase() === address.toLowerCase()
      );
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
