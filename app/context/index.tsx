"use client";

import { wagmiAdapter, projectId } from "../config/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import {
  mainnet,
  arbitrum,

  base,
} from "@reown/appkit/networks";
import React, { useState, type ReactNode } from "react";
import {
  cookieToInitialState,
  useAccount,
  useDisconnect,
  WagmiProvider,
  type Config,
} from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "appkit-example-scroll",
  description: "AppKit Example - Scroll",
  url: "https://scrollapp.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true,
  },
});

export function CustomButton({ props }: { props: string }) {
  return (
    <button className={props} onClick={() => modal.open()}>
      Connect Wallet
    </button>
  );
}

export function ConnectButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const getButtonStyles = () => {
    if (address) {
      return "bg-green-600 text-white hover:bg-green-700";
    } else {
      return "bg-[#F6F4EB] text-[#002A16] hover:bg-[#d4d2c7]";
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        className={`font-medium text-lg px-6 py-3 rounded-full transition duration-300 transform hover:scale-105 ${getButtonStyles()}`}
        onClick={address ? toggleDropdown : () => modal.open()}
      >
        {address ? shortenAddress(address) : "Connect Wallet"}
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-red-500  shadow-xl rounded-lg z-10
                      transition ease-out duration-200 transform scale-100"
        >
          <ul className="py-1">
            <li>
              <button
                className="block w-full text-left px-4 py-2   rounded-t-lg transition duration-150 ease-in-out"
                onClick={() => {
                  disconnect();
                  setIsDropdownOpen(false);
                }}
              >
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
