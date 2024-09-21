import React from "react";
import Layout from "../utils/Layout";

const Page = () => {
  const poolDetails = {
    poolName: "C6Credits Biochar Carbon Pool (CHAR)",
    price: 153.57,
    totalCredits: 1606,
    composition: [
      {
        name: "Wakefield Biochar Facility 2",
        id: "PUR-244045",
        amount: 995.995,
        percentage: "62.02%",
      },
      {
        name: "American BioCarbon CT, LLC",
        id: "PUR-543800",
        amount: 201.77,
        percentage: "12.56%",
      },
      {
        name: "Concepcion 1",
        id: "PUR-432524",
        amount: 195.563,
        percentage: "12.18%",
      },
      {
        name: "Oregon Biochar Solutions",
        id: "PUR-753518",
        amount: 167.84,
        percentage: "10.45%",
      },
      {
        name: "BC Biocarbon - McBride",
        id: "PUR-862421",
        amount: 44.87,
        percentage: "2.79%",
      },
    ],
  };

  return (
    <Layout>
      <div className="flex h-screen">
        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100">
          {/* Pool Header */}
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-semibold">Carbon Assets</h1>
          </div>

          {/* Pool Details */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left - Pool Details */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">{poolDetails.poolName}</h2>
              <p className="text-4xl font-bold mb-4">${poolDetails.price}</p>
              <p className="text-gray-500">
                Credits deposited into pool: {poolDetails.totalCredits} TCO2
              </p>

              {/* Pool Composition */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Pool Composition</h3>
                <div className="grid grid-cols-3 gap-4 border-b py-2">
                  {/* Column Headers */}
                  <span className="font-semibold text-gray-600">Name</span>
                  <span className="font-semibold text-gray-600">
                    Amount (TCO2)
                  </span>
                  <span className="font-semibold text-gray-600">
                    Percentage
                  </span>
                </div>

                {poolDetails.composition.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 gap-4 py-2 border-b"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-500">{item.amount} TCO2</span>
                    <span className="text-gray-500">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Call to Action */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <p className="text-lg font-semibold mb-4">Available now:</p>
                <p className="text-xl font-bold">
                  The World&apos;s First Liquid Market for Biochar
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full">
                  Buy CHAR
                </button>
                <button className="border px-4 py-2 rounded-lg mt-2 w-full">
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Page;
