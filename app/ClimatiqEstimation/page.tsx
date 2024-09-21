"use client";
import React, { useState } from "react";
import axios from "axios";
import Layout from "../utils/Layout";

const ClimatiqEstimation = () => {
  const [energy, setEnergy] = useState(100);
  const [emissionResult, setEmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const climatiqApiKey = "ZDVMP2V6Q952XEDF2B5FZY4HJM";

  const estimateEmissions = async () => {
    setLoading(true);
    setError(null);

    const data = {
      emission_factor: {
        activity_id: "electricity-supply_grid-source_residual_mix",
        data_version: "^6",
      },
      parameters: {
        energy: energy,
        energy_unit: "kWh",
      },
    };

    try {
      const response = await axios.post(
        "https://api.climatiq.io/data/v1/estimate",
        data,
        {
          headers: {
            Authorization: `Bearer ${climatiqApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEmissionResult(response.data);
    } catch (err) {
      setError("Error calculating emissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 max-w-xl mx-auto shadow-sm rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          CO2 Emission Estimation
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Energy Consumption (kWh):
          </label>
          <input
            type="number"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={estimateEmissions}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Calculating..." : "Estimate Emissions"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {emissionResult && (
          <div className="mt-6 bg-white p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Emission Results
            </h3>
            <p className="text-gray-600 mb-2">
              <strong>Total CO2e:</strong> {emissionResult.co2e} kg
            </p>
            <p className="text-gray-600">
              <strong>Emission Factor Source:</strong>{" "}
              {emissionResult.emission_factor.name}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClimatiqEstimation;
