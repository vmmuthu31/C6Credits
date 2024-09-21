"use client";
import Header from "./Components/Header";
import Image from "next/image";
import credits from "./assets/credits.svg";
import box1 from "./assets/box1.svg";
import box2 from "./assets/box2.svg";
import box3 from "./assets/box3.svg";
import digital from "./assets/digital.svg";
import logo from "./assets/logo.svg";
import { GoArrowUp } from "react-icons/go";
import React, { useState, useEffect } from "react";
import frame from "./assets/frame.svg";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useRequireAuth from "./hooks/useRequireAuth";
import { useSelector } from "react-redux";

export default function Home() {
  const [returnCount, setReturnCount] = useState(0);
  const [marketDemandCount, setMarketDemandCount] = useState(0);
  const [competitiveEdgeCount, setCompetitiveEdgeCount] = useState(0);
  const router = useRouter();
  const incrementCount = (
    setValue: React.Dispatch<React.SetStateAction<number>>,
    target: number,
    duration: number
  ) => {
    let start = 0;
    const increment = target / (duration / 10);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(interval);
        setValue(target);
      } else {
        setValue(Math.floor(start));
      }
    }, 10);
  };

  useEffect(() => {
    incrementCount(setReturnCount, 185, 5000);
    incrementCount(setMarketDemandCount, 148, 5000);
    incrementCount(setCompetitiveEdgeCount, 21.3, 5000);
  }, []);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  function handleredirect() {
    if (!token) {
      router.push("/Onboarding");
    } else {
      if (user?.usertype === "company") {
        router.push("/Dashboard");
      } else if (user?.usertype === "offsetter") {
        router.push("/Dashboard");
      }
    }
  }

  return (
    <div>
      <div className=" bg-[#F6F4EB] min-h-screen">
        <div className="p-10 px-14">
          <Header />
          <div className="flex pt-16 px-10 justify-between">
            <div className="flex pt-12 flex-col gap-5 items-start">
              <p className="text-[#002A16] text-5xl w-[600px] font-bold">
                Reduce Your Carbon Footprint with Seamless Tokenized Credits
              </p>
              <p className="text-lg  w-[650px]">
                A seamless and secure marketplace for individuals and businesses
                to trade verified carbon credits, powered by blockchain
                innovation and cross-chain compatibility.
              </p>
              <button
                onClick={handleredirect}
                className="bg-[#05AA58] px-8 py-2 rounded-full text-white text-2xl"
              >
                Start Trading
              </button>
              <div>
                <div className="flex items-center gap-4">
                  <Image src={box1} alt="Secure" width={200} height={120} />
                  <Image src={box2} alt="Secure" width={200} height={120} />
                  <Image src={box3} alt="Secure" width={200} height={120} />
                </div>
              </div>
            </div>
            <div>
              <div>
                <Image src={credits} alt="credits" width={600} height={600} />
              </div>
            </div>
          </div>
          <div className="pt-10 overflow-hidden">
            <div className="animate-scroll">
              <Image src={digital} alt="digital" width={10000} height={10000} />
            </div>
          </div>
          <div>
            <div className="flex justify-center pt-20 text-[#05AA58] ">
              <div className="bg-[#EAFAE7] px-4 py-2 rounded-full flex gap-2 text-[#05AA58]">
                <Image src={logo} alt="logo" width={25} height={25} />
                <p className="relative">
                  Why C<span className="absolute text-[12px] top-3">6</span>{" "}
                  Credit
                </p>
              </div>
            </div>
            <div className=" pt-5">
              <p className="text-5xl text-center font-semibold">
                Your co-pilot to net-zero
              </p>
              <div className="flex pt-5 justify-center">
                <p className="text-center px-56 text-[#002A16]">
                  Maximize returns and market access with C6Credit, harnessing
                  blockchain to revolutionize carbon trading efficiency and
                  transparency.
                </p>
              </div>
              <div className="flex gap-10 pt-10 justify-center">
                <div className="flex flex-col gap-3 bg-[#f1f2e7] p-8 rounded-md">
                  <div className="flex">
                    <p className="text-[#05AA58] text-[12px] px-3 rounded-full py-2 border border-[#05AA58]">
                      Chainlink CCIP
                    </p>
                  </div>
                  <p className="text-3xl w-[400px] font-semibold">
                    Seamless Cross-Chain Accessibility
                  </p>
                  <p className="w-[400px]">
                    Easily trade carbon credits across diverse blockchain
                    networks, enhancing accessibility and market depth without
                    compromising security.
                  </p>
                </div>
                <div className="flex flex-col gap-3 bg-[#f1f2e7] p-8 rounded-md">
                  <div className="flex">
                    <p className="text-[#05AA58] text-[12px] px-3 rounded-full py-2 border border-[#05AA58]">
                      Worldcoin’s World ID{" "}
                    </p>
                  </div>
                  <p className="text-3xl w-[400px] font-semibold">
                    Authentic Engagement, Real Impact{" "}
                  </p>
                  <p className="w-[400px]">
                    Enhance trust and security by verifying the identities of
                    all participants through Worldcoin’s World ID, ensuring
                    genuine and transparent transactions.{" "}
                  </p>
                </div>
              </div>
              <div className="flex gap-10 pt-10 justify-center">
                <div className="flex flex-col gap-3 bg-[#f1f2e7] p-8 rounded-md">
                  <div className="flex">
                    <p className="text-[#05AA58] text-[12px] px-3 rounded-full py-2 border border-[#05AA58]">
                      1inch’s API{" "}
                    </p>
                  </div>
                  <p className="text-3xl w-[400px] font-semibold">
                    Get the Best Rates with Advanced Swaps{" "}
                  </p>
                  <p className="w-[400px]">
                    Achieve superior trading prices for carbon credits by
                    leveraging 1inch’s API, which sources the most competitive
                    rates across multiple exchanges.{" "}
                  </p>
                </div>
                <div className="flex flex-col gap-3 bg-[#f1f2e7] p-8 rounded-md">
                  <div className="flex">
                    <p className="text-[#05AA58] text-[12px] px-3 rounded-full py-2 border border-[#05AA58]">
                      Sign Protocol.{" "}
                    </p>
                  </div>
                  <p className="text-3xl w-[400px] font-semibold">
                    Secure & Verifiable Carbon Credits{" "}
                  </p>
                  <p className="w-[400px]">
                    Guarantee the authenticity of every carbon credit traded on
                    our platform with blockchain-based verifications from Sign
                    Protocol.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-20 bg-[#002A16] border-x-[#05AA58] text-[#E5FBF0] border">
          <div className="flex justify-center">
            <div className="bg-[#EAFAE7] px-4 py-2 rounded-full flex gap-2 text-[#05AA58]">
              <Image src={logo} alt="logo" width={25} height={25} />
              <p>The Opputunity</p>
            </div>
          </div>
          <p className="text-5xl text-center pt-5">
            Capitalize on Blockchain-Enabled Carbon Trading
          </p>
          <p className="text-center pt-3 px-80">
            Maximize returns and market access with C6Credit, harnessing
            blockchain to revolutionize carbon trading efficiency and
            transparency.
          </p>
          <div className="flex pt-10 justify-center item-center gap-5 text-center px-20">
            <div className="flex flex-col item-center gap-2">
              <div className="flex justify-center">
                <p className="text-4xl flex">
                  <GoArrowUp />
                  {returnCount}%
                </p>
              </div>
              <p>Higher Returns</p>
              <p className="w-96">
                Companies leveraging blockchain for carbon trading see an 185%
                higher ROI due to improved market access and enhanced trading
                efficiencies.
              </p>
            </div>
            <div className="flex flex-col item-center gap-2">
              <div className="flex justify-center">
                <p className="text-4xl flex">
                  <GoArrowUp />
                  {marketDemandCount}%
                </p>
              </div>
              <p>Market Demand</p>
              <p className="w-96">
                A growing number of companies are under pressure from both
                investors and regulators to adopt transparent and verifiable
                carbon trading.
              </p>
            </div>
            <div className="flex flex-col item-center gap-2">
              <div className="flex justify-center">
                <p className="text-4xl flex">
                  <GoArrowUp />
                  {competitiveEdgeCount}%
                </p>
              </div>
              <p>Competitive Edge</p>
              <p className="w-96">
                Organizations using decentralized platforms like C6Credit for
                carbon credit trading gain a 21.3% edge over competitors.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-20 text-[#05AA58] ">
          <div className="bg-[#EAFAE7] px-4 py-2 rounded-full flex gap-2 text-[#05AA58]">
            <Image src={logo} alt="logo" width={25} height={25} />
            <p>The sustainable platform</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-4xl font-semibold pt-4">
            Empowering Your Carbon Credit Transactions
          </p>
          <p className="pt-1 px-72">
            Streamline and secure your carbon credit transactions with C6Credit,
            where advanced blockchain technology meets global sustainability.
          </p>
        </div>
        <div className="flex justify-center gap-10 pt-10 pb-5">
          <div className="border bg-[#f1f2e7]  rounded-lg">
            <Image src={frame} alt="logo" width={500} height={500} />
            <div className="pl-5 py-2">
              <p className="text-3xl">Carbon Credit Market Access</p>
              <p className="w-[400px]">
                Engage in a dynamic market where buying, selling, and trading
                carbon credits is streamlined and accessible worldwide.
              </p>
            </div>
          </div>
          <div className="border bg-[#f1f2e7]  rounded-lg">
            <Image src={frame} alt="logo" width={500} height={500} />
            <div className="pl-5 py-2">
              <p className="text-3xl">Sustainable Investments</p>
              <p className="w-[400px]">
                Contribute to environmental sustainability by investing in
                verified green projects, facilitated through reliable carbon
                credit trading.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-10 pb-12 pt-5">
          <div className="border bg-[#f1f2e7]  rounded-lg">
            <Image src={frame} alt="logo" width={500} height={500} />
            <div className="pl-5 py-2">
              <p className="text-3xl">Liquidity Solutions</p>
              <p className="w-[400px]">
                Provide instant liquidity options for project developers and
                traders, enabling quick mobilization of funds and effective
                scaling of environmental impact.
              </p>
            </div>
          </div>
          <div className="border bg-[#f1f2e7]  rounded-lg">
            <Image src={frame} alt="logo" width={500} height={500} />
            <div className="pl-5 py-2">
              <p className="text-3xl">Regulatory Compliance</p>
              <p className="w-[400px]">
                Stay compliant with international environmental and trade
                regulations, ensuring smooth operations across borders.
              </p>
            </div>
          </div>
        </div>
        <div className="pb-10  pt-10 flex justify-between items-end px-64">
          <div>
            <p className="relative text-7xl text-[#002A16] italic playfair">
              C<span className="absolute text-[18px] top-10">6</span>{" "}
              <span className="pl-3">Credit</span>
            </p>{" "}
            <p className="w-[500px] pt-3">
              Revolutionizing carbon credit trading with secure,
              blockchain-powered solutions for a sustainable future.
            </p>
          </div>
          <div className="flex gap-2">
            <FaXTwitter className="text-4xl bg-[#002A16] p-2 text-white rounded-lg" />
            <FaTelegramPlane className="text-4xl bg-[#002A16] p-2 text-white rounded-lg" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 pb-12">
          <p className="relative text-xl text-[#002A16] italic playfair">
            C<span className="absolute text-[18px] top-2">6</span>{" "}
            <span className="pl-3">Credit</span>
          </p>{" "}
          <p>© 2024 All rights reserved</p>
          <p>terms of use</p>
          <p>privacy policy</p>
        </div>
      </div>
    </div>
  );
}
