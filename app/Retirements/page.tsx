import React from "react";
import Layout from "../utils/Layout";

function Page() {
  return (
    <Layout>
      <div className="bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded">
          <h4 className="font-semibold">Please Note</h4>
          <p>
            Due to syncing with the Puro Registry, it may take up to several
            business days for your retirement to complete. In the meantime, it
            will be in a pending state.
          </p>
        </div>
        <div className="mb-6 p-4 bg-blue-100 text-blue-600 rounded">
          <h3 className="font-semibold text-lg">Retirements</h3>
          <p>
            Get an overview of the positive impact you funded by retiring TCO2s.
          </p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">Amount</th>
              <th className="p-4 border-b">Project Name</th>
              <th className="p-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                You are not logged in or connected to the wrong network. Please
                log in and connect to the right network to see your TCO2
                Retirements.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Page;
