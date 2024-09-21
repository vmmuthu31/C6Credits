import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "./context";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/store/Providers";

export const metadata: Metadata = {
  title: "C6Credits",
  description:
    "C6Credits is a decentralized carbon credit system. It allows you to earn credits by reducing your carbon footprint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <Providers>{children}</Providers>
        </ContextProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
