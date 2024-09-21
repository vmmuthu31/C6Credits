"use client";
import React, { useState } from "react";
import Layout from "../utils/Layout";

function OnboardCompany() {
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    industry: "",
    location: "",
    carbonCreditsNeeded: "",
    companyurl: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyDetails({
      ...companyDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyDetails),
      });

      if (response.ok) {
        console.log("Company onboarded successfully");
      } else {
        const errorData = await response.json();
        console.error("Error onboarding company:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Layout>
      <div className=" max-w-xl ">
        <h2 className="text-2xl font-bold mb-4">
          Onboard Company to Carbon Credits
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyDetails.companyName}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyurl" className="block text-sm font-medium">
              Company URL
            </label>
            <input
              type="text"
              id="companyurl"
              name="companyurl"
              value={companyDetails.companyurl}
              onChange={handleChange}
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
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-sm font-medium">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={companyDetails.contactEmail}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactPhone" className="block text-sm font-medium">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={companyDetails.contactPhone}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default OnboardCompany;
