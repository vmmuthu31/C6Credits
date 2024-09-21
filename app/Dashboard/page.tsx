"use client";
import React, { useEffect, useState } from "react";
import Layout from "../utils/Layout";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import useRequireAuth from "../hooks/useRequireAuth";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

const Dashboard = () => {
  const { token, user } = useRequireAuth();
  const [carbonBridged, setCarbonBridged] = useState(0);
  const [carbonLocked, setCarbonLocked] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [carbonRetired, setCarbonRetired] = useState(0);

  const finalBridged = 21890661;
  const finalLocked = 19905783;
  const finalLiquidity = 1810027;
  const finalRetired = 210338;

  useEffect(() => {
    const animateValue = (start, end, duration, setStateFunc) => {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        setStateFunc(value);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const loadAnimations = async () => {
      const statAnimationPromise = Promise.all([
        animateValue(0, finalBridged, 500, setCarbonBridged),
        animateValue(0, finalLocked, 500, setCarbonLocked),
        animateValue(0, finalLiquidity, 500, setLiquidity),
        animateValue(0, finalRetired, 500, setCarbonRetired),
      ]);

      await statAnimationPromise;
    };

    loadAnimations();
  }, []);

  const poolComposition = {
    labels: [
      "Wakefield Biochar Facility 2",
      "American BioCarbon CT, LLC",
      "Concepcion 1",
      "Oregon Biochar Solutions",
      "BC Biocarbon - McBride",
    ],
    datasets: [
      {
        label: "TCO2",
        data: [995.995, 201.77, 195.563, 167.84, 44.87],
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#f1c40f",
          "#e74c3c",
          "#9b59b6",
        ],
        hoverBackgroundColor: [
          "#2980b9",
          "#27ae60",
          "#f39c12",
          "#c0392b",
          "#8e44ad",
        ],
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  const poolOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 3000,
      easing: "easeInOutQuad",
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFont: {
          size: 14,
        },
        bodySpacing: 8,
        padding: 10,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            return `${label}: ${context.raw} TCO2`;
          },
        },
      },
      title: {
        display: true,
        text: "Carbon Pool Composition",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "TCO2",
        },
        ticks: {
          color: "#333",
        },
      },
    },
  };

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href={`${
            user?.usertype === "company"
              ? "/RegisterCompany"
              : "/RegisterProject"
          }`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Attestation
        </Link>
      </div>

      <div className="flex">
        <div className="p-8 space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 shadow-sm rounded-md">
              <h3 className="text-sm font-semibold text-gray-500">
                Total carbon bridged
              </h3>
              <p className="text-2xl font-bold">
                {carbonBridged.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 shadow-sm rounded-md">
              <h3 className="text-sm font-semibold text-gray-500">
                Total carbon locked
              </h3>
              <p className="text-2xl font-bold">
                {carbonLocked.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 shadow-sm rounded-md">
              <h3 className="text-sm font-semibold text-gray-500">
                Total liquidity
              </h3>
              <p className="text-2xl font-bold">{liquidity.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 shadow-sm rounded-md">
              <h3 className="text-sm font-semibold text-gray-500">
                Total carbon retired
              </h3>
              <p className="text-2xl font-bold">
                {carbonRetired.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Pool Composition Section */}
          <div className="bg-white p-6 shadow-sm rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                C6Credits Biochar Carbon Pool (CHAR)
              </h3>
              <span className="text-2xl font-bold">$153.57</span>
            </div>
            <p className="text-sm">Credits deposited into pool: 1,606 TCO2</p>

            {/* Bar Chart */}
            <div className="w-full h-64 mt-4">
              <Bar data={poolComposition} options={poolOptions} />
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
    </Layout>
  );
};

export default Dashboard;
