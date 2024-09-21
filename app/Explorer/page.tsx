"use client";
import React, { useState } from "react";
import Layout from "../utils/Layout";

const Page = () => {
  const [sortCriteria, setSortCriteria] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");

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
  ];

  const sortedProjects = [...projects].sort((a, b) => {
    if (
      sortCriteria === "name" ||
      sortCriteria === "country" ||
      sortCriteria === "category"
    ) {
      const fieldA = a[sortCriteria].toLowerCase();
      const fieldB = b[sortCriteria].toLowerCase();
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(filter.toLowerCase()) ||
      project.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex">
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-4">Explorer</h1>

          {/* Filters and Sorting */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Filter by name or project id"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <div className="flex space-x-4">
              {/* Sorting by Name */}
              <button
                onClick={() => {
                  setSortCriteria("name");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                className="border p-2 rounded"
              >
                Sort by Name{" "}
                {sortCriteria === "name"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>

              {/* Sorting by Country */}
              <button
                onClick={() => {
                  setSortCriteria("country");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                className="border p-2 rounded"
              >
                Sort by Country{" "}
                {sortCriteria === "country"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>

              {/* Sorting by Category */}
              <button
                onClick={() => {
                  setSortCriteria("category");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                className="border p-2 rounded"
              >
                Sort by Category{" "}
                {sortCriteria === "category"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="border-t">
            {filteredProjects.map((project) => (
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
