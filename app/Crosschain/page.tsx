"use client";
import React, { useState } from "react";
import Layout from "../utils/Layout";

const Page = () => {
  const [selectedTokenScreen, setSelectedTokenScreen] =
    useState("bridgeTokens");
  const [selectedToken, setSelectedToken] = useState("BCT");
  const [fromNetwork, setFromNetwork] = useState("Celo Mainnet");
  const [toNetwork, setToNetwork] = useState("Polygon Mainnet");
  const [balance, setBalance] = useState(0.0);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
          {/* Main Content */}
          <div className="flex-1">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Cross-Chain</h1>
            </header>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedTokenScreen("bridgeTokens")}
                className={`pb-2 font-semibold ${
                  selectedTokenScreen === "bridgeTokens"
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
              >
                Bridge Tokens
              </button>
              <button
                onClick={() => setSelectedTokenScreen("transactions")}
                className={`pb-2 font-semibold ${
                  selectedTokenScreen === "transactions"
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
              >
                Transactions
              </button>
            </div>

            {/* Conditional Rendering based on Active Tab */}
            {selectedTokenScreen === "bridgeTokens" ? (
              <div className="p-6 bg-white shadow rounded-md">
                <h2 className="text-xl font-semibold mb-4">Bridge Tokens</h2>
                <p className="text-gray-600 mb-6">
                  With the Cross-Chain Bridge, you can bring your carbon assets
                  from one chain to another in a fast, safe, and secure way.
                  Start by selecting the type of token you want to bridge.
                </p>

                {/* Token Selection */}
                <div className="flex mb-4">
                  <div className="flex-1">
                    <label className="text-gray-700">
                      Balance: {balance} BCT
                    </label>
                  </div>
                  <div className="flex-1">
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    >
                      <option value="BCT">BCT (Base Carbon Tonne)</option>
                      <option value="MCO2">MCO2 (Moss Carbon Credit)</option>
                    </select>
                  </div>
                </div>

                {/* From and To Networks */}
                <div className="flex justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-gray-700 mb-2">From</label>
                    <select
                      value={fromNetwork}
                      onChange={(e) => setFromNetwork(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    >
                      <option value="Celo Mainnet">Celo Mainnet</option>
                      <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                    </select>
                  </div>
                  <div className="flex-1 ml-4">
                    <label className="block text-gray-700 mb-2">To</label>
                    <select
                      value={toNetwork}
                      onChange={(e) => setToNetwork(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    >
                      <option value="Polygon Mainnet">Polygon Mainnet</option>
                      <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                    </select>
                  </div>
                </div>

                {/* Notice */}
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-gray-600">
                    Use cross-chain bridge at your own risk. By clicking below,
                    you agree to C6Credits{" "}
                    <a href="#" className="text-blue-600 underline">
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>

                {/* Bridge Button */}
                <button className="w-full bg-pink-500 text-white py-2 rounded-md">
                  Bridge {selectedToken}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-white shadow rounded-md">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                <p className="text-gray-600 mb-6">
                  Here you can view your recent cross-chain transactions.
                </p>

                {/* Transaction Table Example */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 text-left text-sm text-gray-600">
                          Date
                        </th>
                        <th className="py-2 text-left text-sm text-gray-600">
                          Chain
                        </th>
                        <th className="py-2 text-left text-sm text-gray-600">
                          Amount
                        </th>
                        <th className="py-2 text-left text-sm text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-600">2024-09-16</td>
                        <td className="py-2 text-gray-600">Celo Mainnet</td>
                        <td className="py-2 text-gray-600">100 BCT</td>
                        <td className="py-2 text-green-500">Completed</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">2024-09-15</td>
                        <td className="py-2 text-gray-600">Polygon Mainnet</td>
                        <td className="py-2 text-gray-600">50 BCT</td>
                        <td className="py-2 text-red-500">Failed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
