import React from "react";

const Page = () => {
  return (
    <div className="flex h-screen">
      <div className="p-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow-sm rounded-md">
            <h3 className="text-sm font-semibold text-gray-500">
              Total carbon bridged
            </h3>
            <p className="text-2xl font-bold">21,890,661</p>
          </div>
          <div className="bg-white p-4 shadow-sm rounded-md">
            <h3 className="text-sm font-semibold text-gray-500">
              Total carbon locked
            </h3>
            <p className="text-2xl font-bold">19,905,783</p>
          </div>
          <div className="bg-white p-4 shadow-sm rounded-md">
            <h3 className="text-sm font-semibold text-gray-500">
              Total liquidity
            </h3>
            <p className="text-2xl font-bold">1,810,027</p>
          </div>
          <div className="bg-white p-4 shadow-sm rounded-md">
            <h3 className="text-sm font-semibold text-gray-500">
              Total carbon retired
            </h3>
            <p className="text-2xl font-bold">210,338</p>
          </div>
        </div>

        {/* Pool Composition */}
        <div className="bg-white p-6 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Toucan Biochar Carbon Pool (CHAR)
            </h3>
            <span className="text-2xl font-bold">$153.57</span>
          </div>
          <p className="text-sm">Credits deposited into pool: 1,606 TCO2</p>

          {/* Pool Composition Chart */}
          <div className="flex mt-4">
            <div className="h-4 w-2/3 bg-blue-400"></div>
            <div className="h-4 w-1/6 bg-green-400"></div>
            <div className="h-4 w-1/6 bg-yellow-400"></div>
          </div>

          {/* Pool List */}
          <ul className="mt-4 space-y-2">
            <li>Wakefield Biochar Facility 2: 995.995 TCO2 (62.02%)</li>
            <li>American BioCarbon CT, LLC: 201.77 TCO2 (12.56%)</li>
            <li>Concepcion 1: 195.563 TCO2 (12.18%)</li>
            <li>Oregon Biochar Solutions: 167.84 TCO2 (10.45%)</li>
            <li>BC Biocarbon - McBride: 44.87 TCO2 (2.79%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
