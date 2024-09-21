"use client";
import Image from "next/image";
import React from "react";
import logo from "../assets/logo.svg";
import { ConnectButton } from "../context";
import Link from "next/link";
import useRequireAuth from "../hooks/useRequireAuth";
const DashboardNavbar = () => {
  const { token } = useRequireAuth();

  return (
    <nav className="bg-[#002A16] p-4 shadow-md flex justify-between items-center">
      <Link
        className="flex gap-2 items-center"
        href={`${token ? "/Dashboard" : "/"}`}
      >
        <Image
          src={logo}
          alt="C6Credits"
          className="h-10 w-10"
          width={10}
          height={10}
        />{" "}
        <p className="relative text-xl text-white  playfair">
          C<span className="absolute text-[18px] top-2">6</span>{" "}
          <span className="pl-3">Credit</span>
        </p>{" "}
      </Link>
      <div>
        <ConnectButton />{" "}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
