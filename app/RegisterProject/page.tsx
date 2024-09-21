"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  EvmChains,
  IndexService,
  SignProtocolClient,
  SpMode,
} from "@ethsign/sp-sdk";

export default function RegisterProject() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Carbon credit details state
  const [carbonCreditDetails, setCarbonCreditDetails] = useState({
    issuerAddress: "",
    projectName: "",
    projectType: "",
    carbonAmount: 0,
    tokenStandard: "ERC-721",
    blockchainNetwork: "Ethereum",
  });

  // Function to create attestation
  const createAttestation = async () => {
    try {
      setIsLoading(true);
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.sepolia, // Set your blockchain network
      });

      const {
        issuerAddress,
        projectName,
        projectType,
        carbonAmount,
        tokenStandard,
        blockchainNetwork,
      } = carbonCreditDetails;

      const timestamp = Math.floor(Date.now() / 1000); // UNIX timestamp

      // Attestation data
      const data = {
        IssuerAddress: issuerAddress,
        ProjectName: projectName,
        ProjectType: projectType,
        CarbonAmount: carbonAmount,
        TokenStandard: tokenStandard,
        BlockchainNetwork: blockchainNetwork,
        Timestamp: timestamp,
      };

      const schemaIdWithType = "onchain_evm_11155111_0x248"; // Example schema ID
      const schemaId = schemaIdWithType.split("_").pop(); // Extract schema ID

      // Create attestation using SignProtocolClient
      const createAttestationRes = await client.createAttestation({
        schemaId,
        data,
      });

      console.log("Attestation created:", createAttestationRes);
      alert("Carbon Credit Attestation created successfully!");
    } catch (error) {
      console.error("Error creating attestation:", error);
      alert("Failed to create attestation");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attestations
  const fetchAttestations = async () => {
    const schemaIdWithType = "onchain_evm_11155111_0x248"; // Example schema ID
    const schemaId = schemaIdWithType.split("_").pop();
    console.log(schemaId, "s");
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      id: "",
      schemaId: "onchain_evm_11155111_0x248",
      attester: "",
      page: 1,
      mode: "onchain",
      indexingValue: "",
    });
    console.log("Attestation list:", res);

    if (res?.rows) {
      const filteredAttestations = res.rows.filter(
        (attestation) =>
          attestation.attester.toLowerCase() === address?.toLowerCase()
      );
      console.log("Filtered attestations:", filteredAttestations);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Carbon Credit Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Issuer Address:</label>
        <input
          type="text"
          value={carbonCreditDetails.issuerAddress}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              issuerAddress: e.target.value,
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <label>Project Name:</label>
        <input
          type="text"
          value={carbonCreditDetails.projectName}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              projectName: e.target.value,
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <label>Project Type:</label>
        <input
          type="text"
          value={carbonCreditDetails.projectType}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              projectType: e.target.value,
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <label>Carbon Amount (metric tons):</label>
        <input
          type="number"
          value={carbonCreditDetails.carbonAmount}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              carbonAmount: Number(e.target.value),
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <label>Token Standard:</label>
        <select
          value={carbonCreditDetails.tokenStandard}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              tokenStandard: e.target.value,
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        >
          <option value="ERC-721">ERC-721</option>
          <option value="ERC-1155">ERC-1155</option>
        </select>

        <label>Blockchain Network:</label>
        <select
          value={carbonCreditDetails.blockchainNetwork}
          onChange={(e) =>
            setCarbonCreditDetails({
              ...carbonCreditDetails,
              blockchainNetwork: e.target.value,
            })
          }
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        >
          <option value="Ethereum">Ethereum</option>
          <option value="Celo">Celo</option>
        </select>

        <button
          onClick={createAttestation}
          disabled={isLoading}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Creating..." : "Create Attestation"}
        </button>
      </div>

      <button
        onClick={fetchAttestations}
        disabled={isLoading}
        style={{
          padding: "10px",
          backgroundColor: "#008CBA",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Fetch Attestations
      </button>

      <w3m-button />

      {address && (
        <div style={{ marginTop: "20px" }}>Connected Wallet: {address}</div>
      )}
    </div>
  );
}
