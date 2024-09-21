import React from "react";
import Sidebar from "../Components/Sidebar";
import DashboardNavbar from "../Components/DashboardNavbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-6 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
