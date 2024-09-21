"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  EvmChains,
  IndexService,
  SignProtocolClient,
  SpMode,
} from "@ethsign/sp-sdk";
import Layout from "../utils/Layout";
import toast from "react-hot-toast";

export default function RegisterCompany() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const [carbonCreditDetails, setCarbonCreditDetails] = useState({
    companyName: "",
    companyType: "",
    carbonEmit: 0,
  });

  const createAttestation = async () => {
    try {
      setIsLoading(true);
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.arbitrumSepolia,
      });

      const { companyName, companyType, carbonEmit } = carbonCreditDetails;

      const timestamp = Math.floor(Date.now() / 1000);

      const data = {
        CompanyName: companyName,
        CompanyType: companyType,
        CarbonEmit: carbonEmit,
        Timestamp: timestamp,
      };

      const schemaIdWithType = "onchain_evm_421614_0xff";
      const schemaId = schemaIdWithType.split("_").pop();

      const createAttestationRes = await client.createAttestation({
        schemaId,
        data,
      });

      toast.success("Carbon Credit Attestation created successfully!");
    } catch (error) {
      console.error("Error creating attestation:", error);
      toast.error("Failed to create attestation");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttestations = async () => {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      id: "",
      schemaId: "onchain_evm_421614_0xff",
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
      <div className="min-h-screen flex justify-center ">
        <div className=" p-8 rounded-lg max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Company Attestation
          </h1>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Company Name:
            </label>
            <input
              type="text"
              value={carbonCreditDetails.companyName}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  companyName: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Company Type:
            </label>
            <input
              type="text"
              value={carbonCreditDetails.companyType}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  companyType: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Carbon Emit (metric tons):
            </label>
            <input
              type="number"
              value={carbonCreditDetails.carbonEmit}
              onChange={(e) =>
                setCarbonCreditDetails({
                  ...carbonCreditDetails,
                  carbonEmit: e.target.value,
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
