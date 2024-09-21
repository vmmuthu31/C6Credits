"use client";

import { wagmiAdapter, projectId } from "../config/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
} from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { arbitrumSepolia } from "viem/chains";

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
  networks: [
    mainnet,
    arbitrum,
    avalanche,
    base,
    optimism,
    polygon,
    arbitrumSepolia,
  ],
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
  return (
    <button
      className="bg-[#F6F4EB] text-[#002A16] font-medium text-lg px-4 py-2 rounded-full"
      onClick={() => modal.open()}
    >
      Connect Wallet
    </button>
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
