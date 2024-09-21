"use client";

import { createAppKit } from "@reown/appkit/react";
import { EVMEthers5Client } from "@reown/appkit-adapter-ethers5";
import { ReactNode } from "react";
import { hederaTestnet, sepolia } from "viem/chains";

const projectId = "9a6625b33eb7ffa6b6e25963ede2feb7";

const ethers5Adapter = new EVMEthers5Client();

const metadata = {
  name: "C6Credits",
  description: "C6Credits",
  url: "https://c6credits.vercel.app/",
  icons: ["https://c6credits.vercel.app/_next/static/media/logo.9d363db5.svg"],
};

createAppKit({
  adapters: [ethers5Adapter],
  metadata: metadata,
  networks: [hederaTestnet, sepolia],
  projectId,
  features: {
    analytics: true,
  },
});

export function AppKit({ children }: { children: ReactNode }) {
  return children;
}
