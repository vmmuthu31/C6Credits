"use client";
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "../actions/verify";
import React from "react";

interface WorldIDconnectProps {
  userType: "company" | "offsetter" | null;
  onSuccessCallback: (e?: React.FormEvent) => void;
}

function WorldIDconnect({ userType, onSuccessCallback }: WorldIDconnectProps) {
  const app_id = "app_cc3e55f0294dc00a57b6a815590bb6de";
  const action = "ccredits";
  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result));
  };
  const handleProof = async (result: ISuccessResult) => {
    const data = await verify(result);
    if (data.success) {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div>
      <IDKitWidget
        action={action}
        app_id={app_id}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Device}
      />
      <button
        className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setOpen(true)}
      >
        <div className="mx-3 my-1 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-white"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13.8 9a4 4 0 01-3.8 4h-1v3l-4-4 4-4v3h1a2 2 0 002-2V6a2 2 0 10-4 0H6a4 4 0 018 3z" />
          </svg>
          Verify with World ID
        </div>
      </button>
    </div>
  );
}

export default WorldIDconnect;
