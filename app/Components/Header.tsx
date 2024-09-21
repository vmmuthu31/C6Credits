import React from "react";
import logo from "../assets/logo.svg";
import appname from "../assets/appname.svg";
import Image from "next/image";
import { ConnectButton } from "../context";

function Header() {
  return (
    <div className="bg-[#002A16] flex border py-4 rounded-full justify-between px-5 items-center gap-2">
      <div className="flex gap-2 items-center">
        <Image
          src={logo}
          alt="C6Credits"
          className="h-10 w-10"
          width={10}
          height={10}
        />{" "}
        <Image
          src={appname}
          alt="C6Credits"
          className="h-10 w-24"
          width={20}
          height={20}
        />
      </div>
      <div className="flex text-[#F6F4EB] gap-6 font-medium text-lg items-center">
        <p>Home</p>
        <p>About</p>
        <p>Resources</p>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Header;
