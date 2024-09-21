"use client";
import React, { useState } from "react";
import Layout from "../utils/Layout";

function CarbonOffset() {
  const [offsetDetails, setOffsetDetails] = useState({
    nfcID: "",
    email: "",
    carbonOffsetAmount: "",
    date: "",
    location: "",
    purpose: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOffsetDetails({
      ...offsetDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/offsets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offsetDetails),
      });

      if (response.ok) {
        console.log("Carbon offset created successfully");
      } else {
        const errorData = await response.json();
        console.error("Error creating carbon offset:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Carbon Offset Using NFC</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nfcID" className="block text-sm font-medium">
              NFC ID
            </label>
            <input
              type="text"
              id="nfcID"
              name="nfcID"
              value={offsetDetails.nfcID}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nfcID" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="eamil"
              id="email"
              name="email"
              value={offsetDetails.email}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default CarbonOffset;
