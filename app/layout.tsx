import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "./context";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/store/Providers";
import Head from "next/head";

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
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="C6Credits is a decentralized carbon credit system. It allows you to earn credits by reducing your carbon footprint."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>C6Credits</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link ref="favicon" href="/favicon.ico" />
      </Head>
      <body>
        <ContextProvider cookies={cookies}>
          <Providers>{children}</Providers>
        </ContextProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
