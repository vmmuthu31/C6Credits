"use client";

import { createAppKit } from "@reown/appkit/react";
import { EVMEthers5Client } from "@reown/appkit-adapter-ethers5";
import { ReactNode } from "react";
import { hederaTestnet, sepolia } from "viem/chains";

// 1. Get projectId at https://cloud.reown.com
const projectId = "YOUR_PROJECT_ID";

// 2. Set Ethers adapters
const ethers5Adapter = new EVMEthers5Client();

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create the AppKit instance
createAppKit({
  adapters: [ethers5Adapter],
  metadata: metadata,
  networks: [hederaTestnet, sepolia],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKit({ children }: { children: ReactNode }) {
  return children;
}
