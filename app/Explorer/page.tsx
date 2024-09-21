import React from "react";
import Layout from "../utils/Layout";

const Page = () => {
  const projects = [
    {
      name: "Glanris",
      id: "PUR-375603",
      standard: "Puro",
      country: "United States",
      category: "Biomass Removal",
      pool: "-",
    },
    {
      name: "Jeffries Group",
      id: "PUR-114352",
      standard: "Puro",
      country: "Australia",
      category: "Biomass Removal",
      pool: "-",
    },
    // Add more projects as needed
  ];

  return (
    <Layout>
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Heading */}
          <h1 className="text-2xl font-semibold mb-4">Explorer</h1>
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Filter by name or project id"
              className="border p-2 rounded w-1/3"
            />
            <div className="flex space-x-4">
              <select className="border p-2 rounded">
                <option value="">Country</option>
                <option value="us">United States</option>
                <option value="au">Australia</option>
                {/* Add more countries */}
              </select>
              <select className="border p-2 rounded">
                <option value="">Category</option>
                <option value="biomass">Biomass Removal</option>
                {/* Add more categories */}
              </select>
              <select className="border p-2 rounded">
                <option value="">Pool</option>
                {/* Add more pools */}
              </select>
            </div>
          </div>

          {/* Project List */}
          <div className="border-t">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="text-sm text-gray-500">{project.id}</p>
                </div>
                <div>{project.standard}</div>
                <div>{project.country}</div>
                <div>{project.category}</div>
                <div>{project.pool}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Page;
